import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { MOCK_USERS, ROLES } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(MOCK_USERS);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Initialize: verify existing token
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const user = await api.auth.me();
          setCurrentUser(user);
        } catch (err) {
          console.warn('Existing token invalid or expired. Please log in.');
          localStorage.removeItem('auth_token');
          setCurrentUser(null);
        }
      }
      // Load system accounts for selector/quick-fill
      try {
        const accounts = await api.auth.getAccounts();
        if (Array.isArray(accounts) && accounts.length > 0) {
          setAllUsers(accounts);
        }
      } catch (err) {
        // Fallback to MOCK_USERS
      }
      setIsLoadingAuth(false);
    }
    initAuth();
  }, []);

  // Login handler
  const login = async (username, password) => {
    const res = await api.auth.login(username, password);
    localStorage.setItem('auth_token', res.token);
    setCurrentUser(res.user);
    return res.user;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
  };

  // Quick switch user (for demo/testing from navbar or dev switcher)
  const switchUser = async (userId) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      // Use username with default password or switch profile
      try {
        const res = await api.auth.login(found.username || found.email, 'password123');
        localStorage.setItem('auth_token', res.token);
        setCurrentUser(res.user);
      } catch (err) {
        setCurrentUser(found);
      }
    }
  };

  // For Admin or testing: switch RSO context
  const switchRsoOrganization = (orgId) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        organizationId: orgId
      };
    });
  };

  /**
   * Role & Organization Authorization Check
   */
  const canAccessOrgData = (organizationId) => {
    if (!currentUser) return false;
    if (currentUser.role === ROLES.ADMIN || currentUser.role === 'ADMIN') return true;
    if ((currentUser.role === ROLES.UACSC || currentUser.role === 'UACSC_OFFICER') && organizationId === 'org_uacsc') return true;
    if ((currentUser.role === ROLES.RSO || currentUser.role === 'RSO_OFFICER') && currentUser.organizationId === organizationId) return true;
    return false;
  };

  const role = currentUser?.role;
  const isStudent = role === ROLES.STUDENT || role === 'STUDENT';
  const isAdmin = role === ROLES.ADMIN || role === 'ADMIN';
  const isUACSC = role === ROLES.UACSC || role === 'UACSC_OFFICER';
  const isRSO = role === ROLES.RSO || role === 'RSO_OFFICER';
  const isOfficer = isRSO || isUACSC;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoadingAuth,
        login,
        logout,
        switchUser,
        switchRsoOrganization,
        canAccessOrgData,
        isStudent,
        isAdmin,
        isUACSC,
        isRSO,
        isOfficer,
        allUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
