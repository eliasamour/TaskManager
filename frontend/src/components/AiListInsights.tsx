import { useEffect, useState } from "react";
import { api } from "../api";

type AiListResponse = {
  comment: string;
};

export default function AiListInsights({ listId }: { listId: string }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api<AiListResponse>(`/ai/lists/${listId}`);
      setComment(res.comment);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load AI comment");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [listId]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">AI comment</div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-xl bg-slate-800 px-3 py-2 text-xs hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!error && (
        <div className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
          {comment || (loading ? "Loading..." : "No comment yet.")}
        </div>
      )}
    </div>
  );
}
