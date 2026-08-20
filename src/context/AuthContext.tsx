'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, Permission, DEMO_USERS } from '../types/auth';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: Permission) => boolean;
  canAccessRole: (allowedRoles: UserRole[]) => boolean;
}

const AUTH_STORAGE_KEY = 'yellow_marketing_auth_user_role';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage or default to Site User for instant demo readiness
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(AUTH_STORAGE_KEY) as UserRole | null;
      if (storedRole && DEMO_USERS[storedRole]) {
        setUser(DEMO_USERS[storedRole].user);
      } else {
        // Default pre-authenticated as site_user for smooth initial exploration
        setUser(DEMO_USERS.site_user.user);
        localStorage.setItem(AUTH_STORAGE_KEY, 'site_user');
      }
    } catch (e) {
      setUser(DEMO_USERS.site_user.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsRole = useCallback((targetRole: UserRole) => {
    const demo = DEMO_USERS[targetRole];
    if (demo) {
      setUser(demo.user);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, targetRole);
      } catch (e) {
        console.error('Failed to persist auth session', e);
      }
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string, selectedRole?: UserRole): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      // Simulate network authentication delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Find user by role or email match
      let targetUserRole: UserRole | null = selectedRole || null;

      if (!targetUserRole) {
        const found = Object.values(DEMO_USERS).find(
          (d) => d.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (found) {
          targetUserRole = found.role;
        }
      }

      if (targetUserRole && DEMO_USERS[targetUserRole]) {
        setUser(DEMO_USERS[targetUserRole].user);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, targetUserRole);
        } catch (e) {
          console.error('Failed to save session', e);
        }
        setIsLoading(false);
        return { success: true };
      }

      // Default fallback match
      if (email.includes('admin')) {
        loginAsRole('admin');
      } else if (email.includes('head') || email.includes('hq') || email.includes('finance')) {
        loginAsRole('head_office');
      } else {
        loginAsRole('site_user');
      }

      setIsLoading(false);
      return { success: true };
    },
    [loginAsRole]
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    loginAsRole(newRole);
  }, [loginAsRole]);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const canAccessRole = useCallback(
    (allowedRoles: UserRole[]): boolean => {
      if (!user) return false;
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        loginAsRole,
        logout,
        switchRole,
        hasPermission,
        canAccessRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
