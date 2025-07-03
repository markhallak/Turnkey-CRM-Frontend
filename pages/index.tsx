"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/auth/me");
        router.replace(res.ok ? "/dashboard" : "/login");
      } catch {
        router.replace("/login");
      }
    };
    checkLogin();
  }, [router]);
  return null;
}
