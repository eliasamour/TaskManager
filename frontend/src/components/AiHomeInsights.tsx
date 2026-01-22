import { useEffect, useState } from "react";
import { api } from "../api";

type AiHomeResponse = {
  comment: string;
};

export default function AiHomeInsights() {
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api<AiHomeResponse>("/ai/home");
      setComment(res.comment);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load AI insights");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">
            AI Insights
          </div>
          <div className="mt-1 text-base font-semibold text-white">
            Global overview
          </div>
        </div>

        <button
          onClick={load}
          disabled={loading}
          className="rounded-xl bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!error && (
        <div className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
          {comment || (loading ? "Loading..." : "No insight yet.")}
        </div>
      )}
    </div>
  );
}
