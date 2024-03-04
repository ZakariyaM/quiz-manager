import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import UserContext from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Quiz from "./pages/Quiz";
import Create from "./pages/Create";
import { getUser } from "./api/user";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  const logOut = async () => {
    // eslint-disable-next-line no-restricted-globals
    const isConfirm = confirm("Are you sure you want to log out?");
    if (!isConfirm) return;
    setIsSignedIn(false);
    setUser(null);
    // Saving items to local storage such as user session and authorisation token
    localStorage.setItem("user", JSON.stringify(null));
    localStorage.setItem("isSignedIn", JSON.stringify(false));
    localStorage.setItem("token", "");
    window.location.href = "/";
  };

  const getUserData = async (id) => {
    const res = getUser(id);
    setUser(res.data);
  };

  useEffect(() => {
    const newUser = localStorage.getItem("user");
    setUser(JSON.parse(newUser));
    const newSignInStatus = localStorage.getItem("isSignedIn");
    setIsSignedIn(JSON.parse(newSignInStatus));
    if (user) {
      getUserData(user.id);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isSignedIn, setIsSignedIn }}>
      <Router>
        <div className="App container">
          {isSignedIn ? (
            <button
              style={{
                fontWeight: "600",
                fontSize: 20,
                position: "absolute",
                right: 30,
                top: 20,
                background: "none",
                color: "inherit",
                border: "none",
              }}
              onClick={logOut}
            >
              LOGOUT
            </button>
          ) : null}
          <Routes>
            {!isSignedIn ? (
              <>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<LoginPage />} />
              </>
            ) : (
              <>
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/edit/:id" element={<Create />} />
                <Route path="/create" element={<Create />} />
                <Route path="/" element={<Home />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
