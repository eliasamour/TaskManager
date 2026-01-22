import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { setToken } from "../auth";

type RegisterResponse = {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  };
};

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Elias");
  const [lastName, setLastName] = useState("Amour");
  const [email, setEmail] = useState(`elias+${Date.now()}@test.com`);
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      setToken(res.token);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Create account</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full rounded bg-slate-800 p-3 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="w-full rounded bg-slate-800 p-3 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="w-full rounded bg-slate-800 p-3 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="w-full rounded bg-slate-800 p-3 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
          type="password"
          placeholder="Password (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-violet-600 py-3 font-medium hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-300">
        Already have an account?{" "}
        <Link className="text-violet-300 hover:underline" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
