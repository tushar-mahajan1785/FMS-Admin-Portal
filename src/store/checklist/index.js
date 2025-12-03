import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";
import {
    API_CHECKLIST_ASSET_TYPE_LIST,
    API_CHECKLIST_GROUP_LIST,
    API_CHECKLIST_GROUP_ADD,
    API_CHECKLIST_GROUP_ASSET_LIST,
    API_CHECKLIST_GROUP_DETAILS,
    API_CHECKLIST_GROUP_HISTORY_ADD,
    API_CHECKLIST_GROUP_ASSET_APPROVE,
    API_CHECKLIST_ALL_GROUP_DETAILS
} from "../../common/api/constants";

export const actionChecklistAssetTypeList = createAsyncThunk('checklist/actionChecklistAssetTypeList', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_ASSET_TYPE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionChecklistGroupList = createAsyncThunk('checklist/actionChecklistGroupList', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_GROUP_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionChecklistGroupAdd = createAsyncThunk('checklist/actionChecklistGroupAdd', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_GROUP_ADD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionChecklistGroupAssetList = createAsyncThunk('checklist/actionChecklistGroupAssetList', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_GROUP_ASSET_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionChecklistGroupDetails = createAsyncThunk('checklist/actionChecklistGroupDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_GROUP_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionChecklistGroupHistoryAdd = createAsyncThunk('checklist/actionChecklistGroupHistoryAdd', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_GROUP_HISTORY_ADD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionChecklistGroupAssetApprove = createAsyncThunk('checklist/actionChecklistGroupAssetApprove', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_GROUP_ASSET_APPROVE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionChecklistGroupAllGroupDetails = createAsyncThunk('checklist/actionChecklistGroupAllGroupDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_CHECKLIST_ALL_GROUP_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})



export const checklistStore = createSlice({
    name: 'checklist',
    initialState: {
        checklistAssetTypeList: null,
        checklistGroupList: null,
        checklistGroupAdd: null,
        checklistGroupAssetList: null,
        checklistGroupDetails: null,
        checklistGroupHistoryAdd: null,
        checklistGroupAssetApprove: null,
        checklistGroupAllGroupDetails: null
    },

    reducers: {
        resetChecklistAssetTypeListResponse: (state) => {
            state.checklistAssetTypeList = null
        },
        resetChecklistGroupListResponse: (state) => {
            state.checklistGroupList = null
        },
        resetChecklistGroupAddResponse: (state) => {
            state.checklistGroupAdd = null
        },
        resetChecklistGroupAssetListResponse: (state) => {
            state.checklistGroupAssetList = null
        },
        resetChecklistGroupDetailsResponse: (state) => {
            state.checklistGroupDetails = null
        },
        resetChecklistGroupHistoryAddResponse: (state) => {
            state.checklistGroupHistoryAdd = null
        },
        resetChecklistGroupAssetApproveResponse: (state) => {
            state.checklistGroupAssetApprove = null
        },
        resetChecklistGroupAllGroupDetailsResponse: (state) => {
            state.checklistGroupAllGroupDetails = null
        },

    },
    extraReducers: builder => {
        builder
            .addCase(actionChecklistAssetTypeList.fulfilled, (state, action) => {
                state.checklistAssetTypeList = action.payload
            })
            .addCase(actionChecklistGroupList.fulfilled, (state, action) => {
                state.checklistGroupList = action.payload
            })
            .addCase(actionChecklistGroupAdd.fulfilled, (state, action) => {
                state.checklistGroupAdd = action.payload
            })
            .addCase(actionChecklistGroupAssetList.fulfilled, (state, action) => {
                state.checklistGroupAssetList = action.payload
            })
            .addCase(actionChecklistGroupDetails.fulfilled, (state, action) => {
                state.checklistGroupDetails = action.payload
            })
            .addCase(actionChecklistGroupHistoryAdd.fulfilled, (state, action) => {
                state.checklistGroupHistoryAdd = action.payload
            })
            .addCase(actionChecklistGroupAssetApprove.fulfilled, (state, action) => {
                state.checklistGroupAssetApprove = action.payload
            })
            .addCase(actionChecklistGroupAllGroupDetails.fulfilled, (state, action) => {
                state.checklistGroupAllGroupDetails = action.payload
            })

    }
})

export const {
    resetChecklistAssetTypeListResponse,
    resetChecklistGroupListResponse,
    resetChecklistGroupAddResponse,
    resetChecklistGroupAssetListResponse,
    resetChecklistGroupDetailsResponse,
    resetChecklistGroupHistoryAddResponse,
    resetChecklistGroupAssetApproveResponse,
    resetChecklistGroupAllGroupDetailsResponse
} =
    checklistStore.actions

export default checklistStore.reducer
