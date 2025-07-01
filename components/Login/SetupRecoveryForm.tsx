// components/SetupRecoveryForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { serverUrl } from "@/lib/config";
import { importSPKI, jwtVerify } from "jose";
import { encryptedPost, storeClientPriv } from "@/lib/apiClient";

export default function SetupRecoveryForm({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const [phrase, setPhrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { score, total, requirements } = usePasswordStrength(phrase);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      requirements.some((r) => !r.passed) ||
      phrase !== confirm
    ) {
      setError("Please meet all requirements and confirm your phrase.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const params = { time: 2, mem: 19 * 1024, parallelism: 1, hashLen: 32 };
      const resHash = await fetch("/api/argon-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pass: phrase,
          salt: Buffer.from(salt).toString("base64"),
          ...params,
        }),
      });
      if (!resHash.ok) throw new Error("hash");
      const { hash: hashB64 } = await resHash.json();
      const priv = Buffer.from(hashB64, "base64");
      storeClientPriv(priv);
      const data = await encryptedPost<{ token: string }>(
        "/auth/set-recovery-phrase",
        {
          userId,
          digest: hashB64,
          salt: Buffer.from(salt).toString("base64"),
          kdfParams: Buffer.from(JSON.stringify(params)).toString("base64"),
        }
      );
      let rsaPub = localStorage.getItem("rsaPublicKey");
      if (!rsaPub) {
        const r = await fetch(`${serverUrl}/auth/public-key`);
        const j = await r.json();
        rsaPub = j.public_key;
        localStorage.setItem("rsaPublicKey", rsaPub);
      }
      const key = await importSPKI(rsaPub!, "RS256");
      const { payload: pl } = await jwtVerify(data.token, key);
      window.location.href = pl.next_step as string;
    } finally {
      setLoading(false);
    }
  };

  const percent = (score / total) * 100;
  const barColor =
    percent < 40
      ? "bg-red-500"
      : percent < 80
      ? "bg-yellow-400"
      : "bg-green-600";

  return (
    <Card className="overflow-hidden w-full">
      <CardContent className="mx-3 my-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Set Recovery Phrase</h1>
          </div>

          <div className="grid gap-2 relative">
            <Label htmlFor="phrase">Recovery Phrase</Label>
            <Input
              id="phrase"
              type={showPhrase ? "text" : "password"}
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPhrase(!showPhrase)}
              className="absolute inset-y-10 right-0 pr-3 flex items-center"
            >
              {showPhrase ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className="w-full !mt-3">
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className={`${barColor} h-2 rounded`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <ul className="!mt-2 space-y-1 text-sm">
            {requirements.map(({ label, passed }) => (
              <li
                key={label}
                className={`flex items-center ${
                  passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {passed ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                {label}
              </li>
            ))}
          </ul>

          <div className="grid gap-2 relative">
            <Label htmlFor="confirm">Confirm Phrase</Label>
            <Input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-10 right-0 pr-3 flex items-center"
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
