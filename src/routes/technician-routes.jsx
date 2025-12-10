// routes.js
import Checklist from "../pages/checklist";
import LoginPage from "../pages/login";
import TechnicianAsset from "../pages/technician/assets";
import TechnicianChecklist from "../pages/technician/checklist";
import TechnicianDashboard from "../pages/technician/dashboard";
import TechnicianProfile from "../pages/technician/profile";

const technicianRoutes = [
    {
        path: "/login",
        element: <LoginPage />,
        protected: false,
    },
    {
        path: "/profile",
        element: <TechnicianProfile />,
        permission: "profile",
        protected: true,
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
    {
        path: "/checklist/*",
        element: <TechnicianChecklist />,
        permission: "CHECKLIST",
        protected: true,
    }
];

export default technicianRoutes;
