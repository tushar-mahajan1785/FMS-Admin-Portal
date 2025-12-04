import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
// import routes from "../../routes/admin-routes";
import { getAppRoutes } from "../../routes";
import { useEffect, useState } from "react";
import adminRoutes from "../../routes/admin-routes";

export default function ProtectedRoute({ element, permission, path }) {
    const { hasPermission, user } = useAuth();
    const [routes, setRoutes] = useState(adminRoutes || [])

    /**
    * Get Routes as per Role type Technician or other
    */
    useEffect(() => {
        if (user && user !== null && user?.type && user?.type !== null) {
            let route = getAppRoutes(user?.type);
            setRoutes(route)
        } else {
            setRoutes(adminRoutes)
        }
    }, [user?.type])

    if (user?.type === "Technician") {
        return element;
    } else if (permission && hasPermission(permission)) {
        // ✅ allowed → just render
        return element;
    }




    // 🚫 no permission → find next allowed route
    const currentIndex = routes.findIndex(r => r.path === path);
    const nextAllowed = routes
        .slice(currentIndex + 1)
        .find(r => r.permission && hasPermission(r.permission));

    if (nextAllowed) {
        return <Navigate to={nextAllowed.path.replace("/*", '')} replace />;
    }

    // fallback → first permitted route
    const firstAllowed = routes.find(r => r.permission && hasPermission(r.permission));
    if (firstAllowed) {
        return <Navigate to={firstAllowed.path.replace("/*", '')} replace />;
    }

    // if nothing allowed, send to login (or 404)
    return <Navigate to="/" replace />;
}