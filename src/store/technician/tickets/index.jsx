import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorResponse } from "../../../utils";
import { API_TECHNICIAN_TICKET_DETAILS, API_TECHNICIAN_TICKET_LIST } from "../../../common/api/constants";
import { axiosApi } from "../../../common/api";

export const actionTechnicianTicketList = createAsyncThunk('technicianTicket/actionTechnicianTicketList', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_TICKET_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianTicketDetails = createAsyncThunk('technicianTicket/actionTechnicianTicketDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_TICKET_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const technicianTicketsStore = createSlice({
    name: 'technicianTicket',
    initialState: {
        technicianTicketList: null,
        technicianTicketDetails: null
    },

    reducers: {
        resetTechnicianTicketListResponse: (state) => {
            state.technicianTicketList = null
        },
        resetTechnicianTicketDetailsResponse: (state) => {
            state.technicianTicketDetails = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionTechnicianTicketList.fulfilled, (state, action) => {
                state.technicianTicketList = action.payload
            })
            .addCase(actionTechnicianTicketDetails.fulfilled, (state, action) => {
                state.technicianTicketDetails = action.payload
            })

    }
})

export const {
    resetTechnicianTicketListResponse,
    resetTechnicianTicketDetailsResponse
} =
    technicianTicketsStore.actions

export default technicianTicketsStore.reducer
