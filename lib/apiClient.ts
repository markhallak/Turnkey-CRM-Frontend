// lib/apiClient.ts
import { serverUrl } from "./config";
import nacl from "tweetnacl";
import * as ed2curve from "ed2curve";

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

export function getClientPriv(): Uint8Array | null {
  if (typeof localStorage === "undefined") return null;
  const b64 = localStorage.getItem("clientPrivKey");
  return b64 ? Buffer.from(b64, "base64") : null;
}

export function storeClientPriv(key: Uint8Array) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("clientPrivKey", Buffer.from(key).toString("base64"));
  }
}

export async function encryptedPost<T>(
  path: string,
  data: any
): Promise<T> {
  const priv = getClientPriv();
  if (!priv) throw new Error("missing client private key");
  const serverPub = await fetchServerKey();

  // Convert Ed25519 → X25519 for ECDH
  const edKeyPair = nacl.sign.keyPair.fromSeed(priv);
  const { secretKey: clientCurvePriv } = ed2curve.convertKeyPair(edKeyPair);
  const serverCurvePub = ed2curve.convertPublicKey(serverPub);
  const shared = nacl.scalarMult(clientCurvePriv, serverCurvePub);

  // Encrypt payload with AES-GCM
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await crypto.subtle.importKey(
    "raw",
    shared,
    "AES-GCM",
    false,
    ["encrypt"]
  );
  const plain = new TextEncoder().encode(JSON.stringify(data));
  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    aesKey,
    plain
  );

  // Build envelope
  const clientPub = edKeyPair.publicKey;
  const body = {
    clientPubKey: Buffer.from(clientPub).toString("base64"),
    nonce: Buffer.from(nonce).toString("base64"),
    ciphertext: Buffer.from(new Uint8Array(cipherBuf)).toString("base64"),
  };

  // Send
  const res = await fetch(`${serverUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => `status ${res.status}`);
    throw new Error(text);
  }

  // Decrypt response if needed
  const resp = await res.json();
  if (!resp.ciphertext) {
    return resp as T;
  }
  const respNonce = Buffer.from(resp.nonce, "base64");
  const respCipher = Buffer.from(resp.ciphertext, "base64");
  const aesDecKey = await crypto.subtle.importKey(
    "raw",
    shared,
    "AES-GCM",
    false,
    ["decrypt"]
  );
  const decBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: respNonce },
    aesDecKey,
    respCipher
  );
  return JSON.parse(new TextDecoder().decode(decBuf)) as T;
}

export { fetchServerKey };
