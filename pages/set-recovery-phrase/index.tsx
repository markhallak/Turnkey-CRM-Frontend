import SetupRecoveryForm from "@/components/Login/SetupRecoveryForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { serverUrl } from "@/lib/config";
import { importSPKI, jwtVerify } from "jose";
import { useToast } from "@/hooks/use-toast";

export default function SetRecoveryPhrasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { token } = router.query as { token?: string };
  const [info, setInfo] = useState<{ userId: string; username: string } | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) return;
      const cookieKey = document.cookie
        .split("; ")
        .find((c) => c.startsWith("publicKey="));
      let pub = cookieKey ? decodeURIComponent(cookieKey.split("=")[1]) : null;
      const attempt = async (key: string | null) => {
        try {
          if (!key) throw new Error();
          const imported = await importSPKI(key, "RS256");
          const { payload } = await jwtVerify(token, imported);
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            toast({ description: "Signup link expired.", variant: "destructive" });
            return;
          }
          const res = await fetch(`${serverUrl}/auth/set-recovery-phrase`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          if (!res.ok) throw new Error();
          const d = await res.json();
          setInfo({ userId: d.userId, username: d.username });
        } catch {
          const r = await fetch(`${serverUrl}/auth/public-key`);
          const j = await r.json();
          document.cookie = `publicKey=${encodeURIComponent(j.public_key)}; path=/`;
          try {
            const imported = await importSPKI(j.public_key, "RS256");
            const { payload } = await jwtVerify(token, imported);
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              toast({ description: "Signup link expired.", variant: "destructive" });
              return;
            }
            const res2 = await fetch(`${serverUrl}/auth/set-recovery-phrase`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
            if (!res2.ok) throw new Error();
            const d2 = await res2.json();
            setInfo({ userId: d2.userId, username: d2.username });
          } catch {
            toast({ description: "Invalid signup link.", variant: "destructive" });
          }
        }
      };
      await attempt(pub);
    };
    verify();
  }, [token, toast]);

  if (!token) return <p className="p-4">Missing token</p>;
  if (!info) return <p className="p-4">Verifying link...</p>;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SetupRecoveryForm userId={info.userId} username={info.username} />
      </div>
    </div>
  );
}
