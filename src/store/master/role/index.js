
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../../common/api";
import { getErrorResponse } from "../../../utils";
import {
    API_ROLE_LIST,
    API_ROLE,
    API_ADD_ROLE,
    API_DELETE_ROLE,
    API_ROLE_PERMISSION_LIST,
    API_ROLE_PERMISSION_SAVE,
    API_MASTER_ROLE
} from "../../../common/api/constants";


export const defaultRolesConfig = {
    branch_id: '',
    role_id: '',
    role_name: '',
    module_id: '',
    module_name: '',
    is_modified: ''
}

export const actionRolesPermissionData = createAsyncThunk('role/actionRolesPermissionData', params => {
    return params
})

export const actionRole = createAsyncThunk('role/actionRole', async params => {
    try {
        const response = await axiosApi.post(API_ROLE, params)
        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddRole = createAsyncThunk('role/actionAddRole', async params => {
    try {
        const response = await axiosApi.post(API_ADD_ROLE, params)
        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionGetRoleList = createAsyncThunk('role/actionGetRoleList', async (params) => {
    try {
        const response = await axiosApi.post(API_ROLE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionGetMasterRole = createAsyncThunk('role/actionGetMasterRole', async params => {
    try {
        const response = await axiosApi.post(API_MASTER_ROLE, params)
        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})


export const actionDeleteRole = createAsyncThunk('role/actionDeleteRole', async params => {
    try {
        const response = await axiosApi.post(API_DELETE_ROLE, params)
        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionRolePermissionList = createAsyncThunk('role/actionRolePermissionList', async params => {
    try {
        const response = await axiosApi.post(API_ROLE_PERMISSION_LIST, params)
        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionRolePermissionSave = createAsyncThunk('role/actionRolePermissionSave', async params => {
    try {
        const response = await axiosApi.post(API_ROLE_PERMISSION_SAVE, params)
        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const masterRoleStore = createSlice({
    name: 'role',
    initialState: {
        roleList: null,
        addRole: null,
        getRoleList: null,
        getMasterRole: null,
        deleteRole: null,
        rolePermissionList: null,
        rolePermissionSave: null,
        rolesPermissionData: null,
    },
    reducers: {
        resetRolesResponse: state => {
            state.roleList = null
        },
        resetAddRoleResponse: state => {
            state.addRole = null
        },
        resetGetRoleListResponse: (state) => {
            state.getRoleList = null
        },
        resetDeleteRolesResponse: state => {
            state.deleteRole = null
        },
        resetRolePermissionList: state => {
            state.rolePermissionList = null
        },
        resetRolePermissionSave: state => {
            state.rolePermissionSave = null
        },
        resetRolePermissionData: state => {
            state.rolesPermissionData = null
        },
        resetGetMasterRolesResponse: state => {
            state.getMasterRole = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionRole.fulfilled, (state, action) => {
                state.roleList = action.payload
            })
            .addCase(actionAddRole.fulfilled, (state, action) => {
                state.addRole = action.payload
            })
            .addCase(actionGetRoleList.fulfilled, (state, action) => {
                state.getRoleList = action.payload
            })
            .addCase(actionDeleteRole.fulfilled, (state, action) => {
                state.deleteRole = action.payload
            })
            .addCase(actionRolePermissionList.fulfilled, (state, action) => {
                state.rolePermissionList = action.payload
            })
            .addCase(actionRolePermissionSave.fulfilled, (state, action) => {
                state.rolePermissionSave = action.payload
            })
            .addCase(actionRolesPermissionData.fulfilled, (state, action) => {
                state.rolesPermissionData = action.payload
            })
            .addCase(actionGetMasterRole.fulfilled, (state, action) => {
                state.getMasterRole = action.payload
            })
    }
})

export const {
    resetRolesResponse,
    resetAddRoleResponse,
    resetGetRoleListResponse,
    resetDeleteRolesResponse,
    resetRolePermissionList,
    resetRolePermissionSave,
    resetRolePermissionData,
    resetGetMasterRolesResponse
} = masterRoleStore.actions

export default masterRoleStore.reducer

