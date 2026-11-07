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

export const EvaluationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState(() => {
    const saved = localStorage.getItem('system_organizations');
    return saved ? JSON.parse(saved) : MOCK_ORGANIZATIONS;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('system_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });

  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem('system_responses');
    return saved ? JSON.parse(saved) : MOCK_RESPONSES;
  });

  const [actionPlans, setActionPlans] = useState(() => {
    const saved = localStorage.getItem('system_action_plans');
    return saved ? JSON.parse(saved) : MOCK_ACTION_PLANS;
  });

  const [formTemplates, setFormTemplates] = useState(() => {
    const saved = localStorage.getItem('system_form_templates');
    return saved ? JSON.parse(saved) : MOCK_FORM_TEMPLATES;
  });

  // Selected event for quick preview or evaluation
  const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0].id);

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

  // Check if a student has already submitted for this event (Duplicate prevention)
  const hasStudentEvaluated = (studentId, eventId) => {
    if (!studentId || !eventId) return false;
    return responses.some(
      r => r.eventId === eventId && r.studentId === studentId && !r.isAnonymous
    );
  };

  // Submit a new evaluation
  const submitEvaluation = async (evaluationPayload) => {
    // 1. Duplicate check
    if (!evaluationPayload.isAnonymous && evaluationPayload.studentId) {
      if (hasStudentEvaluated(evaluationPayload.studentId, evaluationPayload.eventId)) {
        throw new Error('Duplicate submission detected. You have already submitted an evaluation for this event.');
      }
    }

    // 2. Generate verification code & hash
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
      actionPlanStatus: 'IN_REVIEW'
    };

    setResponses(prev => [newResponse, ...prev]);
    return newResponse;
  };

  // Event Management
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: 'evt_' + Date.now().toString(36),
      evaluationOpen: true,
      expectedAttendees: Number(eventData.expectedAttendees) || 100
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (eventId, updatedFields) => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, ...updatedFields } : e)));
  };

  const toggleEventEvaluation = (eventId) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, evaluationOpen: !e.evaluationOpen } : e))
    );
  };

  // Organization Management
  const addOrganization = (orgData) => {
    const newOrg = {
      ...orgData,
      id: 'org_' + Date.now().toString(36),
      status: 'ACTIVE',
      eccKeyStatus: 'PENDING_GENERATION'
    };
    setOrganizations(prev => [...prev, newOrg]);
    return newOrg;
  };

  const updateOrganization = (orgId, updatedFields) => {
    setOrganizations(prev => prev.map(o => (o.id === orgId ? { ...o, ...updatedFields } : o)));
  };

  // Action Plans
  const addActionPlan = (planData) => {
    const newPlan = {
      ...planData,
      id: 'act_' + Date.now().toString(36),
      status: 'IN_PROGRESS'
    };
    setActionPlans(prev => [newPlan, ...prev]);
    return newPlan;
  };

  const updateActionPlanStatus = (planId, status) => {
    setActionPlans(prev => prev.map(p => (p.id === planId ? { ...p, status } : p)));
  };

  const updateResponseActionStatus = (responseId, status) => {
    setResponses(prev => prev.map(r => (r.id === responseId ? { ...r, actionPlanStatus: status } : r)));
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
        submitEvaluation,
        addEvent,
        updateEvent,
        toggleEventEvaluation,
        addOrganization,
        updateOrganization,
        addActionPlan,
        updateActionPlanStatus,
        updateResponseActionStatus
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => useContext(EvaluationContext);
