import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_INVENTORY_LIST, API_INVENTORY_ADD, API_INVENTORY_DETAIL, API_INVENTORY_DELETE } from "../../common/api/constants";

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

export const inventoryStore = createSlice({
    name: 'inventory',
    initialState: {
        inventoryList: null,
        addInventory: null,
        getInventoryDetails: null,
        deleteInventory: null
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
        }
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
    }
})

export const {
    resetInventoryListResponse,
    resetAddInventoryResponse,
    resetGetInventoryDetailsResponse,
    resetDeleteInventoryResponse,
} =
    inventoryStore.actions

export default inventoryStore.reducer
