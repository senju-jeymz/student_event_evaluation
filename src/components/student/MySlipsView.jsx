import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Calendar, ShieldCheck, Trash2, Edit3, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function MySlipsView({ onSelectSlip, onEditSlip }) {
  const { responses, events, organizations, deleteEvaluation } = useEvaluation();
  const { currentUser } = useAuth();

  // Non-modal inline delete confirmation tracker
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');

  // Filter responses belonging to this student (or non-anonymous matches)
  const myResponses = responses.filter(r => r.studentId === currentUser?.studentId && !r.isAnonymous);

  const getEvent = (id) => events.find(e => e.id === id);
  const getOrg = (id) => organizations.find(o => o.id === id);

  const handleDelete = (responseId) => {
    deleteEvaluation(responseId);
    setConfirmDeleteId(null);
    setDeleteSuccessMsg('Evaluation submission was successfully withdrawn and removed.');
    setTimeout(() => setDeleteSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Evaluation Receipts & Certificates</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historical records of your completed student organization event evaluations at University of the Assumption.
          </p>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
          {myResponses.length} {myResponses.length === 1 ? 'Record' : 'Records'} Stored
        </span>
      </div>

      {deleteSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{deleteSuccessMsg}</span>
        </div>
      )}

      {myResponses.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-xs">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Evaluation Slips Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any identified event evaluations under your student profile ({currentUser?.name}) yet. Browse campus events to evaluate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myResponses.map(r => {
            const evt = getEvent(r.eventId);
            const org = getOrg(r.organizationId);
            const badgeClass = org?.palette?.badge || 'bg-indigo-50 text-indigo-700 border-indigo-100';

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                        {org?.shortCode || 'RSO'}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{evt?.title || 'Event'}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {evt?.date || 'Date'} • Evaluated on {new Date(r.submittedAt).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Adviser: <span className="font-medium text-slate-600">{org?.adviser || 'Department Adviser'}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                      {r.verificationCode}
                    </span>
                  </div>

                  {/* Rating summary */}
                  <div className="mt-3.5 flex items-center gap-3 text-xs">
                    <span className="text-slate-500">Overall Rating:</span>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ★ {r.ratings?.overall || 5}.0 / 5.0
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">NPS: {r.ratings?.recommendScore || 10}/10</span>
                  </div>

                  {/* Inline Delete Confirmation Banner (Zero Modals!) */}
                  {confirmDeleteId === r.id && (
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Confirm Evaluation Withdrawal
                      </div>
                      <p className="text-rose-700">
                        Are you sure you want to withdraw this evaluation? This action cannot be undone.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                        >
                          Yes, Withdraw
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {r.isEncrypted ? 'ECC NIST P-256' : 'Verified Submission'}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit Evaluation button (if event is still open or allowed) */}
                    {onEditSlip && (
                      <button
                        onClick={() => onEditSlip(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                        title="Edit ratings and comments"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}

                    {/* View Certificate */}
                    <button
                      onClick={() => onSelectSlip(r)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-all cursor-pointer"
                    >
                      Certificate
                    </button>

                    {/* Withdraw/Delete */}
                    <button
                      onClick={() => setConfirmDeleteId(r.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Withdraw evaluation submission"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
