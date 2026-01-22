import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 p-8 shadow-xl backdrop-blur">
        <Outlet />
      </div>
    </div>
  );
}
