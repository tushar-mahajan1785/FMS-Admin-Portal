import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosApi } from "../../common/api";
import { getErrorResponse } from "../../utils";
import {
  API_PM_ACTIVITY_LIST,
  API_SELECTED_ASSET_REMOVE,
} from "../../common/api/constants";

export const defaultPMScheduleData = {
  is_active: 0,
  asset_type: "",
  role_type_id: "",
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
      });
  },
});

export const {
  resetPmScheduleListResponse,
  resetPmScheduleDataResponse,
  resetPmScheduleSelectedAssetResponse,
} = PmActivityStore.actions;

export default PmActivityStore.reducer;
