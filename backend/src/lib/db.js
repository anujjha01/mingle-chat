import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export const connectDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      profile_pic TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      text TEXT,
      image TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS messages_conversation_created_idx
      ON messages (sender_id, receiver_id, created_at);
  `);
  console.log("PostgreSQL connected and schema is ready");
};

export const toUser = (row) => row && ({
  _id: String(row.id),
  fullName: row.full_name,
  email: row.email,
  profilePic: row.profile_pic,
  createdAt: row.created_at,
});

export const toMessage = (row) => ({
  _id: String(row.id),
  senderId: String(row.sender_id),
  receiverId: String(row.receiver_id),
  text: row.text,
  image: row.image,
  createdAt: row.created_at,
});
