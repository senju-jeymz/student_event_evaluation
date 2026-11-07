import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useCrypto } from '../../context/CryptoContext';
import { useAuth } from '../../context/AuthContext';
import { exportAuditLogsToCsv } from '../../utils/exportCsv';
import StatCard from '../common/StatCard';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Calendar, 
  FileText, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Lock, 
  AlertTriangle,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function AdminGovernance({ activeSubTab = 'overview', setActiveSubTab }) {
  const { organizations, events, formTemplates, addOrganization } = useEvaluation();
  const { auditLogs } = useCrypto();
  const { allUsers } = useAuth();

  // Audit Logs filters
  const [logSearch, setLogSearch] = useState('');
  const [logSeverity, setLogSeverity] = useState('ALL');

  // New Organization Inline Drawer State
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    shortCode: '',
    category: 'Academic RSO',
    college: 'College of Information & Computing Sciences',
    president: ''
  });
  const [orgCreatedSuccess, setOrgCreatedSuccess] = useState(false);

  const handleAddOrgSubmit = (e) => {
    e.preventDefault();
    if (!newOrg.name || !newOrg.shortCode) return;

    addOrganization(newOrg);
    setOrgCreatedSuccess(true);
    setTimeout(() => {
      setOrgCreatedSuccess(false);
      setShowAddOrg(false);
      setNewOrg({
        name: '',
        shortCode: '',
        category: 'Academic RSO',
        college: 'College of Information & Computing Sciences',
        president: ''
      });
    }, 1500);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase());
    const matchesSeverity = logSeverity === 'ALL' || log.severity === logSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-500/20 px-3 py-1 rounded-full border border-rose-400/30 text-rose-200">
              Institutional Governances
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Office of Student Affairs & Services (OSA)
            </h1>
            <p className="mt-1 text-rose-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Institutional oversight for recognized student organizations, evaluation templates, role assignments, and tamper-evident audit logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubTab('registry')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'registry' ? 'bg-white text-rose-900 shadow-md' : 'bg-black/30 text-white hover:bg-black/40'
              }`}
            >
              RSO Registry
            </button>
            <button
              onClick={() => setActiveSubTab('templates')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'templates' ? 'bg-white text-rose-900 shadow-md' : 'bg-black/30 text-white hover:bg-black/40'
              }`}
            >
              Form Templates
            </button>
            <button
              onClick={() => setActiveSubTab('audit_logs')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'audit_logs' ? 'bg-white text-rose-900 shadow-md' : 'bg-black/30 text-white hover:bg-black/40'
              }`}
            >
              Global Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recognized Organizations"
          value={organizations.length}
          subtext="Active in Accreditation Registry"
          icon={Building2}
          color="rose"
        />
        <StatCard
          title="Collegiate Events Registered"
          value={events.length}
          subtext="Covering Workshops & Summits"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="System Registered Users"
          value={allUsers.length}
          subtext="Students, Officers & Admins"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Cryptographic Audit Entries"
          value={auditLogs.length}
          subtext="Tamper-evident system log"
          icon={ShieldCheck}
          color="amber"
          badge="Verified"
        />
      </div>

      {/* Sub-view: RSO Registry */}
      {(activeSubTab === 'overview' || activeSubTab === 'registry') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-600" />
                Recognized Student Organization (RSO) Registry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage accredited student bodies and their active public-key status.
              </p>
            </div>
            <button
              onClick={() => setShowAddOrg(!showAddOrg)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {showAddOrg ? 'Close Form' : 'Register New RSO'}
            </button>
          </div>

          {/* Inline Add Org Form (Zero Modals!) */}
          {showAddOrg && (
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-3">
                Register Accredited Student Organization
              </h3>
              {orgCreatedSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Organization successfully registered in institutional registry!
                </div>
              ) : (
                <form onSubmit={handleAddOrgSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Organization Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Society of Chemical Engineering Students"
                      value={newOrg.name}
                      onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Short Code / Acronym *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SCES"
                      value={newOrg.shortCode}
                      onChange={(e) => setNewOrg({ ...newOrg, shortCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newOrg.category}
                      onChange={(e) => setNewOrg({ ...newOrg, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 cursor-pointer"
                    >
                      <option value="Academic RSO">Academic RSO</option>
                      <option value="Socio-Civic RSO">Socio-Civic RSO</option>
                      <option value="Special Interest Club">Special Interest Club</option>
                      <option value="Sports & Athletics">Sports & Athletics</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">College Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. College of Engineering"
                      value={newOrg.college}
                      onChange={(e) => setNewOrg({ ...newOrg, college: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddOrg(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                    >
                      Accredit Organization
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {organizations.map(org => (
              <div key={org.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{org.name}</span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {org.shortCode}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{org.category} • {org.college}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ECC P-256 Active
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {org.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Form Templates */}
      {(activeSubTab === 'templates') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Institutional Evaluation Form Criteria Templates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard criteria and percentage weights enforced for collegiate student organization events.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {formTemplates.map(tmpl => (
              <div key={tmpl.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Active Standard Template
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{tmpl.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{tmpl.description}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">Updated: {tmpl.lastUpdated}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {tmpl.criteria.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Criterion</span>
                      <strong className="text-slate-800 block mt-0.5">{c.category}</strong>
                      <div className="flex justify-between items-center mt-2 text-slate-500 text-[11px]">
                        <span>Weight: <strong className="text-indigo-600 font-bold">{c.weight}</strong></span>
                        <span>{c.items} Items</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Global Audit Logs */}
      {(activeSubTab === 'audit_logs') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Global Cryptographic & Activity Audit Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable, tamper-evident logs tracking key generation, submissions, and authorized decryptions.
              </p>
            </div>
            <button
              onClick={() => exportAuditLogsToCsv(filteredLogs)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Audit Trail (CSV)
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter logs by actor, action, or keyword..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <select
              value={logSeverity}
              onChange={(e) => setLogSeverity(e.target.value)}
              className="py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">INFO</option>
              <option value="NOTICE">NOTICE</option>
              <option value="SECURITY">SECURITY</option>
            </select>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'SECURITY'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : log.severity === 'NOTICE'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900 text-[11px] font-sans">
                      {log.action}
                    </td>
                    <td className="p-3 text-slate-700 text-[11px] font-sans">
                      {log.actor} <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                    </td>
                    <td className="p-3 text-slate-600 font-sans">{log.organizationId}</td>
                    <td className="p-3 text-slate-600 font-sans text-[11px] max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
