import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import {
    API_INVENTORY_LIST, API_INVENTORY_ADD, API_INVENTORY_DETAIL, API_INVENTORY_DELETE,
    API_INVENTORY_CATEGORY, API_INVENTORY_CATEGORY_ADD, API_INVENTORY_CATEGORY_DETAILS, API_INVENTORY_CATEGORY_DELETE
} from "../../common/api/constants";

export const actionInventoryList = createAsyncThunk('inventory/actionInventoryList', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddInventory = createAsyncThunk('inventory/actionAddInventory', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_ADD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetInventoryDetails = createAsyncThunk('inventory/actionGetInventoryDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_DETAIL, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteInventory = createAsyncThunk('inventory/actionDeleteInventory', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_DELETE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionInventoryCategoryList = createAsyncThunk('inventory/actionInventoryCategoryList', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_CATEGORY, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionAddInventoryCategory = createAsyncThunk('inventory/actionAddInventoryCategory', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_CATEGORY_ADD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetInventoryCategoryDetails = createAsyncThunk('inventory/actionGetInventoryCategoryDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_CATEGORY_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteInventoryCategory = createAsyncThunk('inventory/actionDeleteInventoryCategory', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_CATEGORY_DELETE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const inventoryStore = createSlice({
    name: 'inventory',
    initialState: {
        inventoryList: null,
        addInventory: null,
        getInventoryDetails: null,
        deleteInventory: null,
        inventoryCategoryList: null,
        addInventoryCategory: null,
        getInventoryCategoryDetails: null,
        deleteInventoryCategory: null,
    },

    reducers: {
        resetInventoryListResponse: (state) => {
            state.inventoryList = null
        },
        resetAddInventoryResponse: (state) => {
            state.addInventory = null
        },
        resetGetInventoryDetailsResponse: (state) => {
            state.getInventoryDetails = null
        },
        resetDeleteInventoryResponse: (state) => {
            state.deleteInventory = null
        },
        resetInventoryCategoryListResponse: (state) => {
            state.inventoryCategoryList = null
        },
        resetAddInventoryCategoryResponse: (state) => {
            state.addInventoryCategory = null
        },
        resetGetInventoryCategoryDetailsResponse: (state) => {
            state.getInventoryCategoryDetails = null
        },
        resetDeleteInventoryCategoryResponse: (state) => {
            state.deleteInventoryCategory = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionInventoryList.fulfilled, (state, action) => {
                state.inventoryList = action.payload
            })
            .addCase(actionAddInventory.fulfilled, (state, action) => {
                state.addInventory = action.payload
            })
            .addCase(actionGetInventoryDetails.fulfilled, (state, action) => {
                state.getInventoryDetails = action.payload
            })
            .addCase(actionDeleteInventory.fulfilled, (state, action) => {
                state.deleteInventory = action.payload
            })
            .addCase(actionInventoryCategoryList.fulfilled, (state, action) => {
                state.inventoryCategoryList = action.payload
            })
            .addCase(actionAddInventoryCategory.fulfilled, (state, action) => {
                state.addInventoryCategory = action.payload
            })
            .addCase(actionGetInventoryCategoryDetails.fulfilled, (state, action) => {
                state.getInventoryCategoryDetails = action.payload
            })
            .addCase(actionDeleteInventoryCategory.fulfilled, (state, action) => {
                state.deleteInventoryCategory = action.payload
            })
    }
})

export const {
    resetInventoryListResponse,
    resetAddInventoryResponse,
    resetGetInventoryDetailsResponse,
    resetDeleteInventoryResponse,
    resetInventoryCategoryListResponse,
    resetAddInventoryCategoryResponse,
    resetGetInventoryCategoryDetailsResponse,
    resetDeleteInventoryCategoryResponse
} =
    inventoryStore.actions

export default inventoryStore.reducer
