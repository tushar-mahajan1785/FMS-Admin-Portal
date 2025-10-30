import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";
import { API_CONFIGURE_SHIFT } from "../../common/api/constants";

export const actionConfigureShift = createAsyncThunk('roster/actionConfigureShift', async (params) => {
    try {
        const response = await axiosApi.post(API_CONFIGURE_SHIFT, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const rosterStore = createSlice({
    name: 'roster',
    initialState: {
        configureShift: null
    },

    reducers: {
        resetConfigureShiftResponse: (state) => {
            state.configureShift = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionConfigureShift.fulfilled, (state, action) => {
                state.configureShift = action.payload
            })
    }
})

export const {
    resetConfigureShiftResponse
} =
    rosterStore.actions

export default rosterStore.reducer
