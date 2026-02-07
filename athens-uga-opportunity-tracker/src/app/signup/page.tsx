"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSubmitting(false);
      return;
    }

    try {
      // Create user account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setSubmitting(false);
        return;
      }

      // Automatically sign in the user after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but failed to sign in. Please try logging in.");
        setSubmitting(false);
        router.push("/login");
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
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
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-gray-600">Start tracking your career journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="font-medium">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-black rounded px-3 py-2"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@uga.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black rounded px-3 py-2"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="font-medium">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black rounded px-3 py-2"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="font-medium">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-black rounded px-3 py-2"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-red-600 hover:underline">
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
