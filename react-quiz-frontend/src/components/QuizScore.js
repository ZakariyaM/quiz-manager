import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import colors from "../styles/colors";
import AppButton from "./AppButton";

// Calculates and displays the user score at the end of the quiz

function QuizScore({ score, pickedAnswers }) {
  const navigate = useNavigate();

  useEffect(() => {}, [score]);

  const userScore = (score) => {
    let scorePercentage = score.toFixed();
    if (scorePercentage >= 50) {
      return `Congratulations, you passed! You got ${scorePercentage}%`;
    } else {
      return `Unfortunately, you failed. You got ${scorePercentage}%`;
    }
  };

  return (
    <div>
      <h1>{userScore(score)}</h1>
      <AppButton
        title="END QUIZ"
        color={colors.secondary}
        width={220}
        style={{ fontSize: 18, marginTop: 40, height: 45 }}
        onClick={() => navigate("/")}
      />
    </div>
  );
}

export default QuizScore;
