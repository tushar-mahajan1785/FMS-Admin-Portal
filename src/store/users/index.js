import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_ADD_USERS, API_USERS_DETAILS, API_USERS_LIST, API_DELETE_USERS, API_UPDATE_USERS, API_USERS_MASTERS, API_USERS_PERMISSIONS_SAVE } from "../../common/api/constants";

export const actionUsersList = createAsyncThunk('client/actionUsersList', async (params) => {
    try {
        const response = await axiosApi.post(API_USERS_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddUsers = createAsyncThunk('client/actionAddUsers', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_USERS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUpdateUsers = createAsyncThunk('client/actionUpdateUsers', async (params) => {
    try {
        const response = await axiosApi.post(API_UPDATE_USERS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteUsers = createAsyncThunk('client/actionDeleteUsers', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_USERS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUsersDetails = createAsyncThunk('client/actionUsersDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_USERS_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionUsersMasterList = createAsyncThunk('client/actionUsersMasterList', async () => {
    try {
        const response = await axiosApi.get(API_USERS_MASTERS)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})
export const actionUsersPermissionsSave = createAsyncThunk('client/actionUsersPermissionsSave', async (params) => {
    try {
        const response = await axiosApi.post(API_USERS_PERMISSIONS_SAVE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const UsersStore = createSlice({
    name: 'client',
    initialState: {
        usersList: null,
        addUsers: null,
        updateUsers: null,
        deleteUsers: null,
        usersDetails: null,
        usersMasterList: null,
        usersPermissionsSave: null
    },

    reducers: {
        resetUsersListResponse: (state) => {
            state.usersList = null
        },
        resetAddUsersResponse: (state) => {
            state.addUsers = null
        },
        resetUpdateUsersResponse: (state) => {
            state.updateUsers = null
        },
        resetDeleteUsersResponse: (state) => {
            state.deleteUsers = null
        },
        resetUsersDetailsResponse: (state) => {
            state.usersDetails = null
        },
        resetUsersMasterListResponse: (state) => {
            state.usersMasterList = null
        },
        resetUsersPermissionsSaveResponse: (state) => {
            state.usersPermissionsSave = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionUsersList.fulfilled, (state, action) => {
                state.usersList = action.payload
            })
            .addCase(actionAddUsers.fulfilled, (state, action) => {
                state.addUsers = action.payload
            })
            .addCase(actionUpdateUsers.fulfilled, (state, action) => {
                state.updateUsers = action.payload
            })
            .addCase(actionDeleteUsers.fulfilled, (state, action) => {
                state.deleteUsers = action.payload
            })
            .addCase(actionUsersDetails.fulfilled, (state, action) => {
                state.usersDetails = action.payload
            })
            .addCase(actionUsersMasterList.fulfilled, (state, action) => {
                state.usersMasterList = action.payload
            })
            .addCase(actionUsersPermissionsSave.fulfilled, (state, action) => {
                state.usersPermissionsSave = action.payload
            })
    }
})

export const {
    resetUsersListResponse,
    resetAddUsersResponse,
    resetUpdateUsersResponse,
    resetDeleteUsersResponse,
    resetUsersDetailsResponse,
    resetUsersMasterListResponse,
    resetUsersPermissionsSaveResponse
} =
    UsersStore.actions

export default UsersStore.reducer
