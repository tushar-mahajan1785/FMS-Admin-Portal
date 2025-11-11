import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_DOCUMENTS_LIST, API_ADD_DOCUMENTS_GROUP, API_DELETE_DOCUMENTS_GROUP, API_DOCUMENTS_GROUP_DETAILS } from "../../common/api/constants";

export const actionDocumentList = createAsyncThunk('documents/actionDocumentList', async (params) => {
    try {
        const response = await axiosApi.post(API_DOCUMENTS_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddDocumentGroup = createAsyncThunk('documents/actionAddDocumentGroup', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_DOCUMENTS_GROUP, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteDocumentGroup = createAsyncThunk('documents/actionDeleteDocumentGroup', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_DOCUMENTS_GROUP, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDocumentGroupDetails = createAsyncThunk('documents/actionDocumentGroupDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_DOCUMENTS_GROUP_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const documentStore = createSlice({
    name: 'documents',
    initialState: {
        documentList: null,
        addDocumentGroup: null,
        deleteDocumentGroup: null,
        documentGroupDetails: null
    },

    reducers: {
        resetDocumentListResponse: (state) => {
            state.documentList = null
        },
        resetAddDocumentGroupResponse: (state) => {
            state.addDocumentGroup = null
        },
        resetDeleteDocumentGroupResponse: (state) => {
            state.deleteDocumentGroup = null
        },
        resetDocumentGroupDetailsResponse: (state) => {
            state.documentGroupDetails = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionDocumentList.fulfilled, (state, action) => {
                state.documentList = action.payload
            })
            .addCase(actionAddDocumentGroup.fulfilled, (state, action) => {
                state.addDocumentGroup = action.payload
            })
            .addCase(actionDeleteDocumentGroup.fulfilled, (state, action) => {
                state.deleteDocumentGroup = action.payload
            })
            .addCase(actionDocumentGroupDetails.fulfilled, (state, action) => {
                state.documentGroupDetails = action.payload
            })
    }
})

export const {
    resetDocumentListResponse,
    resetAddDocumentGroupResponse,
    resetDeleteDocumentGroupResponse,
    resetDocumentGroupDetailsResponse
} =
    documentStore.actions

export default documentStore.reducer
