import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UNIVERSITY_CONFIG } from '../../config/organizationConfig';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const { login, allUsers } = useAuth();

  const [username, setUsername] = useState('aviane.delrosario');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both your username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await login(username.trim(), password);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (userLogin, pass = 'password123') => {
    setUsername(userLogin);
    setPassword(pass);
    setError('');
  };

  // Group quick accounts
  const adminUser = allUsers.find(u => u.role === 'ADMIN');
  const uacscUser = allUsers.find(u => u.role === 'UACSC_OFFICER' || u.organizationId === 'org_uacsc');
  const aaaUser = allUsers.find(u => u.organizationId === 'org_aaa');
  const ssiteUser = allUsers.find(u => u.organizationId === 'org_ssite');
  const studentUser = allUsers.find(u => u.role === 'STUDENT');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            NIST P-256 ECC End-to-End Cryptography
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {UNIVERSITY_CONFIG.name}
          </h1>
          <p className="text-amber-300 text-xs sm:text-sm font-medium italic">
            "{UNIVERSITY_CONFIG.motto}"
          </p>
          <p className="text-slate-300 text-xs">
            Student Organizations Event Evaluation & Governance Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/20">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Enter your collegiate credentials to automatically access your designated organization or student portal.
          </p>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. aviane.delrosario or lead.aaa@ua.edu.ph"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill Demo Profiles */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Profiles (Click to test):
            </p>

            <div className="space-y-2">
              {/* Aviane Del Rosario - AAA */}
              <button
                type="button"
                onClick={() => fillCredentials(aaaUser?.username || 'aviane.delrosario')}
                className="w-full text-left p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/80 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-indigo-900 group-hover:text-indigo-950 flex items-center gap-1">
                    <span>Aviane Del Rosario</span>
                    <span className="text-[10px] bg-indigo-200/80 text-indigo-800 px-1.5 py-0.5 rounded font-mono">AAA President</span>
                  </div>
                  <div className="text-[11px] text-indigo-700">
                    Redirects to: <strong>AAA Org Dashboard Only</strong>
                  </div>
                </div>
                <span className="text-xs text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">Fill &rarr;</span>
              </button>

              {/* Precious Bernadette Estrada - OSA Admin */}
              <button
                type="button"
                onClick={() => fillCredentials(adminUser?.username || 'osa.admin')}
                className="w-full text-left p-2.5 rounded-xl border border-rose-100 bg-rose-50/60 hover:bg-rose-100/80 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-rose-900 group-hover:text-rose-950 flex items-center gap-1">
                    <span>Ms. Precious Bernadette Estrada</span>
                    <span className="text-[10px] bg-rose-200/80 text-rose-800 px-1.5 py-0.5 rounded font-mono">OSA Director</span>
                  </div>
                  <div className="text-[11px] text-rose-700">
                    Redirects to: <strong>OSA, UACSC & All 18 RSOs</strong>
                  </div>
                </div>
                <span className="text-xs text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform">Fill &rarr;</span>
              </button>

              {/* Garnett Tolentino - UACSC */}
              <button
                type="button"
                onClick={() => fillCredentials(uacscUser?.username || 'uacsc.president')}
                className="w-full text-left p-2.5 rounded-xl border border-amber-100 bg-amber-50/60 hover:bg-amber-100/80 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-amber-900 group-hover:text-amber-950 flex items-center gap-1">
                    <span>Garnett G. Tolentino</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-800 px-1.5 py-0.5 rounded font-mono">UACSC President</span>
                  </div>
                  <div className="text-[11px] text-amber-700">
                    Redirects to: <strong>Central Student Council Dashboard</strong>
                  </div>
                </div>
                <span className="text-xs text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform">Fill &rarr;</span>
              </button>

              {/* Student - Leif Joshua Infante */}
              <button
                type="button"
                onClick={() => fillCredentials(studentUser?.username || 'student.leif')}
                className="w-full text-left p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/80 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-900 group-hover:text-emerald-950 flex items-center gap-1">
                    <span>Leif Joshua Infante</span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Student</span>
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Redirects to: <strong>Student Events & Evaluation Portal</strong>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">Fill &rarr;</span>
              </button>
            </div>

            {/* Quick Selector for other 16 organizations */}
            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Or select another RSO President:
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) fillCredentials(e.target.value);
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Choose an RSO officer...</option>
                {allUsers
                  .filter(u => u.role === 'RSO_OFFICER' && u.organizationId !== 'org_aaa')
                  .map(u => (
                    <option key={u.id} value={u.username || u.email}>
                      {u.name} — {u.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          Office of Student Affairs & Services • Accredited Academic Year 2026-2027
        </p>
      </div>
    </div>
  );
}

