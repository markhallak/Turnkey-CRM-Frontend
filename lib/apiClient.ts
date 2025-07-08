// lib/apiClient.ts
import { serverUrl } from "./config";
import nacl from "tweetnacl";
import * as ed2curve from "ed2curve";
import { toast } from "@/hooks/use-toast";
import {
  loadClientKeys,
  getEd25519PublicKey,
  getX25519PrivateKey,
  clearClientKeyStorage,
} from "./clientKeys";


let cachedServerKey: Uint8Array | null = null;

async function fetchServerKey(): Promise<Uint8Array> {
  if (cachedServerKey) return cachedServerKey;
  if (typeof localStorage !== "undefined") {
    const existing = localStorage.getItem("serverEd25519PublicKey");
    if (existing) {
      cachedServerKey = Buffer.from(existing, "base64");
      return cachedServerKey;
    }
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/ed25519-public-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      credentials: "include",
    }
  );
  const payload = await res.json();
  const publicKeyB64 = payload?.public_key;
  if (publicKeyB64) {
    cachedServerKey = Buffer.from(publicKeyB64, "base64");
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("serverEd25519PublicKey", publicKeyB64);
    }
    return cachedServerKey;
  }
  toast({ description: "missing server key", variant: "destructive" });
  return new Uint8Array();
}

async function encryptRequest(
  path: string,
  data: any,
  method: string = "POST"
): Promise<Response> {
  const hasKeys = await loadClientKeys();

  // no client-side keys yet? just forward
  if (!hasKeys) {
    const isAuthRequest = path.startsWith("/auth/");
    if (!isAuthRequest && typeof document !== "undefined") {
      document.cookie = "session=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      window.location.href = "/auth/login";
    }
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
  }

  // load our ED25519 and X25519 keys
  const clientPub = getEd25519PublicKey();
  const x25519Priv = getX25519PrivateKey();
  if (!clientPub || !x25519Priv) {
    clearClientKeyStorage();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
  }

  // get server pubkey
  const serverPub = await fetchServerKey();
  const serverCurvePub = ed2curve.convertPublicKey(serverPub);
  const sharedSecret = nacl.scalarMult(x25519Priv, serverCurvePub);

  // AES-GCM encrypt
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
    { name: "AES-GCM", iv },
    aesKey,
    plain
  );

  // envelope
  const body = {
    clientPubKey: Buffer.from(clientPub).toString("base64"),
    nonce: Buffer.from(iv).toString("base64"),
    ciphertext: Buffer.from(new Uint8Array(cipherBuf)).toString("base64"),
  };

  // send it off
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
}

async function decryptResponse<T>(res: Response): Promise<T | null> {
  // non-2xx
  if (!res.ok) {
    if (res.status === 403) {
      // try to parse a JSON error
      try {
        if (errJ?.detail === "set-recovery-phrase" || errJ?.detail === "onboarding") {
          window.location.href = `/${errJ.detail}`;
        }
      } catch {
        // ignore
      }
    }
  }

  // now 2xx: maybe encrypted envelope, maybe plain JSON, maybe empty
  const maybe = await res.json();
  if (!maybe || !maybe.ciphertext) {
    // either empty body or plain JSON
    return maybe as T;
  }

  // decrypt envelope
  const ok = await loadClientKeys();
  if (!ok) {
    clearClientKeyStorage();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
  }

  const serverPub = await fetchServerKey();
  const xPriv = getX25519PrivateKey();
  if (!xPriv) {
    clearClientKeyStorage();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
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
  const nonce = Buffer.from(maybe.nonce, "base64");
  const cipher = Buffer.from(maybe.ciphertext, "base64");
  const buf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, aesKey, cipher);

  return JSON.parse(new TextDecoder().decode(buf)) as T;
}

export function encryptPost(path: string, data: any): Promise<Response> {
  return encryptRequest(path, data, "POST");
}

export function decryptPost<T>(res: Response): Promise<T | null> {
  return decryptResponse<T>(res);
}

export { fetchServerKey, encryptRequest, decryptResponse };
