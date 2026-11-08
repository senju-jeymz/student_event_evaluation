import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { computeEventStats } from '../../utils/analytics';
import { COLOR_PALETTES } from '../../config/organizationConfig';
import StatCard from '../common/StatCard';
import { 
  Users, 
  Star, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  Check, 
  Activity, 
  ArrowUpRight,
  Edit3,
  Trash2,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function RsoDashboard({ onNavigateToEvaluations, onNavigateToKeyVault }) {
  const { currentUser } = useAuth();
  const { 
    organizations, 
    events, 
    responses, 
    actionPlans, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    toggleEventEvaluation,
    updateOrganization 
  } = useEvaluation();

  // Current Org
  const currentOrg = organizations.find(o => o.id === currentUser?.organizationId) || organizations[0];

  // Filter events and responses strictly belonging to this organization
  const orgEvents = events.filter(e => e.organizationId === currentOrg.id);
  const orgEventIds = orgEvents.map(e => e.id);
  const orgResponses = responses.filter(r => orgEventIds.includes(r.eventId));
  const orgActionPlans = actionPlans.filter(p => p.organizationId === currentOrg.id);

  // Compute aggregate stats
  const stats = computeEventStats(orgResponses);

  // -------------------------------------------------------------
  // 1. INLINE ORGANIZATION PROFILE QUICK-EDITOR (Zero Modals!)
  // -------------------------------------------------------------
  const [showOrgEditor, setShowOrgEditor] = useState(false);
  const [orgEditForm, setOrgEditForm] = useState({
    name: currentOrg.name,
    shortCode: currentOrg.shortCode,
    president: currentOrg.president,
    adviser: currentOrg.adviser || '',
    college: currentOrg.college || '',
    description: currentOrg.description || '',
    paletteKey: currentOrg.paletteKey || 'GRAY'
  });
  const [orgSaveSuccess, setOrgSaveSuccess] = useState(false);

  const handleSaveOrg = (e) => {
    e.preventDefault();
    const chosenPalette = COLOR_PALETTES[orgEditForm.paletteKey] || currentOrg.palette;
    updateOrganization(currentOrg.id, {
      ...orgEditForm,
      paletteKey: orgEditForm.paletteKey,
      palette: chosenPalette,
      color: chosenPalette?.gradient || currentOrg.color
    });
    setOrgSaveSuccess(true);
    setTimeout(() => {
      setOrgSaveSuccess(false);
      setShowOrgEditor(false);
    }, 1500);
  };

  // -------------------------------------------------------------
  // 2. INLINE EVENT CREATION (Zero Modals!)
  // -------------------------------------------------------------
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState(() => ({
    title: '',
    category: 'Competitions & Workshops',
    date: new Date().toISOString().slice(0, 10),
    time: '01:00 PM - 05:00 PM',
    venue: '',
    modality: 'In-Person',
    speakers: '',
    description: '',
    expectedAttendees: 150,
    tags: 'Academic, Student'
  }));
  const [eventCreatedSuccess, setEventCreatedSuccess] = useState(false);

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.venue) return;

    addEvent({
      ...newEvent,
      organizationId: currentOrg.id,
      speakers: newEvent.speakers.split(',').map(s => s.trim()).filter(Boolean),
      tags: newEvent.tags.split(',').map(t => t.trim()).filter(Boolean),
      eccEncryptionRequired: true
    });

    setEventCreatedSuccess(true);
    setTimeout(() => {
      setEventCreatedSuccess(false);
      setShowCreateEvent(false);
      setNewEvent({
        title: '',
        category: 'Competitions & Workshops',
        date: new Date().toISOString().slice(0, 10),
        time: '01:00 PM - 05:00 PM',
        venue: '',
        modality: 'In-Person',
        speakers: '',
        description: '',
        expectedAttendees: 150,
        tags: 'Academic, Student'
      });
    }, 1500);
  };

  // -------------------------------------------------------------
  // 3. INLINE EVENT EDITING (Zero Modals!)
  // -------------------------------------------------------------
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventForm, setEditEventForm] = useState(null);
  const [eventEditSuccess, setEventEditSuccess] = useState(false);

  const startEditEvent = (evt) => {
    setEditingEventId(evt.id);
    setEditEventForm({
      title: evt.title,
      category: evt.category,
      date: evt.date,
      time: evt.time,
      venue: evt.venue,
      modality: evt.modality,
      speakers: Array.isArray(evt.speakers) ? evt.speakers.join(', ') : (evt.speakers || ''),
      description: evt.description || '',
      expectedAttendees: evt.expectedAttendees || 100,
      evaluationOpen: evt.evaluationOpen
    });
  };

  const handleSaveEditEvent = (e) => {
    e.preventDefault();
    if (!editEventForm.title || !editEventForm.venue) return;

    updateEvent(editingEventId, {
      ...editEventForm,
      speakers: editEventForm.speakers.split(',').map(s => s.trim()).filter(Boolean)
    });

    setEventEditSuccess(true);
    setTimeout(() => {
      setEventEditSuccess(false);
      setEditingEventId(null);
      setEditEventForm(null);
    }, 1500);
  };

  // -------------------------------------------------------------
  // 4. INLINE EVENT DELETION (Zero Modals!)
  // -------------------------------------------------------------
  const [confirmDeleteEventId, setConfirmDeleteEventId] = useState(null);

  const handleDeleteEvent = (id) => {
    deleteEvent(id);
    setConfirmDeleteEventId(null);
  };

  const badgeClass = currentOrg.palette?.badge || 'bg-indigo-50 text-indigo-700 border-indigo-100';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeClass}`}>
                {currentOrg.shortCode} • {currentOrg.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {currentOrg.college}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {currentOrg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <strong>President:</strong> {currentOrg.president}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <strong>Faculty Adviser:</strong> {currentOrg.adviser || 'Department Adviser'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                ECC NIST P-256 Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Organization Settings Trigger */}
            <button
              onClick={() => setShowOrgEditor(!showOrgEditor)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              title="Change Organization Name, shortCode, President, Adviser, and Color"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              {showOrgEditor ? 'Close Settings' : 'Edit Org Info'}
            </button>

            {/* Create Event Trigger */}
            <button
              onClick={() => setShowCreateEvent(!showCreateEvent)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {showCreateEvent ? 'Close Form' : 'Publish Event'}
            </button>

            {/* ECC Key Vault */}
            <button
              onClick={onNavigateToKeyVault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Key Vault
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* INLINE ORGANIZATION PROFILE QUICK-EDITOR (Zero Modals!) */}
        {/* ------------------------------------------------------- */}
        {showOrgEditor && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Edit Organization Profile, Leadership & Color Palette
              </h3>
              <span className="text-xs font-semibold text-slate-500">Instant State & LocalStorage Synchronization</span>
            </div>

            {orgSaveSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 text-emerald-800 text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Organization details successfully updated!
              </div>
            ) : (
              <form onSubmit={handleSaveOrg} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Organization Full Name *</label>
                  <input
                    type="text"
                    required
                    value={orgEditForm.name}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Code *</label>
                  <input
                    type="text"
                    required
                    value={orgEditForm.shortCode}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, shortCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">President Name *</label>
                  <input
                    type="text"
                    required
                    value={orgEditForm.president}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, president: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Faculty Adviser *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Mark Anthony Madalipay"
                    value={orgEditForm.adviser}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, adviser: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color Palette (Theme)</label>
                  <select
                    value={orgEditForm.paletteKey}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, paletteKey: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer font-bold"
                  >
                    {Object.keys(COLOR_PALETTES).map(key => (
                      <option key={key} value={key}>
                        {COLOR_PALETTES[key].name} ({COLOR_PALETTES[key].primary})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Description / Mission</label>
                  <textarea
                    rows={2}
                    value={orgEditForm.description}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOrgEditor(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                  >
                    Save Organization Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* INLINE EVENT CREATOR DRAWER (Strictly NO MODAL!)        */}
        {/* ------------------------------------------------------- */}
        {showCreateEvent && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Publish New Event for {currentOrg.shortCode}
              </h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ECC NIST P-256 Ready
              </span>
            </div>

            {eventCreatedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center font-bold text-sm">
                Event successfully published and ready for student evaluations!
              </div>
            ) : (
              <form onSubmit={handleCreateEventSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HackFlow 2026: Cryptography & AI Hackathon"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Competitions & Workshops">Competitions & Workshops</option>
                    <option value="Conferences & Seminars">Conferences & Seminars</option>
                    <option value="Leadership & Governance">Leadership & Governance</option>
                    <option value="Community Celebration">Community Celebration</option>
                    <option value="Outreach & Civic Action">Outreach & Civic Action</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM - 05:00 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modality</label>
                  <select
                    value={newEvent.modality}
                    onChange={(e) => setNewEvent({ ...newEvent, modality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Virtual / Zoom">Virtual / Zoom</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CICS Innovation Hub & University Grounds"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    value={newEvent.expectedAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, expectedAttendees: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Resource Speakers (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Smith, Engr. Alex Garcia"
                    value={newEvent.speakers}
                    onChange={(e) => setNewEvent({ ...newEvent, speakers: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. AI, Security, Web3"
                    value={newEvent.tags}
                    onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Event Description & Objectives</label>
                  <textarea
                    rows={2}
                    placeholder="Describe program goals, expected outcomes, and target audience..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateEvent(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                  >
                    Save & Publish Event
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Evaluations"
          value={stats.total}
          subtitle={`Across ${orgEvents.length} events`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Overall Satisfaction"
          value={`${stats.averageRating} / 5.0`}
          subtitle={`Weighted average (${stats.total} responses)`}
          icon={Star}
          color="amber"
        />
        <StatCard
          title="Net Promoter Score"
          value={stats.nps}
          subtitle={`${stats.promoterRate}% would recommend`}
          icon={Sparkles}
          color="emerald"
        />
        <StatCard
          title="Encrypted Ratio"
          value={`${stats.encryptedPercentage}%`}
          subtitle="NIST P-256 protected submissions"
          icon={ShieldCheck}
          color="cyan"
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. ORGANIZATION EVENTS MANAGEMENT TABLE (Full CRUD, NO MODAL!) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              {currentOrg.shortCode} Events Management (CRUD)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage event schedules, toggle live evaluation submission windows, edit details, or archive events.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            {orgEvents.length} Events Total
          </span>
        </div>

        {/* INLINE EDIT EVENT DRAWER */}
        {editingEventId && editEventForm && (
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-700" />
                Editing Event: <span className="underline">{editEventForm.title}</span>
              </span>
              <button
                onClick={() => setEditingEventId(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            {eventEditSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center">
                Event changes successfully updated!
              </div>
            ) : (
              <form onSubmit={handleSaveEditEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editEventForm.title}
                    onChange={(e) => setEditEventForm({ ...editEventForm, title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editEventForm.category}
                    onChange={(e) => setEditEventForm({ ...editEventForm, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={editEventForm.date}
                    onChange={(e) => setEditEventForm({ ...editEventForm, date: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    value={editEventForm.time}
                    onChange={(e) => setEditEventForm({ ...editEventForm, time: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modality</label>
                  <select
                    value={editEventForm.modality}
                    onChange={(e) => setEditEventForm({ ...editEventForm, modality: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Virtual / Zoom">Virtual / Zoom</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={editEventForm.venue}
                    onChange={(e) => setEditEventForm({ ...editEventForm, venue: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Evaluation Status</label>
                  <select
                    value={editEventForm.evaluationOpen ? 'OPEN' : 'CLOSED'}
                    onChange={(e) => setEditEventForm({ ...editEventForm, evaluationOpen: e.target.value === 'OPEN' })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="OPEN">Evaluation OPEN</option>
                    <option value="CLOSED">Evaluation CLOSED</option>
                  </select>
                </div>
                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEventId(null)}
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
            )}
          </div>
        )}

        {/* Events Table */}
        {orgEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No events registered under this organization yet. Click "Publish Event" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Event Title</th>
                  <th className="py-3 px-3">Date & Schedule</th>
                  <th className="py-3 px-3">Venue</th>
                  <th className="py-3 px-3">Submissions</th>
                  <th className="py-3 px-3">Eval Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgEvents.map(evt => {
                  const evtResponses = responses.filter(r => r.eventId === evt.id);

                  return (
                    <React.Fragment key={evt.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 block">{evt.title}</span>
                          <span className="text-[11px] text-slate-500">{evt.category}</span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-slate-700 block font-medium">{evt.date}</span>
                          <span className="text-[11px] text-slate-400">{evt.time}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-slate-700 block truncate max-w-xs">{evt.venue}</span>
                          <span className="text-[11px] text-slate-400">{evt.modality}</span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {evtResponses.length} Submissions
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <button
                            onClick={() => toggleEventEvaluation(evt.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${
                              evt.evaluationOpen
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click to toggle open/closed"
                          >
                            {evt.evaluationOpen ? '● OPEN (Accepting)' : '○ CLOSED'}
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEditEvent(evt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                              title="Edit Event"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteEventId(evt.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline Delete Event Confirmation */}
                      {confirmDeleteEventId === evt.id && (
                        <tr>
                          <td colSpan={6} className="p-3 bg-rose-50 border-y border-rose-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900">
                              <div className="flex items-center gap-2 font-bold">
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>
                                  Delete "{evt.title}" and its {evtResponses.length} associated student evaluation responses?
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleDeleteEvent(evt.id)}
                                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteEventId(null)}
                                  className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Category Performance Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Category Score Averages
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Scale of 1.0 to 5.0</span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Program & Objectives</span>
                <span className="text-indigo-600 font-bold">{stats.categoryAverages.program} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(stats.categoryAverages.program / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Speakers & Facilitators</span>
                <span className="text-emerald-600 font-bold">{stats.categoryAverages.speakers} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${(stats.categoryAverages.speakers / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Logistics & Venue Quality</span>
                <span className="text-amber-600 font-bold">{stats.categoryAverages.logistics} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(stats.categoryAverages.logistics / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Star Rating Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Rating Frequency Distribution
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Total: {stats.total}</span>
          </div>

          <div className="space-y-2 pt-1">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = stats.starDistribution[stars] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        stars >= 4 ? 'bg-amber-400' : stars === 3 ? 'bg-indigo-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-right font-mono text-slate-500">{pct}% ({count})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Plans Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Continuous Improvement Tasks
            </h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {orgActionPlans.length} Total
            </span>
          </div>

          <div className="space-y-2.5">
            {orgActionPlans.slice(0, 3).map(plan => (
              <div key={plan.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-800 line-clamp-1">{plan.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    plan.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1 line-clamp-1 italic">
                  Origin: "{plan.originFeedback}"
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={onNavigateToEvaluations}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            Review All Submissions & Inline Decrypt
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
