import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_CLIENT_BRANCH_LIST, API_CLIENT_BRANCH_UPDATE, API_CLIENT_BRANCH_DETAILS } from "../../common/api/constants";

export const actionBranchData = createAsyncThunk('actionBranchData', params => {
    return params
})

export const actionClientBranchList = createAsyncThunk('branch/actionClientBranchList', async (params) => {
    try {
        const response = await axiosApi.post(API_CLIENT_BRANCH_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionClientBranchUpdate = createAsyncThunk('branch/actionClientBranchUpdate', async (params) => {
    try {
        const response = await axiosApi.post(API_CLIENT_BRANCH_UPDATE, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionClientBranchDetails = createAsyncThunk('branch/actionClientBranchDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_CLIENT_BRANCH_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const branchStore = createSlice({
    name: 'branch',
    initialState: {
        branchData: null,
        clientBranchList: null,
        clientBranchUpdate: null,
        clientBranchDetails: null
    },

    reducers: {
        resetBranchData: state => {
            state.branchData = null
        },
        resetClientBranchListResponse: (state) => {
            state.clientBranchList = null
        },
        resetClientBranchUpdateResponse: (state) => {
            state.clientBranchUpdate = null
        },
        resetClientBranchDetailsResponse: (state) => {
            state.clientBranchDetails = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionBranchData.fulfilled, (state, action) => {
                state.branchData = action.payload
            })
            .addCase(actionClientBranchList.fulfilled, (state, action) => {
                state.clientBranchList = action.payload
            })
            .addCase(actionClientBranchUpdate.fulfilled, (state, action) => {
                state.clientBranchUpdate = action.payload
            })
            .addCase(actionClientBranchDetails.fulfilled, (state, action) => {
                state.clientBranchDetails = action.payload
            })
    }
})

export const {
    resetBranchData,
    resetClientBranchListResponse,
    resetClientBranchUpdateResponse,
    resetClientBranchDetailsResponse
} =
    branchStore.actions

export default branchStore.reducer
