import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import { getErrorResponse } from 'src/utils'
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_GET_DASHBOARD_COUNT } from "../../common/api/constants";

export const actionGetDashboardCount = createAsyncThunk('login/actionGetDashboardCount', async () => {
    try {
        const response = await axiosApi.get(API_GET_DASHBOARD_COUNT)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const dashboardStore = createSlice({
    name: 'dashboard',
    initialState: {
        getDashboardCount: null
    },

    reducers: {
        resetGetDashboardCountResponse: (state) => {
            state.getDashboardCount = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionGetDashboardCount.fulfilled, (state, action) => {
                state.getDashboardCount = action.payload
            })
    }
})

export const {
    resetGetDashboardCountResponse
} =
    dashboardStore.actions

export default dashboardStore.reducer
