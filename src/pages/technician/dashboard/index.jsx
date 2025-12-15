

import { Route, Routes } from "react-router-dom";
import TechnicianDashboardList from "./list";
import TechnicianDashboardView from "./view";

export default function TechnicianDashboard() {
    return (
        <Routes>
            <Route index element={<TechnicianDashboardList />} />
            <Route path="view" element={<TechnicianDashboardView />} />
        </Routes>
    );
}
