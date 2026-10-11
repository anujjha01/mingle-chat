import { generateToken } from "../lib/utils.js";
import { pool, toUser } from "../lib/db.js";
import bcrypt from "bcryptjs";
import { uploadImage } from "../lib/imagekit.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
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
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });
    if (!process.env.IMAGEKIT_PRIVATE_KEY) return res.status(503).json({ message: "Profile image uploads are not configured" });
    const profilePicUrl = await uploadImage(profilePic);
    const { rows } = await pool.query(
      "UPDATE users SET profile_pic = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [profilePicUrl, req.user._id]
    );
    res.status(200).json(toUser(rows[0]));
  } catch (error) {
    console.error("Error in update profile", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => res.status(200).json(req.user);
