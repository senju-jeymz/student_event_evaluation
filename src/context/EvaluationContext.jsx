import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
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
  const [organizations, setOrganizations] = useState(MOCK_ORGANIZATIONS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [responses, setResponses] = useState(MOCK_RESPONSES);
  const [actionPlans, setActionPlans] = useState(MOCK_ACTION_PLANS);
  const [formTemplates, setFormTemplates] = useState(MOCK_FORM_TEMPLATES);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Selected event for quick preview or evaluation
  const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0]?.id || 'evt_uacsc_pamuklat');

  // Load live data from Backend API
  const refreshData = useCallback(async () => {
    try {
      const [orgsRes, evtsRes, respsRes, plansRes] = await Promise.allSettled([
        api.organizations.getAll(),
        api.events.getAll(),
        api.evaluations.getAll(),
        api.actionPlans.getAll()
      ]);

      if (orgsRes.status === 'fulfilled' && Array.isArray(orgsRes.value) && orgsRes.value.length > 0) {
        setOrganizations(orgsRes.value);
      }
      if (evtsRes.status === 'fulfilled' && Array.isArray(evtsRes.value)) {
        setEvents(evtsRes.value);
      }
      if (respsRes.status === 'fulfilled' && Array.isArray(respsRes.value)) {
        setResponses(respsRes.value);
      }
      if (plansRes.status === 'fulfilled' && Array.isArray(plansRes.value)) {
        setActionPlans(plansRes.value);
      }
    } catch (err) {
      console.warn('Backend API sync notice:', err.message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
    try {
      const newResponse = await api.evaluations.submit(evaluationPayload);
      setResponses(prev => [newResponse, ...prev.filter(r => r.id !== newResponse.id)]);
      return newResponse;
    } catch (err) {
      // Fallback local creation if offline
      const responseId = 'resp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
      const submittedAt = new Date().toISOString();
      const verificationCode = await generateVerificationHash({
        id: responseId,
        eventId: evaluationPayload.eventId,
        submittedAt,
        studentId: evaluationPayload.isAnonymous ? 'ANON' : evaluationPayload.studentId
      });
      const localResponse = {
        id: responseId,
        ...evaluationPayload,
        verificationCode: 'VERIF-' + verificationCode,
        submittedAt,
        actionPlanStatus: 'IN_REVIEW',
        signature: 'SIG_ECC_P256_' + verificationCode
      };
      setResponses(prev => [localResponse, ...prev]);
      return localResponse;
    }
  };

  // UPDATE: Edit an existing evaluation
  const updateEvaluation = async (responseId, updatedPayload) => {
    try {
      const updatedResponse = await api.evaluations.update(responseId, updatedPayload);
      setResponses(prev => prev.map(r => (r.id === responseId ? updatedResponse : r)));
      return updatedResponse;
    } catch (err) {
      const existing = responses.find(r => r.id === responseId);
      if (!existing) throw new Error('Evaluation submission not found');
      const updatedSubmittedAt = new Date().toISOString();
      const updatedResponse = {
        ...existing,
        ...updatedPayload,
        lastUpdatedAt: updatedSubmittedAt
      };
      setResponses(prev => prev.map(r => (r.id === responseId ? updatedResponse : r)));
      return updatedResponse;
    }
  };

  // DELETE: Withdraw or remove an evaluation
  const deleteEvaluation = async (responseId) => {
    setResponses(prev => prev.filter(r => r.id !== responseId));
    try {
      await api.evaluations.delete(responseId);
    } catch (err) {
      console.warn('API delete evaluation notice:', err.message);
    }
  };

  // Update response action plan review status or officer remarks
  const updateResponseActionStatus = async (responseId, status, officerRemarks = null) => {
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

    try {
      await api.evaluations.updateStatus(responseId, status, officerRemarks);
    } catch (err) {
      console.warn('API update evaluation status notice:', err.message);
    }
  };

  // ==========================================
  // EVENTS CRUD
  // ==========================================

  // CREATE: Add new event
  const addEvent = async (eventData) => {
    try {
      const created = await api.events.create(eventData);
      setEvents(prev => [created, ...prev.filter(e => e.id !== created.id)]);
      return created;
    } catch (err) {
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
    }
  };

  // UPDATE: Update existing event
  const updateEvent = async (eventId, updatedFields) => {
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

    try {
      const updated = await api.events.update(eventId, updatedFields);
      setEvents(prev => prev.map(e => (e.id === eventId ? updated : e)));
      return updated;
    } catch (err) {
      console.warn('API update event notice:', err.message);
    }
  };

  // DELETE: Delete an event
  const deleteEvent = async (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setResponses(prev => prev.filter(r => r.eventId !== eventId));
    setActionPlans(prev => prev.filter(p => p.eventId !== eventId));

    try {
      await api.events.delete(eventId);
    } catch (err) {
      console.warn('API delete event notice:', err.message);
    }
  };

  // Toggle evaluation open/close status
  const toggleEventEvaluation = async (eventId) => {
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

    try {
      const updated = await api.events.toggle(eventId);
      setEvents(prev => prev.map(e => (e.id === eventId ? updated : e)));
    } catch (err) {
      console.warn('API toggle event notice:', err.message);
    }
  };

  // ==========================================
  // ORGANIZATIONS CRUD
  // ==========================================

  const addOrganization = async (orgData) => {
    try {
      const created = await api.organizations.create(orgData);
      setOrganizations(prev => [...prev.filter(o => o.id !== created.id), created]);
      return created;
    } catch (err) {
      const newOrg = {
        ...orgData,
        id: 'org_' + Date.now().toString(36),
        status: 'ACTIVE',
        eccKeyStatus: 'ACTIVE',
        eccKeyId: 'ecc_' + (orgData.shortCode?.toLowerCase() || 'rso') + '_' + Date.now().toString(36)
      };
      setOrganizations(prev => [...prev, newOrg]);
      return newOrg;
    }
  };

  const updateOrganization = async (orgId, updatedFields) => {
    setOrganizations(prev => prev.map(o => (o.id === orgId ? { ...o, ...updatedFields } : o)));
    try {
      const updated = await api.organizations.update(orgId, updatedFields);
      setOrganizations(prev => prev.map(o => (o.id === orgId ? updated : o)));
      return updated;
    } catch (err) {
      console.warn('API update organization notice:', err.message);
    }
  };

  const deleteOrganization = async (orgId) => {
    setOrganizations(prev => prev.filter(o => o.id !== orgId));
    setEvents(prev => prev.filter(e => e.organizationId !== orgId));
    try {
      await api.organizations.delete(orgId);
    } catch (err) {
      console.warn('API delete organization notice:', err.message);
    }
  };

  // ==========================================
  // ACTION PLANS CRUD
  // ==========================================

  const addActionPlan = async (planData) => {
    try {
      const created = await api.actionPlans.create(planData);
      setActionPlans(prev => [created, ...prev.filter(p => p.id !== created.id)]);
      return created;
    } catch (err) {
      const newPlan = {
        ...planData,
        id: 'act_' + Date.now().toString(36),
        status: planData.status || 'IN_PROGRESS',
        createdAt: new Date().toISOString()
      };
      setActionPlans(prev => [newPlan, ...prev]);
      return newPlan;
    }
  };

  const updateActionPlan = async (planId, updatedFields) => {
    setActionPlans(prev => prev.map(p => (p.id === planId ? { ...p, ...updatedFields } : p)));
    try {
      const updated = await api.actionPlans.update(planId, updatedFields);
      setActionPlans(prev => prev.map(p => (p.id === planId ? updated : p)));
      return updated;
    } catch (err) {
      console.warn('API update action plan notice:', err.message);
    }
  };

  const updateActionPlanStatus = async (planId, status) => {
    setActionPlans(prev => prev.map(p => (p.id === planId ? { ...p, status } : p)));
    try {
      const updated = await api.actionPlans.updateStatus(planId, status);
      setActionPlans(prev => prev.map(p => (p.id === planId ? updated : p)));
      return updated;
    } catch (err) {
      console.warn('API update action plan status notice:', err.message);
    }
  };

  const deleteActionPlan = async (planId) => {
    setActionPlans(prev => prev.filter(p => p.id !== planId));
    try {
      await api.actionPlans.delete(planId);
    } catch (err) {
      console.warn('API delete action plan notice:', err.message);
    }
  };

  const resetToDefaultData = () => {
    setOrganizations(MOCK_ORGANIZATIONS);
    setEvents(MOCK_EVENTS);
    setResponses(MOCK_RESPONSES);
    setActionPlans(MOCK_ACTION_PLANS);
    setFormTemplates(MOCK_FORM_TEMPLATES);
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
        refreshData,
        isLoadingData,
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
