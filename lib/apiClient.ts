// lib/apiClient.ts
import { serverUrl } from "./config";
import nacl from "tweetnacl";
import * as ed2curve from "ed2curve";
import {
  loadClientKeys,
  getEd25519PublicKey,
  getX25519PrivateKey,
  clearClientKeyStorage,
} from "./clientKeys";

async function fetchServerKey(): Promise<Uint8Array> {
  const res = await fetch(`${serverUrl}/auth/ed25519-public-key`);
  if (!res.ok) {
    throw new Error(`failed to fetch server public key: ${res.status}`);
  }
  const { public_key } = await res.json();
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("ed25519PublicKey", public_key);
  }
  return Buffer.from(public_key, "base64");
}


async function encryptRequest(
  path: string,
  data: any,
  method: string = "POST"
): Promise<Response> {
  const hasKeys = await loadClientKeys();
  if (!hasKeys) {
    clearClientKeyStorage();
    if (typeof document !== "undefined") {
      document.cookie
        .split(";")
        .forEach((c) => (document.cookie = c.replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/")));
      window.location.href = "/auth/login";
    }
    throw new Error("missing client key");
  }

  const clientPub = getEd25519PublicKey();
  const x25519Priv = getX25519PrivateKey();
  if (!clientPub || !x25519Priv) {
    clearClientKeyStorage();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    throw new Error("missing client key data");
  }

  const serverPub = await fetchServerKey();
  const serverCurvePub = ed2curve.convertPublicKey(serverPub);
  const sharedSecret = nacl.scalarMult(x25519Priv, serverCurvePub);

  // Encrypt payload with AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    "AES-GCM",
    false,
    ["encrypt"]
  );
  const plain = new TextEncoder().encode(JSON.stringify(data));
  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    aesKey,
    plain
  );

  // Build envelope
  const body = {
    clientPubKey: Buffer.from(clientPub).toString("base64"),
    nonce: Buffer.from(iv).toString("base64"),
    ciphertext: Buffer.from(new Uint8Array(cipherBuf)).toString("base64"),
  };

  // Send
  const res = await fetch(`${serverUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return res;
}

async function decryptResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 403) {
      try {
        const j = await res.clone().json();
        const detail = j.detail as string | undefined;
        if (detail === "set-recovery-phrase" || detail === "onboarding") {
          window.location.href = `/${detail}`;
          throw new Error("redirect");
        }
      } catch {}
    }
    const text = await res.text().catch(() => `status ${res.status}`);
    throw new Error(text);
  }
  const json = await res.json();
  if (!json.ciphertext) {
    return json as T;
  }

  const ok = await loadClientKeys();
  if (!ok) {
    clearClientKeyStorage();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    throw new Error("missing client key");
  }

  const serverPub = await fetchServerKey();
  const xPriv = getX25519PrivateKey();
  if (!xPriv) {
    clearClientKeyStorage();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    throw new Error("missing client key data");
  }
  const serverCurvePub = ed2curve.convertPublicKey(serverPub);
  const shared = nacl.scalarMult(xPriv, serverCurvePub);
  const aesKey = await crypto.subtle.importKey(
    "raw",
    shared,
    "AES-GCM",
    false,
    ["decrypt"]
  );
  const nonce = Buffer.from(json.nonce, "base64");
  const cipher = Buffer.from(json.ciphertext, "base64");
  const buf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, aesKey, cipher);
  return JSON.parse(new TextDecoder().decode(buf)) as T;
}

export function encryptPost(path: string, data: any): Promise<Response> {
  return encryptRequest(path, data, "POST");
}

export function encryptGet(path: string, data?: any): Promise<Response> {
  return encryptRequest(path, data, "GET");
}

export function decryptPost<T>(res: Response): Promise<T> {
  return decryptResponse(res);
}

export { fetchServerKey, encryptRequest, decryptResponse };
