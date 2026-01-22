import type { ReactNode } from "react";

export default function AppShell({
  left,
  center,
  right,
}: {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="flex h-full bg-slate-950 text-white">
      {/* Sidebar gauche */}
      <aside className="w-72 border-r border-slate-800">{left}</aside>

      {/* Centre */}
      <main className="flex-1">{center}</main>

      {/* Sidebar droite */}
      <aside className="w-80 border-l border-slate-800">{right}</aside>
    </div>
  );
}
