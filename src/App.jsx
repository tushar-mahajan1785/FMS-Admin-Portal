import { Routes, Route } from "react-router-dom";
import ProtectedLayout from "./layout/auth";
import NotFoundPage from "./pages/not-found";
import { getAppRoutes } from "./routes";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useState } from "react";
import adminRoutes from "./routes/admin-routes";

export default function App() {
  const { user } = useAuth()
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

  return (
    <Provider store={store}>
      <Routes>
        {/* Protected routes (with layout) */}
        <Route element={<ProtectedLayout />}>
          {routes
            .filter(r => r.protected)
            .map(({ path, element, permission }) => {
              if (permission) {
                return <Route key={path} path={path} element={<ProtectedRoute element={element} permission={permission} path={path} />} />
              }
            })}
        </Route>

        {/* Public routes (no ProtectedLayout wrapper) */}
        {routes
          .filter(r => !r.protected)
          .map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        {/* Catch-all non existing / wrong path */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Provider>
  );
}
