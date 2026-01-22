import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-saegus.png";

function NavPill({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={[
        "rounded-full px-4 py-2 text-sm transition",
        active
          ? "bg-violet-600 text-white shadow"
          : "text-slate-200/80 hover:text-white hover:bg-white/5",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute left-40 top-10 h-[380px] w-[380px] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Saegus"
            className="h-8 w-auto object-contain"
          />
        </div>


        <nav className="flex items-center gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur">
          <NavPill to="/login" label="Log-in" />
          <NavPill to="/register" label="Register" />
        </nav>
      </header>

      {/* Center card */}
      <main className="mx-auto grid w-full max-w-6xl place-items-center px-6 pb-16 pt-6">
        <div className="w-full max-w-md rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 shadow-2xl backdrop-blur">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
