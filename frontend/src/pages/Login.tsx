import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { setToken } from "../auth";

type LoginResponse = { token: string };

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("elias@test.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Log In</h1>
      <p className="mt-1 text-sm text-slate-200/70">
        Welcome back. Please enter your details.
      </p>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-500/15 p-4 text-sm text-red-200 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-2 block text-xs text-slate-200/70">Email</span>
          <input
            className="w-full rounded-2xl bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-400/70
                       ring-1 ring-white/10 outline-none backdrop-blur
                       focus:ring-2 focus:ring-violet-500/70"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs text-slate-200/70">Password</span>
          <input
            className="w-full rounded-2xl bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-400/70
                       ring-1 ring-white/10 outline-none backdrop-blur
                       focus:ring-2 focus:ring-violet-500/70"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>


        <button
          disabled={loading}
          className="mt-2 w-full rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white
                     shadow-lg shadow-violet-600/25 transition
                     hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <Link
          to="/register"
          className="block w-full rounded-2xl bg-white/5 py-3 text-center text-sm font-semibold text-white/80
                     ring-1 ring-white/10 hover:bg-white/10"
        >
          Create Account
        </Link>
      </form>
    </div>
  );
}
