import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { encryptPost, decryptPost } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const { u, s } = router.query as { u?: string; s?: string };
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!u || !s) return;
    const verify = async () => {
      setVerifying(true);
      try {
        const res = await encryptPost("/auth/signup", { u, s });
        if (!res.ok) throw new Error("failed");
        const d = await decryptPost<{ token: string }>(res);
        router.replace(`/set-recovery-phrase?token=${encodeURIComponent(d.token)}`);
      } catch {
        router.replace("/auth/login");
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [u, s, router]);

  if (verifying) return <Loading />;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8 flex flex-col gap-6 min-h-64 w-full">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Signing Up</h1>
                <p className="text-balance text-muted-foreground">Finishing your TurnKey signup</p>
              </div>
              <Button disabled className="w-full">
                <span className="animate-spin inline-block h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
              </Button>
            </div>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/login-bg.jpg"
                alt="Signup Background"
                fill
                className="object-cover brightness-100 dark:brightness-50 dark:grayscale"
                priority
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary mt-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
