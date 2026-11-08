import React from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { computeCrossOrgRankings, computeEventStats } from '../../utils/analytics';
import StatCard from '../common/StatCard';
import { 
  Building2, 
  Calendar, 
  Trophy, 
  Star, 
  Users, 
  ShieldCheck, 
  Clock, 
  MapPin 
} from 'lucide-react';

export default function UacscDashboard({ activeSubTab = 'overview', setActiveSubTab }) {
  const { organizations, events, responses } = useEvaluation();
  const rankings = computeCrossOrgRankings(organizations, events, responses);
  const globalStats = computeEventStats(responses);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              University of the Assumption Central Student Council (UACSC)
            </h1>
            <p className="mt-1 text-amber-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              President: <strong>Garnett G. Tolentino</strong>
            </p>
            <p className="mt-1 text-amber-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Adviser: <strong>Dax Nathaniel Bondoc, MPA</strong>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('rankings')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'rankings' ? 'bg-white text-amber-900 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              18 RSOs Rankings
            </button>
            <button
              onClick={() => setActiveSubTab('calendar')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'calendar' ? 'bg-white text-amber-900 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              Events Calendar
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Campus Organizations"
          value={organizations.length}
          subtitle="Accredited councils & RSOs"
          icon={Building2}
          color="amber"
        />
        <StatCard
          title="University-Wide Submissions"
          value={globalStats.total}
          subtitle="Evaluation slips recorded"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Collegiate Rating Average"
          value={`${globalStats.averageRating} / 5.0`}
          subtitle="Aggregate participant score"
          icon={Star}
          color="rose"
        />
        <StatCard
          title="ECC Security Compliance"
          value="100%"
          subtitle="Native NIST P-256 enabled"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Sub-view: Cross-Org Rankings */}
      {(activeSubTab === 'overview' || activeSubTab === 'rankings') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Recognized Student Organization Evaluation Standings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Benchmarked by participant ratings, evaluation volume, and continuous improvement responsiveness.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Organization & Leadership</th>
                  <th className="py-3 px-3">College</th>
                  <th className="py-3 px-3">Events Hosted</th>
                  <th className="py-3 px-3">Evaluations</th>
                  <th className="py-3 px-3">Avg Rating</th>
                  <th className="py-3 px-3 text-right">ECC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankings.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap font-bold text-slate-800">
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 block">{r.name}</span>
                      <span className="text-[11px] text-slate-500">
                        Pres: <strong>{r.president}</strong> • Adv: <strong>{r.adviser || 'Department Adviser'}</strong>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{r.college}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{r.eventCount}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{r.responseCount}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {r.averageRating}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        P-256
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-view: Campus-wide Events Calendar / Schedule */}
      {(activeSubTab === 'calendar') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                University Events Master Calendar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Timeline and evaluation status of campus activities across all student organizations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {events.map(evt => {
              const org = organizations.find(o => o.id === evt.organizationId);
              return (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700 text-center min-w-[64px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {org?.shortCode || 'RSO'}
                        </span>
                        <span className="text-xs text-slate-500">• {evt.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {evt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {evt.venue} ({evt.modality})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      evt.evaluationOpen
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : evt.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {evt.evaluationOpen ? 'Evaluations Open' : evt.status === 'COMPLETED' ? 'Concluded' : 'Upcoming Event'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
