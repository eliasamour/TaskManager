import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-full bg-slate-950 text-white">
      <Outlet />
    </div>
  );
}
