import { useRouter } from "next/router";
import { useEffect } from "react";
import { serverUrl } from "@/lib/config";

export default function SignUpRedirect() {
  const router = useRouter();
  useEffect(() => {
    const { u, s } = router.query;
    if (!u || !s) return;
    const url = `${serverUrl}/auth/sign-up?u=${u}&s=${s}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => router.replace(`/setup-recovery?userId=${d.userId}&username=${encodeURIComponent(d.username)}`))
      .catch(() => router.replace("/login"));
  }, [router.query]);
  return <p className="p-4">Verifying link...</p>;
}
