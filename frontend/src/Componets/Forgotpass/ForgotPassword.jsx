import React, { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const checkRequestLimit = async (identifier) => {
    const userRef = doc(db, "passwordRequests", identifier);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const lastRequest = userDoc.data().lastRequested.toDate();
      const now = new Date();
      const hoursDiff = (now - lastRequest) / (1000 * 60 * 60);
      if (hoursDiff < 24) {
        return false;
      }
    }
    return true;
  };

  const updateRequestTime = async (identifier) => {
    const userRef = doc(db, "passwordRequests", identifier);
    await setDoc(userRef, { lastRequested: serverTimestamp() }, { merge: true });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");
    const identifier = email.replace(/[^a-zA-Z0-9]/g, "");

    try {
      const allowed = await checkRequestLimit(identifier);
      if (!allowed) {
        setError("You can request a password reset only once every 24 hours.");
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email);
      await updateRequestTime(identifier);

      setMessage("Password reset email sent! Check your inbox.");
      setEmail("");
    } catch (error) {
      console.error("Error resetting password:", error.message);
      if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border border-gray-300 rounded-lg text-center">
      <h2 className="text-2xl mb-4">Forgot Password</h2>
      <form onSubmit={handlePasswordReset} className="flex flex-col">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`p-2 bg-green-600 text-white rounded hover:bg-green-700 ${loading && "bg-gray-400"}`}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <div className="mt-4">
        <button
          onClick={generatePassword}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Random Password
        </button>
        {generatedPassword && (
          <p className="mt-2 text-blue-600">
            Suggested Password: <strong>{generatedPassword}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
