import type { ReactNode } from "react";
import { clearToken } from "../auth";
import { useNavigate } from "react-router-dom";
import AppBackground from "./AppBackground";
import { LogOut } from "lucide-react";

export default function AppShell({
  left,
  center,
  right,
  leftOpen,
  rightOpen,
  onToggleLeft,
  onToggleRight,
  logoSrc,
}: {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  logoSrc?: string;
}) {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative isolate min-h-screen text-white overflow-hidden">
      <AppBackground />

      {/* Header (transparent) */}
      <header className="h-16">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <img src={logoSrc} alt="Saegus" className="h-7 w-auto object-contain" />
            ) : (
              <div className="text-sm font-semibold tracking-wide text-white/90">
                saegus
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="rounded-xl p-2 ring-1 ring-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>

        </div>
      </header>

      {/* Page */}
      <div className="h-[calc(100vh-4rem)] pb-4">
        <div className="flex h-full justify-center px-4">
          <div className="grid h-full gap-4 grid-cols-[280px_minmax(720px,1fr)_320px]">


            {/* Left column */}
            <section className="relative">
              {leftOpen ? (
                <div className="h-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
                  {/* Left column header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <div className="text-sm font-semibold text-white/90">My lists</div>

                    <button
                      onClick={onToggleLeft}
                      className="rounded-xl bg-white/5 px-2 py-1 text-xs ring-1 ring-white/10 hover:bg-white/10"
                      aria-label="Close lists"
                      title="Close lists"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Scroll area */}
                  <div className="h-[calc(100%-44px)] overflow-y-auto p-3">{left}</div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <button
                    onClick={onToggleLeft}
                    className="rounded-2xl bg-white/10 px-3 py-2 text-xs ring-1 ring-white/15 hover:bg-white/15"
                    aria-label="Open lists"
                    title="Open lists"
                  >
                    Lists
                  </button>
                </div>

              )}

            </section>

            {/* Center column */}
            <section className="h-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
              <div className="h-full overflow-y-auto p-0">{center}</div>
            </section>

            {/* Right column */}
            <section className="relative">
              {rightOpen ? (
                <div className="h-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
                  {/* Right column header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <div className="text-sm font-semibold text-white/90">Details</div>

                    <button
                      onClick={onToggleRight}
                      className="rounded-xl bg-white/5 px-2 py-1 text-xs ring-1 ring-white/10 hover:bg-white/10"
                      aria-label="Close details"
                      title="Close details"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Scroll area */}
                  <div className="h-[calc(100%-44px)] overflow-y-auto p-3">{right}</div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <button
                    onClick={onToggleRight}
                    className="rounded-2xl bg-white/10 px-3 py-2 text-xs ring-1 ring-white/15 hover:bg-white/15"
                    aria-label="Open details"
                    title="Open details"
                  >
                    Details
                  </button>
                </div>

              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
