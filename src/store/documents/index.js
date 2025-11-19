import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_DOCUMENTS_LIST, API_ADD_DOCUMENTS_GROUP, API_DELETE_DOCUMENTS_GROUP, API_DOCUMENTS_GROUP_DETAILS, API_DOCUMENTS_CATEGORIES_DETAILS, API_UPLOAD_DOCUMENTS_CATEGORIES, API_UPLOAD_DOCUMENTS_CATEGORIES_LIST, API_UPLOAD_DOCUMENTS_CATEGORIES_DELETE, API_UPLOAD_DOCUMENTS_CATEGORIES_ARCHIVE,API_UPLOAD_DOCUMENTS_CATEGORIES_RESTORE } from "../../common/api/constants";

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

export const actionDocumentCategoriesDetails = createAsyncThunk('documents/actionDocumentCategoriesDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_DOCUMENTS_CATEGORIES_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUploadDocumentCategories = createAsyncThunk('documents/actionUploadDocumentCategories', async (params) => {
    try {
        const response = await axiosApi.post(API_UPLOAD_DOCUMENTS_CATEGORIES, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUploadDocumentCategoriesList = createAsyncThunk('documents/actionUploadDocumentCategoriesList', async (params) => {
    try {
        const response = await axiosApi.post(API_UPLOAD_DOCUMENTS_CATEGORIES_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteUploadDocumentCategories = createAsyncThunk('documents/actionDeleteUploadDocumentCategories', async (params) => {
    try {
        const response = await axiosApi.post(API_UPLOAD_DOCUMENTS_CATEGORIES_DELETE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUploadDocumentCategoriesArchive = createAsyncThunk('documents/actionUploadDocumentCategoriesArchive', async (params) => {
    try {
        const response = await axiosApi.post(API_UPLOAD_DOCUMENTS_CATEGORIES_ARCHIVE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUploadDocumentCategoriesRestore = createAsyncThunk('documents/actionUploadDocumentCategoriesRestore', async (params) => {
    try {
        const response = await axiosApi.post(API_UPLOAD_DOCUMENTS_CATEGORIES_RESTORE, params)

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
        documentGroupDetails: null,
        documentCategoriesDetails: null,
        uploadDocumentCategories: null,
        uploadDocumentCategoriesList: null,
        deleteUploadDocumentCategories: null,
        uploadDocumentCategoriesArchive: null,
        uploadDocumentCategoriesRestore: null
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
        resetDocumentCategoriesDetailsResponse: (state) => {
            state.documentCategoriesDetails = null
        },
        resetUploadDocumentCategoriesResponse: (state) => {
            state.uploadDocumentCategories = null
        },
        resetUploadDocumentCategoriesListResponse: (state) => {
            state.uploadDocumentCategoriesList = null
        },
        resetDeleteUploadDocumentCategoriesResponse: (state) => {
            state.deleteUploadDocumentCategories = null
        },
        resetUploadDocumentCategoriesArchiveResponse: (state) => {
            state.uploadDocumentCategoriesArchive = null
        },
        resetUploadDocumentCategoriesRestoreResponse: (state) => {
            state.uploadDocumentCategoriesRestore = null
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
            .addCase(actionDocumentCategoriesDetails.fulfilled, (state, action) => {
                state.documentCategoriesDetails = action.payload
            })
            .addCase(actionUploadDocumentCategories.fulfilled, (state, action) => {
                state.uploadDocumentCategories = action.payload
            })
            .addCase(actionUploadDocumentCategoriesList.fulfilled, (state, action) => {
                state.uploadDocumentCategoriesList = action.payload
            })
            .addCase(actionDeleteUploadDocumentCategories.fulfilled, (state, action) => {
                state.deleteUploadDocumentCategories = action.payload
            })
            .addCase(actionUploadDocumentCategoriesArchive.fulfilled, (state, action) => {
                state.uploadDocumentCategoriesArchive = action.payload
            })
            .addCase(actionUploadDocumentCategoriesRestore.fulfilled, (state, action) => {
                state.uploadDocumentCategoriesRestore = action.payload
            })
    }
})

export const {
    resetDocumentListResponse,
    resetAddDocumentGroupResponse,
    resetDeleteDocumentGroupResponse,
    resetDocumentGroupDetailsResponse,
    resetDocumentCategoriesDetailsResponse,
    resetUploadDocumentCategoriesResponse,
    resetUploadDocumentCategoriesListResponse,
    resetDeleteUploadDocumentCategoriesResponse,
    resetUploadDocumentCategoriesArchiveResponse,
    resetUploadDocumentCategoriesRestoreResponse
} =
    documentStore.actions

export default documentStore.reducer
