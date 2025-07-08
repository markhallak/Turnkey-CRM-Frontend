import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { encryptPost, decryptPost } from "@/lib/apiClient";
import { createClientKeys, loadClientKeys } from "@/lib/clientKeys";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showRecovery, setShowRecovery] = React.useState(false);
  const [phrase, setPhrase] = React.useState("");
  const [recoverLoading, setRecoverLoading] = React.useState(false);
  const lastLoginRef = React.useRef(0);
  const lastParamsRef = React.useRef(0);
  const { toast } = useToast();
  const router = useRouter();

  const emailSchema = z
    .string()
    .min(1, "Required")
    .email("Invalid email address");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const result = emailSchema.safeParse(value);
    setError(result.success ? "" : result.error.errors[0].message);
  };

  const sendLogin = async () => {
    if (Date.now() - lastLoginRef.current < 60000) {
      toast({ description: "Please wait before trying again", variant: "destructive", duration: 5000 });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      if (!r.ok) {
        toast({ description: `status ${r.status}`, variant: "destructive", duration: 5000 });
        return;
      }
      toast({ description: "Check your email for a login link.", duration: 5000 });
    } catch (err: any) {
      const msg = typeof err.message === "string" ? err.message : "";
      if (msg.includes("blacklisted")) {
        toast({ description: "Account is blacklisted.", variant: "destructive", duration: 5000 });
      } else if (msg.includes("User not found")) {
        toast({ description: "Account not found", variant: "destructive", duration: 5000 });
      } else {
        toast({ description: "Failed to send login link.", variant: "destructive", duration: 5000 });
      }
    } finally {
      setLoading(false);
      lastLoginRef.current = Date.now();
    }
  };

  const handleRecover = async () => {
    if (!phrase) return;
    if (Date.now() - lastParamsRef.current < 60000) {
      toast({ description: "Please wait before trying again", variant: "destructive", duration: 5000 });
      return;
    }
    setRecoverLoading(true);
    try {
      const res = await encryptPost("/auth/get-recovery-params", { email });
      if (res.status === 404) {
        toast({ description: "Account not found", variant: "destructive", duration: 5000 });
        return;
      }
      if (!res.ok) {
        toast({ description: "params", variant: "destructive", duration: 5000 });
        return;
      }
      const j = await decryptPost(res);
      const params = JSON.parse(Buffer.from(j.kdfParams, "base64").toString());
      const resHash = await fetch("/api/argon-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass: phrase, salt: j.salt, ...params }),
        credentials: "include",
      });
      if (!resHash.ok) {
        toast({ description: "hash", variant: "destructive", duration: 5000 });
        return;
      }
      const { hash: hashB64 } = await resHash.json();
      await createClientKeys(Buffer.from(hashB64, "base64"));
      const up = await encryptPost("/auth/update-client-key", { userId: j.userId, digest: hashB64 });
      await decryptPost(up);
      setShowRecovery(false);
      setPhrase("");
      await sendLogin();
    } catch {
      toast({ description: "Recovery failed", variant: "destructive", duration: 5000 });
    } finally {
      setRecoverLoading(false);
      lastParamsRef.current = Date.now();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !email) {
      toast({ description: error || "Email required", variant: "destructive", duration: 5000 });
      return;
    }
    const ok = await loadClientKeys();
    if (!ok) {
      setShowRecovery(true);
      return;
    }
    await sendLogin();
  };

  const isDisabled = !!error || !email || loading;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6 min-h-64">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your TurnKey account
                </p>
              </div>
              <div className="grid gap-2 mt-3 sm:mt-5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </div>

              <Button type="submit" disabled={isDisabled} className="w-full">
                {loading ? (
                  <span className="animate-spin inline-block h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login-bg.jpg"
              alt="Login Background"
              fill
              className="object-cover brightness-100 dark:brightness-50 dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <Popover open={showRecovery} onOpenChange={setShowRecovery}>
        <PopoverTrigger asChild>
          <span />
        </PopoverTrigger>
        <PopoverContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="rec">Recovery Phrase</Label>
            <Input id="rec" value={phrase} onChange={(e) => setPhrase(e.target.value)} />
          </div>
          <Button onClick={handleRecover} disabled={recoverLoading} className="w-full">
            {recoverLoading ? "Restoring..." : "Restore"}
          </Button>
        </PopoverContent>
      </Popover>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
