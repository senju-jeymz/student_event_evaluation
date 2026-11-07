import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CryptoProvider } from './context/CryptoContext';
import { EvaluationProvider, useEvaluation } from './context/EvaluationContext';
import { ROLES } from './data/mockData';
import Navbar from './components/common/Navbar';

// Student Components
import StudentEventsView from './components/student/StudentEventsView';
import EvaluationForm from './components/student/EvaluationForm';
import MySlipsView from './components/student/MySlipsView';

// Officer Components
import RsoDashboard from './components/officer/RsoDashboard';
import EvaluationsListInline from './components/officer/EvaluationsListInline';
import EccKeyVaultPanel from './components/officer/EccKeyVaultPanel';
import ActionPlansPanel from './components/officer/ActionPlansPanel';

// Council Components
import UacscDashboard from './components/council/UacscDashboard';

// Admin Components
import AdminGovernance from './components/admin/AdminGovernance';

// Cryptography Playground
import EccPlayground from './components/crypto/EccPlayground';

function AppContent() {
  const { currentUser, isStudent, isRSO, isUACSC, isAdmin } = useAuth();
  const { events } = useEvaluation();

  // Active Tab
  const [activeTab, setActiveTab] = useState('rso_dashboard');
  
  // Active Event for evaluation
  const [targetEvent, setTargetEvent] = useState(events[0]);

  // Sync default tab when user switches role
  useEffect(() => {
    if (isStudent) {
      setActiveTab('student_events');
    } else if (isRSO) {
      setActiveTab('rso_dashboard');
    } else if (isUACSC) {
      setActiveTab('uacsc_overview');
    } else if (isAdmin) {
      setActiveTab('admin_governance');
    }
  }, [currentUser?.role, currentUser?.organizationId]);

  const handleStartEvaluation = (event) => {
    setTargetEvent(event);
    setActiveTab('student_eval_form');
  };

  const handleBackToEvents = () => {
    setActiveTab('student_events');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* STUDENT VIEWS */}
        {isStudent && (
          <>
            {activeTab === 'student_events' && (
              <StudentEventsView
                onSelectEvent={handleStartEvaluation}
                onViewSlip={(response) => {
                  const evt = events.find(e => e.id === response.eventId) || events[0];
                  setTargetEvent(evt);
                  setActiveTab('student_eval_form');
                }}
              />
            )}

            {activeTab === 'student_eval_form' && targetEvent && (
              <EvaluationForm
                event={targetEvent}
                onBackToEvents={handleBackToEvents}
              />
            )}

            {activeTab === 'student_my_slips' && (
              <MySlipsView
                onSelectSlip={(response) => {
                  const evt = events.find(e => e.id === response.eventId) || events[0];
                  setTargetEvent(evt);
                  setActiveTab('student_eval_form');
                }}
              />
            )}

            {activeTab === 'crypto_inspector' && (
              <EccPlayground />
            )}
          </>
        )}

        {/* RSO OFFICER VIEWS */}
        {isRSO && (
          <>
            {activeTab === 'rso_dashboard' && (
              <RsoDashboard
                onNavigateToEvaluations={() => setActiveTab('rso_evaluations')}
                onNavigateToKeyVault={() => setActiveTab('rso_key_vault')}
              />
            )}

            {activeTab === 'rso_evaluations' && (
              <EvaluationsListInline />
            )}

            {activeTab === 'rso_action_plans' && (
              <ActionPlansPanel />
            )}

            {activeTab === 'rso_key_vault' && (
              <EccKeyVaultPanel />
            )}
          </>
        )}

        {/* UACSC COUNCIL VIEWS */}
        {isUACSC && (
          <>
            <UacscDashboard
              activeSubTab={
                activeTab === 'uacsc_rankings'
                  ? 'rankings'
                  : activeTab === 'uacsc_calendar'
                  ? 'calendar'
                  : 'overview'
              }
              setActiveSubTab={(sub) => {
                if (sub === 'rankings') setActiveTab('uacsc_rankings');
                else if (sub === 'calendar') setActiveTab('uacsc_calendar');
                else setActiveTab('uacsc_overview');
              }}
            />
          </>
        )}

        {/* UNIVERSITY ADMIN VIEWS */}
        {isAdmin && (
          <>
            <AdminGovernance
              activeSubTab={
                activeTab === 'admin_rso_registry'
                  ? 'registry'
                  : activeTab === 'admin_templates'
                  ? 'templates'
                  : activeTab === 'admin_audit_logs'
                  ? 'audit_logs'
                  : 'overview'
              }
              setActiveSubTab={(sub) => {
                if (sub === 'registry') setActiveTab('admin_rso_registry');
                else if (sub === 'templates') setActiveTab('admin_templates');
                else if (sub === 'audit_logs') setActiveTab('admin_audit_logs');
                else setActiveTab('admin_governance');
              }}
            />
          </>
        )}
      </main>

      {/* University Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">StudEval</span>
            <span>• College Student Organizations Event Evaluation System</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Zero-Modals • Native NIST P-256 ECC
            </span>
            <span>Accredited by Office of Student Affairs & Services</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CryptoProvider>
        <EvaluationProvider>
          <AppContent />
        </EvaluationProvider>
      </CryptoProvider>
    </AuthProvider>
  );
}
