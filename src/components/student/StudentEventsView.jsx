import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Building2
} from 'lucide-react';

export default function StudentEventsView({ onSelectEvent, onViewSlip }) {
  const { events, organizations, responses, hasStudentEvaluated } = useEvaluation();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState('ALL');

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.tags && evt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === 'ALL' || evt.category === selectedCategory;
    const matchesOrg = selectedOrgFilter === 'ALL' || evt.organizationId === selectedOrgFilter;
    return matchesSearch && matchesCategory && matchesOrg;
  });

  const getOrg = (orgId) => organizations.find(o => o.id === orgId) || organizations[0];

  return (
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Elliptic Curve Cryptography (NIST P-256) Verified Protection
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            University Student Organization Events
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Your honest feedback drives continuous improvement across collegiate organizations. 
            All submissions are protected by public-key cryptography and can be submitted with full anonymity.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-amber-200 font-medium">
            <span>• University of the Assumption</span>
            <span>• Office of Student Affairs (OSA) Accredited</span>
            <span>• 18 Recognized Organizations & Councils</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by event title, venue, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Organization filter */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              aria-label="Filter by Organization"
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              className="text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All 18 Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.shortCode} — {org.name.length > 28 ? org.name.substring(0, 28) + '...' : org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              aria-label="Filter by Event Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="University Assembly">University Assembly</option>
              <option value="Leadership & Governance">Leadership & Governance</option>
              <option value="Community Celebration">Community Celebration</option>
              <option value="Cultural & Holiday">Cultural & Holiday</option>
              <option value="Academic Symposium">Academic Symposium</option>
              <option value="Business Conference">Business Conference</option>
              <option value="Hackathon & Tech">Hackathon & Tech</option>
              <option value="Technical Workshop">Technical Workshop</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map(evt => {
          const org = getOrg(evt.organizationId);
          const alreadySubmitted = currentUser?.studentId ? hasStudentEvaluated(currentUser.studentId, evt.id) : false;
          const userResponse = responses.find(r => r.eventId === evt.id && r.studentId === currentUser?.studentId);
          const badgeClass = org?.palette?.badge || 'bg-indigo-50 text-indigo-700 border-indigo-100';

          return (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 sm:p-6">
                {/* Header with Org & Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeClass}`}>
                      {org?.shortCode || 'RSO'} • {evt.category}
                    </span>
                    <p className="text-xs font-medium text-slate-500 mt-1.5">{org?.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Adviser: <span className="font-medium text-slate-600">{org?.adviser || 'Department Adviser'}</span>
                    </p>
                  </div>

                  {evt.eccEncryptionRequired && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200" title="ECC End-to-End Encryption Available">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ECC Ready
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {evt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                {/* Event Details */}
                <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.venue} ({evt.modality})</span>
                  </div>
                </div>

                {/* Speakers */}
                {evt.speakers && evt.speakers.length > 0 && (
                  <div className="mt-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Speakers: </span>
                    <span>{Array.isArray(evt.speakers) ? evt.speakers.join(', ') : evt.speakers}</span>
                  </div>
                )}

                {/* Tags */}
                {evt.tags && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {evt.tags.map(t => (
                      <span key={t} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {alreadySubmitted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Evaluated
                    </span>
                  ) : evt.evaluationOpen ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Evaluation Open
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">
                      {evt.status === 'COMPLETED' ? 'Event Concluded' : 'Upcoming Event'}
                    </span>
                  )}
                </div>

                <div>
                  {alreadySubmitted && userResponse ? (
                    <button
                      onClick={() => onViewSlip(userResponse)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      View Receipt
                    </button>
                  ) : evt.evaluationOpen ? (
                    <button
                      onClick={() => onSelectEvent(evt)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      Evaluate Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
                    >
                      Evaluation Closed
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
