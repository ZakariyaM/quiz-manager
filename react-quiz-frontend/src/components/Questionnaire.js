import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import colors from "../styles/colors";
import AppButton from "./AppButton";
import ChoiceButton from "./ChoiceButton";

// Used to display choices during the quiz and answers for admin users

function Questionnaire({
  question,
  choices = [],
  setQuestionNumber,
  questionNumber,
  answerPicked,
  setAnswerPicked,
  isLastQuestion = false,
  answer,
}) {
  const { user } = useContext(UserContext);
  const [showAnswer, setShowAnswer] = useState(false);
  const isAdmin = user.accounttype === "ADMIN"

  const handleAnswer = (choice) => {
    const temporaryState = [...answerPicked];
    temporaryState[questionNumber] = choice;
    setAnswerPicked(temporaryState);
  };

  if (!question) return null;

  return (
    <div>
      <h1>{question}</h1>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          marginTop: 50,
        }}
      >
      {choices.map((choice, index) => {
        console.log({answer})
        console.log(choice)
        const picked = answerPicked[questionNumber] === choice;
        const rightAnswer = choice === answer;
        console.log({rightAnswer})
        console.log({picked})
        return (
          <div style={{ display: "flex" }}>
            <ChoiceButton
              style={{
                borderWidth: picked ? 3 : 0,
                borderColor: "black",
                fontWeight: picked ? "bold" : "normal"
              }}
              key={`choice${index}`}
              onClick={() => handleAnswer(choice)}
              title={choice}
            />
            {showAnswer && rightAnswer && (
              <p style={{ marginLeft: 10, marginTop: 5 }}>✅</p>
            )}
            {showAnswer && !rightAnswer && (
              <p style={{ marginLeft: 10, marginTop: 5 }}>❌</p>
            )}
          </div>
        );
      })}
      </div>
      <div className="row">
        {questionNumber !== 0 ? (
          <AppButton
            title="BACK"
            style={{ fontWeight: "700", fontSize: 20 }}
            width={200}
            onClick={() => setQuestionNumber(questionNumber - 1)}
          />
        ) : (
          <div style={{ width: 200, margin: 20 }} />
        )}
        {isAdmin ? (
          <AppButton
            title={showAnswer ? "Hide answer" : "Show answer"}
            style={{ fontWeight: "700", fontSize: 20 }}
            width={200}
            onClick={() => setShowAnswer(!showAnswer)}
          />
        ) : (
          <div style={{ width: 200, margin: 20 }} />
        )}
        <AppButton
          disabled={!answerPicked[questionNumber]}
          title={isLastQuestion ? "FINISH QUIZ" : "NEXT"}
          style={{ fontWeight: "700", fontSize: 20 }}
          width={200}
          color={colors.secondary}
          onClick={() => {
            setQuestionNumber(questionNumber + 1);
            setShowAnswer(false);
          }}
        />
      </div>
    </div>
  );
}

export default Questionnaire;
