import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { computeCrossOrgRankings, computeEventStats } from '../../utils/analytics';
import StatCard from '../common/StatCard';
import { 
  Building2, 
  Calendar, 
  Trophy, 
  Star, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Download,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function UacscDashboard({ activeSubTab = 'overview', setActiveSubTab }) {
  const { organizations, events, responses } = useEvaluation();
  const rankings = computeCrossOrgRankings(organizations, events, responses);
  const globalStats = computeEventStats(responses);

  const [filterMonth, setFilterMonth] = useState('ALL');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full border border-white/20">
              Central Student Council Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              University of the Assumption Central Student Council (UACSC)
            </h1>
            <p className="mt-1 text-amber-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              𝗧𝗵𝗲 𝗛𝗶𝗴𝗵𝗲𝘀𝘁, 𝗨𝗻𝗶𝗳𝗶𝗲𝗱, 𝗮𝗻𝗱 𝗔𝘂𝘁𝗼𝗻𝗼𝗺𝗼𝘂𝘀 𝗦𝘁𝘂𝗱𝗲𝗻𝘁 𝗚𝗼𝘃𝗲𝗿𝗻𝗶𝗻𝗴 𝗕𝗼𝗱𝘆 𝗶𝗻 𝘁𝗵𝗲 𝗨𝗻𝗶𝘃𝗲𝗿𝘀𝗶𝘁𝘆 𝗼𝗳 𝘁𝗵𝗲 𝗔𝘀𝘀𝘂𝗺𝗽𝘁𝗶𝗼𝗻.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('rankings')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'rankings' ? 'bg-white text-amber-900 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              RSO Rankings
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

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="University Satisfaction Index"
          value={`${globalStats.overallAverage} / 5.0`}
          subtext="Campus-wide aggregate score"
          icon={Star}
          color="amber"
          badge="Above Target"
        />
        <StatCard
          title="Total Student Responses"
          value={globalStats.total}
          subtext="Captured through online forms"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Active Student Orgs"
          value={organizations.length}
          subtext="RSOs & Academic Societies"
          icon={Building2}
          color="emerald"
        />
        <StatCard
          title="Campus Net Promoter Score"
          value={`+${globalStats.nps}`}
          subtext={`${globalStats.promoters} Promoters campus-wide`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Sub-view: Cross-Org Rankings Leaderboard */}
      {(activeSubTab === 'overview' || activeSubTab === 'rankings') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Cross-Organization Performance Benchmarks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated satisfaction scores based on student post-event evaluations.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">AY 2026-2027</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Student Organization</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Events</th>
                  <th className="p-3 text-center">Submissions</th>
                  <th className="p-3 text-center">Satisfaction</th>
                  <th className="p-3 text-center">NPS</th>
                  <th className="p-3 text-center">ECC Protection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankings.map((org, index) => (
                  <tr key={org.organizationId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-black text-slate-700">
                      {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{org.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({org.shortCode})</span>
                    </td>
                    <td className="p-3 text-slate-600">{org.category}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{org.totalEvents}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{org.totalResponses}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ★ {org.overallAverage > 0 ? org.overallAverage.toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-indigo-700">
                      {org.totalResponses > 0 ? `+${org.nps}` : 'N/A'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
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
                Collegiate Events Master Calendar
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
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {evt.evaluationOpen ? 'Evaluations Open' : 'Concluded'}
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
