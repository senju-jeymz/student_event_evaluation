import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock, Plus, Target, ArrowRight } from 'lucide-react';

export default function ActionPlansPanel() {
  const { currentUser } = useAuth();
  const { organizations, actionPlans, addActionPlan, updateActionPlanStatus } = useEvaluation();

  const currentOrg = organizations.find(o => o.id === currentUser?.organizationId) || organizations[1];
  const orgActionPlans = actionPlans.filter(p => p.organizationId === currentOrg.id);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    originFeedback: '',
    assignedTo: `${currentOrg.shortCode} Committee`,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newPlan.title) return;
    addActionPlan({
      ...newPlan,
      organizationId: currentOrg.id,
      eventId: 'evt_general'
    });
    setNewPlan({
      title: '',
      originFeedback: '',
      assignedTo: `${currentOrg.shortCode} Committee`,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {currentOrg.shortCode} Action Plans
            </span>
            <span className="text-xs font-semibold text-slate-500">• Continuous Improvement</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Event Feedback Actionable Improvement Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional tracking for addressing constructive feedback and suggestions from evaluations.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Cancel' : 'Create Action Item'}
        </button>
      </div>

      {/* Inline Form to add action item (Zero Modals!) */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            New Continuous Improvement Task
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Action Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Expand live streaming hardware and audio redundancy"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Origin Feedback / Participant Complaint</label>
              <input
                type="text"
                placeholder="e.g. Wi-Fi was lagging during breakout coding session"
                value={newPlan.originFeedback}
                onChange={(e) => setNewPlan({ ...newPlan, originFeedback: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Committee / Officer</label>
              <input
                type="text"
                value={newPlan.assignedTo}
                onChange={(e) => setNewPlan({ ...newPlan, assignedTo: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Completion Date</label>
              <input
                type="date"
                value={newPlan.dueDate}
                onChange={(e) => setNewPlan({ ...newPlan, dueDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              Save Action Item
            </button>
          </div>
        </form>
      )}

      {/* Action Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orgActionPlans.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900 leading-snug">{plan.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  plan.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {plan.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                "{plan.originFeedback}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Assigned: <strong className="text-slate-800">{plan.assignedTo}</strong></span>
              <div className="flex items-center gap-1.5">
                {plan.status !== 'COMPLETED' ? (
                  <button
                    onClick={() => updateActionPlanStatus(plan.id, 'COMPLETED')}
                    className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => updateActionPlanStatus(plan.id, 'IN_PROGRESS')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
