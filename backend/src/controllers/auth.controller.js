import { generateToken } from "../lib/utils.js";
import { pool, toUser } from "../lib/db.js";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { getImageKitPrivateKey, uploadImage } from "../lib/imagekit.js";

const DEMO_EMAIL = "demo@mingle.chat";
const DEMO_FRIEND_EMAIL = "guide@mingle.chat";

const ensureDemoAccounts = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", ["mingle-demo-accounts"]);

    const createAccount = async (fullName, email) => {
      const existing = await client.query(
        "SELECT id, full_name, email, profile_pic, created_at FROM users WHERE email = $1",
        [email]
      );
      if (existing.rows[0]) return existing.rows[0];

      const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 10);
      const inserted = await client.query(
        "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id, full_name, email, profile_pic, created_at",
        [fullName, email, passwordHash]
      );
      if (inserted.rows[0]) return inserted.rows[0];
      const conflict = await client.query(
        "SELECT id, full_name, email, profile_pic, created_at FROM users WHERE email = $1",
        [email]
      );
      return conflict.rows[0];
    };

    const demo = await createAccount("Mingle Demo", DEMO_EMAIL);
    const guide = await createAccount("Mingle Guide", DEMO_FRIEND_EMAIL);
    if (!demo || !guide) throw new Error("Could not create demo accounts");

    const conversation = await client.query(
      "SELECT 1 FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) LIMIT 1",
      [demo.id, guide.id]
    );
    if (!conversation.rowCount) {
      await client.query(
        "INSERT INTO messages (sender_id, receiver_id, text, read_at) VALUES ($1, $2, $3, NOW()), ($2, $1, $4, NULL)",
        [demo.id, guide.id, "Hi! Welcome to Mingle. This sample conversation shows how real-time chat works.", "Thanks! You can send a message or try an image upload here."]
      );
    }

    await client.query("COMMIT");
    return demo;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if ([DEMO_EMAIL, DEMO_FRIEND_EMAIL].includes(email.trim().toLowerCase())) {
    return res.status(409).json({ message: "That email is reserved for the Mingle demo" });
  }
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [fullName.trim(), email.trim().toLowerCase(), hashedPassword]
    );
    const user = toUser(rows[0]);
    generateToken(user._id, res);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ message: "Email already exists" });
    console.error("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const demoLogin = async (_req, res) => {
  try {
    const row = await ensureDemoAccounts();
    const user = toUser(row);
    generateToken(user._id, res);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error starting demo session:", error.message);
    res.status(503).json({ message: "The demo account is temporarily unavailable. Please try again." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email?.trim().toLowerCase()]);
    const row = rows[0];
    if (!row || !(await bcrypt.compare(password || "", row.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = toUser(row);
    generateToken(user._id, res);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_req, res) => {
  res.cookie("jwt", "", { maxAge: 0, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    if (req.user.email === DEMO_EMAIL) {
      return res.status(403).json({ message: "Profile changes are disabled for the shared demo account" });
    }
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });
    if (!getImageKitPrivateKey()) return res.status(503).json({ message: "Profile image uploads need an ImageKit key. Add IMAGEKIT_PRIVATE_KEY in Vercel settings." });
    const profilePicUrl = await uploadImage(profilePic);
    const { rows } = await pool.query(
      "UPDATE users SET profile_pic = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [profilePicUrl, req.user._id]
    );
    res.status(200).json(toUser(rows[0]));
  } catch (error) {
    console.error("Error in update profile", error.message);
    res.status(error.status || 500).json({ message: error.status ? error.message : "Could not update profile photo" });
  }
};

export const checkAuth = (req, res) => res.status(200).json(req.user);

export const heartbeat = async (req, res) => {
  try {
    await pool.query("UPDATE users SET last_seen_at = NOW() WHERE id = $1", [req.user._id]);
    res.status(204).end();
  } catch (error) {
    console.error("Error updating presence", error.message);
    res.status(500).json({ message: "Could not update online status" });
  }
};
