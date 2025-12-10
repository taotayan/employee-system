database-schema.md

Database Schema: Employee Management System

Table: employees
ตารางหลักสำหรับเก็บข้อมูลพนักงาน

| Field        | Type            | Description              |
|--------------|------------------|-------------------------|
| id           | serial PK        | รหัสพนักงาน               |
| first_name   | varchar(100)     | ชื่อ                      |
| last_name    | varchar(100)     | นามสกุล                  |
| phone        | varchar(20)      | เบอร์โทร                  |
| department   | varchar(100)     | แผนก                    |
| position     | varchar(100)     | ตำแหน่ง                  |
| start_date   | date             | วันที่เริ่มงาน                |
| created_at   | timestamp        | วันที่เพิ่มข้อมูล              |
| updated_at   | timestamp        | วันที่แก้ไขล่าสุด             |

---

ER Diagram
```
Employees
   └── id (PK)
```
