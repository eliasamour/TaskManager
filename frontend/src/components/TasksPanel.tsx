import { useEffect, useState } from "react";
import { api } from "../api";
import AiHomeInsights from "./AiHomeInsights";
import AiListInsights from "./AiListInsights";

type Task = {
    id: string;
    title: string;
    details: string | null;
    dueDate: string;
    status: "TODO" | "DONE";
    createdAt: string;
    listId: string;
};

export default function TasksPanel({
    listId,
    onSelectTask,
    selectedTaskId,
    refreshKey,
}: {
    listId: string | null;
    onSelectTask: (id: string | null) => void;
    selectedTaskId: string | null;
    refreshKey: number;
}) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal create task
    const [openCreate, setOpenCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [creating, setCreating] = useState(false);

    const [showCompleted, setShowCompleted] = useState(false);

    async function loadTasks(activeListId: string) {
        setLoading(true);
        setError(null);

        try {
            const data = await api<Task[]>(`/lists/${activeListId}/tasks`);
            setTasks(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Could not load tasks");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!listId) {
            setTasks([]);
            setError(null);
            setLoading(false);
            setOpenCreate(false);
            setShowCompleted(false);
            return;
        }
        loadTasks(listId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId, refreshKey]);

    function resetForm() {
        setTitle("");
        setDetails("");
        setDueDate("");
        setError(null);
    }

    async function createTask() {
        if (!listId) return;

        const cleanTitle = title.trim();
        if (!cleanTitle) {
            setError("Title is required");
            return;
        }
        if (!dueDate) {
            setError("Due date is required");
            return;
        }

        setCreating(true);
        setError(null);

        try {
            const iso = new Date(dueDate).toISOString();

            await api<Task>(`/lists/${listId}/tasks`, {
                method: "POST",
                body: JSON.stringify({
                    title: cleanTitle,
                    details: details.trim() ? details.trim() : undefined,
                    dueDate: iso,
                }),
            });

            await loadTasks(listId);
            setOpenCreate(false);
            resetForm();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Could not create task");
        } finally {
            setCreating(false);
        }
    }

    async function toggleTask(task: Task) {
        const nextStatus: Task["status"] = task.status === "DONE" ? "TODO" : "DONE";

        // update optimiste (UI immédiate)
        setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
        );

        try {
            await api<Task>(`/tasks/${task.id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus }),
            });
        } catch (err) {
            // rollback si erreur
            setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
            );
            setError(err instanceof Error ? err.message : "Could not update task");
        }
    }


    if (!listId) {
        return (
            <div className="p-6">
                <AiHomeInsights />
                <div className="mt-6 text-slate-300">
                    <h2 className="text-xl font-semibold text-white">Tasks</h2>
                    <p className="mt-3">Select a list to see its tasks.</p>
                </div>
            </div>
        );
    }


    const todoTasks = tasks.filter((t) => t.status !== "DONE");
    const doneTasks = tasks.filter((t) => t.status === "DONE");

    return (
        <div className="h-full p-6 flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Tasks</h2>

                <button
                    onClick={() => {
                        setOpenCreate(true);
                        setError(null);
                    }}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500"
                >
                    + Add task
                </button>
            </div>
            <div className="mt-4">
                <AiListInsights listId={listId} />
            </div>


            {loading && <p className="mt-4 text-slate-400">Loading...</p>}

            {!loading && !error && tasks.length === 0 && (
                <p className="mt-4 text-slate-400">No tasks yet.</p>
            )}

            {error && !openCreate && (
                <div className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
                    {error}
                </div>
            )}

            <div className="mt-4 flex-1 overflow-auto">
                {/* TODO tasks */}
                <ul className="space-y-2">
                    {todoTasks.map((t) => {
                        const active = selectedTaskId === t.id;
                        return (
                            <li key={t.id}>
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${active
                                        ? "border-violet-500 bg-violet-500/10"
                                        : "border-slate-800 hover:bg-slate-900/40"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={t.status === "DONE"}
                                        onChange={() => toggleTask(t)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-4 w-4 accent-violet-600 cursor-pointer"
                                    />

                                    <button onClick={() => onSelectTask(t.id)} className="flex-1 text-left">
                                        <div className="font-medium">{t.title}</div>
                                        <div className="mt-1 text-xs text-slate-400">
                                            Due: {new Date(t.dueDate).toLocaleString()}
                                        </div>
                                    </button>

                                    <div className="text-xs text-slate-400">{t.status}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Completed collapsible */}
                <div className="mt-6">
                    <button
                        onClick={() => setShowCompleted((v) => !v)}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 text-left hover:bg-slate-900/50"
                    >
                        <span className="font-medium">
                            Completed tasks <span className="text-slate-400">({doneTasks.length})</span>
                        </span>
                        <span className="text-sm text-slate-300">
                            {showCompleted ? "Hide" : "Show"}
                        </span>
                    </button>

                    {showCompleted && (
                        <ul className="mt-3 space-y-2">
                            {doneTasks.length === 0 ? (
                                <li className="text-sm text-slate-400 px-1">No completed tasks.</li>
                            ) : (
                                doneTasks.map((t) => {
                                    const active = selectedTaskId === t.id;
                                    return (
                                        <li key={t.id}>
                                            <div
                                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${active
                                                    ? "border-violet-500 bg-violet-500/10"
                                                    : "border-slate-800 hover:bg-slate-900/40"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={t.status === "DONE"}
                                                    onChange={() => toggleTask(t)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="h-4 w-4 accent-violet-600 cursor-pointer"
                                                />

                                                <button onClick={() => onSelectTask(t.id)} className="flex-1 text-left">
                                                    <div className="font-medium line-through text-slate-400">
                                                        {t.title}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Due: {new Date(t.dueDate).toLocaleString()}
                                                    </div>
                                                </button>

                                                <div className="text-xs text-green-300">DONE</div>
                                            </div>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Modal Create Task */}
            {openCreate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => {
                        setOpenCreate(false);
                        resetForm();
                    }}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Create task</h3>
                            <button
                                className="rounded-lg bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
                                onClick={() => {
                                    setOpenCreate(false);
                                    resetForm();
                                }}
                            >
                                Esc
                            </button>
                        </div>

                        <div className="mt-4 grid gap-3">
                            <input
                                className="w-full rounded bg-slate-800 p-3 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
                                placeholder="Title (required)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />

                            <textarea
                                className="w-full rounded bg-slate-800 p-3 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
                                placeholder="Details (optional)"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={4}
                            />

                            <input
                                className="w-full rounded bg-slate-800 p-3 outline-none ring-1 ring-slate-700 focus:ring-violet-500"
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />

                            {error && (
                                <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="mt-2 flex gap-2">
                                <button
                                    className="flex-1 rounded bg-slate-800 py-3 text-sm hover:bg-slate-700"
                                    onClick={() => {
                                        setOpenCreate(false);
                                        resetForm();
                                    }}
                                    disabled={creating}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 rounded bg-violet-600 py-3 text-sm font-medium hover:bg-violet-500 disabled:opacity-60"
                                    onClick={createTask}
                                    disabled={creating}
                                >
                                    {creating ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
