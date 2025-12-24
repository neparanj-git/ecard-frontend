import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#f3f4f6] overflow-hidden flex items-center justify-center">
      {/* background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 bg-emerald-400/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 bg-sky-400/30 blur-3xl rounded-full" />
      </div>

      {/* card */}
      <div className="relative z-10 bg-white/85 backdrop-blur border border-slate-200 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-2">
          E-Card <span className="text-emerald-500">Builder</span>
        </h1>

        <p className="text-slate-600 text-sm mb-8">
          Admin panel to create, manage & export digital visiting cards
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium shadow-lg"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="py-3 rounded-xl border border-slate-300 bg-white/70"
          >
            Create Admin Account
          </Link>
        </div>
      </div>
    </div>
  );
}
