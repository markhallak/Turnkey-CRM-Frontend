// pages/set-recovery-phrase/index.tsx
import SetRecoveryPhrase from "@/components/SetRecoveryPhrase/SetRecoveryPhrase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { encryptPost, decryptPost } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

export default function SetRecoveryPhrasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { token } = router.query as { token?: string };
  const [info, setInfo] = useState<{
    userEmail: string;
  } | null>(null);

  useEffect(() => {
    const verifyAndSetup = async () => {
      if (!token) return;
      try {
        const res = await encryptPost("/auth/validate-signup-token", { token });
        if (!res.ok) throw new Error("validate");
        const j = await decryptPost<{ userEmail: string }>(res);
        setInfo({ userEmail: j.userEmail });
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
  if (!info) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <SetRecoveryPhrase
          userEmail={info.userEmail}
          token={token!}
        />
      </div>
    </div>
  );
}
