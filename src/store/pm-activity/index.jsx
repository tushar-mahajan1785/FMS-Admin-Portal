import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";
import {
  API_PM_ACTIVITY_LIST,
  API_SELECTED_ASSET_REMOVE,
  API_PM_ACTIVITY_ADD,
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

export const actionDeleteSelectedAsset = createAsyncThunk(
  "pm-activity/actionDeleteSelectedAsset",
  async (params) => {
    try {
      const response = await axiosApi.post(API_SELECTED_ASSET_REMOVE, params);

      return response.status !== 200 ? getErrorResponse() : response.data;
    } catch (error) {
      return error;
    }
  }
);

export const PmActivityStore = createSlice({
  name: "pm-activity",
  initialState: {
    pmScheduleList: null,
    pmScheduleData: null,
    deleteSelectedAsset: null,
    pmScheduleAdd: null,
  },

  reducers: {
    resetPmScheduleListResponse: (state) => {
      state.pmScheduleList = null;
    },
    resetPmScheduleDataResponse: (state) => {
      state.pmScheduleData = null;
    },
    resetPmScheduleSelectedAssetResponse: (state) => {
      state.deleteSelectedAsset = null;
    },
    resetPmScheduleAddAssetResponse: (state) => {
      state.pmScheduleAdd = null;
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
      .addCase(actionDeleteSelectedAsset.fulfilled, (state, action) => {
        state.deleteSelectedAsset = action.payload;
      })
      .addCase(actionPMScheduleAdd.fulfilled, (state, action) => {
        state.pmScheduleAdd = action.payload;
      });
  },
});

export const {
  resetPmScheduleListResponse,
  resetPmScheduleDataResponse,
  resetPmScheduleSelectedAssetResponse,
  resetPmScheduleAddAssetResponse,
} = PmActivityStore.actions;

export default PmActivityStore.reducer;
