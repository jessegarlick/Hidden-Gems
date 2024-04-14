import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css"; // Import the CSS file for styling
import { Button } from "react-bootstrap";

import Home from "./Home.jsx";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null); // New state to hold error information

  const userId = useSelector((state) => state.userId);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const bodyObj = {
      email,
      password,
    };

    try {
      const res = await axios.post("/login", bodyObj);

      if (res.data.success) {
        dispatch({
          type: "USER_AUTH",
          payload: res.data.userId,
        });
        dispatch({
            type: "UPDATE_NAVBAR",
            payload: res.data.user.navbarColor
          })
          dispatch({
            type: "UPDATE_BACKGROUND",
            payload: res.data.user.backgroundColor
          })
          dispatch({
            type: "UPDATE_FOREGROUND",
            payload: res.data.user.foregroundColor
          })
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data.message); // Set error state with the error message from the server
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const bodyObj = {
      email,
      password,
      firstName,
      lastName,
    };

    try {
      const res = await axios.post("/register", bodyObj);

      if (res.data.success) {
        handleLogin(e);
      }
    } catch (error) {
      setError(error.response.data.message); // Set error state with the error message from the server
    }
  };

  const sessionCheck = async () => {
    try {
      const res = await axios.get("/session-check");

      if (res.data.success) {
        dispatch({
          type: "USER_AUTH",
          payload: res.data.userId,
        });
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  useEffect(() => {
    sessionCheck();
  }, []);

  return (
    <>
      <div className="login-container">
        <h1 className="title">Hidden Gems</h1>
        <h2 className="subtitle">{isLogin ? "Login" : "Create Account"}</h2>

        {!userId && (
          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="auth-form"
          >
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Display error message if exists */}
            <div className="input-group">
              <input
                id="email"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <input
                id="password"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            {!isLogin && (
              <>
                <div className="input-group">
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field"
                  />
                </div>
              </>
            )}
            <div className="action-group">
              <Button
                className="submit-button"
                type="submit"
                
                variant="info"
            >{isLogin ? "Login" : "Register"}</Button>
              <span
                onClick={(e) => setIsLogin(!isLogin)}
                className="toggle-form"
              >
                {isLogin ? "Register Here" : "Login Here"}
              </span>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default Login;
