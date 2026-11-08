import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvaluation } from '../../context/EvaluationContext';
import { ROLES, UNIVERSITY_CONFIG } from '../../data/mockData';
import { 
  UserCheck, 
  Lock,
  Building2
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, switchUser, switchRsoOrganization, allUsers, isAdmin, isUACSC, isRSO, isStudent } = useAuth();
  const { organizations } = useEvaluation();

  const currentOrg = organizations.find(o => o.id === currentUser?.organizationId) || organizations[0];

  const getRoleBadge = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return { label: 'University Admin (OSA)', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case ROLES.UACSC:
        return { label: 'UACSC President', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case ROLES.RSO:
        return { 
          label: `${currentOrg?.shortCode || 'RSO'} President`, 
          bg: currentOrg?.palette?.badge || 'bg-slate-100 text-slate-800 border-slate-300' 
        };
      case ROLES.STUDENT:
        return { label: 'Student Participant', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'User', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Demo Simulation & Motto Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white tracking-wide">{UNIVERSITY_CONFIG.name}</span>
            <span className="text-amber-400 font-medium italic text-[11px] hidden sm:inline">
              ({UNIVERSITY_CONFIG.motto})
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-700">
            <span className="text-slate-400 text-[11px]">Security:</span>
            <span className="text-emerald-400 font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-emerald-500/30">
              NIST P-256 (ECDH + AES-GCM + ECDSA)
            </span>
          </div>
        </div>

        {/* Quick Role & Identity Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* If RSO Officer, allow choosing from all 18 organizations */}
          {isRSO && (
            <div className="flex items-center gap-1.5 mr-2">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <select
                aria-label="Select RSO Organization"
                value={currentUser?.organizationId || ''}
                onChange={(e) => switchRsoOrganization(e.target.value)}
                className="bg-slate-800 text-amber-300 text-xs font-bold rounded-lg px-2 py-1 border border-amber-500/40 focus:outline-none cursor-pointer"
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.shortCode} — {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label htmlFor="user-select" className="text-slate-400 text-xs font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            Switch User:
          </label>
          <select
            id="user-select"
            value={currentUser?.id}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-slate-800 text-slate-100 text-xs font-medium rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
          >
            <optgroup label="Office of Student Affairs (OSA)">
              {allUsers.filter(u => u.role === ROLES.ADMIN).map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — OSA Director
                </option>
              ))}
            </optgroup>
            <optgroup label="Central Student Council (UACSC)">
              {allUsers.filter(u => u.role === ROLES.UACSC).map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — UACSC President
                </option>
              ))}
            </optgroup>
            <optgroup label="RSO Leaders">
              {allUsers.filter(u => u.role === ROLES.RSO).map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Student Participants">
              {allUsers.filter(u => u.role === ROLES.STUDENT).map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.studentId})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md ring-2 ring-white">
              UA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  StudEval
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NIST ECC
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                UA Student Organization Event Evaluation System
              </p>
            </div>
          </div>

          {/* Navigation Links according to Role */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {isStudent && (
              <>
                <button
                  onClick={() => setActiveTab('student_events')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'student_events' || activeTab === 'student_eval_form'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Campus Events
                </button>
                <button
                  onClick={() => setActiveTab('student_my_slips')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'student_my_slips'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  My Evaluation Receipts
                </button>
                <button
                  onClick={() => setActiveTab('crypto_inspector')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'crypto_inspector'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ECC Playground
                </button>
              </>
            )}

            {isRSO && (
              <>
                <button
                  onClick={() => setActiveTab('rso_dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'rso_dashboard'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  RSO Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('rso_evaluations')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'rso_evaluations'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Responses & Decrypt
                </button>
                <button
                  onClick={() => setActiveTab('rso_action_plans')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'rso_action_plans'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Action Plans
                </button>
                <button
                  onClick={() => setActiveTab('rso_key_vault')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'rso_key_vault'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  ECC Vault
                </button>
              </>
            )}

            {isUACSC && (
              <>
                <button
                  onClick={() => setActiveTab('uacsc_overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'uacsc_overview'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Council Overview
                </button>
                <button
                  onClick={() => setActiveTab('uacsc_rankings')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'uacsc_rankings'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  RSO Rankings
                </button>
                <button
                  onClick={() => setActiveTab('uacsc_calendar')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'uacsc_calendar'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Events Calendar
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('admin_governance')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'admin_governance'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  OSA Governance
                </button>
                <button
                  onClick={() => setActiveTab('admin_rso_registry')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'admin_rso_registry'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  RSO Registry (18 Orgs)
                </button>
                <button
                  onClick={() => setActiveTab('admin_templates')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'admin_templates'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab('admin_audit_logs')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'admin_audit_logs'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Audit Logs
                </button>
              </>
            )}
          </nav>

          {/* Current User Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-slate-800">{currentUser?.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shadow-xs">
              {currentUser?.avatar || '👤'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
