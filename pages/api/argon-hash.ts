// pages/api/argon-hash.ts
import type { NextApiRequest, NextApiResponse } from "next";
import argon2 from "argon2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { pass, salt, time, mem, parallelism, hashLen } = req.body || {};
  if (!pass || !salt) return res.status(400).json({ error: "missing params" });

  try {
    const saltBuf = Buffer.from(salt, "base64");
    const hash = await argon2.hash(pass, {
      type: argon2.argon2id,
      salt: saltBuf,
      timeCost: time,
      memoryCost: mem,
      parallelism,
      hashLength: hashLen,
      raw: true,            // return Uint8Array like the Python backend
    });
    res.status(200).json({ hash: Buffer.from(hash).toString("base64") });
  } catch (err) {
    res.status(500).json({ error: "hash failed" });
  }
}
