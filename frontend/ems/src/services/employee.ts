import axios from "axios";

const API = "http://localhost:3000/employees";

export const getEmployees = () => axios.get(API);
export const addEmployee = (data: any) => axios.post(API, data);
export const deleteEmployee = (id: number) => axios.delete(`${API}/${id}`);
