// routes.js
import Checklist from "../pages/checklist";
import LoginPage from "../pages/login";
import Profile from "../pages/profile";
import TechnicianAsset from "../pages/technician/assets";
import TechnicianDashboard from "../pages/technician/dashboard";

const technicianRoutes = [
    {
        path: "/login",
        element: <LoginPage />,
        protected: false,
    },
    {
        path: "/profile",
        element: <Profile />,
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
        element: <Checklist />,
        permission: "CHECKLIST",
        protected: true,
    }
];

export default technicianRoutes;
