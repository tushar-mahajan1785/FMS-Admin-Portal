import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import routes from "../../routes";

export default function ProtectedRoute({ element, permission, path }) {
    const { hasPermission } = useAuth();

    // ✅ allowed → just render
    if (permission && hasPermission(permission)) {
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