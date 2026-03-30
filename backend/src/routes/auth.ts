import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";


const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1,$2,$3) RETURNING id,name,email`,
      [name, email, hashed]
    );

    res.status(201).json(result.rows[0]);
  } catch {
    res.status(400).json({ message: "Email ซ้ำ" });
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "user not found" });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ error: "wrong password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    "secret123",
    { expiresIn: "1h" }
  );

  res.json({ token });
});

export default router;
