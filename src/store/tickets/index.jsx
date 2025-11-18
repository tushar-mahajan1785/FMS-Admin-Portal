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
    API_TICKET_DELETE,
    API_TICKET_VENDOR_CONTACT_UPDATE,
    API_TICKET_ADD_UPDATE,
    API_DELETE_TICKET_UPDATE,
    API_DELETE_TICKET_UPDATE_FILE,
    API_GET_TICKET_MASTER
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

export const actionTicketVendorContactsUpdate = createAsyncThunk('asset/actionTicketVendorContactsUpdate', async (params) => {
    try {
        const response = await axiosApi.post(API_TICKET_VENDOR_CONTACT_UPDATE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTicketAddUpdate = createAsyncThunk('asset/actionTicketAddUpdate', async (params) => {
    try {
        const response = await axiosApi.post(API_TICKET_ADD_UPDATE, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTicketUpdateDelete = createAsyncThunk('asset/actionTicketUpdateDelete', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_TICKET_UPDATE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionTicketUpdateFileDelete = createAsyncThunk('asset/actionTicketUpdateFileDelete', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_TICKET_UPDATE_FILE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionGetTicketMaster = createAsyncThunk('asset/actionGetTicketMaster', async (params) => {
    try {
        const response = await axiosApi.post(API_GET_TICKET_MASTER, params)

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
        ticketDelete: null,
        ticketVendorContactsUpdate: null,
        ticketAddUpdate: null,
        ticketUpdateDelete: null,
        ticketUpdateFileDelete: null,
        getTicketMaster: null
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
        resetTicketVendorContactsUpdateResponse: (state) => {
            state.ticketVendorContactsUpdate = null
        },
        resetTicketAddUpdateResponse: (state) => {
            state.ticketAddUpdate = null
        },
        resetTicketUpdateDeleteResponse: (state) => {
            state.ticketUpdateDelete = null
        },
        resetTicketUpdateFileDeleteResponse: (state) => {
            state.ticketUpdateFileDelete = null
        },
        resetGetTicketMasterResponse: (state) => {
            state.getTicketMaster = null
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
            .addCase(actionTicketVendorContactsUpdate.fulfilled, (state, action) => {
                state.ticketVendorContactsUpdate = action.payload
            })
            .addCase(actionTicketAddUpdate.fulfilled, (state, action) => {
                state.ticketAddUpdate = action.payload
            })
            .addCase(actionTicketUpdateDelete.fulfilled, (state, action) => {
                state.ticketUpdateDelete = action.payload
            })
            .addCase(actionTicketUpdateFileDelete.fulfilled, (state, action) => {
                state.ticketUpdateFileDelete = action.payload
            })
            .addCase(actionGetTicketMaster.fulfilled, (state, action) => {
                state.getTicketMaster = action.payload
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
    resetTicketDeleteResponse,
    resetTicketVendorContactsUpdateResponse,
    resetTicketAddUpdateResponse,
    resetTicketUpdateDeleteResponse,
    resetTicketUpdateFileDeleteResponse,
    resetGetTicketMasterResponse
} =
    ticketsStore.actions

export default ticketsStore.reducer
