import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../api/user";
import UserContext from "../context/UserContext";
import colors from "../styles/colors";

function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { user, setUser, isSignedIn, setIsSignedIn } = useContext(UserContext);

  const logUserIn = async () => {
    try {
      const { status, data, headers } = await signIn(username, password);
      if (status === 200) {
        const token = headers["auth-token"];
        setUser(data);
        setIsSignedIn(true);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isSignedIn", JSON.stringify(true));
        localStorage.setItem("token", token);
      }
    } catch (error) {
      setErrorMessage(error.response.data);
    }
  };

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
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
        style={{
          width: 400,
          marginBottom: 60,
        }}
      />
      <h1 style={{ fontSize: 48, marginBottom: 40 }}>
        <span style={{ color: colors.secondary }}>Onboarding</span> Assessments
      </h1>
      <input
        placeholder="USERNAME"
        style={{
          width: 200,
          height: 40,
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
          borderWidth: 0,
          fontSize: 16,
        }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="PASSWORD"
        style={{
          width: 200,
          height: 40,
          borderRadius: 10,
          padding: 10,
          marginBottom: 30,
          borderWidth: 0,
          fontSize: 16,
        }}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        style={{
          height: 40,
          width: 200,
          borderRadius: 10,
          borderWidth: 0,
          fontSize: 18,
          color: colors.violet,
          fontWeight: "600",
          marginBottom: 10,
        }}
        onClick={logUserIn}
      >
        LOGIN
      </button>
      <Link
        style={{
          height: 40,
          width: 200,
          borderRadius: 10,
          borderWidth: 0,
          fontSize: 18,
          color: colors.primary,
          fontWeight: "600",
          marginBottom: 30,
          backgroundColor: "#f1f1f1",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          textDecoration: "none",
        }}
        to="/register"
      >
        REGISTER
      </Link>
      <div id="loginErrorBanner">
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

export default LoginPage;
