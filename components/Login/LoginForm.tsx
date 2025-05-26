import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import Image from 'next/image';

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !email) return;
    console.log("Logging in with:", email);
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast({
        description: "You have been logged in successfully.",
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !!error || !email || loading;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your TurnKey account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
                {error && <span className="text-sm text-red-600">{error}</span>}
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
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
