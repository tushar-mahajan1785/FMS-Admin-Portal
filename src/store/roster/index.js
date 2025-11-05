import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";
import {
    API_CONFIGURE_SHIFT,
    API_MANAGE_GROUPS_LIST,
    API_ADD_MANAGE_GROUPS,
    API_EDIT_MANAGE_GROUPS,
    API_DELETE_MANAGE_GROUPS,
    API_MANAGE_GROUPS_DETAILS,
    API_ASSET_TYPE_WISE_LIST,
    API_EMPLOYEE_TYPE_WISE_LIST,
    API_CONFIGURE_SHIFT_LIST,
    API_CONFIGURE_SHIFT_REMOVE,
    API_EMPLOYEE_SHIFT_SCHEDULE_LIST,
    API_ADD_EMPLOYEE_SHIFT_SCHEDULE,
    API_DELETE_EMPLOYEE_SHIFT_SCHEDULE,
    API_EMPLOYEE_SHIFT_SCHEDULE_MASTER_LIST,
    API_ROSTER_GROUP_MASTER_LIST
} from "../../common/api/constants";

export const defaultRosterData = {
    asset_type: '',
    role_type_id: ''
}

export const actionRosterData = createAsyncThunk('roster/actionRosterData', async (params) => {
    return params
})

export const actionConfigureShift = createAsyncThunk('roster/actionConfigureShift', async (params) => {
    try {
        const response = await axiosApi.post(API_CONFIGURE_SHIFT, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionManageGroupsList = createAsyncThunk('roster/actionManageGroupsList', async (params) => {
    try {
        const response = await axiosApi.post(API_MANAGE_GROUPS_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddManageGroups = createAsyncThunk('roster/actionAddManageGroups', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_MANAGE_GROUPS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEditManageGroups = createAsyncThunk('roster/actionEditManageGroups', async (params) => {
    try {
        const response = await axiosApi.post(API_EDIT_MANAGE_GROUPS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteManageGroups = createAsyncThunk('roster/actionDeleteManageGroups', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_MANAGE_GROUPS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionManageGroupsDetails = createAsyncThunk('roster/actionManageGroupsDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_MANAGE_GROUPS_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAssetTypeWiseList = createAsyncThunk('roster/actionAssetTypeWiseList', async (params) => {
    try {
        const response = await axiosApi.post(API_ASSET_TYPE_WISE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeTypeWiseList = createAsyncThunk('roster/actionEmployeeTypeWiseList', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_TYPE_WISE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionConfigureShiftList = createAsyncThunk('roster/actionConfigureShiftList', async (params) => {
    try {
        const response = await axiosApi.post(API_CONFIGURE_SHIFT_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteConfigureShift = createAsyncThunk('roster/actionDeleteConfigureShift', async (params) => {
    try {
        const response = await axiosApi.post(API_CONFIGURE_SHIFT_REMOVE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeShiftScheduleList = createAsyncThunk('roster/actionEmployeeShiftScheduleList', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_SHIFT_SCHEDULE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddEmployeeShiftSchedule = createAsyncThunk('roster/actionAddEmployeeShiftSchedule', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_EMPLOYEE_SHIFT_SCHEDULE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteEmployeeShiftSchedule = createAsyncThunk('roster/actionDeleteEmployeeShiftSchedule', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_EMPLOYEE_SHIFT_SCHEDULE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeShiftScheduleMasterList = createAsyncThunk('roster/actionEmployeeShiftScheduleMasterList', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_SHIFT_SCHEDULE_MASTER_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionRosterGroupMasterList = createAsyncThunk('roster/actionRosterGroupMasterList', async (params) => {
    try {
        const response = await axiosApi.post(API_ROSTER_GROUP_MASTER_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const rosterStore = createSlice({
    name: 'roster',
    initialState: {
        configureShift: null,
        manageGroupsList: null,
        addManageGroups: null,
        editManageGroups: null,
        deleteManageGroups: null,
        manageGroupsDetails: null,
        rosterData: null,
        assetTypeWiseList: null,
        employeeTypeWiseList: null,
        configureShiftList: null,
        deleteConfigureShift: null,
        employeeShiftScheduleList: null,
        addEmployeeShiftSchedule: null,
        deleteEmployeeShiftSchedule: null,
        employeeShiftScheduleMasterList: null,
        rosterGroupMasterList: null
    },

    reducers: {
        resetConfigureShiftResponse: (state) => {
            state.configureShift = null
        },
        resetManageGroupsListResponse: (state) => {
            state.manageGroupsList = null
        },
        resetAddManageGroupsResponse: (state) => {
            state.addManageGroups = null
        },
        resetEditManageGroupsResponse: (state) => {
            state.editManageGroups = null
        },
        resetDeleteManageGroupsResponse: (state) => {
            state.deleteManageGroups = null
        },
        resetManageGroupsDetailsResponse: (state) => {
            state.manageGroupsDetails = null
        },
        resetRosterDataResponse: (state) => {
            state.rosterData = null
        },
        resetAssetTypeWiseListResponse: (state) => {
            state.assetTypeWiseList = null
        },
        resetEmployeeTypeWiseListResponse: (state) => {
            state.employeeTypeWiseList = null
        },
        resetConfigureShiftListResponse: (state) => {
            state.configureShiftList = null
        },
        resetDeleteConfigureShiftResponse: (state) => {
            state.deleteConfigureShift = null
        },
        resetEmployeeShiftScheduleListResponse: (state) => {
            state.employeeShiftScheduleList = null
        },
        resetAddEmployeeShiftScheduleResponse: (state) => {
            state.addEmployeeShiftSchedule = null
        },
        resetDeleteEmployeeShiftScheduleResponse: (state) => {
            state.deleteEmployeeShiftSchedule = null
        },
        resetEmployeeShiftScheduleMasterListResponse: (state) => {
            state.employeeShiftScheduleMasterList = null
        },
        resetRosterGroupMasterListResponse: (state) => {
            state.rosterGroupMasterList = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionConfigureShift.fulfilled, (state, action) => {
                state.configureShift = action.payload
            })
            .addCase(actionManageGroupsList.fulfilled, (state, action) => {
                state.manageGroupsList = action.payload
            })
            .addCase(actionAddManageGroups.fulfilled, (state, action) => {
                state.addManageGroups = action.payload
            })
            .addCase(actionEditManageGroups.fulfilled, (state, action) => {
                state.editManageGroups = action.payload
            })
            .addCase(actionDeleteManageGroups.fulfilled, (state, action) => {
                state.deleteManageGroups = action.payload
            })
            .addCase(actionManageGroupsDetails.fulfilled, (state, action) => {
                state.manageGroupsDetails = action.payload
            })
            .addCase(actionRosterData.fulfilled, (state, action) => {
                state.rosterData = action.payload
            })
            .addCase(actionAssetTypeWiseList.fulfilled, (state, action) => {
                state.assetTypeWiseList = action.payload
            })
            .addCase(actionEmployeeTypeWiseList.fulfilled, (state, action) => {
                state.employeeTypeWiseList = action.payload
            })
            .addCase(actionConfigureShiftList.fulfilled, (state, action) => {
                state.configureShiftList = action.payload
            })
            .addCase(actionDeleteConfigureShift.fulfilled, (state, action) => {
                state.deleteConfigureShift = action.payload
            })
            .addCase(actionEmployeeShiftScheduleList.fulfilled, (state, action) => {
                state.employeeShiftScheduleList = action.payload
            })
            .addCase(actionAddEmployeeShiftSchedule.fulfilled, (state, action) => {
                state.addEmployeeShiftSchedule = action.payload
            })
            .addCase(actionDeleteEmployeeShiftSchedule.fulfilled, (state, action) => {
                state.deleteEmployeeShiftSchedule = action.payload
            })
            .addCase(actionEmployeeShiftScheduleMasterList.fulfilled, (state, action) => {
                state.employeeShiftScheduleMasterList = action.payload
            })
            .addCase(actionRosterGroupMasterList.fulfilled, (state, action) => {
                state.rosterGroupMasterList = action.payload
            })
    }
})

export const {
    resetConfigureShiftResponse,
    resetManageGroupsListResponse,
    resetAddManageGroupsResponse,
    resetEditManageGroupsResponse,
    resetDeleteManageGroupsResponse,
    resetManageGroupsDetailsResponse,
    resetRosterDataResponse,
    resetAssetTypeWiseListResponse,
    resetEmployeeTypeWiseListResponse,
    resetConfigureShiftListResponse,
    resetDeleteConfigureShiftResponse,
    resetEmployeeShiftScheduleListResponse,
    resetAddEmployeeShiftScheduleResponse,
    resetDeleteEmployeeShiftScheduleResponse,
    resetEmployeeShiftScheduleMasterListResponse,
    resetRosterGroupMasterListResponse
} =
    rosterStore.actions

export default rosterStore.reducer
