import SetupRecoveryForm from "@/components/Login/SetupRecoveryForm";
import { useRouter } from "next/router";

export default function SetupRecoveryPage() {
  const router = useRouter();
  const { userId, username } = router.query as { userId?: string; username?: string };
  if (!userId || !username) return <p className="p-4">Missing info</p>;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SetupRecoveryForm userId={userId} username={username} />
      </div>
    </div>
  );
}
