import DashboardIcon from "../../assets/icons/DashboardIcon";
import AssetIcon from "../../assets/icons/AssetIcon";

export const sideMenuItemsTechnician = [
    {
        title: "Dashboard",
        path: "/",
        icon: DashboardIcon,
        permission: "DASHBOARD",
    },
    { title: "Asset", path: "/assets", icon: AssetIcon, permission: "ASSET" }
];
