import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import { getErrorResponse } from 'src/utils'
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_VERIFY_EMAIL, API_RESET_PASSWORD, API_CHANGE_PASSWORD } from "../../common/api/constants";

export const actionVerifyEmail = createAsyncThunk('login/actionVerifyEmail', async (params) => {
    try {
        const response = await axiosApi.post(API_VERIFY_EMAIL, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionPasswordReset = createAsyncThunk('login/actionPasswordReset', async (params) => {
    try {
        const response = await axiosApi.post(API_RESET_PASSWORD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionChangePassword = createAsyncThunk('login/actionChangePassword', async (params) => {
    try {
        const response = await axiosApi.post(API_CHANGE_PASSWORD, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const forgetPasswordStore = createSlice({
    name: 'forgetPassword',
    initialState: {
        verifyEmail: null,
        passwordReset: null,
        changePassword: null
    },

    reducers: {
        resetVerifyEmailResponse: (state) => {
            state.verifyEmail = null
        },
        resetPasswordResetResponse: (state) => {
            state.passwordReset = null
        },
        resetChangePasswordResponse: (state) => {
            state.changePassword = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionVerifyEmail.fulfilled, (state, action) => {
                state.verifyEmail = action.payload
            })
            .addCase(actionPasswordReset.fulfilled, (state, action) => {
                state.passwordReset = action.payload
            })
            .addCase(actionChangePassword.fulfilled, (state, action) => {
                state.changePassword = action.payload
            })
    }
})

export const {
    resetVerifyEmailResponse,
    resetPasswordResetResponse,
    resetChangePasswordResponse
} =
    forgetPasswordStore.actions

export default forgetPasswordStore.reducer
