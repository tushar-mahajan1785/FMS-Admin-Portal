import adminRoutes from "./admin-routes";
import technicianRoutes from "./technician-routes";

export const getAppRoutes = (roleType) => {

    /**
    * Get Routes as per Role type Technician or other
    */
    if (roleType === "Technician") {
        return technicianRoutes;
    }
    return adminRoutes;
};
