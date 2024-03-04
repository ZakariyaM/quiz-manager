const express = require("express");
const quizRoutes = express.Router();
const Joi = require("joi");
const pool = require('../config/db');

// Quiz schema validation for each quiz field
const newQuizSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  questions: Joi.array().required(),
  userId: Joi.number().required(),
});

const insertChoiceSql = 'INSERT INTO choices (body, questionId, number) VALUES ($1, $2, $3)';

// SQL queries to remove questions and choices
async function deleteQuestionsAndChoicesOnEdit(id) {
  await pool.query('DELETE FROM questions WHERE quizId = $1', [id], (err) => {
    if (err) {
      console.log(`Failed to delete questions for quizId ${id} due to error: ${err}`);
      return res.status(500).send(err.message);
    }
  });
  await pool.query(
    `DELETE FROM choices WHERE questionId IN (SELECT id FROM questions WHERE quizId = $1)`,
    [id],
    (err) => {
      if (err) {
          console.log(`Failed to delete and choices for quizId ${id} due to error: ${err}`);
          return res.status(500).send(err.message);
      }
    }
  );
};

async function insertQuestionsAndChoicesOnCreate(question, index, quizID) {
  try {
    const insertQuestionSql = 'INSERT INTO questions (body, answerId, quizId, number) VALUES ($1, $2, $3, $4) RETURNING id';
    const { rows } = await pool.query(insertQuestionSql, [question.body, question.answerIndex + 1, quizID, index + 1]);
    const questionID = rows[0].id;

    const promises = question.choices.map((choice, index) => {
      return pool.query(insertChoiceSql, [choice, questionID, index + 1]);
    });

    await Promise.all(promises);
    return 'Done';
  } catch (err) {
    console.log(`Failed to insert questions and choices for quizID: ${quizID} into database due to error: ${err}`);
    throw err;
  }
}

async function insertQuestionsAndChoicesOnEdit(question, id, index) {
  try {
    const insertQuestionSql = 'INSERT INTO questions (body, quizId, number) VALUES ($1, $2, $3) RETURNING id';
    const { rows } = await pool.query(insertQuestionSql, [question.body, id, index + 1]);
    const questionID = rows[0].id;

    const secondPromises = question.choices.map((choice, index) => {
      return pool.query(insertChoiceSql, [choice, questionID, index + 1]);
    });

    await Promise.all(secondPromises);
    return 'Done';
  } catch (err) {
    console.log(`Failed to insert questions and choices for quizID: ${id} into database due to error: ${err}`);
    throw err;
  }
}

// API to get all quizzes stored in db to display on homepage
quizRoutes.route("/").get(async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM quizzes`);
    if (rows.length === 0) {
      return res.status(200).send([]);
    } else {
      return res.status(200).send(rows);
    }
  } catch (err) {
    console.log(`Failed to get quizzes due to error: ${err}`);
    return res.status(501).send(err.message);
  }
});

// API to create new quizzes only and insert new quiz into db
quizRoutes.route("/create").post(async (req, res) => {
  const { error } = newQuizSchema.validate(req.body);
  if (error) {
    console.log(`Failed to create quiz due to validation error: ${error}`);
    return res.status(400).send(error.details[0].message);
  }
  
  const questions = req.body.questions;
  try {
    const createQuizSql = `INSERT INTO quizzes (name, description, userId) VALUES ($1, $2, $3) RETURNING id`;
    const { rows } = await pool.query(createQuizSql, [req.body.name, req.body.description, req.body.userId]);
    const quizID = rows[0].id;
    console.log(`A new quiz has been created and inserted with rowid ${quizID}`);
    
    for (let index = 0; index < questions.length; index++) {
      await insertQuestionsAndChoicesOnCreate(questions[index], index, quizID);
    }
    
    return res.status(200).send({ id: quizID });
  } catch (err) {
    console.log(`Failed to create quiz in database due to error: ${err}`);
    return res.status(400).send(err.message);
  }
});

// API to delete quizzes from database
quizRoutes.route("/delete").delete(async (req, res) => {
  const { id } = req.body;
  await pool.query(`DELETE FROM quizzes WHERE id = $1`, [id], (err) => {
    if (err) {
        console.log(`Failed to delete quiz (quizId - ${id}) in database due to error: ${err}`);
        return res.status(400).send(err);
    } else {
      return res.status(200).send("Quiz deleted");
    }
  });
});

// API to retrieve quizzes via ID to allow user to take them after selecting
quizRoutes.route("/:id").get(async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: quizzes } = await pool.query(`SELECT * FROM quizzes WHERE id = $1 LIMIT 1`, [id]);

    if (quizzes.length === 0) {
      return res.status(400).send("Quiz not found");
    }

    const quiz = quizzes[0];

    const { rows: questions } = await pool.query(`SELECT * FROM questions WHERE quizId = $1`, [id]);

    const temporaryQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const { rows: choices } = await pool.query(`SELECT * FROM choices WHERE questionId = $1 ORDER BY number ASC`, [question.id]);

      const temporaryQuestion = { ...question };
      temporaryQuestion.choices = choices.map(choice => choice.body);
      const answerIndex = choices.findIndex(choice => choice.id === question.answerId);
      temporaryQuestion.answerIndex = answerIndex;
      temporaryQuestions.push(temporaryQuestion);
    }

    const quizWithQuestions = {
      ...quiz,
      questions: temporaryQuestions,
    };

    return res.status(200).send(quizWithQuestions);
  } catch (err) {
    console.log(`Failed to retrieve quiz and its questions for (quizId - ${id}) from database due to error: ${err}`);
    return res.status(400).send(err.message);
  }
});

// API to edit an existing quiz by the ID
quizRoutes.route("/edit/:id").put(async (req, res) => {
  const { id } = req.params;
  const { error } = newQuizSchema.validate(req.body);
  if (error) {
    console.log(`Failed to edit quiz due to validation error: ${error}`);
    return res.status(400).send(error.details[0].message);
  }

  try {
    await pool.query(`UPDATE quizzes SET name = $1, description = $2 WHERE id = $3`, [req.body.name, req.body.description, id]);
    await deleteQuestionsAndChoicesOnEdit(id, res);

    const questions = req.body.questions || [];
    for (let index = 0; index < questions.length; index++) {
      await insertQuestionsAndChoicesOnEdit(questions[index], id, index);
    }

    return res.status(200).send(id);
  } catch (err) {
    console.log(`Failed to update quiz for quizID ${id} in database due to error: ${err}`);
    return res.status(400).send(err.message);
  }
});

module.exports = quizRoutes;
