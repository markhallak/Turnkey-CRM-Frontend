from fastapi import FastAPI, HTTPException, Request
from typing import Set
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import os
import uvicorn

app = FastAPI()

ALLOWED_IPS: Set[str] = {"127.0.0.1", "::1"}

privateKey = rsa.generate_private_key(public_exponent=65537, key_size=2048)
publicKey = privateKey.public_key()


def serializePrivate(key: rsa.RSAPrivateKey) -> str:
    return key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()


def serializePublic(key: rsa.RSAPublicKey) -> str:
    return key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode()


@app.get("/private-key")
async def getPrivateKey(request: Request):
    client_ip = request.client.host
    if client_ip not in ALLOWED_IPS:
        raise HTTPException(status_code=403, detail="Forbidden")
    return {"privateKey": serializePrivate(privateKey)}


@app.get("/public-key")
async def getPublicKey():
    return {"publicKey": serializePublic(publicKey)}


if __name__ == "__main__":
    port = int(os.getenv("KMS_PORT", "9000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
