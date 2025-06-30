import uuid
from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

from asyncpg import Connection
import json
import jwt
import asyncio
from functools import wraps
from fastapi import HTTPException


def handleErrors(func):
    if asyncio.iscoroutinefunction(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except HTTPException:
                raise
            except Exception as e:
                print(f"Error in {func.__name__}: {e}")
                raise HTTPException(status_code=500, detail="Internal server error")

        return wrapper
    else:
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                print(f"Error in {func.__name__}: {e}")
                return None

        return wrapper


@handleErrors
async def isUUIDv4(u: str) -> bool:
    try:
        val = uuid.UUID(u, version=4)
    except (ValueError, AttributeError):
        return False

    return str(val) == u


@handleErrors
async def createMagicLink(
        conn: Connection,
        user_id: UUID,
        private_key_pem: str,
        purpose: str,
        recipientEmail: str,
        ttlHours: int = 24,
) -> str:
    new_uuid = uuid4()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=ttlHours)
    payload = {
        "uuid": str(new_uuid),
        "next_step": "setup_recovery",
        "exp": int(expires_at.timestamp()),
    }
    token = generateJwtRs256(payload, private_key_pem)

    sql = """
        INSERT INTO magic_link (
          uuid, user_id, token, expires_at, consumed, purpose, send_to
        ) VALUES ($1, $2, $3, $4, FALSE, $5, $6);
    """

    await conn.execute(
        sql,
        new_uuid,
        user_id,
        token,
        expires_at,
        purpose,
        recipientEmail,
    )

    return token



@handleErrors
def generateJwtRs256(payload: dict, privateKeyPem: str) -> str:
    return jwt.encode(payload, privateKeyPem, algorithm="RS256")


@handleErrors
def decodeJwtRs256(token: str, publicKeyPem: str) -> dict:
    return jwt.decode(token, publicKeyPem, algorithms=["RS256"])


