// src/layout/technician/TechnicianLayout.jsx

import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../../components/bottom-navbar";

export default function TechnicianLayout() {
    const [value, setValue] = useState(0);
    const location = useLocation();

    const routes = ["/", "/checklist", "/assets", "/tickets", "/profile"];

    useEffect(() => {
        const i = routes.findIndex((path) =>
            location.pathname.startsWith(path)
        );
        if (i !== -1) setValue(i);
    }, [location.pathname]);

    return (
        <>
            <div style={{ paddingBottom: "80px" }}>
                <Outlet />
            </div>

            <BottomNav value={value} onChange={setValue} />
        </>
    );
}
