import { createRouter, createWebHistory } from "vue-router";
import { authStore } from "../stores/authStore";

const routes = [
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/auth/Login.vue"),
    },
    {
        path: "/",
        name: "Usher",
        component: () => import("../views/Usher.vue"),
    },
    {
        path: "/404",
        name: "404",
        component: () => import("../views/404.vue"),
    },
    {
        path: "/chat/messages",
        name: "Chats",
        component: () => import("../views/chats.vue"),
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("../views/admin/Layout.vue"),
        meta: { role: "admin" },
        children: [
            {
                path: "",
                name: "AdminDashboard",
                component: () => import("../views/admin/Dashboard.vue"),
            },
            {
                path: "users",
                name: "AdminUsers",
                component: () => import("../views/admin/Users.vue"),
            },
            {
                path: "settings",
                name: "AdminSettings",
                component: () => import("../views/admin/Settings.vue"),
            },
            {
                path: "tables",
                name: "AdminTables",
                component: () => import("../views/admin/Tables.vue"),
            },
        ],
    },
    {
        path: "/pos",
        name: "pos",
        component: () => import("../views/pos/Layout.vue"),
        meta: { role: "waiter" },
        children: [
            {
                path: "",
                name: "posDashboard",
                component: () => import("../views/pos/Main.vue"),
            },         
          
        ],
    },
    {
        path: "/inventory",
        name: "Inventory",
        meta: { role: "inventory-manager" },
        component: () => import("../views/inventory/Layout.vue"),
        children: [
            {
                path: "",
                name: "InventoryDashboard",
                component: () => import("../views/inventory/Dashboard.vue"),
            },
            {
                path: "items",
                name: "InventoryItems",
                component: () => import("../views/inventory/Items.vue"),
            },
            {
                path: "purchases",
                name: "InventoryPurchase",
                component: () => import("../views/inventory/Purchase.vue"),
            },
            {
                path: "categories",
                name: "InventoryCategories",
                component: () => import("../views/inventory/Categories.vue"),
            },
            {
                path: "suppliers",
                name: "InventorySuppliers",
                component: () => import("../views/inventory/Suppliers.vue"),
            },
            {
                path: "orders",
                name: "InventoryOrders",
                component: () => import("../views/inventory/Orders.vue"),
            },
            {
                path: "reports",
                name: "InventoryReports",
                component: () => import("../views/inventory/Reports.vue"),
            },
        ],
    },
    {
        path: "/reservations",
        name: "Reservations",
        component: () => import("../views/reservations/Layout.vue"),
        meta: { role: "blend-mode" },
        children: [
             {
                path: "",
                name: "ReservationDashboard",
                component: () => import("../views/reservations/Dashboard.vue"),
            },
            {
                path: "zone-reservations",
                name: "ZoneReservations",
                component: () => import("../views/reservations/ZoneReservations.vue"),
            },
            {
                path: "table-reservations",
                name: "TableReservations",
                component: () => import("../views/reservations/TableReservations.vue"),
            },
            {
                path: "recurring-reservations",
                name: "RecurringReservations",
                component: () => import("../views/reservations/RecurringReservations.vue"),
            },
            {
                path: "tables",
                name: "ReservationTables",
                component: () => import("../views/reservations/Tables.vue"),
            },
            {
                path: "zones",
                name: "ReservationZones",
                component: () => import("../views/reservations/Zones.vue"),
            },
        ],
    },
    {
        path: "/menu",
        name: "Menu",
        component: () => import("../views/menu/Layout.vue"),
        meta: { role: "blend-mode" },
        children: [
            {
                path: "category",
                name: "MenuCategory",
                component: () => import("../views/menu/Category.vue"),
            },
            {
                path: "menu",
                name: "MenuItems",
                component: () => import("../views/menu/Menu.vue"),
            },
        ],
    },
    {
        path: "/user/profile",
        name: "Profile",
        component: () => import("../views/Profile.vue"),
    },

    {
        path: "/unauthorized",
        name: "Unauthorized",
        component: () => import("../views/Unauthorized.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
    linkActiveClass: "border-indigo-500",
    linkExactActiveClass: "border-indigo-700",
    history: createWebHistory("/"),
    routes,
});

router.beforeEach((to, from, next) => {
    const { user, is_authenticated } = authStore();
    console.log("Authenticating...", user?.token);
    console.log('user array', user);

    // If user is authenticated
    if (is_authenticated) {
        const userRole = user?.roles[0];

        // Allow admin users
        if (userRole === "admin") {
            return next();
        }
        // If the route requires a specific role
        if (to.meta.role) {
            const requiredRoles = Array.isArray(to.meta.role)
                ? to.meta.role
                : [to.meta.role];

            if (requiredRoles.includes(userRole)) {
                return next();
            } else {
                if (to.path === "/unauthorized") {
                    return next();
                }
                return next({ path: "/unauthorized" });
            }
        } else {
            return next();
        }
    } else {
        if (to.path === "/login") {
            return next();
        }
        return next({ path: "/login" });
    }
});

export default router;
