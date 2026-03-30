import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employee_db",
  password: "oatzaza4",
  port: 5432,
});
