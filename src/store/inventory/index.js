import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import {
    API_INVENTORY_LIST, API_INVENTORY_ADD, API_INVENTORY_DETAIL, API_INVENTORY_DELETE,
    API_INVENTORY_CATEGORY, API_INVENTORY_CATEGORY_ADD, API_INVENTORY_CATEGORY_DETAILS, API_INVENTORY_CATEGORY_DELETE, API_GET_UNIT_LIST, API_GET_INVENTORY_TRANSACTION_HISTORY,
    API_INVENTORY_RESTOCK_SAVE, API_INVENTORY_CONSUMPTION_SAVE
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
        const response = await axiosApi.post(API_INVENTORY_ADD, params, MULTIPART_HEADER)

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
export const actionGetUnitMaster = createAsyncThunk('inventory/actionGetUnitMaster', async () => {
    try {
        const response = await axiosApi.get(API_GET_UNIT_LIST)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetInventoryTransactionHistory = createAsyncThunk('inventory/actionGetInventoryTransactionHistory', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_INVENTORY_TRANSACTION_HISTORY, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionInventoryRestockSave = createAsyncThunk('inventory/actionInventoryRestockSave', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_RESTOCK_SAVE, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionInventoryConsumptionSave = createAsyncThunk('inventory/actionInventoryConsumptionSave', async (params) => {
    try {
        const response = await axiosApi.post(API_INVENTORY_CONSUMPTION_SAVE, params)

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
        getUnitMaster: null,
        getInventoryTransactionHistory: null,
        inventoryRestockSave: null,
        inventoryConsumptionSave: null
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
        resetGetUnitMasterResponse: (state) => {
            state.getUnitMaster = null
        },
        resetGetInventoryTransactionHistoryResponse: (state) => {
            state.getInventoryTransactionHistory = null
        },
        resetInventoryRestockSaveResponse: (state) => {
            state.inventoryRestockSave = null
        },
        resetInventoryConsumptionSaveResponse: (state) => {
            state.inventoryConsumptionSave = null
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
            .addCase(actionGetUnitMaster.fulfilled, (state, action) => {
                state.getUnitMaster = action.payload
            })
            .addCase(actionGetInventoryTransactionHistory.fulfilled, (state, action) => {
                state.getInventoryTransactionHistory = action.payload
            })
            .addCase(actionInventoryRestockSave.fulfilled, (state, action) => {
                state.inventoryRestockSave = action.payload
            })
            .addCase(actionInventoryConsumptionSave.fulfilled, (state, action) => {
                state.inventoryConsumptionSave = action.payload
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
    resetDeleteInventoryCategoryResponse,
    resetGetUnitMasterResponse,
    resetGetInventoryTransactionHistoryResponse,
    resetInventoryRestockSaveResponse,
    resetInventoryConsumptionSaveResponse
} =
    inventoryStore.actions

export default inventoryStore.reducer
