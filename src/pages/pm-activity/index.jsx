/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import OverDueIcon from "../../assets/icons/OverdueIcon";
import {
  ERROR,
  getMasterPMActivityEditStatus,
  getPmActivityFrequencyArray,
  getMasterPMActivitySchedule,
  IMAGES_SCREEN_NO_DATA,
  LIST_LIMIT,
  SERVER_ERROR,
  UNAUTHORIZED,
} from "../../constants";
import EmptyContent from "../../components/empty_content";
import FullScreenLoader from "../../components/fullscreen-loader";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../hooks/useSnackbar";

import ServerSideListComponents from "../../components/server-side-list-component";
import { SearchInput } from "../../components/common";
import SearchIcon from "../../assets/icons/SearchIcon";
import CustomTextField from "../../components/text-field";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import TotalPMIcon from "../../assets/icons/TotalPMIcon";
import ActivePMIcon from "../../assets/icons/ActivePMIcon";
import CompletedPMIcon from "../../assets/icons/CompletedPMIcon";
import CustomChip from "../../components/custom-chip";
import AddPMSchedule from "./add";
import {
  actionPMScheduleList,
  resetPmScheduleListResponse,
  actionDeletePmActivity,
  resetDeletePmActivityResponse,
} from "../../store/pm-activity";
import {
  actionMasterAssetType,
  resetMasterAssetTypeResponse,
} from "../../store/asset";
import { useBranch } from "../../hooks/useBranch";
import EyeIcon from "../../assets/icons/EyeIcon";
import AlertPopup from "../../components/alert-confirm";
import AlertCircleIcon from "../../assets/icons/AlertCircleIcon";
import PMActivityDetails from "./view";
import TypographyComponent from "../../components/custom-typography";

export default function PmActivity() {
  /** Hooks **/
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const branch = useBranch();

  /** Redux Store **/
  const { pmScheduleList, deletePmActivity } = useSelector(
    (state) => state.pmActivityStore
  );

  /** States **/
  const [searchQuery, setSearchQuery] = useState("");
  const [pmScheduleActivityData, setPmScheduleActivityData] = useState([]);
  const [originalPmActivityScheduleData, setOriginalPmActivityScheduleData] =
    useState([]);

  /**
   * upcomingSchedules
   * @type {Array}
   * @description : State to store upcoming PM Schedules
   */
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAssetTypes, setSelectedAssetTypes] = useState("");
  const [masterAssetTypeOptions, setMasterAssetTypeOptions] = useState([]);
  const [selectedUpcomingPmSchedule, setSelectedUpcomingPmSchedule] =
    useState("");
  const [openAddPmSchedule, setOpenAddPmSchedule] = useState(false);
  const [openDeletePmActivityPopup, setOpenDeletePmActivityPopup] =
    useState(false);
  const [selectedPmActivityData, setSelectedPmActivityData] = useState(null);
  const [loadingDeletePmActivity, setLoadingDeletePmActivity] = useState(false);
  const [openPmActivityDetails, setOpenPmActivityDetails] = useState(false);

  /**
   * masterAssetType
   * @type {Object}
   * @description : Redux store to get master asset type list
   */
  const { masterAssetType } = useSelector((state) => state.AssetStore);

  /**
   * columns
   * @type {Array}
   * @description : Columns for PM Activity Data Grid
   */
  const columns = [
    {
      flex: 0.5,
      field: "title",
      headerName: "Title",
      renderCell: (params) => {
        return (
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              height: "100%",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenPmActivityDetails(true);
              let objData = {
                uuid: params.row.uuid,
              };
              setPmScheduleActivityData(objData);
            }}
          >
            <TypographyComponent fontSize={16} fontWeight={500}>
              {params?.row?.title}
            </TypographyComponent>
          </Stack>
        );
      },
    },

    {
      flex: 0.4,
      field: "assets",
      headerName: "Assets",
      renderCell: (params) => {
        return (
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", height: "100%" }}
          >
            <Chip
              label={`${params?.row?.asset_count} Assets`}
              size="small"
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.primary[600],
                fontWeight: 500,
                px: "4px",
                py: "8px",
                borderRadius: 0,
              }}
            />
            <Tooltip followCursor placement="top" title={params?.row?.assets}>
              <IconButton>
                <EyeIcon stroke="#717680" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      flex: 0.2,
      field: "start_date",
      headerName: "Start Date",
    },
    {
      flex: 0.2,
      field: "frequency",
      headerName: "Frequency",
    },
    {
      flex: 0.2,
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        let color = "primary";
        switch (params?.row?.status) {
          case "Active":
            color = "success";
            break;
          case "Completed":
            color = "primary";
            break;
          case "Overdue":
            color = "warning";
            break;
          default:
            color = "primary";
        }
        return (
          <React.Fragment>
            <CustomChip text={params?.row?.status} colorName={color} />
          </React.Fragment>
        );
      },
    },

    {
      flex: 0.2,
      sortable: false,
      field: "",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Delete" followCursor placement="top">
                {/* Delete Pm Activity  */}
                <IconButton
                  onClick={() => {
                    let details = {
                      uuid: params?.row?.uuid,
                      title: "Delete PM Activity",
                      text: " Are you sure you want to delete this PM Activity? This action cannot be undone.",
                    };
                    setSelectedPmActivityData(details);
                    setOpenDeletePmActivityPopup(true);
                  }}
                >
                  <DeleteIcon stroke={"#181D27"} />
                </IconButton>
              </Tooltip>
            </Box>
          </React.Fragment>
        );
      },
    },
  ];

  /** PM Activity Counts Cards Data */
  const [getArrPMActivityCounts, setGetArrPmActivityCounts] = useState([
    {
      labelTop: "Total",
      labelBottom: "PM Schedules",
      key: "total_pm_schedules",
      value: 0,
      icon: <TotalPMIcon size={"24"} stroke={theme.palette.primary[600]} />,
      color: theme.palette.primary[50],
    },
    {
      labelTop: "Active ",
      labelBottom: "PM Schedules",
      key: "active_pm_schedules",
      value: 0,
      icon: <ActivePMIcon size={"24"} stroke={theme.palette.primary[600]} />,
      color: theme.palette.primary[50],
    },
    {
      labelTop: "Completed",
      labelBottom: "PM Schedules",
      key: "completed_pm_schedules",
      value: 0,
      icon: <CompletedPMIcon size={"24"} stroke={theme.palette.primary[600]} />,
      color: theme.palette.primary[50],
    },
    {
      labelTop: "Overdue",
      labelBottom: "PM Schedules",
      key: "overdue_pm_schedules",
      value: 0,
      icon: <OverDueIcon size={"24"} stroke={theme.palette.primary[600]} />,
      color: theme.palette.primary[50],
    },
    {
      labelTop: "Upcoming PM",
      labelBottom: "Schedules",
      key: "upcoming_pm_schedules",
      value: 0,
      icon: <CalendarIcon size={"24"} stroke={theme.palette.primary[600]} />,
      color: theme.palette.primary[50],
    },
  ]);

  /**
   * useEffect
   * @dependency : branch?.currentBranch
   * @type : API CALL
   * @description : Get Asset Type List API Call
   */
  useEffect(() => {
    if (branch?.currentBranch?.client_uuid) {
      setSelectedUpcomingPmSchedule(getMasterPMActivitySchedule[0]?.name)
      dispatch(
        actionMasterAssetType({
          client_uuid: branch.currentBranch.client_uuid,
        })
      );
    }
  }, [branch?.currentBranch]);

  /**
   * useEffect
   * @dependency : pmScheduleList
   * @type : HANDLE API RESULT;
   * @description : Handle the result of ticket List API
   */
  useEffect(() => {
    if (pmScheduleList && pmScheduleList !== null) {
      dispatch(resetPmScheduleListResponse());

      if (pmScheduleList?.result === true) {
        setPmScheduleActivityData(pmScheduleList?.response?.pm_schedule_list);
        setOriginalPmActivityScheduleData(
          pmScheduleList?.response?.pm_schedule_list
        );

        setUpcomingSchedules(pmScheduleList?.response?.upcoming_schedule_list);

        let objData = pmScheduleList?.response;
        setGetArrPmActivityCounts((prevArr) =>
          prevArr.map((item) => ({
            ...item,
            value: objData[item.key] !== undefined ? objData[item.key] : 0,
          }))
        );
        setTotal(pmScheduleList?.response?.total_pm_schedules);
        setLoadingList(false);
      } else {
        setTotal(null);

        switch (pmScheduleList?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetPmScheduleListResponse());
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: pmScheduleList?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [pmScheduleList]);

  /**
   * useEffect
   * @dependency : page, selectedStatus, selectedAssetTypes, selectedFrequency, selectedUpcomingPmSchedule
   * @type : API CALL
   * @description : Get PM Schedule List API Call
   */
  useEffect(() => {
    if (page !== null) {
      dispatch(
        actionPMScheduleList({
          page: page,
          limit: LIST_LIMIT,
          status: selectedStatus,
          asset_type: selectedAssetTypes,
          branch_uuid: branch?.currentBranch?.uuid,
          frequency: selectedFrequency,
          upcoming_filter: selectedUpcomingPmSchedule,
        })
      );
    }
  }, [
    page,
    selectedStatus,
    selectedAssetTypes,
    selectedFrequency,
    selectedUpcomingPmSchedule,
  ]);

  /**
   * useEffect
   * @dependency : masterAssetType
   * @type : HANDLE API RESULT;
   * @description : Handle the result of Master Asset Type API
   */
  useEffect(() => {
    if (masterAssetType && masterAssetType !== null) {
      dispatch(resetMasterAssetTypeResponse());
      if (masterAssetType?.result === true) {
        setMasterAssetTypeOptions(masterAssetType?.response);
      } else {
        setMasterAssetTypeOptions([]);
        switch (masterAssetType?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetMasterAssetTypeResponse());
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: masterAssetType?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [masterAssetType]);

  /**
   * useEffect
   * @dependency : deletePmActivity
   * @type : HANDLE API RESULT;
   * @description : Handle the result of Delete PM Activity API
   */
  useEffect(() => {
    if (deletePmActivity && deletePmActivity !== null) {
      dispatch(resetDeletePmActivityResponse());
      if (deletePmActivity?.result === true) {
        showSnackbar({
          message: deletePmActivity?.message,
          severity: "success",
        });
        dispatch(
          actionPMScheduleList({
            page: page,
            limit: LIST_LIMIT,
            status: selectedStatus,
            asset_type: selectedAssetTypes,
            branch_uuid: branch?.currentBranch?.uuid,
            frequency: selectedFrequency,
            upcoming_filter: selectedUpcomingPmSchedule,
          })
        );
        setOpenDeletePmActivityPopup(false);
        setLoadingDeletePmActivity(false);
      } else {
        setLoadingDeletePmActivity(false);
        switch (deletePmActivity?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetDeletePmActivityResponse());
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: deletePmActivity?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [deletePmActivity]);

  /**
   * useEffect
   * @dependency : searchQuery
   * @type : FILTER DATA
   * @description : Filter PM Schedule Data on search query
   */
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      if (
        originalPmActivityScheduleData &&
        originalPmActivityScheduleData !== null &&
        originalPmActivityScheduleData.length > 0
      ) {
        var filteredData = originalPmActivityScheduleData.filter(
          (item) =>
            (item?.title &&
              item?.title
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase())) ||
            (item?.assets &&
              item?.assets
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase())) ||
            (item?.start_date &&
              item?.start_date
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase())) ||
            (item?.frequency &&
              item?.frequency
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase())) ||
            (item?.status &&
              item?.status
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase()))
        );

        if (filteredData && filteredData.length > 0) {
          setPmScheduleActivityData(filteredData);
        } else {
          setPmScheduleActivityData([]);
        }
      }
    } else {
      setPmScheduleActivityData(originalPmActivityScheduleData);
    }
  }, [searchQuery]);

  /**
   * handleSearchQueryChange
   * @type : EVENT HANDLER
   * @description : Handle search query change
   * @param {object} event - Event object
   * @return {void}
   */
  const handleSearchQueryChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  return (
    <React.Fragment>
      <Stack>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Stack
            sx={{
              flexDirection: "row",
              columnGap: 1,
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Stack>
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={24}
                fontWeight={500}
              >
                Preventive Maintenance Activity
              </TypographyComponent>
            </Stack>
          </Stack>
          <Stack>
            <Button
              size={"small"}
              sx={{
                textTransform: "capitalize",
                px: "18px",
                py: "10px",
                borderRadius: "8px",
                backgroundColor: theme.palette.primary[600],
                color: theme.palette.common.white,
                fontSize: 16,
                fontWeight: 600,
                borderColor: theme.palette.primary[600],
              }}
              onClick={() => {
                setOpenAddPmSchedule(true);
              }}
              variant="contained"
            >
              <AddIcon
                sx={{
                  color: "white",
                  fontSize: { xs: "20px", sm: "20px", md: "22px" },
                }}
              />
              Add New Schedule
            </Button>
          </Stack>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "8px",
            columnGap: 2,
          }}
        >
          {getArrPMActivityCounts?.map((item, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",

                p: 2,
                my: 2,
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: "#fff",
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Stack
                  sx={{
                    flexDirection: "row",
                    columnGap: 1,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      backgroundColor: theme.palette.primary[100],
                      color: theme.palette.primary[600],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 0.5,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Stack>
                    {/* Label Top */}
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      sx={{
                        color: theme.palette.grey[650],
                        fontSize: "0.85rem",
                        lineHeight: "20px",
                      }}
                    >
                      {item.labelTop}
                    </Typography>

                    {/* Label Bottom */}
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      sx={{
                        color: theme.palette.grey[650],
                        fontSize: "0.85rem",
                        lineHeight: "20px",
                      }}
                    >
                      {item.labelBottom}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography
                  fontSize={24}
                  fontWeight={600}
                  sx={{
                    color: theme.palette.primary[600],
                    fontWeight: 700,
                    mt: 0.3,
                  }}
                >
                  {item.value.toString().padStart(2, "0")}
                </Typography>
              </Stack>
            </Card>
          ))}
        </Box>
      </Stack>
      <Grid container spacing={"24px"}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 9, xl: 9 }}>
          <Stack
            sx={{
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: "8px",
              // minHeight: "772px",
              // height: "100%",
              background: theme.palette.common.white,
              pb: 1,
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                background: theme.palette.common.white,
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "8px",
                py: 2,
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  columnGap: 1,
                  paddingX: "20px",
                  paddingTop: "20px",
                  alignItems: "center",
                }}
              >
                <Stack>
                  <TypographyComponent
                    fontSize={18}
                    fontWeight={500}
                    sx={{ color: theme.palette.grey[700] }}
                  >
                    PM Schedule List
                  </TypographyComponent>
                </Stack>
                <Chip
                  label={total && total !== null ? `${total?.toString().padStart(2, "0")} Schedules` : '0 Schedules'}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.primary[50],
                    color: theme.palette.primary[600],
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                />
              </Stack>
              <Stack
                sx={{
                  paddingRight: "15px",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <SearchInput
                  id="search-schedules"
                  placeholder="Search Schedules"
                  variant="outlined"
                  size="small"
                  onChange={handleSearchQueryChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <SearchIcon stroke={theme.palette.grey[500]} />
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomTextField
                  select
                  fullWidth
                  sx={{ width: 150 }}
                  value={selectedStatus}
                  onChange={(event) => {
                    setSelectedStatus(event.target.value);
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 220,
                          scrollbarWidth: "thin",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  {getMasterPMActivityEditStatus &&
                    getMasterPMActivityEditStatus.map((option) => (
                      <MenuItem
                        key={option?.name}
                        value={option?.name}
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          maxWidth: 300,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {option?.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
                <CustomTextField
                  select
                  fullWidth
                  sx={{ width: 150 }}
                  value={selectedFrequency}
                  onChange={(event) => {
                    setSelectedFrequency(event.target.value);
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 220,
                          scrollbarWidth: "thin",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All Frequency</em>
                  </MenuItem>
                  {getPmActivityFrequencyArray &&
                    getPmActivityFrequencyArray.map((option) => (
                      <MenuItem
                        key={option?.name}
                        value={option?.name}
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          maxWidth: 300,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {option?.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
                <CustomTextField
                  select
                  fullWidth
                  sx={{ width: 160 }}
                  value={selectedAssetTypes}
                  onChange={(event) => {
                    setSelectedAssetTypes(event.target.value);
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 220,
                          scrollbarWidth: "thin",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All Asset Types</em>
                  </MenuItem>
                  {masterAssetTypeOptions &&
                    masterAssetTypeOptions.map((option) => (
                      <MenuItem
                        key={option?.name}
                        value={option?.name}
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          maxWidth: 300,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {option?.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Stack>
            </Stack>
            {loadingList ? (
              <FullScreenLoader open={true} />
            ) : pmScheduleActivityData &&
              pmScheduleActivityData !== null &&
              pmScheduleActivityData.length > 0 ? (
              <ServerSideListComponents
                height={500}
                rows={pmScheduleActivityData}
                columns={columns}
                isCheckbox={false}
                total={total}
                page={page}
                onPageChange={setPage}
                pageSize={LIST_LIMIT}
                onChange={(selectedIds) => {
                  console.log("Selected row IDs in EmployeeList:", selectedIds);
                }}
              />
            ) : (
              <Box sx={{ height: 560 }}>
                <EmptyContent
                  imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND}
                  title={"No PM Schedule Found"}
                  subTitle={""}
                />
              </Box>

            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3, xl: 3 }}>
          <Stack>
            <Box>
              {" "}
              {/* Upcoming PM Schedules Panel */}
              <Card
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: "8px",
                  bgcolor: "#fff",
                  height: "642px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "2px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: "2px",
                  },
                }}
              >
                <Stack sx={{ gap: 2 }}>
                  <Stack sx={{ gap: 2 }}>
                    <Stack>
                      <TypographyComponent
                        fontSize={18}
                        fontWeight={600}
                        sx={{ color: theme.palette.grey[700] }}
                      >
                        Upcoming PM Schedules
                      </TypographyComponent>
                    </Stack>
                    <Stack>
                      {/* Filter Dropdown */}
                      <Select
                        defaultValue="This Month"
                        size="small"
                        value={selectedUpcomingPmSchedule}
                        onChange={(event) => {
                          setSelectedUpcomingPmSchedule(event.target.value);
                        }}
                        sx={{
                          borderRadius: 2,
                          fontSize: 14,
                          fontWeight: 500,
                          height: 40,
                          width: "100%",
                          color: theme.palette.grey[700],
                          ".MuiSelect-select": { py: 0.5 },
                        }}
                      >
                        <MenuItem value="This Month">
                          <em></em>
                        </MenuItem>
                        {getMasterPMActivitySchedule &&
                          getMasterPMActivitySchedule.map((option) => (
                            <MenuItem
                              key={option?.name}
                              value={option?.name}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                maxWidth: 430,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {option?.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </Stack>
                  </Stack>

                  <Stack sx={{ gap: 2, marginTop: 1 }}>
                    {upcomingSchedules &&
                      upcomingSchedules !== null &&
                      upcomingSchedules?.length > 0 &&
                      upcomingSchedules?.map((item, index) => (
                        <Box key={item.id}>
                          <Box
                            sx={{
                              backgroundColor: theme.palette.primary[100],
                              color: theme.palette.primary[600],
                              borderRadius: 1,
                              p: 0.5,
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <Stack sx={{ width: "100%" }}>
                              <Typography
                                fontSize={13}
                                color={theme.palette.grey[800]}
                                fontWeight={600}
                                height={40}
                                p={1}
                                width={380}
                              >
                                {item.date}
                              </Typography>
                            </Stack>
                          </Box>
                          <Typography
                            mt={0.5}
                            fontSize={14}
                            color={theme.palette.grey[800]}
                            fontWeight={500}
                            width={320}
                            height={40}
                            p={1}
                          >
                            {item.title}
                          </Typography>
                          {index !== upcomingSchedules.length - 1 && (
                            <Divider sx={{ gap: 2, mt: 1 }} />
                          )}
                        </Box>
                      ))}
                  </Stack>
                </Stack>
              </Card>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <AddPMSchedule
        open={openAddPmSchedule}
        handleClose={() => {
          setOpenAddPmSchedule(false);
          dispatch(
            actionPMScheduleList({
              page: page,
              limit: LIST_LIMIT,
              status: selectedStatus,
              asset_type: selectedAssetTypes,
              branch_uuid: branch?.currentBranch?.uuid,
              frequency: selectedFrequency,
              upcoming_filter: selectedUpcomingPmSchedule,
            })
          );
        }}
      />

      {openDeletePmActivityPopup && (
        <AlertPopup
          open={openDeletePmActivityPopup}
          icon={
            <AlertCircleIcon
              sx={{ color: theme.palette.error[600] }}
              fontSize="inherit"
            />
          }
          color={theme.palette.error[600]}
          objData={selectedPmActivityData}
          actionButtons={[
            <Button
              key="cancel"
              color="secondary"
              variant="outlined"
              sx={{
                width: "100%",
                color: theme.palette.grey[800],
                textTransform: "capitalize",
              }}
              onClick={() => {
                setOpenDeletePmActivityPopup(false);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="delete"
              variant="contained"
              sx={{
                width: "100%",
                textTransform: "capitalize",
                background: theme.palette.error[600],
                color: theme.palette.common.white,
              }}
              disabled={loadingDeletePmActivity}
              onClick={() => {
                setLoadingDeletePmActivity(true);
                if (
                  selectedPmActivityData?.uuid &&
                  selectedPmActivityData?.uuid !== null
                ) {
                  dispatch(
                    actionDeletePmActivity({
                      uuid: selectedPmActivityData?.uuid,
                    })
                  );
                }
              }}
            >
              {loadingDeletePmActivity ? (
                <CircularProgress size={20} color="white" />
              ) : (
                "Delete"
              )}
            </Button>,
          ]}
        />
      )}

      <PMActivityDetails
        open={openPmActivityDetails}
        objData={pmScheduleActivityData}
        handleClose={() => {
          setOpenPmActivityDetails(false);
          dispatch(
            actionPMScheduleList({
              page: page,
              limit: LIST_LIMIT,
              status: selectedStatus,
              asset_type: selectedAssetTypes,
              branch_uuid: branch?.currentBranch?.uuid,
              frequency: selectedFrequency,
              upcoming_filter: selectedUpcomingPmSchedule,
            })
          );
        }}
      />
    </React.Fragment>
  );
}
