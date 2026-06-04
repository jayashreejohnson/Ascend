"""SQLAlchemy async engine + session factory."""
from __future__ import annotations

import ssl as _ssl

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


def _connect_args() -> dict:
    """Remote Postgres (e.g. Railway) requires SSL; local does not.

    Uses a permissive SSL context (no cert verification) — fine for a managed
    provider over a trusted connection string, avoids cert-chain headaches.
    """
    url = settings.database_url
    is_local = "localhost" in url or "127.0.0.1" in url
    if url.startswith("postgresql") and not is_local:
        ctx = _ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = _ssl.CERT_NONE
        return {"ssl": ctx}
    return {}


engine = create_async_engine(settings.database_url, echo=False, connect_args=_connect_args())
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with SessionLocal() as session:
        yield session
