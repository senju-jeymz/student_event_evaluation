import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CryptoProvider } from './context/CryptoContext';
import { EvaluationProvider, useEvaluation } from './context/EvaluationContext';
import Navbar from './components/common/Navbar';
import LoginView from './components/auth/LoginView';

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
  const { currentUser, isLoadingAuth, isStudent, isRSO, isUACSC, isAdmin } = useAuth();
  const { events } = useEvaluation();

  // Active Tab
  const [activeTab, setActiveTab] = useState('rso_dashboard');

  // Automatically synchronize active tab and dashboard whenever currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    const role = currentUser.role;
    if (role === 'ADMIN') {
      setActiveTab('admin_governance');
    } else if (role === 'UACSC_OFFICER') {
      setActiveTab('uacsc_overview');
    } else if (role === 'RSO_OFFICER') {
      setActiveTab('rso_dashboard');
    } else if (role === 'STUDENT') {
      setActiveTab('student_events');
    }
  }, [currentUser]);

  // Active Event for evaluation
  const [targetEvent, setTargetEvent] = useState(null);
  const [editingResponse, setEditingResponse] = useState(null);

  // Default target event
  useEffect(() => {
    if (events && events.length > 0 && !targetEvent) {
      if (currentUser?.organizationId) {
        const orgEvt = events.find(e => e.organizationId === currentUser.organizationId);
        setTargetEvent(orgEvt || events[0]);
      } else {
        setTargetEvent(events[0]);
      }
    }
  }, [events, currentUser, targetEvent]);

  // Loading screen while verifying token
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider text-slate-300">
          Loading University of the Assumption Evaluation System...
        </p>
      </div>
    );
  }

  // If not logged in, enforce Login View first!
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={(user) => {
          if (user.role === 'ADMIN') {
            setActiveTab('admin_governance');
          } else if (user.role === 'UACSC_OFFICER') {
            setActiveTab('uacsc_overview');
          } else if (user.role === 'RSO_OFFICER') {
            setActiveTab('rso_dashboard');
          } else if (user.role === 'STUDENT') {
            setActiveTab('student_events');
          }
        }}
      />
    );
  }

  const handleStartEvaluation = (event) => {
    setTargetEvent(event);
    setEditingResponse(null);
    setActiveTab('student_eval_form');
  };

  const handleBackToEvents = () => {
    setEditingResponse(null);
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
                  setEditingResponse(response);
                  setActiveTab('student_eval_form');
                }}
              />
            )}

            {activeTab === 'student_eval_form' && targetEvent && (
              <EvaluationForm
                event={targetEvent}
                editingResponse={editingResponse}
                onBackToEvents={handleBackToEvents}
              />
            )}

            {activeTab === 'student_my_slips' && (
              <MySlipsView
                onSelectSlip={(response) => {
                  const evt = events.find(e => e.id === response.eventId) || events[0];
                  setTargetEvent(evt);
                  setEditingResponse(response);
                  setActiveTab('student_eval_form');
                }}
                onEditSlip={(response) => {
                  const evt = events.find(e => e.id === response.eventId) || events[0];
                  setTargetEvent(evt);
                  setEditingResponse(response);
                  setActiveTab('student_eval_form');
                }}
              />
            )}

            {activeTab === 'crypto_inspector' && (
              <EccPlayground />
            )}
          </>
        )}

        {/* RSO OFFICER VIEWS (Locked to their authorized organization) */}
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

        {/* UNIVERSITY ADMIN VIEWS (OSA Director oversees OSA, UACSC, and all RSOs) */}
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
              Zero-Modals • Native NIST P-256 ECC • Prisma ORM SQLite Backend
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
