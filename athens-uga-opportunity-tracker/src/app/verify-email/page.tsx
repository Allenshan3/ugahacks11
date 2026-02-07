"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-fill email from URL params if present
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerifySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!email || !code) {
      setError("Please enter email and verification code");
      setSubmitting(false);
      return;
    }

    if (code.length !== 6) {
      setError("Verification code must be 6 digits");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Verification error:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend code");
        return;
      }

      setResendCooldown(60);
      setCode(""); // Clear previous code
      setError(null);
    } catch (err) {
      console.error("Resend error:", err);
      setError("Failed to resend verification code");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 font-bold">Athens & UGA</h1>
          <h2 className="text-3xl text-red-600 font-semibold">
            Opportunity Tracker
          </h2>
        </div>

        <div className="border-2 border-black rounded-xl p-6 bg-white shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Verify Email</h2>
            <p className="text-gray-600 text-sm mt-2">
              We sent a code to your email
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">✓ Email verified!</p>
              <p className="text-gray-600 text-sm mt-2">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="font-medium text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@uga.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="code" className="font-medium text-sm">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-center text-3xl tracking-widest font-mono"
                  disabled={submitting}
                />
                <p className="text-gray-500 text-xs">6-digit code from email</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {submitting ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || submitting}
                  className="text-red-600 hover:underline text-sm disabled:text-gray-400"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
