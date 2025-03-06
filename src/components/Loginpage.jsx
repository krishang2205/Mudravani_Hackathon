import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth, googleSignIn, githubSignIn } from "../firebase"; // Correct imports
import "./Loginpage.css";
import PlaceholderImage from "./images/image.png";
import googlelogo from "./images/devicon_google.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      console.log(result.user); // Access user data
      navigate("/homepage"); // Redirect to Homepage after successful sign in
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle GitHub Sign In
  const handleGitHubSignIn = async () => {
    try {
      const result = await githubSignIn();
      console.log(result.user); // Access user data
      navigate("/homepage"); // Redirect to Homepage after successful sign in
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle Email/Password Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      console.log(result.user); // Access user data
      navigate("/homepage"); // Redirect to Homepage after successful sign in
    } catch (error) {
      console.error(error.message);
      alert("Error: " + error.message); // Display error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-title">Welcome Back!</h1>
        <p className="login-subtitle">Log in to continue your journey.</p>

        <div className="login-options">
          <button className="login-button-google" onClick={handleGoogleSignIn}>
            <img src={googlelogo} alt="Google" className="icon" />
            Continue with Google
          </button>
          <button className="login-btn-github" onClick={handleGitHubSignIn}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              alt="GitHub"
              className="icon"
            />
            Continue with GitHub
          </button>
        </div>

        <div className="separator">
          <div className="line"></div>
          <span>OR</span>
          <div className="line"></div>
        </div>

        <form className="login-form" onSubmit={handleEmailSignIn}>
          <input
            type="text"
            placeholder="Email or Username"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgot-password">
            Forgot password?
          </div>
          <div className="create-account">
            <a href="/signuppage">Don't have an account? Create one</a>
          </div>
          <button className="sign-in-btn" type="submit">
            Sign In
          </button>
        </form>
      </div>

      <div className="login-right">
        <img
          src={PlaceholderImage}
          alt="Login Illustration"
          className="image-placeholder"
        />
      </div>
    </div>
  );
};

export default LoginPage;
