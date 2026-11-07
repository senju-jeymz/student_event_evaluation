import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { computeEventStats } from '../../utils/analytics';
import StatCard from '../common/StatCard';
import { 
  BarChart3, 
  Users, 
  Star, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  Check, 
  Clock, 
  TrendingUp, 
  Activity, 
  ArrowUpRight,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function RsoDashboard({ onNavigateToEvaluations, onNavigateToKeyVault }) {
  const { currentUser } = useAuth();
  const { organizations, events, responses, actionPlans, addEvent } = useEvaluation();

  // Current Org
  const currentOrg = organizations.find(o => o.id === currentUser?.organizationId) || organizations[1]; // default ACSS

  // Filter events and responses strictly belonging to this organization
  const orgEvents = events.filter(e => e.organizationId === currentOrg.id);
  const orgEventIds = orgEvents.map(e => e.id);
  const orgResponses = responses.filter(r => orgEventIds.includes(r.eventId));
  const orgActionPlans = actionPlans.filter(p => p.organizationId === currentOrg.id);

  // Compute aggregate stats
  const stats = computeEventStats(orgResponses);

  // Inline Event Creation State (Zero Modals!)
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Competitions & Workshops',
    date: new Date().toISOString().slice(0, 10),
    time: '01:00 PM - 05:00 PM',
    venue: '',
    modality: 'In-Person',
    speakers: '',
    description: '',
    expectedAttendees: 150,
    tags: 'Academic, Tech'
  });
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
        tags: 'Academic, Tech'
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                {currentOrg.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {currentOrg.college}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {currentOrg.name} ({currentOrg.shortCode})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Official executive dashboard for evaluation metrics, cryptographic feedback decryption, and actionable continuous improvement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreateEvent(!showCreateEvent)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {showCreateEvent ? 'Close Form' : 'Publish New Event'}
            </button>
            <button
              onClick={onNavigateToKeyVault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ECC Key Vault
            </button>
          </div>
        </div>

        {/* INLINE Event Creator Drawer (Strictly NO MODAL!) */}
        {showCreateEvent && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Publish New Event with ECC Encryption
              </h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Protected by NIST P-256
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
                    placeholder="e.g. CodeCamp 2026: Cloud Architecture Workshop"
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
                  <label className="font-bold text-slate-700 block mb-1">Venue / Physical Room *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering Lecture Hall 301 & Zoom Stream"
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

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Resource Speakers (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Doe (AI Lead), John Smith (Senior Dev)"
                    value={newEvent.speakers}
                    onChange={(e) => setNewEvent({ ...newEvent, speakers: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Brief Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the objectives and learning outcomes of this event..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateEvent(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                  >
                    Publish Event
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Evaluations"
          value={stats.total}
          subtext={`Across ${orgEvents.length} registered events`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Overall Satisfaction"
          value={`${stats.overallAverage} / 5.0`}
          subtext="University Standard Benchmark: 4.0+"
          icon={Star}
          color="amber"
          badge="Top Rated"
        />
        <StatCard
          title="Net Promoter Score"
          value={`+${stats.nps}`}
          subtext={`${stats.promoters} Promoters, ${stats.detractors} Detractors`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="ECC Encrypted Feedback"
          value={`${stats.encryptedCount} / ${stats.total}`}
          subtext="Protected with NIST P-256 ECIES"
          icon={ShieldCheck}
          color="purple"
          badge="High Privacy"
        />
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

          <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            💡 <strong>Insight:</strong> Speaker engagement remains your organization's highest performing asset.
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

          <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100">
            <span className="text-slate-500">Positive Index (4-5★):</span>
            <span className="font-bold text-emerald-700">
              {stats.total > 0
                ? `${Math.round((((stats.starDistribution[5] || 0) + (stats.starDistribution[4] || 0)) / stats.total) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Action Plans Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Feedback Improvement Tasks
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
