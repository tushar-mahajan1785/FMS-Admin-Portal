import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_ADDITIONAL_FIELDS_ADD, API_ADDITIONAL_FIELDS_DETAILS, API_USER_PROFILE, API_USER_PROFILE_UPLOAD, API_USER_PROFILE_UPLOAD_REMOVE } from "../../common/api/constants";

export const actionAdditionalFieldsDetails = createAsyncThunk('common/actionAdditionalFieldsDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_ADDITIONAL_FIELDS_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAdditionalFieldsAdd = createAsyncThunk('common/actionAdditionalFieldsAdd', async (params) => {
    try {
        const response = await axiosApi.post(API_ADDITIONAL_FIELDS_ADD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetUserProfileDetails = createAsyncThunk('common/actionGetUserProfileDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_USER_PROFILE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionUserProfileUpload = createAsyncThunk('common/actionUserProfileUpload', async (params) => {
    try {
        const response = await axiosApi.post(API_USER_PROFILE_UPLOAD, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionUserProfileUploadReset = createAsyncThunk('common/actionUserProfileUploadReset', async (params) => {
    try {
        const response = await axiosApi.post(API_USER_PROFILE_UPLOAD_REMOVE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const CommonStore = createSlice({
    name: 'common',
    initialState: {
        additionalFieldsDetails: null,
        additionalFieldsAdd: null,
        getUserProfileDetails: null,
        userProfileUpload: null,
        userProfileUploadReset: null
    },

    reducers: {
        resetAdditionalFieldsDetailsResponse: (state) => {
            state.additionalFieldsDetails = null
        },
        resetAdditionalFieldsAddResponse: (state) => {
            state.additionalFieldsAdd = null
        },
        resetGetUserProfileDetailsResponse: (state) => {
            state.getUserProfileDetails = null
        },
        resetUserProfileUploadResponse: (state) => {
            state.userProfileUpload = null
        },
        resetUserProfileUploadResetResponse: (state) => {
            state.userProfileUploadReset = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionAdditionalFieldsDetails.fulfilled, (state, action) => {
                state.additionalFieldsDetails = action.payload
            })
            .addCase(actionAdditionalFieldsAdd.fulfilled, (state, action) => {
                state.additionalFieldsAdd = action.payload
            })
            .addCase(actionGetUserProfileDetails.fulfilled, (state, action) => {
                state.getUserProfileDetails = action.payload
            })
            .addCase(actionUserProfileUpload.fulfilled, (state, action) => {
                state.userProfileUpload = action.payload
            })
            .addCase(actionUserProfileUploadReset.fulfilled, (state, action) => {
                state.userProfileUploadReset = action.payload
            })
    }
})

export const {
    resetAdditionalFieldsDetailsResponse,
    resetAdditionalFieldsAddResponse,
    resetGetUserProfileDetailsResponse,
    resetUserProfileUploadResponse,
    resetUserProfileUploadResetResponse
} =
    CommonStore.actions

export default CommonStore.reducer
