import { Router } from "express";
import { pool } from "../db";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminOnly);

/* GET all users */
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT id, email, role FROM users ORDER BY id"
  );
  res.json(result.rows);
});

/* UPDATE role */
router.put("/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const result = await pool.query(
    "UPDATE users SET role=$1 WHERE id=$2 RETURNING id,email,role",
    [role, id]
  );

  res.json(result.rows[0]);
});

/* DELETE user */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

export default router;
