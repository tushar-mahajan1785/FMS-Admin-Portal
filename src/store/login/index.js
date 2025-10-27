import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import { getErrorResponse } from 'src/utils'
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_LOGOUT } from "../../common/api/constants";

export const actionUserLogout = createAsyncThunk('login/actionUserLogout', async () => {
    try {
        const response = await axiosApi.get(API_LOGOUT)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const loginStore = createSlice({
    name: 'login',
    initialState: {
        userLogout: null
    },

    reducers: {
        resetUserLogoutResponse: (state) => {
            state.userLogout = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionUserLogout.fulfilled, (state, action) => {
                state.userLogout = action.payload
            })
    }
})

export const {
    resetUserLogoutResponse
} =
    loginStore.actions

export default loginStore.reducer
