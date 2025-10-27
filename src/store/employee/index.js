import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosApi, MULTIPART_HEADER } from "../../common/api"
import { getErrorResponse } from "../../utils";
import { API_EMPLOYEE_LIST, API_ADD_EMPLOYEE, API_UPDATE_EMPLOYEE, API_DELETE_EMPLOYEE, API_EMPLOYEE_MANAGER_LIST, API_EMPLOYEE_DETAILS, API_EMPLOYEE_BULK_UPLOAD, API_EMPLOYEE_WISE_PERMISSION_SAVE, API_EMPLOYEE_BULK_UPLOAD_LIST, API_EMPLOYEE_BULK_UPLOAD_CRON } from "../../common/api/constants";

export const actionEmployeeList = createAsyncThunk('employee/actionEmployeeList', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionAddEmployee = createAsyncThunk('employee/actionAddEmployee', async (params) => {
    try {
        const response = await axiosApi.post(API_ADD_EMPLOYEE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionUpdateEmployee = createAsyncThunk('employee/actionUpdateEmployee', async (params) => {
    try {
        const response = await axiosApi.post(API_UPDATE_EMPLOYEE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionDeleteEmployee = createAsyncThunk('employee/actionDeleteEmployee', async (params) => {
    try {
        const response = await axiosApi.post(API_DELETE_EMPLOYEE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeManagerList = createAsyncThunk('employee/actionEmployeeManagerList', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_MANAGER_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeDetails = createAsyncThunk('employee/actionEmployeeDetails', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_DETAILS, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeBulkUpload = createAsyncThunk('employee/actionEmployeeBulkUpload', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_BULK_UPLOAD, params, MULTIPART_HEADER)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeWisePermissionSave = createAsyncThunk('employee/actionEmployeeWisePermissionSave', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_WISE_PERMISSION_SAVE, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeBulkUploadList = createAsyncThunk('employee/actionEmployeeBulkUploadList', async (params) => {
    try {
        const response = await axiosApi.post(API_EMPLOYEE_BULK_UPLOAD_LIST, params)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const actionEmployeeBulkUploadCron = createAsyncThunk('employee/actionEmployeeBulkUploadCron', async () => {
    try {
        const response = await axiosApi.get(API_EMPLOYEE_BULK_UPLOAD_CRON)

        return response.status !== 200 ? getErrorResponse() : response.data
    } catch (error) {
        return error
    }
})

export const employeeStore = createSlice({
    name: 'employee',
    initialState: {
        employeeList: null,
        addEmployee: null,
        updateEmployee: null,
        deleteEmployee: null,
        employeeManagerList: null,
        employeeDetails: null,
        employeeBulkUpload: null,
        employeeWisePermissionSave: null,
        employeeBulkUploadList: null,
        employeeBulkUploadCron: null
    },

    reducers: {
        resetEmployeeListResponse: (state) => {
            state.employeeList = null
        },
        resetAddEmployeeResponse: (state) => {
            state.addEmployee = null
        },
        resetUpdateEmployeeResponse: (state) => {
            state.updateEmployee = null
        },
        resetDeleteEmployeeResponse: (state) => {
            state.deleteEmployee = null
        },
        resetEmployeeManagerListResponse: (state) => {
            state.employeeManagerList = null
        },
        resetEmployeeDetailsResponse: (state) => {
            state.employeeDetails = null
        },
        resetEmployeeBulkUploadResponse: (state) => {
            state.employeeBulkUpload = null
        },
        resetEmployeeWisePermissionSaveResponse: (state) => {
            state.employeeWisePermissionSave = null
        },
        resetEmployeeBulkUploadListResponse: (state) => {
            state.employeeBulkUploadList = null
        },
        resetEmployeeBulkUploadCronResponse: (state) => {
            state.employeeBulkUploadCron = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(actionEmployeeList.fulfilled, (state, action) => {
                state.employeeList = action.payload
            })
            .addCase(actionAddEmployee.fulfilled, (state, action) => {
                state.addEmployee = action.payload
            })
            .addCase(actionUpdateEmployee.fulfilled, (state, action) => {
                state.updateEmployee = action.payload
            })
            .addCase(actionDeleteEmployee.fulfilled, (state, action) => {
                state.deleteEmployee = action.payload
            })
            .addCase(actionEmployeeManagerList.fulfilled, (state, action) => {
                state.employeeManagerList = action.payload
            })
            .addCase(actionEmployeeDetails.fulfilled, (state, action) => {
                state.employeeDetails = action.payload
            })
            .addCase(actionEmployeeBulkUpload.fulfilled, (state, action) => {
                state.employeeBulkUpload = action.payload
            })
            .addCase(actionEmployeeWisePermissionSave.fulfilled, (state, action) => {
                state.employeeWisePermissionSave = action.payload
            })
            .addCase(actionEmployeeBulkUploadList.fulfilled, (state, action) => {
                state.employeeBulkUploadList = action.payload
            })
            .addCase(actionEmployeeBulkUploadCron.fulfilled, (state, action) => {
                state.employeeBulkUploadCron = action.payload
            })
    }
})

export const {
    resetEmployeeListResponse,
    resetAddEmployeeResponse,
    resetUpdateEmployeeResponse,
    resetDeleteEmployeeResponse,
    resetEmployeeManagerListResponse,
    resetEmployeeDetailsResponse,
    resetEmployeeBulkUploadResponse,
    resetEmployeeWisePermissionSaveResponse,
    resetEmployeeBulkUploadListResponse,
    resetEmployeeBulkUploadCronResponse
} =
    employeeStore.actions

export default employeeStore.reducer
