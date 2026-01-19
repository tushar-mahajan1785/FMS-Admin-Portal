import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorResponse } from "../../../utils";
import {
    API_TECHNICIAN_CHECKLIST_ASSET_TYPE_LIST,
    API_TECHNICIAN_CHECKLIST_GROUP_LIST,
    API_TECHNICIAN_CHECKLIST_GROUP_ASSET_LIST,
    API_TECHNICIAN_CHECKLIST_ASSET_TIMES, API_TECHNICIAN_ASSET_CHECKLIST_DETAILS,
    API_TECHNICIAN_ASSET_CHECKLIST_UPDATE,
    API_TECHNICIAN_ASSET_VALIDATE_QR_CODE,
    API_TECHNICIAN_GET_CURRENT_FILLED_ASSETS
} from "../../../common/api/constants";
import { axiosApi } from "../../../common/api";

export const actionTechnicianChecklistAssetTypeList = createAsyncThunk('technicianChecklist/actionTechnicianChecklistAssetTypeList', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_CHECKLIST_ASSET_TYPE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTechnicianChecklistGroupList = createAsyncThunk('technicianChecklist/actionTechnicianChecklistGroupList', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_CHECKLIST_GROUP_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTechnicianChecklistGroupAssetList = createAsyncThunk('technicianChecklist/actionTechnicianChecklistGroupAssetList', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_CHECKLIST_GROUP_ASSET_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTechnicianGetChecklistAssetTimes = createAsyncThunk('technicianChecklist/actionTechnicianGetChecklistAssetTimes', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_CHECKLIST_ASSET_TIMES, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTechnicianAssetChecklistDetails = createAsyncThunk('technicianChecklist/actionTechnicianAssetChecklistDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_ASSET_CHECKLIST_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTechnicianAssetChecklistUpdate = createAsyncThunk('technicianChecklist/actionTechnicianAssetChecklistUpdate', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_ASSET_CHECKLIST_UPDATE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianAssetValidateQRCode = createAsyncThunk('technicianChecklist/actionTechnicianAssetValidateQRCode', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_ASSET_VALIDATE_QR_CODE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianGetCurrentFilledAssets = createAsyncThunk('technicianChecklist/actionTechnicianGetCurrentFilledAssets', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_GET_CURRENT_FILLED_ASSETS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})


export const technicianChecklistStore = createSlice({
    name: 'technicianChecklist',
    initialState: {
        technicianChecklistAssetTypeList: null,
        technicianChecklistGroupList: null,
        technicianChecklistGroupAssetList: null,
        technicianGetChecklistAssetTimes: null,
        technicianAssetChecklistDetails: null,
        technicianAssetChecklistUpdate: null,
        technicianAssetValidateQRCode: null,
        technicianGetCurrentFilledAssets: null
    },

    reducers: {
        resetTechnicianChecklistAssetTypeListResponse: (state) => {
            state.technicianChecklistAssetTypeList = null
        },
        resetTechnicianChecklistGroupListResponse: (state) => {
            state.technicianChecklistGroupList = null
        },
        resetTechnicianChecklistGroupAssetListResponse: (state) => {
            state.technicianChecklistGroupAssetList = null
        },
        resetTechnicianGetChecklistAssetTimesResponse: (state) => {
            state.technicianGetChecklistAssetTimes = null
        },
        resetTechnicianAssetChecklistDetailsResponse: (state) => {
            state.technicianAssetChecklistDetails = null
        },
        resetTechnicianAssetChecklistUpdateResponse: (state) => {
            state.technicianAssetChecklistUpdate = null
        },
        resetTechnicianAssetValidateQRCodeResponse: (state) => {
            state.technicianAssetValidateQRCode = null
        },
        resetTechnicianGetCurrentFilledAssetsResponse: (state) => {
            state.technicianGetCurrentFilledAssets = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionTechnicianChecklistAssetTypeList.fulfilled, (state, action) => {
                state.technicianChecklistAssetTypeList = action.payload
            })
            .addCase(actionTechnicianChecklistGroupList.fulfilled, (state, action) => {
                state.technicianChecklistGroupList = action.payload
            })
            .addCase(actionTechnicianChecklistGroupAssetList.fulfilled, (state, action) => {
                state.technicianChecklistGroupAssetList = action.payload
            })
            .addCase(actionTechnicianGetChecklistAssetTimes.fulfilled, (state, action) => {
                state.technicianGetChecklistAssetTimes = action.payload
            })
            .addCase(actionTechnicianAssetChecklistDetails.fulfilled, (state, action) => {
                state.technicianAssetChecklistDetails = action.payload
            })
            .addCase(actionTechnicianAssetChecklistUpdate.fulfilled, (state, action) => {
                state.technicianAssetChecklistUpdate = action.payload
            })
            .addCase(actionTechnicianAssetValidateQRCode.fulfilled, (state, action) => {
                state.technicianAssetValidateQRCode = action.payload
            })
            .addCase(actionTechnicianGetCurrentFilledAssets.fulfilled, (state, action) => {
                state.technicianGetCurrentFilledAssets = action.payload
            })

    }
})

export const {
    resetTechnicianChecklistAssetTypeListResponse,
    resetTechnicianChecklistGroupListResponse,
    resetTechnicianChecklistGroupAssetListResponse,
    resetTechnicianGetChecklistAssetTimesResponse,
    resetTechnicianAssetChecklistDetailsResponse,
    resetTechnicianAssetChecklistUpdateResponse,
    resetTechnicianChecklistGroupAssetApproveResponse,
    resetTechnicianChecklistGroupAllGroupDetailsResponse,
    resetTechnicianAssetValidateQRCodeResponse,
    resetTechnicianGetCurrentFilledAssetsResponse
} =
    technicianChecklistStore.actions

export default technicianChecklistStore.reducer
