import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";
import {
  API_PM_ACTIVITY_LIST,
  API_PM_ACTIVITY_REMOVE,
  API_PM_ACTIVITY_ADD,
  API_PM_ACTIVITY_DETAILS,
} from "../../common/api/constants";

export const defaultPMScheduleData = {
  is_active: 0,
  asset_type: "",
  frequency_exceptions: "",
};

export const actionPMScheduleList = createAsyncThunk(
  "pm-activity/actionPMScheduleList",
  async (params) => {
    try {
      const response = await axiosApi.post(API_PM_ACTIVITY_LIST, params);

      return response.status !== 200 ? getErrorResponse() : response.data;
    } catch (error) {
      return error;
    }
  }
);

export const actionPMScheduleAdd = createAsyncThunk(
  "pm-activity/actionPMScheduleAdd",
  async (params) => {
    try {
      const response = await axiosApi.post(API_PM_ACTIVITY_ADD, params);

      return response.status !== 200 ? getErrorResponse() : response.data;
    } catch (error) {
      return error;
    }
  }
);

export const actionPMScheduleData = createAsyncThunk(
  "pm-activity/actionPMScheduleData",
  async (params) => {
    return params;
  }
);

export const actionDeletePmActivity = createAsyncThunk(
  "pm-activity/actionDeletePmActivity",
  async (params) => {
    try {
      const response = await axiosApi.post(API_PM_ACTIVITY_REMOVE, params);

      return response.status !== 200 ? getErrorResponse() : response.data;
    } catch (error) {
      return error;
    }
  }
);

export const actionPMScheduleDetails = createAsyncThunk(
  "pm-activity/actionPMScheduleDetails",
  async (params) => {
    try {
      const response = await axiosApi.post(API_PM_ACTIVITY_DETAILS, params);

      return response.status !== 200 ? getErrorResponse() : response.data;
    } catch (error) {
      return error;
    }
  }
);

export const pmActivityStore = createSlice({
  name: "pm-activity",
  initialState: {
    pmScheduleList: null,
    pmScheduleData: null,
    deletePmActivity: null,
    pmScheduleAdd: null,
    pmScheduleDetails: null,
  },

  reducers: {
    resetPmScheduleListResponse: (state) => {
      state.pmScheduleList = null;
    },
    resetPmScheduleDataResponse: (state) => {
      state.pmScheduleData = null;
    },
    resetDeletePmActivityResponse: (state) => {
      state.deletePmActivity = null;
    },
    resetPmScheduleAddAssetResponse: (state) => {
      state.pmScheduleAdd = null;
    },
    resetPmScheduleDetailsResponse: (state) => {
      state.pmScheduleDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionPMScheduleList.fulfilled, (state, action) => {
        state.pmScheduleList = action.payload;
      })
      .addCase(actionPMScheduleData.fulfilled, (state, action) => {
        state.pmScheduleData = action.payload;
      })
      .addCase(actionDeletePmActivity.fulfilled, (state, action) => {
        state.deletePmActivity = action.payload;
      })
      .addCase(actionPMScheduleAdd.fulfilled, (state, action) => {
        state.pmScheduleAdd = action.payload;
      })
      .addCase(actionPMScheduleDetails.fulfilled, (state, action) => {
        state.pmScheduleDetails = action.payload;
      });
  },
});

export const {
  resetPmScheduleListResponse,
  resetPmScheduleDataResponse,
  resetDeletePmActivityResponse,
  resetPmScheduleAddAssetResponse,
  resetPmScheduleDetailsResponse,
} = pmActivityStore.actions;

export default pmActivityStore.reducer;
