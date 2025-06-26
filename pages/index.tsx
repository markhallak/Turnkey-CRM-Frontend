"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    const loggedIn = document.cookie
      .split("; ")
      .some((c) => c.startsWith("token="));
    router.replace(loggedIn ? "/dashboard" : "/login");
  }, [router]);
  return null;
}
