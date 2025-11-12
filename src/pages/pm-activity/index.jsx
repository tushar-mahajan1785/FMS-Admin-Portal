/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import OverDueIcon from "../../assets/icons/OverdueIcon";
import {
  ERROR,
  getMasterPMActivityStatus,
  getPmActivityFrequencyArray,
  getMasterPMActivitySchedule,
  IMAGES_SCREEN_NO_DATA,
  LIST_LIMIT,
  SERVER_ERROR,
  UNAUTHORIZED,
} from "../../constants";
import EmptyContent from "../../components/empty_content";
import FullScreenLoader from "../../components/fullscreen-loader";
import TypographyComponent from "../../components/custom-typography";
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
} from "../../store/pm-activity";
import {
  actionMasterAssetType,
  resetMasterAssetTypeResponse,
} from "../../store/asset";

export default function PmActivity() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();

  // store
  const { pmScheduleList } = useSelector((state) => state.PmActivityStore);

  const [searchQuery, setSearchQuery] = useState("");
  const [pmScheduleActivityData, setPmScheduleActivityData] = useState([]);
  const [originalPmActivityScheduleData, setOriginalPmActivityScheduleData] =
    useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAssetTypes, setSelectedAssetTypes] = useState("");
  const [masterAssetTypeOptions, setMasterAssetTypeOptions] = useState([]);
  const [masterPmActivityStatusOptions] = useState(getMasterPMActivityStatus);
  const [masterPmActivityScheduleOptions] = useState(
    getMasterPMActivitySchedule
  );

  const [openAddTicket, setOpenAddTicket] = useState(false);
  const { masterAssetType } = useSelector((state) => state.AssetStore);

  const upcomingSchedules = [
    { id: 1, date: "11 Nov 2025", title: "Electrical system PM schedule" },
    { id: 2, date: "16 Nov 2025", title: "Plumbing system PM schedule" },
    { id: 3, date: "23 Nov 2025", title: "Fire safety PM schedule" },
    { id: 4, date: "24 Nov 2025", title: "Emergency safety PM schedule" },
    { id: 5, date: "24 Nov 2025", title: "Electrical safety PM schedule" },
    { id: 6, date: "24 Nov 2025", title: "Plumbing safety PM schedule" },
  ];

  const columns = [
    {
      flex: 0.5,
      field: "title",
      headerName: "Title",
    },
    {
      flex: 0.7,
      field: "assets",
      headerName: "Assets",
      renderCell: (params) => {
        // Check if 'assets' is a string or array
        let assets = params?.row?.assets;
        if (!assets) return "-";

        // Convert string (comma-separated or bracketed) to array if needed
        if (typeof assets === "string") {
          assets = assets
            .replace(/[\[\]]/g, "") // remove brackets if any
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a.length > 0);
        }

        // If only 1 or 2 assets, show them all
        if (assets.length <= 2) {
          return (
            <Stack direction="row" spacing={1}>
              {assets.map((asset, idx) => (
                <Chip
                  key={idx}
                  label={asset}
                  sx={{
                    bgcolor: "#F9F4FF",
                    color: "#7E57C2",
                    fontWeight: 500,
                    fontSize: "13px",
                    borderRadius: "16px",
                  }}
                />
              ))}
            </Stack>
          );
        }

        // If more than 2 assets, show first 2 + "+N"
        const remainingCount = assets.length - 2;
        const visibleAssets = assets.slice(0, 2);

        return (
          <Stack direction="row" spacing={1}>
            {visibleAssets.map((asset, idx) => (
              <Chip
                key={idx}
                label={asset}
                sx={{
                  bgcolor: "#F9F4FF",
                  color: "#7E57C2",
                  fontWeight: 500,
                  fontSize: "13px",
                  borderRadius: "16px",
                }}
              />
            ))}
            <Chip
              label={`+${remainingCount}`}
              sx={{
                bgcolor: "#F9F4FF",
                color: "#7E57C2",
                fontWeight: 600,
                fontSize: "13px",
                borderRadius: "16px",
              }}
            />
          </Stack>
        );
      },
    },
    ,
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
      renderCell: () => {
        return (
          <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Delete" followCursor placement="top">
                {/* Delete Pm Activity  */}
                <IconButton
                // onClick={() => {
                //   // setEmployeeData(params.row)
                //   // setOpenEmployeeDetailsPopup(true)
                // }}
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
   * @dependency : pmScheduleList
   * @type : HANDLE API RESULT;
   * @description : Handle the result of ticket List API
   */
  useEffect(() => {
    if (pmScheduleList && pmScheduleList !== null) {
      dispatch(resetPmScheduleListResponse());
      if (pmScheduleList?.result === true) {
        setPmScheduleActivityData(pmScheduleList?.response?.data);
        setOriginalPmActivityScheduleData(pmScheduleList?.response?.data);
        let objData = pmScheduleList?.response?.counts;
        setGetArrPmActivityCounts((prevArr) =>
          prevArr.map((item) => ({
            ...item,
            value: objData[item.key] !== undefined ? objData[item.key] : 0,
          }))
        );
        setTotal(pmScheduleList?.response?.counts?.total_tickets);
        setLoadingList(false);
      } else {
        setLoadingList(false);
        setPmScheduleActivityData([
          {
            id: 1,
            title: "Electrical System PM Schedule",
            assets: [
              "CTPT Check Meter",
              "ISO-G-1 Panel",
              "Power Factor Panel",
              "VFD Main Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Quarterly",
            status: "Overdue",
          },
          {
            id: 2,
            title: "Plumbing System PM Schedule",
            assets: [
              "CTPT Check Meter",
              "Pump Control Panel",
              "Booster Pump Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Monthly",
            status: "Completed",
          },
          {
            id: 3,
            title: "Elevator PM Schedule",
            assets: [
              "ISO-G-1 Panel",
              "ATS Control Panel",
              "Soft Starter Panel",
              "VFD Bypass Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Weekly",
            status: "Active",
          },
          {
            id: 4,
            title: "Fire Safety System PM Schedule",
            assets: ["Conventional Fire Panel", "Sprinkler Control Panel"],
            start_date: "23/09/2025",
            frequency: "Yearly",
            status: "Active",
          },
          {
            id: 5,
            title: "Lighting System PM Schedule",
            assets: ["ISO-G-1 Panel", "CTPT Check Meter"],
            start_date: "23/09/2025",
            frequency: "Monthly",
            status: "Active",
          },
          {
            id: 6,
            title: "HVAC System PM Schedule",
            assets: [
              "Chiller Control Panel",
              "AHU Control Panel",
              "Cooling Tower Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Weekly",
            status: "Overdue",
          },
          {
            id: 7,
            title: "Security System PM Schedule",
            assets: ["CCTV Control Panel", "Access Control Panel"],
            start_date: "23/09/2025",
            frequency: "Yearly",
            status: "Completed",
          },
          {
            id: 8,
            title: "Water Treatment PM Schedule",
            assets: [
              "PLC Control Panel",
              "BMS Control Panel",
              "Main Distribution Board",
            ],
            start_date: "23/09/2025",
            frequency: "Monthly",
            status: "Active",
          },
          {
            id: 9,
            title: "Generator PM Schedule",
            assets: [
              "DG Control Panel",
              "DG Sync Panel",
              "ATS Control Panel",
              "Power Factor Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Weekly",
            status: "Active",
          },
          {
            id: 10,
            title: "Pump System PM Schedule",
            assets: [
              "Jockey Pump Panel",
              "Booster Pump Panel",
              "Fire Pump Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Yearly",
            status: "Completed",
          },
          {
            id: 11,
            title: "HVAC System PM Schedule",
            assets: [
              "Chiller Control Panel",
              "AHU Control Panel",
              "Cooling Tower Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Weekly",
            status: "Overdue",
          },
          {
            id: 12,
            title: "Security System PM Schedule",
            assets: ["CCTV Control Panel", "Access Control Panel"],
            start_date: "23/09/2025",
            frequency: "Yearly",
            status: "Completed",
          },
          {
            id: 13,
            title: "Water Treatment PM Schedule",
            assets: [
              "PLC Control Panel",
              "BMS Control Panel",
              "Main Distribution Board",
            ],
            start_date: "23/09/2025",
            frequency: "Monthly",
            status: "Active",
          },
          {
            id: 14,
            title: "Generator PM Schedule",
            assets: [
              "DG Control Panel",
              "DG Sync Panel",
              "ATS Control Panel",
              "Power Factor Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Weekly",
            status: "Active",
          },
          {
            id: 15,
            title: "Pump System PM Schedule",
            assets: [
              "Jockey Pump Panel",
              "Booster Pump Panel",
              "Fire Pump Panel",
            ],
            start_date: "23/09/2025",
            frequency: "Yearly",
            status: "Completed",
          },
        ]);

        setTotal(100);
        // setGetArrPmActivityCounts(null);
        // setPmScheduleActivityData;
        // [];
        // setOriginalPmActivityScheduleData;
        // [];
        let objData = {
          total_tickets: 0,
          open_tickets: 0,
          overdue_tickets: 0,
          on_hold_tickets: 0,
          closed_tickets: 0,
        };
        setGetArrPmActivityCounts((prevArr) =>
          prevArr.map((item) => ({
            ...item,
            value: objData[item.key] !== undefined ? objData[item.key] : 0,
          }))
        );
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
   * Ticket list API Call on change of Page
   */
  useEffect(() => {
    if (page !== null) {
      dispatch(
        actionPMScheduleList({
          page: page,
          limit: LIST_LIMIT,
          // priority: selectedPriority,
          status: selectedStatus,
          asset_type: selectedAssetTypes,
        })
      );
    }
  }, [page, selectedStatus, selectedAssetTypes]);

  //Keep this ONCE only

  //API for Asset Type
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
   * Filter the setting list
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

  // handle search function
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
                setOpenAddTicket(true);
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
                      backgroundColor: "#F1E9FF",
                      color: "#7E57C2",
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
                  label={`100 Schedule`}
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
                  {masterPmActivityStatusOptions &&
                    masterPmActivityStatusOptions.map((option) => (
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
                  value={selectedPriority}
                  onChange={(event) => {
                    setSelectedPriority(event.target.value);
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
              <EmptyContent
                imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND}
                title={"No Tickets Found"}
                subTitle={""}
              />
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
                      </Select>
                    </Stack>
                  </Stack>

                  <Stack sx={{ gap: 2, marginTop: 1 }}>
                    {upcomingSchedules.map((item, index) => (
                      <Box key={item.id}>
                        <Box
                          sx={{
                            bgcolor: "#F9F4FF",
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
        open={openAddTicket}
        handleClose={() => {
          setOpenAddTicket(false);
        }}
      />
    </React.Fragment>
  );
}
