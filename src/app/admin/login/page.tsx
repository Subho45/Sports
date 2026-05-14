"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center relative z-10 auth-container">
        <div className="auth-card glass-card animate-fade-in">
          <div className="text-center">
            <h2 className="auth-title">
              Admin Dashboard Login
            </h2>
            <p className="auth-subtitle">
              Use "admin123" to login for Phase 1 testing
            </p>
          </div>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-fields">
              <div className="form-group">
                <input
                  type="password"
                  required
                  className="input-field form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <div>
              <button type="submit" className="btn btn-primary btn-submit">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .auth-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 6rem 1rem 3rem; /* padding-top increased to prevent navbar overlap */
          position: relative;
          z-index: 10;
        }
        .auth-card {
          width: 100%;
          max-width: 28rem;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .text-center {
          text-align: center;
        }
        .auth-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .auth-subtitle {
          color: #e5e7eb;
          font-weight: 500;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .auth-form {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-control {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          width: 100%;
          outline: none;
        }
        .form-control:focus {
          border-color: var(--primary);
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.5);
          border-radius: 0.5rem;
          padding: 0.75rem;
        }
        .error-message p {
          color: #ef4444;
          font-size: 0.875rem;
          text-align: center;
          font-weight: 500;
        }
        .btn-submit {
          width: 100%;
          padding: 1rem;
          font-size: 1.125rem;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  );
}
