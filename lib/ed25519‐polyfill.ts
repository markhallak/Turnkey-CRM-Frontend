// lib/ed25519‐polyfill.ts
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

// wire up noble‐ed25519’s missing sync‐sha512 hook
ed.utils.sha512Sync = (...m: Uint8Array[]) =>
  sha512(ed.utils.concatBytes(...m));
