import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../../common/api";
import { getErrorResponse } from "../../../utils";
import { API_ROLE_TYPE_LIST, API_ROLE_TYPE_ADD, API_ROLE_TYPE_DELETE } from "../../../common/api/constants";

export const actionGetRoleTypeList = createAsyncThunk('roleType/actionGetRoleTypeList', async (params) => {
    try {
        const response = await axiosApi.post(API_ROLE_TYPE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionRoleTypeList = createAsyncThunk('roleType/actionRoleTypeList', async (params) => {
    try {
        const response = await axiosApi.post(API_ROLE_TYPE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddRoleType = createAsyncThunk('roleType/actionAddRoleType', async (params) => {
    try {
        const response = await axiosApi.post(API_ROLE_TYPE_ADD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteRoleType = createAsyncThunk('roleType/actionDeleteRoleType', async (params) => {
    try {
        const response = await axiosApi.post(API_ROLE_TYPE_DELETE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const masterRoleTypeStore = createSlice({
    name: 'roleType',
    initialState: {
        getRoleTypeList: null,
        roleTypeList: null,
        addRoleType: null,
        deleteRoleType: null,
    },

    reducers: {
        resetGetRoleTypeListResponse: (state) => {
            state.getRoleTypeList = null
        },
        resetRoleTypeListResponse: (state) => {
            state.roleTypeList = null
        },
        resetAddRoleTypeResponse: (state) => {
            state.addRoleType = null
        },
        resetDeleteRoleTypeResponse: (state) => {
            state.deleteRoleType = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionGetRoleTypeList.fulfilled, (state, action) => {
                state.getRoleTypeList = action.payload
            })
            .addCase(actionRoleTypeList.fulfilled, (state, action) => {
                state.roleTypeList = action.payload
            })
            .addCase(actionAddRoleType.fulfilled, (state, action) => {
                state.addRoleType = action.payload
            })
            .addCase(actionDeleteRoleType.fulfilled, (state, action) => {
                state.deleteRoleType = action.payload
            })
    }
})

export const {
    resetGetRoleTypeListResponse,
    resetRoleTypeListResponse,
    resetAddRoleTypeResponse,
    resetDeleteRoleTypeResponse
} =
    masterRoleTypeStore.actions

export default masterRoleTypeStore.reducer
