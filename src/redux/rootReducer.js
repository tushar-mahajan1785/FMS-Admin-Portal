import loginStore from '../store/login';
import dashboardStore from '../store/dashboard';
import employeeStore from '../store/employee';
import forgetPasswordStore from '../store/forget-password';
import masterRoleTypeStore from '../store/master/role-type';
import masterRoleStore from '../store/master/role';
import vendorStore from '../store/vendor';
import AssetStore from '../store/asset';
import UsersStore from '../store/users';
import branchStore from '../store/branch';
import settingStore from '../store/setting';
import CommonStore from '../store/common';
import branchThemeStore from '../store/branch-theme';
import rosterStore from '../store/roster';
import ticketsStore from '../store/tickets';
import documentStore from '../store/documents';
import inventoryStore from '../store/inventory';
import pmActivityStore from '../store/pm-activity';
import documentCategoriesStore from '../store/document-categories';

const rootReducer = {
    loginStore,
    dashboardStore,
    employeeStore,
    forgetPasswordStore,
    masterRoleTypeStore,
    masterRoleStore,
    vendorStore,
    AssetStore,
    UsersStore,
    branchStore,
    settingStore,
    CommonStore,
    branchThemeStore,
    rosterStore,
    ticketsStore,
    documentStore,
    inventoryStore,
    pmActivityStore,
    documentCategoriesStore
};

export default rootReducer;
