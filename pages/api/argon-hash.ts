import type { NextApiRequest, NextApiResponse } from "next";
import argon2 from "argon2-browser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  try {
    const { pass, salt, ...params } = req.body || {};
    if (!pass || !salt) {
      res.status(400).json({ error: "missing params" });
      return;
    }
    const saltBuf = Buffer.from(salt, "base64");
    const { hash } = await argon2.hash({ pass, salt: saltBuf, ...params });
    res.status(200).json({ hash: Buffer.from(hash).toString("base64") });
  } catch (err) {
    res.status(500).json({ error: "hash failed" });
  }
}
