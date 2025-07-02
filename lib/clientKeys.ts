import nacl from "tweetnacl";
import * as ed2curve from "ed2curve";

let ed25519PublicKey: Uint8Array | null = null;
let ed25519PrivateKey: Uint8Array | null = null;
let x25519PublicKey: Uint8Array | null = null;
let x25519PrivateKey: Uint8Array | null = null;

const dbName = "clientKeys";
const storeName = "keys";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(storeName);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function createClientKeys(seed: Uint8Array) {
  const edKeys = nacl.sign.keyPair.fromSeed(seed);
  ed25519PublicKey = edKeys.publicKey;
  ed25519PrivateKey = edKeys.secretKey;
  const { publicKey, secretKey } = ed2curve.convertKeyPair(edKeys);
  x25519PublicKey = publicKey;
  x25519PrivateKey = secretKey;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(ed25519PublicKey, "ed25519PublicKey");
    tx.objectStore(storeName).put(ed25519PrivateKey, "ed25519PrivateKey");
    tx.objectStore(storeName).put(x25519PublicKey, "x25519PublicKey");
    tx.objectStore(storeName).put(x25519PrivateKey, "x25519PrivateKey");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadClientKeys(): Promise<boolean> {
  if (ed25519PublicKey && ed25519PrivateKey && x25519PublicKey && x25519PrivateKey) return true;
  const db = await openDb();
  return new Promise<boolean>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const reqEdPub = tx.objectStore(storeName).get("ed25519PublicKey");
    const reqEdPriv = tx.objectStore(storeName).get("ed25519PrivateKey");
    const reqXPub = tx.objectStore(storeName).get("x25519PublicKey");
    const reqXPriv = tx.objectStore(storeName).get("x25519PrivateKey");
    tx.oncomplete = () => {
      ed25519PublicKey = (reqEdPub.result as Uint8Array) || null;
      ed25519PrivateKey = (reqEdPriv.result as Uint8Array) || null;
      x25519PublicKey = (reqXPub.result as Uint8Array) || null;
      x25519PrivateKey = (reqXPriv.result as Uint8Array) || null;
      resolve(
        !!ed25519PublicKey &&
          !!ed25519PrivateKey &&
          !!x25519PublicKey &&
          !!x25519PrivateKey
      );
    };
    tx.onerror = () => reject(tx.error);
  });
}

export function getEd25519PublicKey() {
  return ed25519PublicKey;
}

export function getEd25519PrivateKey() {
  return ed25519PrivateKey;
}

export function getX25519PublicKey() {
  return x25519PublicKey;
}

export function getX25519PrivateKey() {
  return x25519PrivateKey;
}

export async function clearClientKeyStorage() {
  ed25519PublicKey = null;
  ed25519PrivateKey = null;
  x25519PublicKey = null;
  x25519PrivateKey = null;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
