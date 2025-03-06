import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Loginpage";
import SignupPage from "./components/signuppage"; // Ensure the file name is correct
import MeetingRoom from "./components/VideoCallPage"; // Ensure the file name is correct


import { auth } from "./firebase"; // Firebase auth import
import { onAuthStateChanged } from "firebase/auth"; // Firebase function to track auth state changes

// Protected Route component to guard the homepage
const ProtectedRoute = ({ children }) => {
  if (!auth.currentUser) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Track auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []); // Add empty dependency array to run effect only once

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      setUser(null); // Set user state to null after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Default Route directly to HomePage */}
        <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />

        {/* Protected Route for HomePage */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Route for LoginPage */}
        <Route path="/loginpage" element={<Login />} />

        {/* Route for SignupPage */}
        <Route path="/signuppage" element={<SignupPage />} />

        
        { <Route
          path="/VideoCallPage"
          element={
            <ProtectedRoute>
              <MeetingRoom user={user} />
            </ProtectedRoute>
          }
        />}
      </Routes>
    </Router>
  );
}

export default App;
