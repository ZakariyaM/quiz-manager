import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteQuizById, getAllQuiz } from "../api/quiz";
import UserContext from "../context/UserContext";
import colors from "../styles/colors";
import { format } from "date-fns";
import { useNavigate } from "react-router";


function Home(props) {
  const { user } = useContext(UserContext);
  const isAdmin = user.accounttype === "ADMIN";

  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [searchedQuizzes, setSearchedQuizzes] = useState([]);

  const getQuizzes = async () => {
    const res = await getAllQuiz();
    setQuizzes(res);
    setSearchedQuizzes(res);
  };

  const deleteQuiz = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    const isConfirm = confirm("Are you sure you want to delete this quiz?");
    if (!isConfirm) return;
    await deleteQuizById(id);
    getQuizzes();
  };

  const onSearch = (text) => {
    const newQuizzes = quizzes.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchedQuizzes(newQuizzes);
  };

  const editQuiz = (id) => {
    navigate("/edit/" + id);
  };

  useEffect(() => {
    getQuizzes();
  }, []);

  return (
    <div style={{ padding: 100, fontSize: 22 }} className="container-fluid">
      {user.accounttype === "ADMIN" ? (
        <Link to="/create">
          <a
            style={{
              fontWeight: "600",
              fontSize: 20,
              position: "absolute",
              left: 30,
              top: 20,
              background: "none",
              color: "white",
              border: "none",
            }}
          >
            CREATE NEW ASSESSMENT
          </a>
        </Link>
      ) : null}
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
          style={{
            width: 160,
            position: "relative",
            bottom: 80,
          }}
          class="center"
        />
      </div>

      <div className="row">
        <h1>
          Hi <span style={{ color: colors.secondary }}>{user.username}</span>!
          Select an assessment to begin 🤓
        </h1>
      </div>
      <div className="row">
        <input
          placeholder="Search"
          style={{
            padding: 10,
            borderRadius: 10,
            borderWidth: 0,
            fontSize: 16,
            margin: 30,
          }}
          onChange={(e) => onSearch(e.target.value)}
        ></input>
      </div>
      <div>
        <div className="row">
          <div className="col">
            <h5>Name</h5>
          </div>
          <div className="col">
            <h5>Description</h5>
          </div>
          <div className="col">
            <h5>Create Date</h5>
          </div>
          {isAdmin ? (
            <div className="col-1">
              <h5>Delete Quiz</h5>
            </div>
          ) : null}
            <div className="col-1">
              <h5>Edit Quiz</h5>
            </div>
          <div className="col-2">
            <h5>Open Quiz</h5>
          </div>
        </div>
        {searchedQuizzes.map((item) => {
          return (
            <div className="row" style={{ fontSize: 18 }}>
              <div className="col">
                <p>{item.name}</p>
              </div>
              <div className="col">
                <p>{item.description}</p>
              </div>
              <div className="col">
                <p>{format(Date.parse(item.createdate), "PPPP")}</p>
              </div>
              {isAdmin ? (
                <div className="col-1">
                  <button
                    style={{
                      border: "none",
                      fontSize: 16,
                      borderRadius: 5,
                      padding: 5,
                      color: "red",
                    }}
                    onClick={() => deleteQuiz(item.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
                <div className="col-1">
                  <button
                    style={{
                      border: "none",
                      fontSize: 16,
                      borderRadius: 5,
                      padding: 5,
                      color: "blue",
                    }}
                    onClick={() => editQuiz(item.id)}
                  >
                    Edit
                  </button>
                </div>
              <div className="col-2">
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/quiz/${item.id}`}
                >
                  <p style={{ color: colors.secondary, fontWeight: "bold" }}>
                    START
                  </p>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
