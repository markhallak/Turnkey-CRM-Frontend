import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serverUrl } from "@/lib/config";
import { importSPKI, jwtVerify } from "jose";
import { encryptedPost, storeClientPriv } from "@/lib/apiClient";
import * as React from "react";

interface Props {
  userId: string;
  username: string;
}

export default function SetupRecoveryForm({ userId, username }: Props) {
  const [phrase, setPhrase] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const params = { time: 2, mem: 19 * 1024, parallelism: 1, hashLen: 32 };
      const resHash = await fetch("/api/argon-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass: phrase, salt: Buffer.from(salt).toString("base64"), ...params }),
      });
      if (!resHash.ok) throw new Error("hash");
      const { hash: hashB64 } = await resHash.json();
      const priv = Buffer.from(hashB64, "base64");
      const data = await encryptedPost<{ token: string }>("/auth/setup-recovery", {
        userId,
        recoveryPhrase: phrase,
        salt: Buffer.from(salt).toString("base64"),
        kdfParams: Buffer.from(JSON.stringify(params)).toString("base64"),
        clientPrivKey: Buffer.from(priv).toString("base64"),
      });
      storeClientPriv(priv);
      const cookieKey = document.cookie
        .split("; ")
        .find((c) => c.startsWith("publicKey="));
      let rsaPub = cookieKey
        ? decodeURIComponent(cookieKey.slice("publicKey=".length))
        : null;
      if (!rsaPub) {
        const r = await fetch(`${serverUrl}/auth/public-key`);
        const j = await r.json();
        rsaPub = j.public_key;
        document.cookie = `publicKey=${encodeURIComponent(rsaPub)}; path=/`;
      }
      const key = await importSPKI(rsaPub!, "RS256");
      const { payload: pl } = await jwtVerify(data.token, key);
      window.location.href = pl.next_step as string;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Set Recovery Phrase</h1>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phrase">Recovery Phrase</Label>
            <Input id="phrase" value={phrase} onChange={(e) => setPhrase(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
