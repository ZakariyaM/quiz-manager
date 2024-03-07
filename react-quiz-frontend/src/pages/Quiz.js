import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getQuizById } from "../api/quiz";
import AppButton from "../components/AppButton";
import colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import Questionnaire from "../components/Questionnaire";
import QuizScore from "../components/QuizScore";

function Quiz(props) {
  const { id } = useParams();

  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [started, setStarted] = useState(false);

  const [questionNumber, setQuestionNumber] = useState(0);
  const [answerPicked, setAnswerPicked] = useState([]);

  const getQuiz = async (_id) => {
    const res = await getQuizById(_id);
    setQuiz(res);
  };

  const calculateScore = (pickedAnswers, answers) => {
    console.log(answers)
    console.log(pickedAnswers)
    const numberOfQuestions = answers.length;
    let correctAnswers = 0;
    pickedAnswers.forEach((item, index) => {
      if (item === answers[index]) {
        correctAnswers += 1;
      }
    });
    return (correctAnswers / numberOfQuestions) * 100;
  };

  const StartingPage = () => {
    return (
      <>
        <h1 style={{ fontWeight: "600" }}>{quiz.name.toUpperCase()}</h1>
        <div style={{ marginTop: 20 }}>
          <AppButton
            title="EXIT"
            style={{ fontSize: 22, height: 50, width: 180 }}
            onClick={() => navigate("/")}
          />
          <AppButton
            title="BEGIN QUIZ"
            color={colors.secondary}
            style={{ fontSize: 22, height: 50, width: 180 }}
            onClick={() => setStarted(true)}
          />
        </div>
      </>
    );
  };

  useEffect(() => {
    getQuiz(id);
  }, []);

  if (!quiz) return null;

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <button
        style={{
          fontWeight: "600",
          fontSize: 20,
          position: "absolute",
          left: 30,
          top: 20,
          background: "none",
          color: "inherit",
          border: "none",
        }}
        onClick={() => navigate("/")}
      >
        GO TO HOMEPAGE
      </button>
      {!started ? <StartingPage /> : null}
      {started && questionNumber < quiz.questions.length ? (
        <Questionnaire
          answer={
            quiz.questions[questionNumber].choices[
              quiz.questions[questionNumber].answerIndex
            ]
          }
          question={quiz.questions[questionNumber].body}
          isLastQuestion={questionNumber === quiz.questions.length - 1}
          choices={quiz.questions[questionNumber].choices}
          setQuestionNumber={setQuestionNumber}
          questionNumber={questionNumber}
          setAnswerPicked={setAnswerPicked}
          answerPicked={answerPicked}
        />
      ) : null}
      {questionNumber === quiz.questions.length ? (
        <QuizScore
          pickedAnswers={answerPicked}
          score={calculateScore(
            answerPicked,
            quiz.questions.map(item => item.choices[item.answerid])
          )}
        />
      ) : null}
    </div>
  );
}

export default Quiz;
