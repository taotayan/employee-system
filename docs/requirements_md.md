requirements.md

Requirements: Employee Management System

1. Overview
ระบบจัดการพนักงาน (Employee Management System) เป็นระบบเว็บที่รองรับการจัดการพนักงานแบบครบวงจร พร้อมระบบยืนยันตัวตนและสิทธิ์ผู้ใช้งาน (admin/user)

ขอบเขตหลักของระบบ
- จัดการข้อมูลพนักงาน (เพิ่ม แก้ไข ลบ ค้นหา)
- ยืนยันตัวตนด้วย JWT
- รองรับการสมัครสมาชิกและรีเซ็ตรหัสผ่าน
- แสดง Dashboard สรุปข้อมูลพนักงาน
- รองรับเมนูแอดมินเพื่อจัดการผู้ใช้งาน

---

2. Features

Authentication Module
- สมัครสมาชิก (Register)
- เข้าสู่ระบบ (Login) ด้วย email/password
- รีเซ็ตรหัสผ่าน (Forgot Password / Reset Password)
- ใช้งาน JWT เพื่อยืนยันตัวตน
- Auto logout เมื่อ token หมดอายุหรือไม่ถูกต้อง

Employee Module
- ดูรายการพนักงาน
- ค้นหาพนักงานจาก ชื่อ/นามสกุล/แผนก/ตำแหน่ง
- เพิ่มพนักงาน (admin)
- แก้ไขพนักงาน (admin)
- ลบพนักงาน (admin)
- แบ่งหน้า (Pagination)

Dashboard Module
- แสดงจำนวนพนักงานทั้งหมด
- แสดงจำนวนแผนก
- แสดงวันที่เพิ่มพนักงานล่าสุด (จากข้อมูลจริง)
- กราฟสัดส่วนพนักงานแยกตามแผนก
- Export รายงานพนักงานเป็น Excel และ PDF

Admin Module
- ดูรายชื่อผู้ใช้งานทั้งหมด (admin only)
- เปลี่ยน role ผู้ใช้งาน (admin/user)
- ลบผู้ใช้งาน (admin only)

---

3. Pages
- Login Page
- Register Page
- Dashboard Page
- Employee List Page
- Employee Create Page
- Employee Edit Page
- Admin Users Page (admin only)

---

4. API Endpoints

Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/reset-password

Employees
- GET /employees/stats
- GET /employees
- GET /employees/:id
- POST /employees
- PUT /employees/:id
- DELETE /employees/:id
- GET /employees/export/excel
- GET /employees/export/pdf

Admin Users
- GET /admin/users
- PUT /admin/users/:id/role
- DELETE /admin/users/:id

---

5. Tech Stack

Frontend
- Vue 3 + TypeScript
- Vue Router
- Axios
- Chart.js + vue-chartjs
- vue-sonner

Backend
- Node.js + Express + TypeScript
- pg (PostgreSQL client)
- jsonwebtoken + bcryptjs
- exceljs + pdfkit

Database
- PostgreSQL
- ใช้งานผ่าน pgAdmin 4 ได้

Tools
- Git / GitHub
- Postman / Thunder Client (optional)

---

6. Roles and Permissions
- user:
	- Login
	- ดู Dashboard และข้อมูลพนักงาน
	- ไม่สามารถเพิ่ม/แก้ไข/ลบพนักงาน
	- ไม่สามารถเข้า Admin Users

- admin:
	- สิทธิ์ทั้งหมดของ user
	- เพิ่ม/แก้ไข/ลบพนักงาน
	- เข้าหน้า Admin Users และจัดการ role ผู้ใช้

