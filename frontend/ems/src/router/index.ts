import { createRouter, createWebHistory } from 'vue-router'
import { isAuth , logout , getUserFromToken} from "../utils/auth";
import Login from '../pages/Login.vue'
import Register from '@/pages/Register.vue';
import EmployeeList from '../pages/EmployeeList.vue'
import EmployeeCreate from '../pages/EmployeeCreate.vue'
import EmployeeEdit from '../pages/EmployeeEdit.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Dashboard from '../pages/Dashboard.vue'
import Adminusers from '@/pages/AdminUsers.vue'

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "employees", component: EmployeeList },
      { path: "employees/create", component: EmployeeCreate },
      { path: "employees/:id/edit", component: EmployeeEdit },
      { path: "admin/users",component: Adminusers},
    ],
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!isAuth() && to.path !== "/login" && to.path !== "/register") {
    return next("/login");
  }

  const user = getUserFromToken();

  if (
    (to.path.startsWith("/employees/create") ||
     to.path.includes("/edit")) &&
    user?.role !== "admin"
  ) {
    return next("/dashboard");
  }

  if (to.path.startsWith("/admin/users") && user?.role !== "admin") {
    return next("/dashboard");
  }

  next();
});


export default router
