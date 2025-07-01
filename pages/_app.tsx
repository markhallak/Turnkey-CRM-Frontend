import "@/lib/ed25519‐polyfill";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "@/styles/input-border-animation.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [sidebarDefaultOpen, setSidebarDefaultOpen] = useState(true);

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sidebar_state="));
    if (match) {
      setSidebarDefaultOpen(match.split("=")[1] === "true");
    }
  }, []);

  useEffect(() => {
    const originalPush = router.push.bind(router);
    router.push = (url, as, options) => {
      if (
        router.pathname === "/login" ||
        router.pathname === "/onboarding" ||
        router.pathname === "/set-recovery-phrase" ||
        router.pathname === "/projects/new" ||
        router.pathname === "/clients/new" ||
        router.pathname === "/billing/new"
      ) {
        return originalPush(url, as, options);
      }

      const path = typeof url === "string" ? url : url.pathname;
      if (path === "/login") {
        return originalPush(url, as, options);
      }

      window.open(
        typeof url === "string" ? url : url.pathname + url.search,
        "_blank",
        "noopener,noreferrer"
      );

      return Promise.resolve(true);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router]);

  const noSidebar = ["/login", "/onboarding", "/set-recovery-phrase"].includes(router.pathname);

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
            "--sidebar-width": "15rem",
            "--sidebar-width-mobile": "15rem",
          }}
        >
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col min-w-0">
            <Component {...pageProps} />
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      )}
    </ToastProvider>
  );
}
