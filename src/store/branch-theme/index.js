import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_GET_THEME_LIST, API_ADD_THEME, API_DELETE_THEME } from "../../common/api/constants";
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";

export const actionBranchThemeList = createAsyncThunk('branchTheme/actionBranchThemeList', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_THEME_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionBranchThemeAdd = createAsyncThunk('branchTheme/actionBranchThemeAdd', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_THEME, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionBranchThemeDelete = createAsyncThunk('branchTheme/actionBranchThemeDelete', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_THEME, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const branchThemeStore = createSlice({
    name: 'branchTheme',
    initialState: {
        branchThemeList: null,
        branchThemeAdd: null,
        branchThemeDelete: null,
    },

    reducers: {
        resetBranchThemeListResponse: (state) => {
            state.branchThemeList = null
        },
        resetBranchThemeAddResponse: (state) => {
            state.branchThemeAdd = null
        },
        resetBranchThemeDeleteResponse: (state) => {
            state.branchThemeDelete = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionBranchThemeList.fulfilled, (state, action) => {
                state.branchThemeList = action.payload
            })
            .addCase(actionBranchThemeAdd.fulfilled, (state, action) => {
                state.branchThemeAdd = action.payload
            })
            .addCase(actionBranchThemeDelete.fulfilled, (state, action) => {
                state.branchThemeDelete = action.payload
            })
    }
})

export const {
    resetBranchThemeListResponse,
    resetBranchThemeAddResponse,
    resetBranchThemeDeleteResponse
} =
    branchThemeStore.actions

export default branchThemeStore.reducer
