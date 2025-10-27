import ClientsIcon from "../../assets/icons/ClientsIcon";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import AssetIcon from "../../assets/icons/AssetIcon";
import VendorIcon from "../../assets/icons/VendorIcon";

export const sideMenuItems = [
    { title: "Dashboard", path: "/", icon: DashboardIcon, permission: 'DASHBOARD' },
    { title: "Employee", path: "/employees", icon: ClientsIcon, permission: 'EMPLOYEE' },
    { title: "Asset", path: "/assets", icon: AssetIcon, permission: 'ASSET' },
    { title: "Vendor", path: "/vendors", icon: VendorIcon, permission: 'VENDOR' },
    { title: "Settings", path: "/admin-setting", icon: SettingsIcon, permission: 'SETTING' },
];