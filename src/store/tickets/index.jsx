import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api";
import { getErrorResponse } from "../../utils";
import {
    API_GET_TICKET_COUNTS,
    API_TICKETS_LIST,
    API_GET_TICKETS_BY_STATUS,
    API_LAST_SIX_MONTH_TICKETS,
    API_GET_TICKETS_BY_ASSET_TYPES,
    API_TICKET_ADD,
    API_TICKET_DETAIL,
    API_CHANGE_TICKET_STATUS,
    API_TICKET_DELETE
} from "../../common/api/constants";

export const actionGetTicketCounts = createAsyncThunk('tickets/actionGetTicketCounts', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_TICKET_COUNTS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionTicketsList = createAsyncThunk('tickets/actionTicketsList', async (params) => {
    try {
        const response = await axiosApi.post(API_TICKETS_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionGetTicketsByStatus = createAsyncThunk('tickets/actionGetTicketsByStatus', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_TICKETS_BY_STATUS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionGetLastSixMonthsTickets = createAsyncThunk('tickets/actionGetLastSixMonthsTickets', async (params) => {
    try {
        const response = await axiosApi.post(API_LAST_SIX_MONTH_TICKETS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionGetTicketsByAssetTypes = createAsyncThunk('tickets/actionGetTicketsByAssetTypes', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_TICKETS_BY_ASSET_TYPES, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionAddTicket = createAsyncThunk('tickets/actionAddTicket', async (params) => {
    try {
        const response = await axiosApi.post(API_TICKET_ADD, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetTicketDetails = createAsyncThunk('tickets/actionGetTicketDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_TICKET_DETAIL, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionChangeTicketStatus = createAsyncThunk('tickets/actionChangeTicketStatus', async (params) => {
    try {
        const response = await axiosApi.post(API_CHANGE_TICKET_STATUS, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTicketDelete = createAsyncThunk('tickets/actionTicketDelete', async (params) => {
    try {
        const response = await axiosApi.post(API_TICKET_DELETE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const ticketsStore = createSlice({
    name: 'tickets',
    initialState: {
        getTicketCounts: null,
        ticketsList: null,
        getTicketsByStatus: null,
        getLastSixMonthsTickets: null,
        getTicketsByAssetTypes: null,
        addTicket: null,
        getTicketDetails: null,
        changeTicketStatus: null,
        ticketDelete: null
    },

    reducers: {
        resetGetTicketCountsResponse: (state) => {
            state.getTicketCounts = null
        },
        resetTicketsListResponse: (state) => {
            state.ticketsList = null
        },
        resetGetTicketsByStatusResponse: (state) => {
            state.getTicketsByStatus = null
        },
        resetGetLastSixMonthsTicketsResponse: (state) => {
            state.getLastSixMonthsTickets = null
        },
        resetGetTicketsByAssetTypesResponse: (state) => {
            state.getTicketsByAssetTypes = null
        },
        resetAddTicketResponse: (state) => {
            state.addTicket = null
        },
        resetGetTicketDetailsResponse: (state) => {
            state.getTicketDetails = null
        },
        resetChangeTicketStatusResponse: (state) => {
            state.changeTicketStatus = null
        },
        resetTicketDeleteResponse: (state) => {
            state.ticketDelete = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionGetTicketCounts.fulfilled, (state, action) => {
                state.getTicketCounts = action.payload
            })
            .addCase(actionTicketsList.fulfilled, (state, action) => {
                state.ticketsList = action.payload
            })
            .addCase(actionGetTicketsByStatus.fulfilled, (state, action) => {
                state.getTicketsByStatus = action.payload
            })
            .addCase(actionGetLastSixMonthsTickets.fulfilled, (state, action) => {
                state.getLastSixMonthsTickets = action.payload
            })
            .addCase(actionGetTicketsByAssetTypes.fulfilled, (state, action) => {
                state.getTicketsByAssetTypes = action.payload
            })
            .addCase(actionAddTicket.fulfilled, (state, action) => {
                state.addTicket = action.payload
            })
            .addCase(actionGetTicketDetails.fulfilled, (state, action) => {
                state.getTicketDetails = action.payload
            })
            .addCase(actionChangeTicketStatus.fulfilled, (state, action) => {
                state.changeTicketStatus = action.payload
            })
            .addCase(actionTicketDelete.fulfilled, (state, action) => {
                state.ticketDelete = action.payload
            })
    }
})

export const {
    resetGetTicketCountsResponse,
    resetTicketsListResponse,
    resetGetTicketsByStatusResponse,
    resetGetLastSixMonthsTicketsResponse,
    resetGetTicketsByAssetTypesResponse,
    resetAddTicketResponse,
    resetGetTicketDetailsResponse,
    resetChangeTicketStatusResponse,
    resetTicketDeleteResponse
} =
    ticketsStore.actions

export default ticketsStore.reducer
