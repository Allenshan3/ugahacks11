"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const { status, data: session } = useSession(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Login page - Auth status:", status);
    console.log("🔍 Login page - Session data:", session);
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      
      console.log("🔐 Attempting login..."); // Debug
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      console.log("🔐 Login result:", result); // Debug

      if (result?.error) {
        console.log("❌ Login failed - Invalid credentials"); // Debug
        setError("Invalid email or password. Please try again.");
        setSubmitting(false);
        return;
      }

      console.log("✅ Login successful, redirecting..."); // Debug
      router.push(result?.url ?? callbackUrl);
    } catch (error) {
      console.error("❌ Failed to sign in", error);
      setError("We couldn't sign you in. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 font-bold">Athens & UGA</h1>
          <h2 className="text-3xl text-purple-900 font-semibold">
            Opportunity Tracker
          </h2>
        </div>

        <div className="border-2 border-black rounded-xl p-6 bg-white shadow">
          <div className="text-center mb-4">
            <h2 className="text-2xl text-purple-900 font-bold">Welcome Back</h2>
            <p className="text-gray-600">Sign in to track your opportunities</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-center" role="alert" style={{ color: "#9F76A9" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-900 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-left bg-gray-50">
            <p className="font-semibold mb-2 text-gray-800">Demo Credentials</p>
            <ul className="space-y-1 text-gray-600">
              <li><span className="font-medium text-gray-900">Student:</span> student1@uga.edu / test123!</li>
              <li><span className="font-medium text-gray-900">Admin:</span> admin@uga.edu / admin123!</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <a href="/signup" className="text-sm text-purple-900hover:underline">
              Don&apos;t have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}