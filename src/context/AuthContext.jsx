import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS, ROLES } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store active user in localStorage or default to SSITE officer
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('active_user_id');
    if (saved) {
      const found = MOCK_USERS.find(u => u.id === saved);
      if (found) return found;
    }
    return MOCK_USERS[2]; // Default to SSITE President (Hannah Samantha Lising)
  });

  const switchUser = (userId) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('active_user_id', found.id);
    }
  };

  // Helper allowing RSO officers to switch to any of the 18 student organizations to test and manage
  const switchRsoOrganization = (orgId) => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        organizationId: orgId
      };
      return updated;
    });
  };

  /**
   * Role & Organization Authorization Check
   */
  const canAccessOrgData = (organizationId) => {
    if (!currentUser) return false;
    if (currentUser.role === ROLES.ADMIN) return true;
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
        switchRsoOrganization,
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
