import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MOCK_ORGANIZATIONS,
  MOCK_EVENTS,
  MOCK_RESPONSES,
  MOCK_ACTION_PLANS,
  MOCK_FORM_TEMPLATES
} from '../data/mockData';
import { generateVerificationHash } from '../utils/cryptoUtils';

const EvaluationContext = createContext();
const DATA_VERSION = 'ua_2026_v3';

export const EvaluationProvider = ({ children }) => {
  // Check version to ensure the new 18 UA organizations and events load smoothly
  useEffect(() => {
    const currentVer = localStorage.getItem('system_data_version');
    if (currentVer !== DATA_VERSION) {
      localStorage.setItem('system_organizations', JSON.stringify(MOCK_ORGANIZATIONS));
      localStorage.setItem('system_events', JSON.stringify(MOCK_EVENTS));
      localStorage.setItem('system_responses', JSON.stringify(MOCK_RESPONSES));
      localStorage.setItem('system_action_plans', JSON.stringify(MOCK_ACTION_PLANS));
      localStorage.setItem('system_form_templates', JSON.stringify(MOCK_FORM_TEMPLATES));
      localStorage.setItem('system_data_version', DATA_VERSION);
    }
  }, []);

  const [organizations, setOrganizations] = useState(() => {
    const currentVer = localStorage.getItem('system_data_version');
    if (currentVer !== DATA_VERSION) return MOCK_ORGANIZATIONS;
    const saved = localStorage.getItem('system_organizations');
    return saved ? JSON.parse(saved) : MOCK_ORGANIZATIONS;
  });

  const [events, setEvents] = useState(() => {
    const currentVer = localStorage.getItem('system_data_version');
    if (currentVer !== DATA_VERSION) return MOCK_EVENTS;
    const saved = localStorage.getItem('system_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });

  const [responses, setResponses] = useState(() => {
    const currentVer = localStorage.getItem('system_data_version');
    if (currentVer !== DATA_VERSION) return MOCK_RESPONSES;
    const saved = localStorage.getItem('system_responses');
    return saved ? JSON.parse(saved) : MOCK_RESPONSES;
  });

  const [actionPlans, setActionPlans] = useState(() => {
    const currentVer = localStorage.getItem('system_data_version');
    if (currentVer !== DATA_VERSION) return MOCK_ACTION_PLANS;
    const saved = localStorage.getItem('system_action_plans');
    return saved ? JSON.parse(saved) : MOCK_ACTION_PLANS;
  });

  const [formTemplates, setFormTemplates] = useState(() => {
    const currentVer = localStorage.getItem('system_data_version');
    if (currentVer !== DATA_VERSION) return MOCK_FORM_TEMPLATES;
    const saved = localStorage.getItem('system_form_templates');
    return saved ? JSON.parse(saved) : MOCK_FORM_TEMPLATES;
  });

  // Selected event for quick preview or evaluation
  const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0]?.id || 'evt_uacsc_pamuklat');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('system_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('system_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('system_responses', JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem('system_action_plans', JSON.stringify(actionPlans));
  }, [actionPlans]);

  useEffect(() => {
    localStorage.setItem('system_form_templates', JSON.stringify(formTemplates));
  }, [formTemplates]);

  // Reset to default institutional configuration
  const resetToDefaultData = () => {
    setOrganizations(MOCK_ORGANIZATIONS);
    setEvents(MOCK_EVENTS);
    setResponses(MOCK_RESPONSES);
    setActionPlans(MOCK_ACTION_PLANS);
    setFormTemplates(MOCK_FORM_TEMPLATES);
    localStorage.setItem('system_data_version', DATA_VERSION);
  };

  // Check if a student has already submitted for this event (Duplicate prevention)
  const hasStudentEvaluated = (studentId, eventId, excludeResponseId = null) => {
    if (!studentId || !eventId) return false;
    return responses.some(
      r => r.eventId === eventId && r.studentId === studentId && !r.isAnonymous && r.id !== excludeResponseId
    );
  };

  // ==========================================
  // EVALUATION SUBMISSIONS CRUD
  // ==========================================

  // CREATE: Submit a new evaluation
  const submitEvaluation = async (evaluationPayload) => {
    if (!evaluationPayload.isAnonymous && evaluationPayload.studentId) {
      if (hasStudentEvaluated(evaluationPayload.studentId, evaluationPayload.eventId)) {
        throw new Error('Duplicate submission detected. You have already submitted an evaluation for this event.');
      }
    }

    const responseId = 'resp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
    const submittedAt = new Date().toISOString();

    const verificationCode = await generateVerificationHash({
      id: responseId,
      eventId: evaluationPayload.eventId,
      submittedAt,
      studentId: evaluationPayload.isAnonymous ? 'ANON' : evaluationPayload.studentId
    });

    const newResponse = {
      id: responseId,
      ...evaluationPayload,
      verificationCode: 'VERIF-' + verificationCode,
      submittedAt,
      actionPlanStatus: 'IN_REVIEW',
      signature: 'SIG_ECC_P256_' + verificationCode
    };

    setResponses(prev => [newResponse, ...prev]);
    return newResponse;
  };

  // UPDATE: Edit an existing evaluation
  const updateEvaluation = async (responseId, updatedPayload) => {
    const existing = responses.find(r => r.id === responseId);
    if (!existing) throw new Error('Evaluation submission not found');

    const updatedSubmittedAt = new Date().toISOString();
    const updatedVerificationCode = await generateVerificationHash({
      id: responseId,
      eventId: updatedPayload.eventId || existing.eventId,
      submittedAt: updatedSubmittedAt,
      studentId: updatedPayload.isAnonymous ? 'ANON' : (updatedPayload.studentId || existing.studentId)
    });

    const updatedResponse = {
      ...existing,
      ...updatedPayload,
      lastUpdatedAt: updatedSubmittedAt,
      verificationCode: 'VERIF-' + updatedVerificationCode,
      signature: 'SIG_ECC_P256_' + updatedVerificationCode + '_REV'
    };

    setResponses(prev => prev.map(r => (r.id === responseId ? updatedResponse : r)));
    return updatedResponse;
  };

  // DELETE: Withdraw or remove an evaluation
  const deleteEvaluation = (responseId) => {
    setResponses(prev => prev.filter(r => r.id !== responseId));
  };

  // Update response action plan review status or officer remarks
  const updateResponseActionStatus = (responseId, status, officerRemarks = null) => {
    setResponses(prev => prev.map(r => {
      if (r.id === responseId) {
        return {
          ...r,
          actionPlanStatus: status,
          ...(officerRemarks !== null ? { officerRemarks } : {})
        };
      }
      return r;
    }));
  };

  // ==========================================
  // EVENTS CRUD
  // ==========================================

  // CREATE: Add new event
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: 'evt_' + Date.now().toString(36),
      evaluationOpen: eventData.evaluationOpen !== undefined ? eventData.evaluationOpen : true,
      status: eventData.status || (eventData.evaluationOpen ? 'ACTIVE' : 'UPCOMING'),
      expectedAttendees: Number(eventData.expectedAttendees) || 100,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  // UPDATE: Update existing event
  const updateEvent = (eventId, updatedFields) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const merged = { ...e, ...updatedFields };
        if (updatedFields.evaluationOpen !== undefined) {
          merged.status = updatedFields.evaluationOpen ? 'ACTIVE' : (merged.status === 'COMPLETED' ? 'COMPLETED' : 'UPCOMING');
        }
        return merged;
      }
      return e;
    }));
  };

  // DELETE: Delete an event and cleanly handle associated responses
  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    // Cascade delete associated responses
    setResponses(prev => prev.filter(r => r.eventId !== eventId));
    // Cascade cleanup for action plans
    setActionPlans(prev => prev.filter(p => p.eventId !== eventId));
  };

  // Toggle evaluation open/close status
  const toggleEventEvaluation = (eventId) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          const nextState = !e.evaluationOpen;
          return {
            ...e,
            evaluationOpen: nextState,
            status: nextState ? 'ACTIVE' : 'UPCOMING'
          };
        }
        return e;
      })
    );
  };

  // ==========================================
  // ORGANIZATIONS CRUD
  // ==========================================

  // CREATE: Add organization
  const addOrganization = (orgData) => {
    const newOrg = {
      ...orgData,
      id: 'org_' + Date.now().toString(36),
      status: 'ACTIVE',
      eccKeyStatus: 'ACTIVE',
      eccKeyId: 'ecc_' + (orgData.shortCode?.toLowerCase() || 'rso') + '_' + Date.now().toString(36)
    };
    setOrganizations(prev => [...prev, newOrg]);
    return newOrg;
  };

  // UPDATE: Update organization (Name, shortCode, President, Adviser, etc.)
  const updateOrganization = (orgId, updatedFields) => {
    setOrganizations(prev => prev.map(o => (o.id === orgId ? { ...o, ...updatedFields } : o)));
  };

  // DELETE: Delete organization
  const deleteOrganization = (orgId) => {
    setOrganizations(prev => prev.filter(o => o.id !== orgId));
    setEvents(prev => prev.filter(e => e.organizationId !== orgId));
  };

  // ==========================================
  // ACTION PLANS CRUD
  // ==========================================

  // CREATE: Add action plan
  const addActionPlan = (planData) => {
    const newPlan = {
      ...planData,
      id: 'act_' + Date.now().toString(36),
      status: planData.status || 'IN_PROGRESS',
      createdAt: new Date().toISOString()
    };
    setActionPlans(prev => [newPlan, ...prev]);
    return newPlan;
  };

  // UPDATE: Update action plan
  const updateActionPlan = (planId, updatedFields) => {
    setActionPlans(prev => prev.map(p => (p.id === planId ? { ...p, ...updatedFields } : p)));
  };

  // UPDATE STATUS: Quick status update
  const updateActionPlanStatus = (planId, status) => {
    setActionPlans(prev => prev.map(p => (p.id === planId ? { ...p, status } : p)));
  };

  // DELETE: Delete action plan
  const deleteActionPlan = (planId) => {
    setActionPlans(prev => prev.filter(p => p.id !== planId));
  };

  return (
    <EvaluationContext.Provider
      value={{
        organizations,
        events,
        responses,
        actionPlans,
        formTemplates,
        selectedEventId,
        setSelectedEventId,
        hasStudentEvaluated,
        // Evaluations CRUD
        submitEvaluation,
        updateEvaluation,
        deleteEvaluation,
        updateResponseActionStatus,
        // Events CRUD
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventEvaluation,
        // Organizations CRUD
        addOrganization,
        updateOrganization,
        deleteOrganization,
        // Action Plans CRUD
        addActionPlan,
        updateActionPlan,
        updateActionPlanStatus,
        deleteActionPlan,
        // Utilities
        resetToDefaultData
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => useContext(EvaluationContext);
