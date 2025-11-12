// routes.js
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import ProfilePage from "../pages/profile";
import Assets from "../pages/assets";
import Employees from "../pages/employees";
import ForgetPassword from "../pages/forgot-password";
import Vendors from "../pages/vendors";
import AssetBulkUpload from "../pages/assets/bulk-upload";
import EmployeeBulkUpload from "../pages/employees/bulk-upload";
import VendorBulkUpload from "../pages/vendors/bulk-upload";
import Settings from "../pages/setting";
import AdminSetting from "../pages/admin-setting";
import ConfigureShiftList from "../pages/configure-shift";
import ManageGroups from "../pages/manage-groups";
import { Tickets } from "../pages/tickets";
import { TicketList } from "../pages/tickets/all";
import ManageShift from "../pages/manage-shift";
import Documents from "../pages/documents";
import Inventory from "../pages/inventory";
import ViewDocument from "../pages/documents/view";
import PmActivity from "../pages/pm-activity";

const routes = [
  {
    path: "/",
    element: <DashboardPage />,
    permission: "DASHBOARD",
    protected: true,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    permission: "PROFILE",
    protected: true,
  },
  {
    path: "/login",
    element: <LoginPage />,
    protected: false,
  },
  {
    path: "/assets/*",
    element: <Assets />,
    permission: "ASSET",
    protected: true,
  },
  {
    path: "/employees/*",
    element: <Employees />,
    permission: "EMPLOYEE",
    protected: true,
  },
  {
    path: "/forgot-password",
    element: <ForgetPassword />,
    protected: false,
  },
  {
    path: "/vendors/*",
    element: <Vendors />,
    permission: "VENDOR",
    protected: true,
  },
  {
    path: "/bulk-upload",
    element: <AssetBulkUpload />,
    permission: "ASSET_BULK_UPLOAD",
    protected: true,
  },
  {
    path: "/bulk-upload",
    element: <EmployeeBulkUpload />,
    permission: "EMPLOYEE_BULK_UPLOAD",
    protected: true,
  },
  {
    path: "/bulk-upload",
    element: <VendorBulkUpload />,
    permission: "VENDOR_BULK_UPLOAD",
    protected: true,
  },
  {
    path: "/setting/*",
    element: <Settings />,
    permission: "SETTING",
    protected: true,
  },
  {
    path: "/admin-setting/*",
    element: <AdminSetting />,
    permission: "SETTING",
    protected: true,
  },
  {
    path: "/configuration-shift",
    element: <ConfigureShiftList />,
    permission: "CONFIGURATION_SHIFT",
    protected: true,
  },
  {
    path: "/manage-groups",
    element: <ManageGroups />,
    permission: "MANAGE_GROUPS",
    protected: true,
  },
  {
    path: "/tickets/*",
    element: <Tickets />,
    permission: "TICKET",
    protected: true,
  },
  {
    path: "/manage-shift/*",
    element: <ManageShift />,
    permission: "MANAGE_SHIFT",
    protected: true,
  },
  {
    path: "/documents/*",
    element: <Documents />,
    permission: "DOCUMENT",
    protected: true,
  },
  {
    path: "/inventory/*",
    element: <Inventory />,
    permission: "INVENTORY",
    protected: true,
  },
  {
    path: "/view",
    element: <ViewDocument />,
    permission: "DOCUMENT_VIEW",
    protected: true,
  },
  {
    path: "/pm-activity",
    element: <PmActivity />,
    permission: "EMPLOYEE",
    protected: true,
  },
];

export default routes;
