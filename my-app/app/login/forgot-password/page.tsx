"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback?next=/login/reset-password` }
    );

    setLoading(false);
    if (resetError) {
      if (resetError.message.toLowerCase().includes("rate limit")) {
        setError("Too many requests. Please wait a few minutes before trying again.");
      } else {
        setError(resetError.message);
      }
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-start justify-center px-4 pt-16">
        <div className="w-full max-w-md bg-surface border border-line rounded-2xl shadow-sm shadow-ink/5 p-8 text-center">
          <div className="text-4xl mb-4">📬</div>
          <h1 className="text-2xl font-bold text-brand mb-2">Check your email</h1>
          <p className="text-ink-muted mb-6">
            If an account exists for{" "}
            <span className="font-medium text-ink">{email}</span>, you'll
            receive a password reset link shortly.
          </p>
          <Link href="/admin" className="text-sm text-brand font-semibold hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 pt-16">
      <div className="w-full max-w-md bg-surface border border-line rounded-2xl shadow-sm shadow-ink/5 p-8">
        <h1 className="text-3xl font-bold text-brand text-center mb-2">Forgot Password</h1>
        <p className="text-ink-muted text-center mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border border-line bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-brand text-white rounded-full py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors mt-2 disabled:opacity-50">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          Remember your password?{" "}
          <Link href="/admin" className="text-brand font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
