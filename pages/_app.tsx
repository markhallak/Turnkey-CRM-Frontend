"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import "@/styles/input-border-animation.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import { loadClientKeys } from "@/lib/clientKeys";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [sidebarDefaultOpen, setSidebarDefaultOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout>();

  // --- Sidebar state from cookie ---
  useEffect(() => {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sidebar_state='));
    if (match) {
      setSidebarDefaultOpen(match.split('=')[1] === 'true');
    }
  }, []);

  // --- Override router.push for new-tab navigation ---
  useEffect(() => {
    const originalPush = router.push.bind(router);
    router.push = (url, as, options) => {
      const path = typeof url === 'string' ? url : url.pathname;
      const sameTabPaths = [
        '/auth/login',
        '/set-recovery-phrase',
        '/onboarding',
        '/projects/new',
        '/clients/new',
        '/billing/new',
      ];
      if (sameTabPaths.includes(router.pathname) || sameTabPaths.includes(path)) {
        return originalPush(url, as, options);
      }
      window.open(
        typeof url === 'string' ? url : path + (url.search || ''),
        '_blank',
        'noopener,noreferrer'
      );
      return Promise.resolve(true);
    };
    return () => {
      router.push = originalPush;
    };
  }, [router]);

  // --- Initial auth + keys + first refresh ---
  useEffect(() => {
    const init = async () => {
      const path = router.pathname;
      if (['/auth/login', '/set-recovery-phrase', '/onboarding'].includes(path)) {
        setIsAuthenticated(false);
        setReady(true);
        clearInterval(refreshInterval.current as NodeJS.Timeout);
        return;
      }
      try {
        // 1) check session
        const me = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          { credentials: 'include' }
        );
        if (!me.ok) throw new Error('No session');
        setIsAuthenticated(true);
        // 2) initial refresh to extend cookie
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-session`,
          { method: 'POST', credentials: 'include' }
        );
        // 3) load client keys
        const hasKeys = await loadClientKeys();
        if (!hasKeys) throw new Error('Missing keys');
      } catch (err) {
        console.error('Init auth error:', err);
        setIsAuthenticated(false);
        clearInterval(refreshInterval.current as NodeJS.Timeout);
        router.replace('/auth/login');
      } finally {
        setReady(true);
      }
    };
    init();
  }, [router.pathname]);

  // --- Silent token refresh loop ---
  useEffect(() => {
    if (!isAuthenticated) return;
    // Clear any existing timer
    clearInterval(refreshInterval.current as NodeJS.Timeout);

    const doRefresh = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-session`,
          { method: 'POST', credentials: 'include' }
        );
        if (!res.ok) throw new Error('Refresh failed');
      } catch (err) {
        console.error('Token refresh error:', err);
        clearInterval(refreshInterval.current as NodeJS.Timeout);
        setIsAuthenticated(false);
        router.replace('/auth/login');
      }
    };

    // Schedule periodic refresh every 4 minutes
    refreshInterval.current = setInterval(doRefresh, 1000 * 60 * 4);
    return () => clearInterval(refreshInterval.current as NodeJS.Timeout);
  }, [isAuthenticated, router]);

  // --- Delay rendering until ready ---
  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center">
      </div>
    );
  }

  const noSidebar = ['/auth/login', '/onboarding', '/set-recovery-phrase'].includes(
    router.pathname
  );

  return (
    <ToastProvider>
      {noSidebar ? (
        <>
          <Component {...pageProps} />
          <Toaster />
        </>
      ) : (
        <SidebarProvider
          defaultOpen={sidebarDefaultOpen}
          style={{
            '--sidebar-width': '15rem',
            '--sidebar-width-mobile': '15rem',
          }}
        >
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Component {...pageProps} />
            <Toaster />
          </div>
        </SidebarProvider>
      )}
    </ToastProvider>
  );
}
