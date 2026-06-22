"""
database.py — PostgreSQL connection & queries using psycopg2
"""

import os
import psycopg2
import psycopg2.extras
from datetime import datetime

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/voicescript"
)


def get_conn():
    return psycopg2.connect(DATABASE_URL)


def init_db():
    """Create tables if they don't exist."""
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS transcriptions (
            id          SERIAL PRIMARY KEY,
            text        TEXT NOT NULL,
            source      VARCHAR(50) DEFAULT 'microphone',
            created_at  TIMESTAMP DEFAULT NOW()
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database ready.")


def save_transcription(text: str, source: str = "microphone") -> dict:
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "INSERT INTO transcriptions (text, source) VALUES (%s, %s) RETURNING *",
        (text, source)
    )
    row = dict(cur.fetchone())
    row["created_at"] = row["created_at"].isoformat()
    conn.commit()
    cur.close()
    conn.close()
    return row


def get_transcriptions() -> list:
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM transcriptions ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    result = []
    for row in rows:
        r = dict(row)
        r["created_at"] = r["created_at"].isoformat()
        result.append(r)
    return result


def delete_transcription(item_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM transcriptions WHERE id = %s", (item_id,))
    conn.commit()
    cur.close()
    conn.close()
