import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api/user";
import UserContext from "../context/UserContext";
import colors from "../styles/colors";

function RegisterPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const { user, setUser, isSignedIn, setIsSignedIn } = useContext(UserContext);

  const registerUser = async () => {
    // eslint-disable-next-line no-restricted-globals
    const isConfirm = confirm("Are you sure you want to register a new user?");
    if (!isConfirm) return;
    if (password !== confirmPassword)
      return setErrorMessage("Passwords do not match");
    try {
      const { status, data, headers } = await signUp(username, password);
      if (status === 200) {
        const token = headers["auth-token"];
        setUser(data);
        setIsSignedIn(true);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isSignedIn", JSON.stringify(true));
        localStorage.setItem("token", token);
        navigate("/");
        window.alert("User created successfully");
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
        <span style={{ color: colors.secondary }}>Register</span>
      </h1>
      <p>Please fill in the below</p>
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
          marginBottom: 10,
          borderWidth: 0,
          fontSize: 16,
        }}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="CONFIRM PASSWORD"
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
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        style={{
          height: 40,
          width: 200,
          borderRadius: 10,
          borderWidth: 0,
          fontSize: 18,
          color: colors.primary,
          fontWeight: "600",
          marginBottom: 10,
        }}
        onClick={registerUser}
      >
        REGISTER
      </button>
      <Link
        style={{
          height: 40,
          width: 200,
          borderRadius: 10,
          borderWidth: 0,
          fontSize: 18,
          color: colors.violet,
          fontWeight: "600",
          marginBottom: 10,
          backgroundColor: "#f1f1f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
        }}
        to="/"
      >
        RETRUN TO LOGIN
      </Link>
      <div id="registerErrorBanner">
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

export default RegisterPage;
