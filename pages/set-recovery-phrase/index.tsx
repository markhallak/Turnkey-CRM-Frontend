// pages/set-recovery-phrase/index.tsx
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
  const [info, setInfo] = useState<{
    userId: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const verifyAndSetup = async () => {
      if (!token) return;

      let pem = localStorage.getItem("rsaPublicKey") || undefined;

      try {
        // If no cookie, fetch from server
        if (!pem) {
  const res = await fetch(`${serverUrl}/auth/public-key`);
  if (!res.ok) throw new Error("public key fetch failed");
  pem = (await res.json()).public_key;
  localStorage.setItem("rsaPublicKey", pem);
}

        console.log("PEM: ", pem);
        // Verify JWT
const imported = await importSPKI(pem, "RS256");
        const { payload } = await jwtVerify(token, imported);
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          toast({
            description: "Signup link expired.",
            variant: "destructive",
          });
          return;
        }

        setInfo({
          userId: payload.userId as string,
          username: payload.username as string,
        });
      } catch (err) {
            console.error("verifyAndSetup failed:", err);

        toast({
          description: "Invalid or expired signup link.",
          variant: "destructive",
        });
      }
    };

    verifyAndSetup();
  }, [token, toast]);

  if (!token) return <p className="p-4">Missing token</p>;
  if (!info) return <p className="p-4">Verifying link…</p>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <SetupRecoveryForm
          userId={info.userId}
          username={info.username}
        />
      </div>
    </div>
  );
}
