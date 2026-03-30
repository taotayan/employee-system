import api from "./api";

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
}

export const getEmployees = async () => {
  const res = await api.get("/employees");
  return res.data;
};

export const createEmployee = async (data: any) => {
  await api.post("/employees", data);
};

export const deleteEmployee = async (id: number) => {
  await api.delete(`/employees/${id}`);
};

export const getEmployeeById = async (id: number) => {
  const res = await api.get(`/employees/${id}`);
  return res.data;
};

export const updateEmployee = (id: number, data: any) => {
  return api.put(`/employees/${id}`, data);
};

export const getEmployeeStats = async () => {
  const res = await api.get("/employees/stats");
  return res.data;
};

export const exportEmployeesExcel = async () => {
  const res = await api.get("/employees/export/excel", {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "employees.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
};
export const exportEmployeesPDF = async () => {
  const res = await api.get("/employees/export/pdf", {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(res.data);
  window.open(url);
};


