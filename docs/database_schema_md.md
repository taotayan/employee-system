database-schema.md

Database Schema: Employee Management System

ภาพรวมฐานข้อมูล
- ระบบใช้งาน PostgreSQL
- ตารางหลักที่ใช้ปัจจุบัน: users, employees

---

Table: users
ตารางสำหรับเก็บข้อมูลบัญชีผู้ใช้งานระบบ

| Field      | Type                 | Description                         |
|------------|----------------------|-------------------------------------|
| id         | serial PK            | รหัสผู้ใช้                           |
| name       | varchar(150)         | ชื่อผู้ใช้                           |
| email      | varchar(150) UNIQUE  | อีเมล (ไม่ซ้ำ)                      |
| password   | varchar(255)         | รหัสผ่านแบบ hash (bcrypt)          |
| role       | varchar(20)          | สิทธิ์ผู้ใช้ (admin/user)          |
| created_at | timestamp            | วันที่สร้างบัญชี                     |

Constraints/Notes
- PRIMARY KEY: id
- UNIQUE: email
- role ค่าเริ่มต้นเป็น user

---

Table: employees
ตารางสำหรับเก็บข้อมูลพนักงาน

| Field      | Type             | Description                 |
|------------|------------------|-----------------------------|
| id         | serial PK        | รหัสพนักงาน                  |
| first_name | varchar(100)     | ชื่อ                         |
| last_name  | varchar(100)     | นามสกุล                      |
| department | varchar(100)     | แผนก                         |
| position   | varchar(100)     | ตำแหน่ง                      |
| created_at | timestamp        | วันที่เพิ่มข้อมูล              |
| updated_at | timestamp        | วันที่แก้ไขล่าสุด              |

Constraints/Notes
- PRIMARY KEY: id
- ใช้ created_at สำหรับ Dashboard (เพิ่มล่าสุด)

---

ER Diagram (Current)
```
Users
   └── id (PK)

Employees
   └── id (PK)
```

หมายเหตุ
- ปัจจุบัน users และ employees ยังไม่ได้เชื่อมด้วย foreign key โดยตรง
- หากต้องการผูกผู้สร้างข้อมูลพนักงาน สามารถเพิ่ม created_by (FK -> users.id) ได้ในอนาคต
