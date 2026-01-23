export default function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base */}
      <div className="absolute inset-0 bg-[#05060b]" />

      {/* Big diagonal gradient (this is the “dégradé” you miss) */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-700/35 via-sky-500/10 to-transparent" />

      {/* Spotlight top-left */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_22%_18%,rgba(99,102,241,0.35),transparent_60%)]" />

      {/* Secondary soft spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_15%_60%,rgba(56,189,248,0.16),transparent_55%)]" />

      {/* Blobs */}
      <div className="absolute -left-56 -top-56 h-[720px] w-[720px] rounded-full bg-violet-600/22 blur-3xl" />
      <div className="absolute left-24 top-0 h-[520px] w-[520px] rounded-full bg-sky-500/16 blur-3xl" />
      <div className="absolute right-[-240px] top-[-240px] h-[780px] w-[780px] rounded-full bg-fuchsia-500/12 blur-3xl" />

      {/* IMPORTANT: veil too strong kills the gradient. Keep it lighter */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
