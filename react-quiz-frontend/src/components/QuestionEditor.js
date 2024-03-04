import React, { useState } from "react";
import { useParams } from "react-router";
import colors from "../styles/colors";
import AppButton from "./AppButton";

// Used to create/edit quizzes on the UI

function QuestionEditor({
  show = false,
  questions = [],
  setQuestions,
  createQuiz,
  questionIndex,
  setQuestionIndex,
}) {
  const { id } = useParams();

  const setQuestion = (text) => {
    let newQuestions = [...questions];
    newQuestions[questionIndex].body = text;
    setQuestions(newQuestions);
  };

  const setChoice = (choice, index) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[index] = choice;
    setQuestions(newQuestions);
  };

  const addNewChoice = () => {
    let newQuestions = [...questions];
    newQuestions[questionIndex].choices.push("");
    setQuestions(newQuestions);
  };

  const deleteChoiceByIndex = (i) => {
    let newQuestions = [...questions];
    let newChoices = [...questions[questionIndex].choices].filter(
      (value, index) => index !== i
    );
    newQuestions[questionIndex].choices = newChoices;
    setQuestions(newQuestions);
  };

  const setAnswer = (index) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answerIndex = index;
    setQuestions(newQuestions);
  };

  const nextQuestion = () => {
    if (!questions[questionIndex + 1]) {
      let newQuestions = [...questions];
      newQuestions.push({
        question: "",
        answer: "",
        answerIndex: 0,
        choices: ["", "", ""],
      });
      setQuestions(newQuestions);
    }
    setQuestionIndex(questionIndex + 1);
  };

  const deleteQuestion = (indexToDelete) => {
    let newQuestions = questions.filter(
      (item, index) => index !== indexToDelete
    );
    if (!questions[questionIndex - 1]) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuestionIndex(questionIndex - 1);
    }
    setQuestions(newQuestions);
  };

  if (!show) return null;
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <h1>Question {questionIndex + 1}:</h1>
      <input
        placeholder="Question"
        value={questions[questionIndex].body ? questions[questionIndex].body : ""}
        onChange={(e) => {
          setQuestion(e.target.value);
        }}
        style={{
          borderRadius: 20,
          border: "none",
          padding: 10,
          fontSize: 18,
          marginBottom: 20,
          width: 500,
        }}
      />
      {questions[questionIndex].choices.map((choice, index) => {
        return (
          <div
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              display: "flex",
              width: 500,
            }}
            key={`${index}-question-${questionIndex}`}
          >
            <input
              placeholder={`Choice ${index + 1}`}
              value={choice}
              onChange={(e) => setChoice(e.currentTarget.value, index)}
              style={{
                borderRadius: 20,
                border: "none",
                padding: 10,
                fontSize: 18,
                marginBottom: 15,
              }}
            />
            {true ? (
              <button
                onClick={() => setAnswer(index)}
                style={{
                  marginLeft: 10,
                  border: "none",
                  padding: 5,
                  marginTop: 8,
                  borderRadius: 10,
                  color: "blue",
                }}
              >
                Mark as answer
              </button>
            ) : null}
            {index > 2 ? (
              <button
                onClick={() => deleteChoiceByIndex(index)}
                style={{
                  marginLeft: 10,
                  border: "none",
                  padding: 3,
                  marginTop: 8,
                  borderRadius: 10,
                  color: "red",
                }}
              >
                Remove
              </button>
            ) : null}
          </div>
        );
      })}
      <br />
      <h3>
        Answer :{" "}
        {questions[questionIndex].choices[questions[questionIndex].answerIndex]}
      </h3>
      {questionIndex > 0 ? (
        <AppButton
          width={200}
          title="Previous Question"
          onClick={() => setQuestionIndex(questionIndex - 1)}
        />
      ) : null}
      <div>
        <AppButton
          width={200}
          title="Add Choice"
          onClick={() => addNewChoice()}
        />
        <AppButton
          width={200}
          title="Delete Question"
          onClick={() => deleteQuestion(questionIndex)}
        />
        <AppButton
          width={200}
          title={
            questionIndex === questions.length - 1
              ? "Add Question"
              : "Next Question"
          }
          onClick={() => nextQuestion()}
        />
        <AppButton
          width={200}
          color={colors.secondary}
          title={id ? "Update Quiz" : "Submit Quiz"}
          onClick={createQuiz}
        />
      </div>
    </div>
  );
}

export default QuestionEditor;
