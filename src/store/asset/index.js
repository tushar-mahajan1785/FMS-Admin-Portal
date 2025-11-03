import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import {
    API_ADD_ASSET,
    API_ASSET_DETAILS,
    API_ASSET_LIST,
    API_DELETE_ASSET,
    API_UPDATE_ASSET,
    API_ASSET_CUSTODIAN_LIST,
    API_ASSET_BULK_UPLOAD,
    API_ASSET_UPLOAD_LIST,
    API_ASSET_BULK_UPLOAD_CRON,
    API_MASTER_ASSET_TYPE,
    API_GET_MASTER_ASSET_NAME,
    API_GET_ASSET_DETAILS_BY_NAME
} from "../../common/api/constants";

export const actionAssetList = createAsyncThunk('asset/actionAssetList', async (params) => {
    try {
        const response = await axiosApi.post(API_ASSET_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddAsset = createAsyncThunk('asset/actionAddAsset', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_ASSET, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUpdateAsset = createAsyncThunk('asset/actionUpdateAsset', async (params) => {
    try {
        const response = await axiosApi.post(API_UPDATE_ASSET, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteAsset = createAsyncThunk('asset/actionDeleteAsset', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_ASSET, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAssetDetails = createAsyncThunk('asset/actionAssetDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_ASSET_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAssetCustodianList = createAsyncThunk('asset/actionAssetCustodianList', async (params) => {
    try {
        const response = await axiosApi.post(API_ASSET_CUSTODIAN_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionAssetBulkUpload = createAsyncThunk('asset/actionAssetBulkUpload', async (params) => {
    try {
        const response = await axiosApi.post(API_ASSET_BULK_UPLOAD, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionAssetUploadList = createAsyncThunk('asset/actionAssetUploadList', async (params) => {
    try {
        const response = await axiosApi.post(API_ASSET_UPLOAD_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionAssetBulkUploadCron = createAsyncThunk('asset/actionAssetBulkUploadCron', async () => {
    try {
        const response = await axiosApi.get(API_ASSET_BULK_UPLOAD_CRON)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionMasterAssetType = createAsyncThunk('asset/actionMasterAssetType', async (params) => {
    try {
        const response = await axiosApi.post(API_MASTER_ASSET_TYPE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetAssetDetailsByName = createAsyncThunk('asset/actionGetAssetDetailsByName', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_ASSET_DETAILS_BY_NAME, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetMasterAssetName = createAsyncThunk('asset/actionGetMasterAssetName', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_MASTER_ASSET_NAME, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const AssetStore = createSlice({
    name: 'asset',
    initialState: {
        assetList: null,
        addAsset: null,
        updateAsset: null,
        deleteAsset: null,
        assetDetails: null,
        assetCustodianList: null,
        assetBulkUpload: null,
        assetUploadList: null,
        assetBulkUploadCron: null,
        masterAssetType: null,
        getAssetDetailsByName: null,
        getMasterAssetName: null
    },

    reducers: {
        resetAssetListResponse: (state) => {
            state.assetList = null
        },
        resetAddAssetResponse: (state) => {
            state.addAsset = null
        },
        resetUpdateAssetResponse: (state) => {
            state.updateAsset = null
        },
        resetDeleteAssetResponse: (state) => {
            state.deleteAsset = null
        },
        resetAssetDetailsResponse: (state) => {
            state.assetDetails = null
        },
        resetAssetCustodianListResponse: (state) => {
            state.assetCustodianList = null
        },
        resetAssetBulkUploadResponse: (state) => {
            state.assetBulkUpload = null
        },
        resetAssetUploadListResponse: (state) => {
            state.assetUploadList = null
        },
        resetAssetBulkUploadCronResponse: (state) => {
            state.assetBulkUploadCron = null
        },
        resetMasterAssetTypeResponse: (state) => {
            state.masterAssetType = null
        },
        resetGetAssetDetailsByNameResponse: (state) => {
            state.getAssetDetailsByName = null
        },
        resetGetMasterAssetNameResponse: (state) => {
            state.getMasterAssetName = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionAssetList.fulfilled, (state, action) => {
                state.assetList = action.payload
            })
            .addCase(actionAddAsset.fulfilled, (state, action) => {
                state.addAsset = action.payload
            })
            .addCase(actionUpdateAsset.fulfilled, (state, action) => {
                state.updateAsset = action.payload
            })
            .addCase(actionDeleteAsset.fulfilled, (state, action) => {
                state.deleteAsset = action.payload
            })
            .addCase(actionAssetDetails.fulfilled, (state, action) => {
                state.assetDetails = action.payload
            })
            .addCase(actionAssetCustodianList.fulfilled, (state, action) => {
                state.assetCustodianList = action.payload
            })
            .addCase(actionAssetBulkUpload.fulfilled, (state, action) => {
                state.assetBulkUpload = action.payload
            })
            .addCase(actionAssetUploadList.fulfilled, (state, action) => {
                state.assetUploadList = action.payload
            })
            .addCase(actionAssetBulkUploadCron.fulfilled, (state, action) => {
                state.assetBulkUploadCron = action.payload
            })
            .addCase(actionMasterAssetType.fulfilled, (state, action) => {
                state.masterAssetType = action.payload
            })
            .addCase(actionGetAssetDetailsByName.fulfilled, (state, action) => {
                state.getAssetDetailsByName = action.payload
            })
            .addCase(actionGetMasterAssetName.fulfilled, (state, action) => {
                state.getMasterAssetName = action.payload
            })
    }
})

export const {
    resetAssetListResponse,
    resetAddAssetResponse,
    resetUpdateAssetResponse,
    resetDeleteAssetResponse,
    resetAssetDetailsResponse,
    resetAssetCustodianListResponse,
    resetAssetBulkUploadResponse,
    resetAssetUploadListResponse,
    resetAssetBulkUploadCronResponse,
    resetMasterAssetTypeResponse,
    resetGetAssetDetailsByNameResponse,
    resetGetMasterAssetNameResponse
} =
    AssetStore.actions

export default AssetStore.reducer
