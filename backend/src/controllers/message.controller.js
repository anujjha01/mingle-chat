import { pool, toMessage, toUser } from "../lib/db.js";
import { uploadImage } from "../lib/imagekit.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, full_name, email, profile_pic, created_at,
              COALESCE(last_seen_at > NOW() - INTERVAL '90 seconds', FALSE) AS is_online
       FROM users WHERE id <> $1 ORDER BY full_name`,
      [req.user._id]
    );
    res.status(200).json(rows.map(toUser));
  } catch (error) {
    console.error("Error in getUsersForSidebar", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, sender_id, receiver_id, text, image, created_at
       FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC, id ASC`,
      [req.user._id, req.params.id]
    );
    res.status(200).json(rows.map(toMessage));
  } catch (error) {
    console.error("Error in getMessages", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    let imageUrl = null;
    if (image) {
      if (!process.env.IMAGEKIT_PRIVATE_KEY) return res.status(503).json({ message: "Image uploads are not configured" });
      imageUrl = await uploadImage(image);
    }
    if (!text?.trim() && !imageUrl) return res.status(400).json({ message: "A message or image is required" });
    const { rows } = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, text, image)
       SELECT $1, id, $3, $4 FROM users WHERE id = $2
       RETURNING id, sender_id, receiver_id, text, image, created_at`,
      [req.user._id, receiverId, text?.trim() || null, imageUrl]
    );
    if (!rows[0]) return res.status(404).json({ message: "Recipient not found" });
    const message = toMessage(rows[0]);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
