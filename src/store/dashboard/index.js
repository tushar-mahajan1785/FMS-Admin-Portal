import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_GET_DASHBOARD_DETAILS } from "../../common/api/constants";

export const actionGetDashboardDetails = createAsyncThunk('dashboard/actionGetDashboardDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_DASHBOARD_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const dashboardStore = createSlice({
    name: 'dashboard',
    initialState: {
        getDashboardDetails: null
    },

    reducers: {
        resetGetDashboardDetailsResponse: (state) => {
            state.getDashboardDetails = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionGetDashboardDetails.fulfilled, (state, action) => {
                state.getDashboardDetails = action.payload
            })
    }
})

export const {
    resetGetDashboardDetailsResponse
} =
    dashboardStore.actions

export default dashboardStore.reducer
