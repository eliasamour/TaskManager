import { useEffect, useState } from "react";
import { api } from "../api";

type TaskList = {
  id: string;
  name: string;
  createdAt: string;
};

export default function SidebarLists({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadLists() {
    setLoading(true);
    try {
      const data = await api<TaskList[]>("/lists");
      setLists(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createList() {
    const name = newName.trim();
    if (!name) return;

    setError(null);
    setCreating(true);

    try {
      const created = await api<TaskList>("/lists", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      setNewName("");
      setShowCreate(false);

      await loadLists();
      onSelect(created.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not create list";
      setError(msg);
    } finally {
      setCreating(false);
    }
  }

  async function deleteList(id: string) {
    setDeleting(true);
    try {
      await api<void>(`/lists/${id}`, { method: "DELETE" });

      // Si on supprime la liste sélectionnée, on "désélectionne"
      if (selectedId === id) {
        // On ne connaît pas encore les autres listes (on va reload)
        onSelect(""); // on met vide temporairement
      }

      setConfirmDeleteId(null);
      await loadLists();

      // Si on a mis "", on remet null (plus clean)
      if (selectedId === id) {
        onSelect(""); // keep stable for this render
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not delete list";
      setError(msg);
      setConfirmDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  // Helper pour gérer “aucune sélection” proprement
  function setSelectedId(id: string | null) {
    // On force null si id vide
    if (!id) return onSelect("");
    return onSelect(id);
  }

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My lists</h2>
        <button
          onClick={() => {
            setError(null);
            setShowCreate((v) => !v);
          }}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
        >
          {showCreate ? "Close" : "Create"}
        </button>
      </div>

      {showCreate && (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
          <input
            className="w-full rounded bg-slate-800 p-2 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
            placeholder="List name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createList();
              if (e.key === "Escape") setShowCreate(false);
            }}
          />
          <button
            disabled={creating}
            onClick={createList}
            className="w-full rounded bg-violet-600 py-2 text-sm font-medium hover:bg-violet-500 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Add list"}
          </button>

          {error && (
            <div className="rounded-lg bg-red-500/20 p-2 text-xs text-red-200">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex-1 overflow-auto">
        {loading && <p className="text-slate-400">Loading...</p>}

        {!loading && lists.length === 0 && (
          <p className="text-slate-400">No lists yet. Create one.</p>
        )}

        <ul className="mt-2 space-y-2">
          {lists.map((list) => (
            <li key={list.id} className="flex items-center gap-2">
              <button
                onClick={() => setSelectedId(list.id)}
                className={`flex-1 rounded px-3 py-2 text-left ${
                  selectedId === list.id
                    ? "bg-violet-600"
                    : "hover:bg-slate-800"
                }`}
              >
                {list.name}
              </button>

              <button
                onClick={() => setConfirmDeleteId(list.id)}
                className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-red-500/30"
                title="Delete list"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal confirmation */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Delete list?</h3>
            <p className="mt-2 text-sm text-slate-300">
              This will also delete all tasks inside this list.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                className="flex-1 rounded bg-slate-800 py-2 text-sm hover:bg-slate-700"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded bg-red-600 py-2 text-sm font-medium hover:bg-red-500 disabled:opacity-60"
                onClick={() => deleteList(confirmDeleteId)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
