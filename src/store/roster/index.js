import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";
import { 
    API_CONFIGURE_SHIFT,
    API_MANAGE_GROUPS_LIST,
    API_ADD_MANAGE_GROUPS,
    API_EDIT_MANAGE_GROUPS,
    API_DELETE_MANAGE_GROUPS,
    API_MANAGE_GROUPS_DETAILS
 } from "../../common/api/constants";

export const actionConfigureShift = createAsyncThunk('roster/actionConfigureShift', async (params) => {
    try {
        const response = await axiosApi.post(API_CONFIGURE_SHIFT, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionManageGroupsList = createAsyncThunk('roster/actionManageGroupsList', async (params) => {
    try {
        const response = await axiosApi.post(API_MANAGE_GROUPS_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddManageGroups = createAsyncThunk('roster/actionAddManageGroups', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_MANAGE_GROUPS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEditManageGroups = createAsyncThunk('roster/actionEditManageGroups', async (params) => {
    try {
        const response = await axiosApi.post(API_EDIT_MANAGE_GROUPS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteManageGroups = createAsyncThunk('roster/actionDeleteManageGroups', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_MANAGE_GROUPS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionManageGroupsDetails = createAsyncThunk('roster/actionManageGroupsDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_MANAGE_GROUPS_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const rosterStore = createSlice({
    name: 'roster',
    initialState: {
        configureShift: null,
        manageGroupsList: null,
        addManageGroups: null,
        editManageGroups: null,
        deleteManageGroups: null,
        manageGroupsDetails: null
    },

    reducers: {
        resetConfigureShiftResponse: (state) => {
            state.configureShift = null
        },
        resetManageGroupsListResponse: (state) => {
            state.manageGroupsList = null
        },
        resetAddManageGroupsResponse: (state) => {
            state.addManageGroups = null
        },
        resetEditManageGroupsResponse: (state) => {
            state.editManageGroups = null
        },
        resetDeleteManageGroupsResponse: (state) => {
            state.deleteManageGroups = null
        },
        resetManageGroupsDetailsResponse: (state) => {
            state.manageGroupsDetails = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionConfigureShift.fulfilled, (state, action) => {
                state.configureShift = action.payload
            })
            .addCase(actionManageGroupsList.fulfilled, (state, action) => {
                state.manageGroupsList = action.payload
            })
            .addCase(actionAddManageGroups.fulfilled, (state, action) => {
                state.addManageGroups = action.payload
            })
            .addCase(actionEditManageGroups.fulfilled, (state, action) => {
                state.editManageGroups = action.payload
            })
            .addCase(actionDeleteManageGroups.fulfilled, (state, action) => {
                state.deleteManageGroups = action.payload
            })
            .addCase(actionManageGroupsDetails.fulfilled, (state, action) => {
                state.manageGroupsDetails = action.payload
            })
    }
})

export const {
    resetConfigureShiftResponse,
    resetManageGroupsListResponse,
    resetAddManageGroupsResponse,
    resetEditManageGroupsResponse,
    resetDeleteManageGroupsResponse,
    resetManageGroupsDetailsResponse
} =
    rosterStore.actions

export default rosterStore.reducer
