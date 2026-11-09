import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvaluation } from '../../context/EvaluationContext';
import { ROLES } from '../../data/mockData';
import { UNIVERSITY_CONFIG } from '../../config/organizationConfig';
import { 
  UserCheck, 
  Lock,
  Building2,
  LogOut
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, logout, switchUser, switchRsoOrganization, allUsers, isAdmin, isUACSC, isRSO, isStudent } = useAuth();
  const { organizations } = useEvaluation();

  const currentOrg = organizations.find(o => o.id === currentUser?.organizationId) || organizations[0];

  const getRoleBadge = (role) => {
    switch (role) {
      case ROLES.ADMIN:
      case 'ADMIN':
        return { label: 'University Admin (OSA)', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case ROLES.UACSC:
      case 'UACSC_OFFICER':
        return { label: 'UACSC President', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case ROLES.RSO:
      case 'RSO_OFFICER':
        return { 
          label: `${currentOrg?.shortCode || 'RSO'} President`, 
          bg: currentOrg?.palette?.badge || 'bg-slate-100 text-slate-800 border-slate-300' 
        };
      case ROLES.STUDENT:
      case 'STUDENT':
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
            <span className="text-slate-400 text-[11px]">Backend:</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">Prisma + SQLite (Port 5000)</span>
          </div>
        </div>

        {/* Quick Role & Identity Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* If OSA Admin, allow supervising and switching across all organizations */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 mr-2">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <label htmlFor="admin-org-inspect" className="text-slate-400 text-[11px]">Inspect RSO:</label>
              <select
                id="admin-org-inspect"
                aria-label="Inspect RSO Organization"
                value={currentUser?.organizationId || ''}
                onChange={(e) => switchRsoOrganization(e.target.value)}
                className="bg-slate-800 text-amber-300 text-xs font-bold rounded-lg px-2 py-1 border border-amber-500/40 focus:outline-none cursor-pointer"
              >
                <option value="">All Organizations (OSA Overview)</option>
                {organizations
                  .filter(org => org.shortCode !== 'UACSC')
                  .map(org => (
                    <option key={org.id} value={org.id}>
                      {org.shortCode} — {org.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* User profile dropdown switcher */}
          <label htmlFor="user-select" className="text-slate-400 text-xs font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            Switch Profile:
          </label>
          <select
            id="user-select"
            value={currentUser?.id || ''}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-slate-800 text-slate-100 text-xs font-medium rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
          >
            <optgroup label="Office of Student Affairs (OSA)">
              {allUsers.filter(u => u.role === ROLES.ADMIN || u.role === 'ADMIN').map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — OSA Director
                </option>
              ))}
            </optgroup>
            <optgroup label="Central Student Council (UACSC)">
              {allUsers.filter(u => u.role === ROLES.UACSC || u.role === 'UACSC_OFFICER').map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — UACSC President
                </option>
              ))}
            </optgroup>
            <optgroup label="RSO Leaders (18 Orgs)">
              {allUsers.filter(u => u.role === ROLES.RSO || u.role === 'RSO_OFFICER').map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Student Participants">
              {allUsers.filter(u => u.role === ROLES.STUDENT || u.role === 'STUDENT').map(u => (
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
              <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base block">
                {isRSO ? `${currentOrg?.name || 'RSO'} Portal` : isUACSC ? 'UACSC Student Council' : isAdmin ? 'OSA University Governance' : 'StudEval Portal'}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">
                {isRSO ? `${currentOrg?.shortCode} • ${currentOrg?.college || 'Student Organization'}` : 'University Event Evaluation System'}
              </span>
            </div>
          </div>

          {/* Navigation Links according to role */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
            {isStudent && (
              <>
                <button
                  onClick={() => setActiveTab('student_events')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'student_events' || activeTab === 'student_eval_form'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  Campus Events
                </button>
                <button
                  onClick={() => setActiveTab('student_my_slips')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'student_my_slips'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  My Slips & Certificates
                </button>
                <button
                  onClick={() => setActiveTab('crypto_inspector')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'crypto_inspector'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/50'
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
                  {currentOrg?.shortCode} Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('rso_evaluations')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'rso_evaluations'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Responses & Decryption
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
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'rso_key_vault'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Key Vault
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
                  UACSC Overview
                </button>
                <button
                  onClick={() => setActiveTab('uacsc_rankings')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'uacsc_rankings'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  18 RSOs Standings
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

          {/* Current User Badge & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-slate-800">{currentUser?.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shadow-xs">
              {currentUser?.avatar || '👤'}
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/70 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
