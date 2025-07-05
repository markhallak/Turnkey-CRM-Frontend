"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL }/auth/me`, {credentials: "include",});
        router.replace(res.ok ? "/dashboard" : "/login");
      } catch {
        router.replace("/login");
      }
    };
    checkLogin();
  }, [router]);
  return null;
}
