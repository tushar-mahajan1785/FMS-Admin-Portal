import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorResponse } from "../../../utils";
import { API_TECHNICIAN_ASSET_DETAILS, API_TECHNICIAN_ASSET_TYPE_LIST, API_TECHNICIAN_ASSET_LIST } from "../../../common/api/constants";
import { axiosApi } from "../../../common/api";

export const actionTechnicianAssetList = createAsyncThunk('technicianAsset/actionTechnicianAssetList', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_ASSET_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianAssetTypeList = createAsyncThunk('technicianAsset/actionTechnicianAssetTypeList', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_ASSET_TYPE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianAssetDetails = createAsyncThunk('technicianAsset/actionTechnicianAssetDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_ASSET_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const technicianAssetStore = createSlice({
    name: 'technicianAsset',
    initialState: {
        technicianAssetList: null,
        technicianAssetTypeList: null,
        technicianAssetDetails: null
    },

    reducers: {
        resetTechnicianAssetListResponse: (state) => {
            state.technicianAssetList = null
        },
        resetTechnicianAssetTypeListResponse: (state) => {
            state.technicianAssetTypeList = null
        },
        resetTechnicianAssetDetailsResponse: (state) => {
            state.technicianAssetDetails = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionTechnicianAssetList.fulfilled, (state, action) => {
                state.technicianAssetList = action.payload
            })
            .addCase(actionTechnicianAssetTypeList.fulfilled, (state, action) => {
                state.technicianAssetTypeList = action.payload
            })
            .addCase(actionTechnicianAssetDetails.fulfilled, (state, action) => {
                state.technicianAssetDetails = action.payload
            })

    }
})

export const {
    resetTechnicianAssetListResponse,
    resetTechnicianAssetTypeListResponse,
    resetTechnicianAssetDetailsResponse
} =
    technicianAssetStore.actions

export default technicianAssetStore.reducer
