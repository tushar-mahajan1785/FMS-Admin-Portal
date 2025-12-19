import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_VENDOR_LIST, API_ADD_VENDOR, API_EDIT_VENDOR, API_DELETE_VENDOR, API_VENDOR_DETAILS, API_MASTER_COUNTRY_CODE_LIST, API_VENDOR_MASTER, API_VENDOR_BULK_UPLOAD, API_VENDOR_UPLOAD_LIST, API_VENDOR_BULK_UPLOAD_CRON } from "../../common/api/constants";

export const actionVendorList = createAsyncThunk('vendor/actionVendorList', async (params) => {
    try {
        const response = await axiosApi.post(API_VENDOR_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddVendor = createAsyncThunk('vendor/actionAddVendor', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_VENDOR, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEditVendor = createAsyncThunk('vendor/actionEditVendor', async (params) => {
    try {
        const response = await axiosApi.post(API_EDIT_VENDOR, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteVendor = createAsyncThunk('vendor/actionDeleteVendor', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_VENDOR, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionVendorDetails = createAsyncThunk('vendor/actionVendorDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_VENDOR_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionMasterCountryCodeList = createAsyncThunk('vendor/actionMasterCountryCodeList', async () => {
    try {
        const response = await axiosApi.get(API_MASTER_COUNTRY_CODE_LIST)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionVendorMasterList = createAsyncThunk('vendor/actionVendorMasterList', async (params) => {
    try {
        const response = await axiosApi.post(API_VENDOR_MASTER, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionVendorBulkUpload = createAsyncThunk('vendor/actionVendorBulkUpload', async (params) => {
    try {
        const response = await axiosApi.post(API_VENDOR_BULK_UPLOAD, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionVendorUploadList = createAsyncThunk('vendor/actionVendorUploadList', async (params) => {
    try {
        const response = await axiosApi.post(API_VENDOR_UPLOAD_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionVendorBulkUploadCron = createAsyncThunk('vendor/actionVendorBulkUploadCron', async (params) => {
    try {
        const response = await axiosApi.post(API_VENDOR_BULK_UPLOAD_CRON, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const vendorStore = createSlice({
    name: 'vendor',
    initialState: {
        vendorList: null,
        addVendor: null,
        editVendor: null,
        deleteVendor: null,
        vendorDetails: null,
        masterCountryCodeList: null,
        vendorMasterList: null,
        vendorBulkUpload: null,
        vendorUploadList: null,
        vendorBulkUploadCron: null
    },

    reducers: {
        resetVendorListResponse: (state) => {
            state.vendorList = null
        },
        resetAddVendorResponse: (state) => {
            state.addVendor = null
        },
        resetEditVendorResponse: (state) => {
            state.editVendor = null
        },
        resetDeleteVendorResponse: (state) => {
            state.deleteVendor = null
        },
        resetVendorDetailsResponse: (state) => {
            state.vendorDetails = null
        },
        resetMasterCountryCodeListResponse: (state) => {
            state.masterCountryCodeList = null
        },
        resetVendorMasterListResponse: (state) => {
            state.vendorMasterList = null
        },
        resetVendorBulkUploadResponse: (state) => {
            state.vendorBulkUpload = null
        },
        resetVendorUploadListResponse: (state) => {
            state.vendorUploadList = null
        },
        resetVendorBulkUploadCronResponse: (state) => {
            state.vendorBulkUploadCron = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionVendorList.fulfilled, (state, action) => {
                state.vendorList = action.payload
            })
            .addCase(actionAddVendor.fulfilled, (state, action) => {
                state.addVendor = action.payload
            })
            .addCase(actionEditVendor.fulfilled, (state, action) => {
                state.editVendor = action.payload
            })
            .addCase(actionDeleteVendor.fulfilled, (state, action) => {
                state.deleteVendor = action.payload
            })
            .addCase(actionVendorDetails.fulfilled, (state, action) => {
                state.vendorDetails = action.payload
            })
            .addCase(actionMasterCountryCodeList.fulfilled, (state, action) => {
                state.masterCountryCodeList = action.payload
            })
            .addCase(actionVendorMasterList.fulfilled, (state, action) => {
                state.vendorMasterList = action.payload
            })
            .addCase(actionVendorBulkUpload.fulfilled, (state, action) => {
                state.vendorBulkUpload = action.payload
            })
            .addCase(actionVendorUploadList.fulfilled, (state, action) => {
                state.vendorUploadList = action.payload
            })
            .addCase(actionVendorBulkUploadCron.fulfilled, (state, action) => {
                state.vendorBulkUploadCron = action.payload
            })
    }
})

export const {
    resetVendorListResponse,
    resetAddVendorResponse,
    resetEditVendorResponse,
    resetDeleteVendorResponse,
    resetVendorDetailsResponse,
    resetMasterCountryCodeListResponse,
    resetVendorMasterListResponse,
    resetVendorBulkUploadResponse,
    resetVendorUploadListResponse,
    resetVendorBulkUploadCronResponse
} =
    vendorStore.actions

export default vendorStore.reducer
