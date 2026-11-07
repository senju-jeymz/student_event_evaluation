import React from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Calendar, CheckCircle2, Printer, ShieldCheck } from 'lucide-react';

export default function MySlipsView({ onSelectSlip }) {
  const { responses, events, organizations } = useEvaluation();
  const { currentUser } = useAuth();

  // Filter responses belonging to this student (or non-anonymous matches)
  const myResponses = responses.filter(r => r.studentId === currentUser?.studentId && !r.isAnonymous);

  const getEvent = (id) => events.find(e => e.id === id);
  const getOrg = (id) => organizations.find(o => o.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Evaluation Receipts & Certificates</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Historical records of your completed student organization event evaluations.
        </p>
      </div>

      {myResponses.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-xs">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Evaluation Slips Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any identified event evaluations under your student profile yet. Browse events to evaluate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myResponses.map(r => {
            const evt = getEvent(r.eventId);
            const org = getOrg(r.organizationId);

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {org?.shortCode || 'RSO'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">{evt?.title || 'Event'}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {evt?.date || 'Date'} • Evaluated on {new Date(r.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    {r.verificationCode}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {r.isEncrypted ? 'ECC NIST P-256' : 'Verified Submission'}
                  </div>
                  <button
                    onClick={() => onSelectSlip(r)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-all cursor-pointer"
                  >
                    View Slip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
