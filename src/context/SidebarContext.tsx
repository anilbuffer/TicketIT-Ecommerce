// src/context/SidebarContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextType {
  isMobileOpen: boolean;
  isMiniSidebar: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  openMobileDrawer: () => void;
  toggleMiniSidebar: () => void;
  setIsMiniSidebar: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'ticketit_sidebar_mini_preference';

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMiniSidebar, setIsMiniSidebarState] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(1200);

  // Screen size classification
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Initialize and handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width < 768) {
        // Mobile: sidebar is hidden off-canvas by default
      } else if (width >= 768 && width < 1024) {
        // Tablet: default to mini sidebar
        setIsMiniSidebarState(true);
        setIsMobileOpen(false);
      } else {
        // Desktop: load saved user preference if exists
        try {
          const savedPref = localStorage.getItem(STORAGE_KEY);
          if (savedPref !== null) {
            setIsMiniSidebarState(savedPref === 'true');
          }
        } catch {
          // ignore localStorage errors
        }
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isMobileOpen]);

  const toggleMobileDrawer = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const openMobileDrawer = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const setIsMiniSidebar = useCallback((val: boolean) => {
    setIsMiniSidebarState(val);
    try {
      localStorage.setItem(STORAGE_KEY, String(val));
    } catch {
      // ignore
    }
  }, []);

  const toggleMiniSidebar = useCallback(() => {
    setIsMiniSidebarState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        isMiniSidebar,
        isMobile,
        isTablet,
        isDesktop,
        toggleMobileDrawer,
        closeMobileDrawer,
        openMobileDrawer,
        toggleMiniSidebar,
        setIsMiniSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    // Fallback safe dummy object if used outside provider
    return {
      isMobileOpen: false,
      isMiniSidebar: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      toggleMobileDrawer: () => {},
      closeMobileDrawer: () => {},
      openMobileDrawer: () => {},
      toggleMiniSidebar: () => {},
      setIsMiniSidebar: () => {},
    };
  }
  return context;
}
