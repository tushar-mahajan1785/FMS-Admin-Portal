import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorResponse } from "../../../utils";
import { API_TECHNICIAN_DASHBOARD_DETAILS } from "../../../common/api/constants";
import { axiosApi } from "../../../common/api";

export const actionTechnicianDashboardDetails = createAsyncThunk('technicianDashboard/actionTechnicianDashboardDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_DASHBOARD_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const technicianDashboardStore = createSlice({
    name: 'technicianDashboard',
    initialState: {
        technicianDashboardDetails: null,
    },

    reducers: {
        resetTechnicianDashboardDetailsResponse: (state) => {
            state.technicianDashboardDetails = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionTechnicianDashboardDetails.fulfilled, (state, action) => {
                state.technicianDashboardDetails = action.payload
            })

    }
})

export const {
    resetTechnicianDashboardDetailsResponse
} =
    technicianDashboardStore.actions

export default technicianDashboardStore.reducer
