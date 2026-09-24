import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../services/api";
import "./AuthPages.css";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const verificationStarted = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    authApi.verifyEmail(token)
      .then((response) => {
        setStatus("success");
        setMessage(response.message || "Email verified successfully. You can now log in.");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.message || "This verification link is invalid or expired.");
      });
  }, [searchParams]);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-form-col" style={{ width: "100%" }}>
        <div className="auth-card">
          <h1 className="auth-card-title font-serif">{status === "loading" ? "Verifying email" : status === "success" ? "Email verified" : "Verification failed"}</h1>
          <p className="auth-card-subtitle">{message}</p>
          {status !== "loading" && (
            <Link to="/login" className="btn-auth-submit" style={{ display: "flex", textDecoration: "none", justifyContent: "center" }}>
              Go to Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}