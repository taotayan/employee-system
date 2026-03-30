-- employee_db_seed.sql
-- Seed script for Employee Management System

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) DEFAULT '',
  position VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Optional sample users (password hash is bcrypt for demo only)
-- Example plaintext password for these demo rows: 123456
INSERT INTO users (name, email, password, role)
VALUES
  (
    'Admin Demo',
    'admin@test.com',
    '$2b$10$GmGORsl4MLn.s.LoFPigIez0ouCH.ElPij5vdTaQ.4pgxrR/HWQfq',
    'admin'
  ),
  (
    'User Demo',
    'user@test.com',
    '$2b$10$GmGORsl4MLn.s.LoFPigIez0ouCH.ElPij5vdTaQ.4pgxrR/HWQfq',
    'user'
  )
ON CONFLICT (email) DO NOTHING;

-- Optional sample employees (idempotent inserts)
INSERT INTO employees (first_name, last_name, department, position)
SELECT 'Somchai', 'Jaidee', 'HR', 'HR Officer'
WHERE NOT EXISTS (
  SELECT 1 FROM employees
  WHERE first_name = 'Somchai' AND last_name = 'Jaidee'
);

INSERT INTO employees (first_name, last_name, department, position)
SELECT 'Suda', 'Sukjai', 'IT', 'Developer'
WHERE NOT EXISTS (
  SELECT 1 FROM employees
  WHERE first_name = 'Suda' AND last_name = 'Sukjai'
);

INSERT INTO employees (first_name, last_name, department, position)
SELECT 'Narin', 'Thongdee', 'Finance', 'Accountant'
WHERE NOT EXISTS (
  SELECT 1 FROM employees
  WHERE first_name = 'Narin' AND last_name = 'Thongdee'
);
