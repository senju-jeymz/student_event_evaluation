import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, ROLES } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store active user in localStorage or default to student / officer
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('active_user_id');
    if (saved) {
      const found = MOCK_USERS.find(u => u.id === saved);
      if (found) return found;
    }
    return MOCK_USERS[2]; // Default to ACSS Officer for rich demo experience
  });

  const switchUser = (userId) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('active_user_id', found.id);
    }
  };

  /**
   * Strict Role & Organization Authorization Check
   * Admin: Can manage system, view aggregate statistics, but cannot decrypt private feedback without org key
   * UACSC: Can view university-wide metrics and UACSC events
   * RSO: Strictly isolated to their specific organization (e.g. org_acss, org_jml)
   * Student: Can view public events, submit evaluations, view their own certificates
   */
  const canAccessOrgData = (organizationId) => {
    if (!currentUser) return false;
    if (currentUser.role === ROLES.ADMIN) return true; // High-level admin oversight
    if (currentUser.role === ROLES.UACSC && organizationId === 'org_uacsc') return true;
    if (currentUser.role === ROLES.RSO && currentUser.organizationId === organizationId) return true;
    return false;
  };

  const isStudent = currentUser?.role === ROLES.STUDENT;
  const isAdmin = currentUser?.role === ROLES.ADMIN;
  const isUACSC = currentUser?.role === ROLES.UACSC;
  const isRSO = currentUser?.role === ROLES.RSO;
  const isOfficer = isRSO || isUACSC;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        canAccessOrgData,
        isStudent,
        isAdmin,
        isUACSC,
        isRSO,
        isOfficer,
        allUsers: MOCK_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
