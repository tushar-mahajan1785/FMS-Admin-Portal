import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_DOCUMENTS_LIST } from "../../common/api/constants";

export const actionDocumentList = createAsyncThunk('documents/actionDocumentList', async (params) => {
    try {
        const response = await axiosApi.post(API_DOCUMENTS_LIST,params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const documentStore = createSlice({
    name: 'documents',
    initialState: {
        documentList: null
    },

    reducers: {
        resetDocumentListResponse: (state) => {
            state.documentList = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionDocumentList.fulfilled, (state, action) => {
                state.documentList = action.payload
            })
    }
})

export const {
    resetDocumentListResponse
} =
    documentStore.actions

export default documentStore.reducer
