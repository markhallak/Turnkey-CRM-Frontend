"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/lib/authContext";

export default function IndexPage() {
  const router = useRouter();
    const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        router.replace(isAuthenticated ? "/dashboard" : "/auth/login");
      } catch {
        router.replace("/auth/login");
      }
    };
    checkLogin();
  }, [router]);
  return null;
}
