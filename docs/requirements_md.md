requirements.md

Requirements: Employee Management System

1. ระบบจัดการพนักงาน (Employee Management System) เป็นระบบเว็บที่ช่วยให้ผู้ใช้งานสามารถเพิ่ม แก้ไข ลบ ค้นหา และดูรายละเอียดของพนักงานได้

---

2. Features

Employee Module
- เพิ่มข้อมูลพนักงาน
- แก้ไขข้อมูลพนักงาน
- ลบข้อมูลพนักงาน
- ค้นหาพนักงานตาม ชื่อ / เบอร์โทร / แผนก
- เรียงลำดับข้อมูล (Sort)
- แสดงรายละเอียดพนักงาน

Authentication Module
- Login ด้วย username/password
- Token-based Authentication (JWT)

---

3. Pages
- **Login Page** 
- **Employee List Page** — แสดงรายการพนักงาน
- **Employee Form Page** — เพิ่ม/แก้ไขพนักงาน
- **Employee Detail Page** — ดูรายละเอียด

---

4. API Endpoints
Employee
- `GET /employees`
- `GET /employees/:id`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id`

Authentication (optional)
- `POST /auth/login`
- `GET /auth/profile`

---

5. Tech Stack
- **Frontend:** Vue 3 + TypeScript, Pinia, TailwindCSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Tools:** Postman, Git, GitHub

