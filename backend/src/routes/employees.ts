import { Router } from "express";
import { pool } from "../db";
import { authMiddleware } from "../middlewares/auth.middleware";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import path from "path";

const fontPath = path.join(
  __dirname,
  "../assets/fonts/THSarabunNew.ttf"
);

const router = Router();

/* ================= STATS (Dashboard) ================= */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // รวมพนักงานทั้งหมด
    const total = await pool.query(
      "SELECT COUNT(*) FROM employees"
    );

    // สรุปตามแผนก
    const byDept = await pool.query(`
      SELECT department, COUNT(*)::int as count
      FROM employees
      GROUP BY department
      ORDER BY department
    `);

    // พนักงานล่าสุด
    const recent = await pool.query(`
      SELECT id, first_name, last_name, department, created_at
      FROM employees
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      total: Number(total.rows[0].count),
      byDepartment: byDept.rows,
      recent: recent.rows, // ✅ สำคัญมาก
    });
  } catch (err) {
    console.error("EMPLOYEE STATS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= PROTECTED ROUTES ================= */
router.use(authMiddleware);

/* GET all */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET by id */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM employees WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json(result.rows[0]);
});

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, department, position } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "first_name และ last_name จำเป็นต้องกรอก"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO employees
      (first_name, last_name, department, position)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        first_name.trim(),
        last_name.trim(),
        department || "",
        position || ""
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, department, position } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "first_name และ last_name จำเป็นต้องกรอก"
      });
    }

    const result = await pool.query(
      `
      UPDATE employees
      SET first_name=$1,
          last_name=$2,
          department=$3,
          position=$4
      WHERE id=$5
      RETURNING *
      `,
      [
        first_name.trim(),
        last_name.trim(),
        department || "",
        position || "",
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE EMPLOYEE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await pool.query(
    "DELETE FROM employees WHERE id=$1",
    [req.params.id]
  );
  res.sendStatus(204);
});
/* ================= EXPORT EXCEL ================= */
router.get("/export/excel", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT first_name, last_name, department, position FROM employees ORDER BY id"
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Employees");

    sheet.columns = [
      { header: "ชื่อ", key: "first_name", width: 20 },
      { header: "นามสกุล", key: "last_name", width: 20 },
      { header: "แผนก", key: "department", width: 15 },
      { header: "ตำแหน่ง", key: "position", width: 20 },
    ];

    result.rows.forEach(emp => {
      sheet.addRow(emp);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=employees.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("EXPORT EXCEL ERROR:", err);
    res.status(500).json({ message: "Export failed" });
  }
});
/* ================= EXPORT PDF ================= */
router.get("/export/pdf", async (req, res) => {
  try {
    const total = await pool.query("SELECT COUNT(*) FROM employees");
    const byDept = await pool.query(`
      SELECT department, COUNT(*) as count
      FROM employees
      GROUP BY department
    `);

    const doc = new PDFDocument({ margin: 50 });

    const fontPath = path.join(
      __dirname,
      "../assets/fonts/THSarabunNew.ttf"
    );

    doc.registerFont("thai", fontPath);
    doc.font("thai");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=employee-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("รายงานพนักงาน", { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text(`พนักงานทั้งหมด: ${total.rows[0].count} คน`);
    doc.moveDown();

    doc.text("พนักงานแยกตามแผนก:");
    doc.moveDown(0.5);

    byDept.rows.forEach(d => {
      doc.text(`- ${d.department}: ${d.count} คน`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export PDF failed" });
  }
});

export default router;
