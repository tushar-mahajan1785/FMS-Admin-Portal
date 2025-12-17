import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorResponse } from "../../../utils";
import { API_TECHNICIAN_TICKET_ADD, API_TECHNICIAN_TICKET_DETAILS, API_TECHNICIAN_TICKET_LIST, API_TECHNICIAN_TICKET_TYPE_WISE_ASSET, API_TECHNICIAN_TICKET_CUSTODIAN_LIST, API_TECHNICIAN_TICKET_ASSET_DETAILS } from "../../../common/api/constants";
import { axiosApi, MULTIPART_HEADER } from "../../../common/api";

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

export const actionTechnicianTicketTypeWiseAsset = createAsyncThunk('tickets/actionTechnicianTicketTypeWiseAsset', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_TICKET_TYPE_WISE_ASSET, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianTicketCustodianList = createAsyncThunk('tickets/actionTechnicianTicketCustodianList', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_TICKET_CUSTODIAN_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianTicketAssetDetails = createAsyncThunk('tickets/actionTechnicianTicketAssetDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_TICKET_ASSET_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTechnicianAddTicket = createAsyncThunk('tickets/actionTechnicianAddTicket', async (params) => {
    try {
        const response = await axiosApi.post(API_TECHNICIAN_TICKET_ADD, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})


export const technicianTicketsStore = createSlice({
    name: 'technicianTicket',
    initialState: {
        technicianTicketList: null,
        technicianTicketDetails: null,
        technicianTicketTypeWiseAsset: null,
        technicianTicketCustodianList: null,
        technicianTicketAssetDetails: null,
        technicianAddTicket: null,
    },

    reducers: {
        resetTechnicianTicketListResponse: (state) => {
            state.technicianTicketList = null
        },
        resetTechnicianTicketDetailsResponse: (state) => {
            state.technicianTicketDetails = null
        },
        resetTechnicianTicketTypeWiseAssetResponse: (state) => {
            state.technicianTicketTypeWiseAsset = null
        },
        resetTechnicianTicketCustodianListResponse: (state) => {
            state.technicianTicketCustodianList = null
        },
        resetTechnicianTicketAssetDetailsResponse: (state) => {
            state.technicianTicketAssetDetails = null
        },
        resetTechnicianAddTicketResponse: (state) => {
            state.technicianAddTicket = null
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
            .addCase(actionTechnicianTicketTypeWiseAsset.fulfilled, (state, action) => {
                state.technicianTicketTypeWiseAsset = action.payload
            })
            .addCase(actionTechnicianTicketCustodianList.fulfilled, (state, action) => {
                state.technicianTicketCustodianList = action.payload
            })
            .addCase(actionTechnicianTicketAssetDetails.fulfilled, (state, action) => {
                state.technicianTicketAssetDetails = action.payload
            })
            .addCase(actionTechnicianAddTicket.fulfilled, (state, action) => {
                state.technicianAddTicket = action.payload
            })

    }
})

export const {
    resetTechnicianTicketListResponse,
    resetTechnicianTicketDetailsResponse,
    resetTechnicianTicketTypeWiseAssetResponse,
    resetTechnicianTicketCustodianListResponse,
    resetTechnicianTicketAssetDetailsResponse,
    resetTechnicianAddTicketResponse
} =
    technicianTicketsStore.actions

export default technicianTicketsStore.reducer
