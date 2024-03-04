import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getQuizById, submitQuiz, updateQuiz } from "../api/quiz";
import AppButton from "../components/AppButton";
import QuestionEditor from "../components/QuestionEditor";
import UserContext from "../context/UserContext";

const CreateEventNameComponent = ({
  name,
  setName,
  description,
  setDescription,
  title,
}) => {
  return (
    <>
      <h1>{title}</h1>
      <br />
      <input
        value={name}
        placeholder="Quiz name"
        style={{
          width: 400,
          fontSize: 22,
          borderRadius: 20,
          border: "none",
          padding: 10,
          marginBottom: 12,
        }}
        type="text"
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <textarea
        value={description}
        placeholder="Quiz description"
        style={{
          width: 400,
          height: 100,
          fontSize: 22,
          borderRadius: 20,
          border: "none",
          padding: 10,
          marginBottom: 12,
        }}
        type="text"
        onChange={(e) => setDescription(e.currentTarget.value)}
      />
    </>
  );
};

function Create(props) {
  const navigate = useNavigate();

  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const { user } = useContext(UserContext);
  const userId = user.id;

  const createQuiz = async () => {
    const isConfirm = window.confirm(
      `Are you sure you want to ${!id ? "create" : "update"} this quiz?`
    );
    if (!isConfirm) return;
    let error = false;
    questions.forEach((item) => {
      if (!item.body) {
        setErrorMessage("Questions must not be empty");
        error = true;
      }
      item.choices.forEach((choice) => {
        if (!choice) {
          setErrorMessage("Choices must not be empty");
          error = true;
        }
      });
      if (item.choices.length < 3) {
        setErrorMessage("Questions must have at least 3 answer choices");
        error = true;
      }
    });
    if (error) return;
    setLoading(true);
    if (!id) {
      const res = await submitQuiz({
        name,
        description,
        questions,
        userId,
      });
      if (res) {
        navigate(`/quiz/${res.id}`);
      }
    } else {
      const res = await updateQuiz(id, {
        name,
        description,
        questions,
        userId,
      });
      if (res) {
        navigate(`/quiz/${res}`);
      }
    }
  };

  const populateQuizData = async (_id) => {
    const newQuiz = await getQuizById(_id);
    if (newQuiz) {
      setName(newQuiz.name);
      setDescription(newQuiz.description);
      setQuestions(newQuiz.questions);
    }
  };

  const clearQuiz = () => {
    const isConfirm = window.confirm(
      "Are you sure you want to clear the quiz?"
    );
    if (!isConfirm) return;
    setQuestions([
      {
        question: "",
        answer: "",
        answerIndex: 0,
        choices: ["", "", ""],
      },
    ]);
    setName("");
    setDescription("");
    setQuestionIndex(0);
    setShowQuestionEditor(false);
    window.alert("Quiz cleared");
  };

  useEffect(() => {
    if (id) {
      populateQuizData(id);
    } else {
      setQuestions([
        {
          question: "",
          answer: "",
          answerIndex: 0,
          choices: ["", "", ""],
        },
      ]);
    }
  }, []);

  if (loading) return null;

  return (
    <div
      style={{
        paddingTop: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
      <button
        style={{
          fontWeight: "600",
          fontSize: 20,
          position: "absolute",
          top: 20,
          background: "none",
          color: "inherit",
          border: "none",
        }}
        onClick={clearQuiz}
      >
        CLEAR QUIZ
      </button>
      {!showQuestionEditor ? (
        <CreateEventNameComponent
          title={!id ? "Create New Quiz" : "Edit Quiz"}
          name={name}
          description={description}
          setName={setName}
          setDescription={setDescription}
        />
      ) : null}
      {!showQuestionEditor ? (
        <AppButton
          disabled={name.length < 3 || description.length < 6}
          title="Continue"
          style={{ fontSize: 22, width: 200, height: 45 }}
          onClick={() => setShowQuestionEditor(true)}
        />
      ) : null}
      <QuestionEditor
        createQuiz={createQuiz}
        show={showQuestionEditor}
        questions={questions}
        setQuestions={setQuestions}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
      />
      <div id="createErrorBanner">
        {errorMessage ? (
          <div class="alert-warning banner">
            <p style={{ color: "white", backgroundColor: "red", padding: 20 }}>
              {errorMessage}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Create;
