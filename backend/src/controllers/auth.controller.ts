import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email & password required"
      });
    }

    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (exists.rowCount && exists.rowCount > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashed]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    const message = error?.message || "Register failed";
    res.status(500).json({ message });
  }
};


/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error: any) {
    const message = error?.message || "Login failed";
    res.status(500).json({ message });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body ?? {};

    if (!email || !newPassword) {
      return res.status(400).json({ message: "email & newPassword required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashed, email]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    const message = error?.message || "Reset password failed";
    res.status(500).json({ message });
  }
};
