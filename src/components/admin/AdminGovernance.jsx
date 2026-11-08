import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useCrypto } from '../../context/CryptoContext';
import { exportAuditLogsToCsv } from '../../utils/exportCsv';
import { COLOR_PALETTES } from '../../config/organizationConfig';
import StatCard from '../common/StatCard';
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Lock, 
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function AdminGovernance({ activeSubTab = 'overview', setActiveSubTab }) {
  const { organizations, events, formTemplates, addOrganization, updateOrganization, deleteOrganization } = useEvaluation();
  const { auditLogs } = useCrypto();

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
    president: '',
    adviser: '',
    paletteKey: 'GRAY'
  });
  const [orgCreatedSuccess, setOrgCreatedSuccess] = useState(false);

  // Edit Organization Inline State
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [editOrgForm, setEditOrgForm] = useState(null);

  // Delete Organization Inline Confirmation State
  const [confirmDeleteOrgId, setConfirmDeleteOrgId] = useState(null);

  const handleAddOrgSubmit = (e) => {
    e.preventDefault();
    if (!newOrg.name || !newOrg.shortCode) return;

    const chosenPalette = COLOR_PALETTES[newOrg.paletteKey] || COLOR_PALETTES.GRAY;

    addOrganization({
      ...newOrg,
      paletteKey: newOrg.paletteKey,
      palette: chosenPalette,
      color: chosenPalette.gradient
    });

    setOrgCreatedSuccess(true);
    setTimeout(() => {
      setOrgCreatedSuccess(false);
      setShowAddOrg(false);
      setNewOrg({
        name: '',
        shortCode: '',
        category: 'Academic RSO',
        college: 'College of Information & Computing Sciences',
        president: '',
        adviser: '',
        paletteKey: 'GRAY'
      });
    }, 1500);
  };

  const startEditOrg = (org) => {
    setEditingOrgId(org.id);
    setEditOrgForm({
      name: org.name,
      shortCode: org.shortCode,
      president: org.president,
      adviser: org.adviser || '',
      college: org.college || '',
      category: org.category || 'Academic RSO',
      paletteKey: org.paletteKey || 'GRAY'
    });
  };

  const handleSaveEditOrg = (e) => {
    e.preventDefault();
    if (!editOrgForm.name || !editOrgForm.shortCode) return;

    const chosenPalette = COLOR_PALETTES[editOrgForm.paletteKey] || COLOR_PALETTES.GRAY;

    updateOrganization(editingOrgId, {
      ...editOrgForm,
      paletteKey: editOrgForm.paletteKey,
      palette: chosenPalette,
      color: chosenPalette.gradient
    });

    setEditingOrgId(null);
    setEditOrgForm(null);
  };

  const handleDeleteOrg = (id) => {
    deleteOrganization(id);
    setConfirmDeleteOrgId(null);
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
      {/* OSA Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                Office of Student Affairs (OSA)
              </span>
              <span className="text-xs font-semibold text-slate-500">• University of the Assumption</span>
              <span className="text-xs italic text-amber-700 font-medium hidden md:inline">("biasa, maganaca, mayap")</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Student Organizations Governance & Audit Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Director: <strong className="text-slate-800">Ms. Precious Bernadette Estrada</strong> • Institutional compliance, public-key infrastructure, and cryptographic audit records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('registry')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'registry' ? 'bg-rose-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              18 RSOs Registry
            </button>
            <button
              onClick={() => setActiveSubTab('audit_logs')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'audit_logs' ? 'bg-rose-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Accredited Organizations"
          value={organizations.length}
          subtitle="All UA Recognized Councils & RSOs"
          icon={Building2}
          color="rose"
        />
        <StatCard
          title="Campus Events"
          value={events.length}
          subtitle="Total institutional events"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Public Key Coverage"
          value="100%"
          subtitle="NIST P-256 ECC enabled"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Audit Trail Logs"
          value={auditLogs.length}
          subtitle="Tamper-evident system logs"
          icon={Lock}
          color="amber"
        />
      </div>

      {/* Sub-view: RSO Registry (CRUD) */}
      {(activeSubTab === 'overview' || activeSubTab === 'registry') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-600" />
                Accredited Student Organizations (18 Total)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage organizational records, presidents, advisers, and color palettes.
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
                <form onSubmit={handleAddOrgSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Organization Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Society of Information Technology Education"
                      value={newOrg.name}
                      onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Short Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SSITE"
                      value={newOrg.shortCode}
                      onChange={(e) => setNewOrg({ ...newOrg, shortCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">President Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hannah Samantha Lising"
                      value={newOrg.president}
                      onChange={(e) => setNewOrg({ ...newOrg, president: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Faculty Adviser *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mark Anthony Madalipay"
                      value={newOrg.adviser}
                      onChange={(e) => setNewOrg({ ...newOrg, adviser: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">College Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. College of Information & Computing Sciences"
                      value={newOrg.college}
                      onChange={(e) => setNewOrg({ ...newOrg, college: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Color Palette (Theme)</label>
                    <select
                      value={newOrg.paletteKey}
                      onChange={(e) => setNewOrg({ ...newOrg, paletteKey: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold cursor-pointer"
                    >
                      {Object.keys(COLOR_PALETTES).map(key => (
                        <option key={key} value={key}>
                          {COLOR_PALETTES[key].name} ({COLOR_PALETTES[key].primary})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
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

          {/* INLINE EDIT ORG DRAWER */}
          {editingOrgId && editOrgForm && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 animate-fade-in space-y-3">
              <span className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-700" />
                Editing Organization: {editOrgForm.name} ({editOrgForm.shortCode})
              </span>
              <form onSubmit={handleSaveEditOrg} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={editOrgForm.name}
                    onChange={(e) => setEditOrgForm({ ...editOrgForm, name: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Code</label>
                  <input
                    type="text"
                    required
                    value={editOrgForm.shortCode}
                    onChange={(e) => setEditOrgForm({ ...editOrgForm, shortCode: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">President</label>
                  <input
                    type="text"
                    required
                    value={editOrgForm.president}
                    onChange={(e) => setEditOrgForm({ ...editOrgForm, president: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adviser</label>
                  <input
                    type="text"
                    required
                    value={editOrgForm.adviser}
                    onChange={(e) => setEditOrgForm({ ...editOrgForm, adviser: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">College</label>
                  <input
                    type="text"
                    value={editOrgForm.college}
                    onChange={(e) => setEditOrgForm({ ...editOrgForm, college: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color Palette</label>
                  <select
                    value={editOrgForm.paletteKey}
                    onChange={(e) => setEditOrgForm({ ...editOrgForm, paletteKey: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold cursor-pointer"
                  >
                    {Object.keys(COLOR_PALETTES).map(key => (
                      <option key={key} value={key}>
                        {COLOR_PALETTES[key].name} ({COLOR_PALETTES[key].primary})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingOrgId(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Organizations List */}
          <div className="divide-y divide-slate-100">
            {organizations.map(org => {
              const badgeClass = org.palette?.badge || 'bg-slate-100 text-slate-700 border-slate-200';
              const orgEventCount = events.filter(e => e.organizationId === org.id).length;

              return (
                <div key={org.id} className="py-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                          {org.shortCode}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{org.name}</span>
                      </div>
                      <p className="text-slate-500 mt-1">
                        <strong>President:</strong> {org.president} • <strong>Adviser:</strong> {org.adviser || 'Department Adviser'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {org.college} • {orgEventCount} Events Registered
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        P-256 ECC Active
                      </span>

                      <button
                        onClick={() => startEditOrg(org)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                        title="Edit Organization Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setConfirmDeleteOrgId(org.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Remove Organization"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Delete Org Confirmation */}
                  {confirmDeleteOrgId === org.id && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Remove {org.name} and all its events from system?</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDeleteOrg(org.id)}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteOrgId(null)}
                          className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Sub-view: Cryptographic Audit Logs */}
      {(activeSubTab === 'audit_logs') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Immutable Cryptographic Audit Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Timestamped records of all key generations, submissions, and authorized decryptions.
              </p>
            </div>
            <button
              onClick={() => exportAuditLogsToCsv(auditLogs)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Audit Trail
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail by actor, action, or details..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={logSeverity}
                onChange={(e) => setLogSeverity(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                <option value="INFO">INFO</option>
                <option value="NOTICE">NOTICE</option>
                <option value="SECURITY">SECURITY</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      <span className="font-semibold block">{log.actor}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.actorRole}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-md">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'SECURITY'
                          ? 'bg-rose-100 text-rose-800'
                          : log.severity === 'NOTICE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.severity}
                      </span>
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
