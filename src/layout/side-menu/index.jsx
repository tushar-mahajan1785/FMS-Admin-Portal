import ClientsIcon from "../../assets/icons/ClientsIcon";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import AssetIcon from "../../assets/icons/AssetIcon";
import VendorIcon from "../../assets/icons/VendorIcon";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import CircleIcon from "../../assets/icons/CircleIcon";
import ReportsIcon from "../../assets/icons/ReportsIcon";
import FileAlertIcon from "../../assets/icons/FileAlertIcon";
import TechnicianTicketIcon from "../../assets/icons/TechnicianTicketIcon"
import CalendarTodayIcon from "../../assets/icons/CalendarTodayIcon"
import ClipboardIcon from "../../assets/icons/ClipboardIcon"

export const sideMenuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: DashboardIcon,
    permission: "DASHBOARD",
  },
  {
    title: "Tickets",
    path: "/tickets",
    icon: TechnicianTicketIcon,
    permission: "TICKET",
  },
  {
    title: "PM Activity",
    path: "/pm-activity",
    icon: CalendarTodayIcon,
    permission: "PM_ACTIVITY",
  },
  {
    group: "Inventory Management",
    icon: FileAlertIcon,
    items: [
      {
        title: "Category Master",
        path: "/inventory-category",
        icon: CircleIcon,
        permission: "INVENTORY",
      },
      {
        title: "Inventory",
        path: "/inventory",
        icon: CircleIcon,
        permission: "INVENTORY",
      },
    ],
  },
  { title: "Employee", path: "/employees", icon: ClientsIcon, permission: "EMPLOYEE", },
  { title: "Vendor", path: "/vendors", icon: VendorIcon, permission: "VENDOR" },
  { title: "Asset", path: "/assets", icon: AssetIcon, permission: "ASSET" },
  {
    group: "Roster",
    icon: CalendarIcon,
    items: [
      {
        title: "Manage Groups",
        path: "/manage-groups",
        icon: CircleIcon,
        permission: "MANAGE_GROUPS",
      },
      {
        title: "Configuration Shift",
        path: "/configuration-shift",
        icon: CircleIcon,
        permission: "CONFIGURATION_SHIFT",
      },
      {
        title: "Manage Shift",
        path: "/manage-shift",
        icon: CircleIcon,
        permission: "MANAGE_SHIFT",
      },
    ],
  },
  {
    title: "Checklist",
    path: "/checklist",
    icon: ClipboardIcon,
    permission: "CHECKLIST",
  },
  {
    group: "Document Management",
    icon: ReportsIcon,
    items: [
      {
        title: "Document Categories",
        path: "/document-categories",
        icon: CircleIcon,
        permission: "DOCUMENT_CATEGORIES",
      },
      {
        title: "Documents",
        path: "/documents",
        icon: CircleIcon,
        permission: "DOCUMENT",
      }
    ],
  },
  {
    title: "Settings",
    path: "/admin-setting",
    icon: SettingsIcon,
    permission: "SETTING",
  },
];
