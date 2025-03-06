import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvDd_JsoSPcWKl1DXFZIq6sDTFQo0_mEA",
  authDomain: "mudravani-d1dae.firebaseapp.com",
  projectId: "mudravani-d1dae",
  storageBucket: "mudravani-d1dae.appspot.com",
  messagingSenderId: "182600888132",
  appId: "1:182600888132:web:3cdb3eec8d77f405687111",
  measurementId: "G-HFPWDE95QL"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Authentication
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ✅ Authentication Functions

// Sign Up Function
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Error during sign-up:", error.code, error.message);
    throw new Error(`Sign-up failed: ${error.message}`); // Provide more meaningful error messages
  }
};

// Login Function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Error during login:", error.code, error.message);
    throw new Error(`Login failed: ${error.message}`); // Provide more meaningful error messages
  }
};

// Google Sign-In Function
export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error during Google Sign-In:", error.code, error.message);
    throw new Error(`Google sign-in failed: ${error.message}`); // Provide more meaningful error messages
  }
};

// GitHub Sign-In Function
export const githubSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result;
  } catch (error) {
    console.error("Error during GitHub Sign-In:", error.code, error.message);
    throw new Error(`GitHub sign-in failed: ${error.message}`); // Provide more meaningful error messages
  }
};

// Logout Function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during sign-out:", error.code, error.message);
    throw new Error(`Sign-out failed: ${error.message}`); // Provide more meaningful error messages
  }
};
