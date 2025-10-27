import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_ADD_SETTING, API_SETTING_LIST, API_DELETE_SETTING } from "../../common/api/constants";

export const actionSettingList = createAsyncThunk('setting/actionSettingList', async (params) => {
    try {
        const response = await axiosApi.post(API_SETTING_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddSetting = createAsyncThunk('setting/actionAddSetting', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_SETTING, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteSetting = createAsyncThunk('setting/actionDeleteSetting', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_SETTING, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const settingStore = createSlice({
    name: 'setting',
    initialState: {
        settingList: null,
        addSetting: null,
        deleteSetting: null
    },

    reducers: {
        resetSettingListResponse: (state) => {
            state.settingList = null
        },
        resetAddSettingResponse: (state) => {
            state.addSetting = null
        },
        resetDeleteSettingResponse: (state) => {
            state.deleteSetting = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionSettingList.fulfilled, (state, action) => {
                state.settingList = action.payload
            })
            .addCase(actionAddSetting.fulfilled, (state, action) => {
                state.addSetting = action.payload
            })
            .addCase(actionDeleteSetting.fulfilled, (state, action) => {
                state.deleteSetting = action.payload
            })
    }
})

export const {
    resetSettingListResponse,
    resetAddSettingResponse,
    resetDeleteSettingResponse,
} =
    settingStore.actions

export default settingStore.reducer
