import ClientsIcon from "../../assets/icons/ClientsIcon";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import AssetIcon from "../../assets/icons/AssetIcon";
import VendorIcon from "../../assets/icons/VendorIcon";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import CircleIcon from "../../assets/icons/CircleIcon"
import ReportsIcon from "../../assets/icons/ReportsIcon"
import FileAlertIcon from "../../assets/icons/FileAlertIcon";

export const sideMenuItems = [
    { title: "Dashboard", path: "/", icon: DashboardIcon, permission: 'DASHBOARD' },
    { title: "Tickets", path: "/tickets", icon: ClientsIcon, permission: 'TICKET' },
    { title: "Inventory", path: "/inventory", icon: FileAlertIcon, permission: 'INVENTORY' },
    { title: "Employee", path: "/employees", icon: ClientsIcon, permission: 'EMPLOYEE' },
    { title: "Vendor", path: "/vendors", icon: VendorIcon, permission: 'VENDOR' },
    { title: "Asset", path: "/assets", icon: AssetIcon, permission: 'ASSET' },
    { title: "Settings", path: "/admin-setting", icon: SettingsIcon, permission: 'SETTING' },
    {
        group: "Roster",
        icon: CalendarIcon,
        items: [
            { title: "Manage Groups", path: "/manage-groups", icon: CircleIcon, permission: 'MANAGE_GROUPS' },
            { title: "Configuration Shift", path: "/configuration-shift", icon: CircleIcon, permission: 'CONFIGURATION_SHIFT' },
            { title: "Manage Shift", path: "/manage-shift", icon: CircleIcon, permission: 'MANAGE_SHIFT' },
        ],
    },
    { title: "Documents", path: "/documents", icon: ReportsIcon, permission: 'DOCUMENT' },
];