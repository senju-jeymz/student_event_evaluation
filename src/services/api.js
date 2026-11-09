/**
 * Centralized API Client for StudEval Backend
 * Communicates with Express + Prisma SQLite Server
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (username, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }),
    me: () => request('/auth/me'),
    getAccounts: () => request('/auth/accounts')
  },

  // Organizations
  organizations: {
    getAll: () => request('/organizations'),
    getById: (id) => request(`/organizations/${id}`),
    create: (data) =>
      request('/organizations', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/organizations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/organizations/${id}`, {
        method: 'DELETE'
      })
  },

  // Events
  events: {
    getAll: (organizationId) => {
      const q = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : '';
      return request(`/events${q}`);
    },
    getById: (id) => request(`/events/${id}`),
    create: (data) =>
      request('/events', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    toggle: (id) =>
      request(`/events/${id}/toggle`, {
        method: 'PATCH'
      }),
    delete: (id) =>
      request(`/events/${id}`, {
        method: 'DELETE'
      })
  },

  // Evaluations
  evaluations: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.organizationId) query.set('organizationId', params.organizationId);
      if (params.eventId) query.set('eventId', params.eventId);
      if (params.studentId) query.set('studentId', params.studentId);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/evaluations${qs}`);
    },
    getById: (id) => request(`/evaluations/${id}`),
    verify: (code) => request(`/evaluations/verify/${encodeURIComponent(code)}`),
    submit: (data) =>
      request('/evaluations', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/evaluations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, actionPlanStatus, officerRemarks) =>
      request(`/evaluations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ actionPlanStatus, officerRemarks })
      }),
    delete: (id) =>
      request(`/evaluations/${id}`, {
        method: 'DELETE'
      })
  },

  // Action Plans
  actionPlans: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.organizationId) query.set('organizationId', params.organizationId);
      if (params.eventId) query.set('eventId', params.eventId);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/action-plans${qs}`);
    },
    create: (data) =>
      request('/action-plans', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/action-plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, status) =>
      request(`/action-plans/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    delete: (id) =>
      request(`/action-plans/${id}`, {
        method: 'DELETE'
      })
  },

  // ECC Key Vaults & Security Audit Logs
  crypto: {
    getVaults: () => request('/crypto/vaults'),
    getVault: (orgId) => request(`/crypto/vaults/${orgId}`),
    saveVault: (orgId, vaultData) =>
      request(`/crypto/vaults/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify(vaultData)
      }),
    getAuditLogs: () => request('/crypto/audit-logs'),
    addAuditLog: (logData) =>
      request('/crypto/audit-logs', {
        method: 'POST',
        body: JSON.stringify(logData)
      })
  }
};

