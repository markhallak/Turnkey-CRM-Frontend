import { serverUrl } from "./config";
import * as ed25519 from "@noble/ed25519";
import { ed25519PrivateKeyToX25519, ed25519PublicKeyToX25519 } from "@noble/ed25519/convert";
import { getSharedSecret } from "@noble/x25519";

let serverKey: Uint8Array | null = null;

async function fetchServerKey() {
  if (serverKey) return serverKey;
  const res = await fetch(`${serverUrl}/auth/ed25519-public-key`);
  const j = await res.json();
  serverKey = Buffer.from(j.public_key, "base64");
  return serverKey;
}

export function getClientPriv(): Uint8Array | null {
  const b64 = typeof localStorage !== "undefined" ? localStorage.getItem("clientPrivKey") : null;
  return b64 ? Buffer.from(b64, "base64") : null;
}

export function storeClientPriv(key: Uint8Array) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("clientPrivKey", Buffer.from(key).toString("base64"));
  }
}

export async function encryptedPost<T>(path: string, data: any): Promise<T> {
  const priv = getClientPriv();
  if (!priv) throw new Error("missing key");
  const serverPub = await fetchServerKey();
  const xPriv = ed25519PrivateKeyToX25519(priv);
  const xPub = ed25519PublicKeyToX25519(serverPub);
  const shared = getSharedSecret(xPriv, xPub);
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey("raw", shared, "AES-GCM", false, ["encrypt"]);
  const plain = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, plain);
  const clientPub = await ed25519.getPublicKey(priv);
  const res = await fetch(`${serverUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientPubKey: Buffer.from(clientPub).toString("base64"),
      nonce: Buffer.from(nonce).toString("base64"),
      ciphertext: Buffer.from(new Uint8Array(cipher)).toString("base64"),
    }),
  });
  if (!res.ok) {
    let msg = `status ${res.status}`;
    try {
      msg = await res.text();
    } catch {}
    throw new Error(msg);
  }
  const resp = await res.json();
  if (!resp.ciphertext) return resp as T;
  const n2 = Buffer.from(resp.nonce, "base64");
  const c2 = Buffer.from(resp.ciphertext, "base64");
  const dkey = await crypto.subtle.importKey("raw", shared, "AES-GCM", false, ["decrypt"]);
  const dec = await crypto.subtle.decrypt({ name: "AES-GCM", iv: n2 }, dkey, c2);
  return JSON.parse(new TextDecoder().decode(dec)) as T;
}

export { fetchServerKey };
