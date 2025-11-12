import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_DOCUMENTS_CATEGORIES_LIST, API_ADD_DOCUMENTS_CATEGORIES, API_DELETE_DOCUMENTS_CATEGORIES } from "../../common/api/constants";

export const actionDocumentCategoriesList = createAsyncThunk('documentCategories/actionDocumentCategoriesList', async (params) => {
    try {
        const response = await axiosApi.post(API_DOCUMENTS_CATEGORIES_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddDocumentCategories = createAsyncThunk('documentCategories/actionAddDocumentCategories', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_DOCUMENTS_CATEGORIES, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteDocumentCategories = createAsyncThunk('documentCategories/actionDeleteDocumentCategories', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_DOCUMENTS_CATEGORIES, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const documentCategoriesStore = createSlice({
    name: 'documentCategories',
    initialState: {
        documentCategoriesList: null,
        addDocumentCategories: null,
        deleteDocumentCategories: null
    },

    reducers: {
        resetDocumentCategoriesListResponse: (state) => {
            state.documentCategoriesList = null
        },
        resetAddDocumentCategoriesResponse: (state) => {
            state.addDocumentCategories = null
        },
        resetDeleteDocumentCategoriesResponse: (state) => {
            state.deleteDocumentCategories = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionDocumentCategoriesList.fulfilled, (state, action) => {
                state.documentCategoriesList = action.payload
            })
            .addCase(actionAddDocumentCategories.fulfilled, (state, action) => {
                state.addDocumentCategories = action.payload
            })
            .addCase(actionDeleteDocumentCategories.fulfilled, (state, action) => {
                state.deleteDocumentCategories = action.payload
            })
    }
})

export const {
    resetDocumentCategoriesListResponse,
    resetAddDocumentCategoriesResponse,
    resetDeleteDocumentCategoriesResponse
} =
    documentCategoriesStore.actions

export default documentCategoriesStore.reducer
