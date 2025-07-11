"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import { AuthContext } from "@/lib/authContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import "@/styles/input-border-animation.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { loadClientKeys } from "@/lib/clientKeys";
import { fetchServerKey } from "@/lib/apiClient";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [sidebarDefaultOpen, setSidebarDefaultOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isClient, setIsClient] = useState("");
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
        '/billing/new'
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
        if (!me.ok) {
          router.replace('/auth/login');
          return;
        }
        const meData = await me.json();
        setEmail(meData.email);
        setRole(meData.role);
        setIsClient(meData.is_client);
        setIsAuthenticated(true);

        // 2) initial refresh to extend cookie
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-session`,
          { method: 'POST', credentials: 'include' }
        );
        // 3) load client keys
        const hasKeys = await loadClientKeys();
        if (!hasKeys) {
          toast({ description: 'Missing keys', variant: 'destructive' });
          return;
        }
        await fetchServerKey();
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
    const requiredRoles = Component.auth?.roles
  if (requiredRoles && !requiredRoles.includes(role)) {
    router.replace('/unauthorized')
    return null
  }
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
        if (!res.ok) {
          toast({ description: 'Refresh failed', variant: 'destructive' });
          return;
        }
      } catch (err) {
        console.error('Token refresh error:', err);
        clearInterval(refreshInterval.current as NodeJS.Timeout);
        setIsAuthenticated(false);
        router.replace('/auth/login');
      }
    };

    refreshInterval.current = setInterval(doRefresh, 1000 * 60 * 60);
    return () => clearInterval(refreshInterval.current as NodeJS.Timeout);
  }, [isAuthenticated, router]);


  // --- Delay rendering until ready ---
  if (!ready) {
    return (
      <div>
      </div>
    );
  }



  const noSidebar = ['/auth/login', '/onboarding', '/set-recovery-phrase', '/unauthorized'].includes(
    router.pathname
  );

  return (
          <AuthContext.Provider value={{ email, isAuthenticated, isClient }}>
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
        </AuthContext.Provider>
  );
}
