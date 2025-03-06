import React, { useState } from "react";
import { auth, googleSignIn, githubSignIn, signUp } from "../firebase"; // Import Firebase functions
import "./signuppage.css";
import PlaceholderImage from "./images/image.png";
import googlelogo from "./images/devicon_google.png";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      const result = await googleSignIn();
      console.log(result.user); // Access user data
      // Redirect to your home or dashboard page (optional)
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle GitHub Sign Up
  const handleGitHubSignUp = async () => {
    try {
      const result = await githubSignIn();
      console.log(result.user); // Access user data
      // Redirect to your home or dashboard page (optional)
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle Email/Password Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const result = await signUp(email, password);
      console.log(result.user); // Access user data
      // Redirect to login or home page (optional)
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">Join us today by filling in your details.</p>

        <div className="signup-options">
          <button className="signup-btn google" onClick={handleGoogleSignUp}>
            <img src={googlelogo} alt="Google" className="icon" />
            Sign up with Google
          </button>
          <button className="signup-btn github" onClick={handleGitHubSignUp}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              alt="GitHub"
              className="icon"
            />
            Sign up with GitHub
          </button>
        </div>

        <div className="separator">
          <div className="line"></div>
          <span>OR</span>
          <div className="line"></div>
        </div>

        <form className="signup-form" onSubmit={handleEmailSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="signup-btn" type="submit">
            Sign Up
          </button>
        </form>

        <div className="login-link-container">
          <p>
            Already have an account?{" "}
            <a href="/loginpage" className="login-link">Login</a>
          </p>
        </div>
      </div>

      <div className="signup-right">
        <img
          src={PlaceholderImage}
          alt="Signup Illustration"
          className="image-placeholder-signup"
        />
      </div>
    </div>
  );
};

export default SignupPage;
