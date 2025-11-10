export const ENV = import.meta.env.VITE_ENV_TYPE

export const HOST = {
    prod: import.meta.env.VITE_ENV_PROD,
    dev: import.meta.env.VITE_ENV_DEV,
    local: `${import.meta.env.VITE_ENV_LOCAL_BASE}:${import.meta.env.VITE_PORT}`
}

export const BASE = '/api/admin'

export const CRYPTO_SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

export const API_VERIFY_EMAIL = `${BASE}/employee/forgot-password`

export const API_RESET_PASSWORD = `${BASE}/employee/reset-password`

export const API_GET_DASHBOARD_COUNT = `${BASE}/dashboard/details`

export const API_EMPLOYEE_LOGIN = `${BASE}/employee/login`

export const API_LOGOUT = `${BASE}/employee/logout`

export const API_CHANGE_PASSWORD = `${BASE}/employee/change-password`

export const API_VERIFY_OTP = ``

export const API_VERIFY_TOKEN = `${BASE}/employee/verify-token`

// employee
export const API_EMPLOYEE_LIST = `${BASE}/employee/list`

export const API_ADD_EMPLOYEE = `${BASE}/employee/add`

export const API_UPDATE_EMPLOYEE = `${BASE}/employee/edit`

export const API_DELETE_EMPLOYEE = `${BASE}/employee/remove`

export const API_ROLE_LIST = `${BASE}/role/list`

export const API_ROLE_TYPE_LIST = `${BASE}/role-type/list`

export const API_ROLE_TYPE_ADD = `${BASE}/role-type/add-or-edit`

export const API_ROLE_TYPE_DELETE = `${BASE}/role-type/remove`

export const API_EMPLOYEE_MANAGER_LIST = `${BASE}/employee/manager-list`

export const API_EMPLOYEE_DETAILS = `${BASE}/employee/details`

export const API_MASTER_COUNTRY_CODE_LIST = `${BASE}/vendor/country-code-list`

export const API_EMPLOYEE_BULK_UPLOAD = `${BASE}/employee/bulk-add`

export const API_EMPLOYEE_WISE_PERMISSION_SAVE = `${BASE}/employee/permission-save`

export const API_EMPLOYEE_BULK_UPLOAD_LIST = `${BASE}/employee/non-sync-data`

export const API_EMPLOYEE_BULK_UPLOAD_CRON = `${BASE}/employee/bulk-upload-cron`

// vendor
export const API_VENDOR_LIST = `${BASE}/vendor/list`

export const API_ADD_VENDOR = `${BASE}/vendor/add`

export const API_EDIT_VENDOR = `${BASE}/vendor/edit`

export const API_DELETE_VENDOR = `${BASE}/vendor/remove`

export const API_VENDOR_DETAILS = `${BASE}/vendor/details`

export const API_VENDOR_MASTER = `${BASE}/vendor/master-list`

export const API_VENDOR_BULK_UPLOAD = `${BASE}/vendor/bulk-upload`

export const API_VENDOR_UPLOAD_LIST = `${BASE}/vendor/non-sync-list`

export const API_VENDOR_BULK_UPLOAD_CRON = `${BASE}/vendor/bulk-upload-cron`

//Role
export const API_ROLE = `${BASE}/client-role/list`

export const API_ADD_ROLE = `${BASE}/client-role/add-or-edit`

export const API_DELETE_ROLE = `${BASE}/client-role/remove`

export const API_ROLE_PERMISSION_LIST = `${BASE}/client-role-permission/list`

export const API_ROLE_PERMISSION_SAVE = `${BASE}/client-role-permission/add`

export const API_MASTER_ROLE = `${BASE}/role/master-list`

// asset
export const API_ASSET_LIST = `${BASE}/asset/list`

export const API_ADD_ASSET = `${BASE}/asset/add`

export const API_UPDATE_ASSET = `${BASE}/asset/edit`

export const API_DELETE_ASSET = `${BASE}/asset/remove`

export const API_ASSET_DETAILS = `${BASE}/asset/details`

export const API_ASSET_CUSTODIAN_LIST = `${BASE}/asset/custodian-list`

export const API_ASSET_BULK_UPLOAD = `${BASE}/asset/bulk-add`

export const API_ASSET_UPLOAD_LIST = `${BASE}/asset/non-sync-list`

export const API_ASSET_BULK_UPLOAD_CRON = `${BASE}/asset/bulk-upload-cron`

export const API_MASTER_ASSET_TYPE = `${BASE}/asset-type/master-list`

// clients
export const API_CLIENTS_LIST = `${BASE}/client/list`

export const API_ADD_CLIENTS = `${BASE}/client/add`

export const API_UPDATE_CLIENTS = `${BASE}/client/edit`

export const API_DELETE_CLIENTS = `${BASE}/client/remove`

export const API_CLIENTS_DETAILS = `${BASE}/client/details`

export const API_CLIENTS_MASTERS = `${BASE}/client/master-list`

// role management

export const API_ROLE_MANAGEMENT_LIST = `${BASE}/role/list`

export const API_ADD_ROLE_MANAGEMENT = `${BASE}/role/add-or-edit`

export const API_DELETE_ROLE_MANAGEMENT = `${BASE}/role/remove`

export const API_ROLE_MANAGEMENT_PERMISSION_LIST = `${BASE}/role-permission/list`

export const API_ROLE_MANAGEMENT_PERMISSION_SAVE = `${BASE}/role-permission/add`

export const API_MASTER_ROLE_MANAGEMENT = `${BASE}/role/all-list`

// users
export const API_USERS_LIST = `${BASE}/user/list`

export const API_ADD_USERS = `${BASE}/user/add`

export const API_UPDATE_USERS = `${BASE}/user/edit`

export const API_DELETE_USERS = `${BASE}/user/remove`

export const API_USERS_DETAILS = `${BASE}/user/details`

export const API_USERS_MASTERS = `${BASE}/user/master-list`

export const API_USERS_PERMISSIONS_SAVE = `${BASE}/user/permission-save`

// client group
export const API_CLIENT_GROUP_LIST = `${BASE}/client-group/list`

export const API_ADD_CLIENT_GROUP = `${BASE}/client-group/add`

export const API_EDIT_CLIENT_GROUP = `${BASE}/client-group/edit`

export const API_DELETE_CLIENT_GROUP = `${BASE}/client-group/remove`

export const API_CLIENT_GROUP_DETAILS = `${BASE}/client-group/details`

export const API_CLIENT_GROUP_MASTER_LIST = `${BASE}/client-group/list`

// branch
export const API_CLIENT_BRANCH_LIST = `${BASE}/branch/list`

export const API_CLIENT_BRANCH_UPDATE = `${BASE}/branch/add-or-edit`

export const API_CLIENT_BRANCH_DETAILS = `${BASE}/branch/details`

// setting
export const API_SETTING_LIST = `${BASE}/setting/list`

export const API_ADD_SETTING = `${BASE}/setting/add-or-edit`

export const API_DELETE_SETTING = `${BASE}/setting/remove`

//additional fields
export const API_ADDITIONAL_FIELDS_DETAILS = `${BASE}/additional-fields/details`

export const API_ADDITIONAL_FIELDS_ADD = `${BASE}/additional-fields/add-or-edit`

// Theme
export const API_GET_THEME_LIST = `${BASE}/theme/list`

export const API_ADD_THEME = `${BASE}/theme/add-or-edit`

export const API_DELETE_THEME = `${BASE}/theme/remove`

// profile
export const API_USER_PROFILE = `${BASE}/employee/profile`

export const API_USER_PROFILE_UPLOAD = `${BASE}/employee/profile-image-upload`

export const API_USER_PROFILE_UPLOAD_REMOVE = `${BASE}/employee/profile-image-remove`

// roster
export const API_CONFIGURE_SHIFT = `${BASE}/roster-shift/add-or-edit`

export const API_CONFIGURE_SHIFT_LIST = `${BASE}/roster-shift/list`

export const API_CONFIGURE_SHIFT_REMOVE = `${BASE}/roster-shift/remove`

export const API_MANAGE_GROUPS_LIST = `${BASE}/roster-group/list`

export const API_ADD_MANAGE_GROUPS = `${BASE}/roster-group/add`

export const API_EDIT_MANAGE_GROUPS = `${BASE}/roster-group/edit`

export const API_DELETE_MANAGE_GROUPS = `${BASE}/roster-group/remove`

export const API_MANAGE_GROUPS_DETAILS = `${BASE}/roster-group/details`

export const API_ASSET_TYPE_WISE_LIST = `${BASE}/roster-group/type-wise-asset-list`

export const API_EMPLOYEE_TYPE_WISE_LIST = `${BASE}/roster-group/type-wise-employee-list`

export const API_ROSTER_GROUP_MASTER_LIST = `${BASE}/roster-group/master-list`

export const API_ROSTER_GROUP_EMPLOYEE_LIST = `${BASE}/roster-group/employee-list`

export const API_EMPLOYEE_SHIFT_SCHEDULE_LIST = `${BASE}/employee-shift-schedule/list`

export const API_ADD_EMPLOYEE_SHIFT_SCHEDULE = `${BASE}/employee-shift-schedule/add-or-edit`

export const API_DELETE_EMPLOYEE_SHIFT_SCHEDULE = `${BASE}/employee-shift-schedule/remove`

export const API_EMPLOYEE_SHIFT_SCHEDULE_DETAILS = `${BASE}/employee-shift-schedule/details`

export const API_EMPLOYEE_SHIFT_SCHEDULE_MASTER_LIST = `${BASE}/employee-shift-schedule/employee-shift-master-list`

//tickets

export const API_GET_TICKET_COUNTS = `${BASE}/tickets/get-count`

export const API_TICKETS_LIST = `${BASE}/ticket/list`

export const API_GET_TICKETS_BY_STATUS = `${BASE}/ticket/status-wise-ticket-summary`

export const API_LAST_SIX_MONTH_TICKETS = `${BASE}/ticket/last-six-months-ticket-summary`

export const API_GET_TICKETS_BY_ASSET_TYPES = `${BASE}/ticket/asset-type-wise-ticket-summary`

export const API_GET_ASSET_DETAILS_BY_NAME = `${BASE}/asset/details`

export const API_TICKET_ADD = `${BASE}/ticket/add`

export const API_TICKET_DETAIL = `${BASE}/ticket/details`

export const API_GET_MASTER_ASSET_NAME = `${BASE}/roster-group/type-wise-asset-list`

export const API_CHANGE_TICKET_STATUS = `${BASE}/ticket/add-or-update-history`

export const API_TICKET_DELETE = `${BASE}/ticket/remove`

export const API_TICKET_VENDOR_CONTACT_UPDATE = `${BASE}/ticket/vendor-edit`

export const API_TICKET_ADD_UPDATE = `${BASE}/ticket/add-or-update-history`

export const API_DELETE_TICKET_UPDATE = `${BASE}/ticket/remove-history`

export const API_DELETE_TICKET_UPDATE_FILE = `${BASE}/ticket/remove-history-media`

// documents
export const API_DOCUMENTS_LIST = `${BASE}/documents/list`