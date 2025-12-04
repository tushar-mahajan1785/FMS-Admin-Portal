// routes.js
import LoginPage from "../pages/login";
import TechnicianAsset from "../pages/technician/assets";
import TechnicianDashboard from "../pages/technician/dashboard";

const technicianRoutes = [
    {
        path: "/login",
        element: <LoginPage />,
        protected: false,
    },
    {
        path: "/",
        element: <TechnicianDashboard />,
        permission: "Technician",
        protected: true,
    },
    {
        path: "/assets/*",
        element: <TechnicianAsset />,
        permission: "Asset",
        protected: true,
    },
];

export default technicianRoutes;
