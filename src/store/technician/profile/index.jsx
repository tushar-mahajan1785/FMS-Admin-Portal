import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorResponse } from "../../../utils";
import { API_TECHNICIAN_EMPLOYEE_PROFILE, API_TECHNICIAN_EMPLOYEE_CHANGE_PASSWORD, API_TECHNICIAN_EMPLOYEE_LOGOUT } from "../../../common/api/constants";
import { axiosApi } from "../../../common/api";

export const actionTechnicianEmployeeProfile = createAsyncThunk('technicianProfile/actionTechnicianEmployeeProfile', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_EMPLOYEE_PROFILE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTechnicianEmployeeChangePassword = createAsyncThunk('technicianProfile/actionTechnicianEmployeeChangePassword', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_EMPLOYEE_CHANGE_PASSWORD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTechnicianEmployeeLogout = createAsyncThunk('technicianProfile/actionTechnicianEmployeeLogout', async () => {
    try {
        const response = await axiosApi.get(API_TECHNICIAN_EMPLOYEE_LOGOUT)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const technicianProfileStore = createSlice({
    name: 'technicianProfile',
    initialState: {
        technicianEmployeeProfile: null,
        technicianEmployeeChangePassword: null,
        technicianEmployeeLogout: null
    },

    reducers: {
        resetTechnicianEmployeeProfileResponse: (state) => {
            state.technicianEmployeeProfile = null
        },
        resetTechnicianEmployeeChangePasswordResponse: (state) => {
            state.technicianEmployeeChangePassword = null
        },
        resetTechnicianEmployeeLogoutResponse: (state) => {
            state.technicianEmployeeLogout = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionTechnicianEmployeeProfile.fulfilled, (state, action) => {
                state.technicianEmployeeProfile = action.payload
            })
            .addCase(actionTechnicianEmployeeChangePassword.fulfilled, (state, action) => {
                state.technicianEmployeeChangePassword = action.payload
            })
            .addCase(actionTechnicianEmployeeLogout.fulfilled, (state, action) => {
                state.technicianEmployeeLogout = action.payload
            })

    }
})

export const {
    resetTechnicianEmployeeProfileResponse,
    resetTechnicianEmployeeChangePasswordResponse,
    resetTechnicianEmployeeLogoutResponse
} =
    technicianProfileStore.actions

export default technicianProfileStore.reducer
