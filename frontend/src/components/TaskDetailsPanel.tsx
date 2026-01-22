import { useEffect, useState } from "react";
import { api } from "../api";

type Task = {
    id: string;
    title: string;
    details: string | null;
    dueDate: string;
    status: "TODO" | "DONE";
    createdAt: string;
    listId: string;
};

export default function TaskDetailsPanel({
    taskId,
    onDeleted,
}: {
    taskId: string | null;
    onDeleted: () => void;
}) {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [editTitle, setEditTitle] = useState("");
    const [editDetails, setEditDetails] = useState("");
    const [editDueDate, setEditDueDate] = useState(""); // datetime-local
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!taskId) {
            setTask(null);
            setError(null);
            setLoading(false);
            setConfirmDelete(false);
            return;
        }

        setLoading(true);
        setError(null);

        api<Task>(`/tasks/${taskId}`)
            .then((t) => {
                setTask(t);
                setIsEditing(false);
                setEditTitle(t.title);
                setEditDetails(t.details ?? "");
                // ISO => datetime-local (YYYY-MM-DDTHH:mm)
                const d = new Date(t.dueDate);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                const hh = String(d.getHours()).padStart(2, "0");
                const min = String(d.getMinutes()).padStart(2, "0");
                setEditDueDate(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
            })

            .catch((err: unknown) =>
                setError(err instanceof Error ? err.message : "Could not load task")
            )
            .finally(() => setLoading(false));
    }, [taskId]);

    async function deleteTask() {
        if (!taskId) return;

        setDeleting(true);
        setError(null);

        try {
            await api<void>(`/tasks/${taskId}`, { method: "DELETE" });
            setConfirmDelete(false);
            setTask(null);
            onDeleted();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Could not delete task");
        } finally {
            setDeleting(false);
        }
    }

    async function saveEdits() {
        if (!taskId) return;

        const cleanTitle = editTitle.trim();
        if (!cleanTitle) {
            setError("Title is required");
            return;
        }
        if (!editDueDate) {
            setError("Due date is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const iso = new Date(editDueDate).toISOString();

            const updated = await api<Task>(`/tasks/${taskId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title: cleanTitle,
                    details: editDetails.trim() ? editDetails.trim() : null,
                    dueDate: iso,
                }),
            });

            setTask(updated);
            setIsEditing(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Could not save changes");
        } finally {
            setSaving(false);
        }
    }

    if (!taskId) {
        return <div className="p-6 text-slate-500">No task selected</div>;
    }

    return (
        <div className="h-full p-6">
            <h2 className="text-lg font-semibold">Task details</h2>

            {loading && <p className="mt-3 text-slate-400">Loading...</p>}
            {error && (
                <div className="mt-3 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
                    {error}
                </div>
            )}

            {task && (
                <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm text-slate-400">Task name</div>
                                <div className="mt-1 text-lg font-semibold">{task.title}</div>
                            </div>
                            <div
                                className={`rounded-full px-3 py-1 text-xs ${task.status === "DONE"
                                    ? "bg-green-500/15 text-green-300"
                                    : "bg-slate-700/40 text-slate-200"
                                    }`}
                            >
                                {task.status}
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm">
                            <div>
                                <div className="text-slate-400">Creation date</div>
                                <div className="mt-1">
                                    {new Date(task.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <div>
                                <div className="text-slate-400">Due date</div>
                                <div className="mt-1">
                                    {new Date(task.dueDate).toLocaleString()}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-slate-400">Description</div>

                                    {!isEditing ? (
                                        <button
                                            onClick={() => {
                                                setError(null);
                                                setIsEditing(true);
                                            }}
                                            className="rounded-lg bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700"
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    // reset à l'état de la task
                                                    setEditTitle(task.title);
                                                    setEditDetails(task.details ?? "");
                                                    const d = new Date(task.dueDate);
                                                    const yyyy = d.getFullYear();
                                                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                                                    const dd = String(d.getDate()).padStart(2, "0");
                                                    const hh = String(d.getHours()).padStart(2, "0");
                                                    const min = String(d.getMinutes()).padStart(2, "0");
                                                    setEditDueDate(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
                                                    setIsEditing(false);
                                                    setError(null);
                                                }}
                                                disabled={saving}
                                                className="rounded-lg bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700 disabled:opacity-60"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={saveEdits}
                                                disabled={saving}
                                                className="rounded-lg bg-violet-600 px-3 py-1 text-xs hover:bg-violet-500 disabled:opacity-60"
                                            >
                                                {saving ? "Saving..." : "Save"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <div className="mt-2 text-slate-200">{task.details ? task.details : "—"}</div>
                                ) : (
                                    <div className="mt-3 space-y-3">
                                        <div>
                                            <div className="text-xs text-slate-400">Title</div>
                                            <input
                                                className="mt-1 w-full rounded bg-slate-800 p-2 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <div className="text-xs text-slate-400">Due date</div>
                                            <input
                                                type="datetime-local"
                                                className="mt-1 w-full rounded bg-slate-800 p-2 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
                                                value={editDueDate}
                                                onChange={(e) => setEditDueDate(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <div className="text-xs text-slate-400">Description</div>
                                            <textarea
                                                rows={4}
                                                className="mt-1 w-full rounded bg-slate-800 p-2 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
                                                value={editDetails}
                                                onChange={(e) => setEditDetails(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Delete */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
                        {!confirmDelete ? (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="w-full rounded-xl bg-red-600 py-3 text-sm font-medium hover:bg-red-500"
                            >
                                Delete task
                            </button>
                        ) : (
                            <div>
                                <p className="text-sm text-slate-300">
                                    Are you sure? This can’t be undone.
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        disabled={deleting}
                                        className="flex-1 rounded-xl bg-slate-800 py-3 text-sm hover:bg-slate-700 disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteTask}
                                        disabled={deleting}
                                        className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-medium hover:bg-red-500 disabled:opacity-60"
                                    >
                                        {deleting ? "Deleting..." : "Confirm"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
