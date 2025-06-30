import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serverUrl } from "@/lib/config";
import argon2 from "argon2-browser";
import nacl from "tweetnacl";
import { importSPKI, jwtVerify } from "jose";
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
      const salt = nacl.randomBytes(16);
      const params = { time: 1, mem: 65536, parallelism: 1, hashLen: 32, type: argon2.ArgonType.Argon2id };
      const { hash } = await argon2.hash({ pass: phrase, salt, ...params });
      const sig = nacl.sign.keyPair.fromSeed(hash);
      const enc = nacl.box.keyPair();
      const payload = {
        userId,
        salt: Buffer.from(salt).toString("base64"),
        kdfParams: Buffer.from(JSON.stringify(params)).toString("base64"),
        sigKey: Buffer.from(sig.publicKey).toString("base64"),
        encKey: Buffer.from(enc.publicKey).toString("base64"),
      };
      const res = await fetch(`${serverUrl}/auth/set-recovery-phrase`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-username": username },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const cookieKey = document.cookie
        .split("; ")
        .find((c) => c.startsWith("publicKey="));
      let pub = cookieKey ? decodeURIComponent(cookieKey.split("=")[1]) : null;
      if (!pub) {
        const r = await fetch(`${serverUrl}/auth/public-key`);
        const j = await r.json();
        pub = j.public_key;
        document.cookie = `publicKey=${encodeURIComponent(pub)}; path=/`;
      }
      const key = await importSPKI(pub!, "RS256");
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
