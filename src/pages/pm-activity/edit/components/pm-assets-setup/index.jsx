/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import SearchIcon from "../../../../../assets/icons/SearchIcon";
import TypographyComponent from "../../../../../components/custom-typography";
import { AntSwitch, SearchInput } from "../../../../../components/common";
import CustomTextField from "../../../../../components/text-field";
import FormLabel from "../../../../../components/form-label";
import EmptyContent from "../../../../../components/empty_content";
import {
  ERROR,
  IMAGES_SCREEN_NO_DATA,
  SERVER_ERROR,
  UNAUTHORIZED,
  getMasterPMActivityEditStatus,
  getPmActivityFrequencyArray,
} from "../../../../../constants";
import {
  actionMasterAssetType,
  resetMasterAssetTypeResponse,
} from "../../../../../store/asset";
import {
  actionAssetTypeWiseList,
  resetAssetTypeWiseListResponse,
} from "../../../../../store/roster";
import { useAuth } from "../../../../../hooks/useAuth";
import { useBranch } from "../../../../../hooks/useBranch";
import { useSnackbar } from "../../../../../hooks/useSnackbar";
import DeleteIcon from "../../../../../assets/icons/DeleteIcon";
import DatePicker from "react-datepicker";
import CalendarIcon from "../../../../../assets/icons/CalendarIcon";
import DatePickerWrapper from "../../../../../components/datapicker-wrapper";
import moment from "moment";
import ChevronDownIcon from "../../../../../assets/icons/ChevronDown";
import { actionPMScheduleData } from "../../../../../store/pm-activity";
import { getObjectById } from "../../../../../utils";

export default function PMActivityAssetSetUp() {
  /**
   * 🔹 Hooks & Store Access
   * @description : Accessing theme, dispatch, auth, snackbar, branch and form context
   */
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const branch = useBranch();

  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  /**
   * 🔹 Local States
   * @description : Local states for search query, asset type options and asset list
   */
  const [searchQuery, setSearchQuery] = useState("");
  const [assetTypeMasterOption, setAssetTypeMasterOption] = useState([]);
  const [assetTypeWiseListOptions, setAssetTypeWiseListOptions] = useState([]);
  const [assetTypeWiseListOriginalData, setAssetTypeWiseListOriginalData] =
    useState([]);

  /**
   * 🔹 Redux Store Access
   *  @description : Accessing master asset type and asset type wise list from Redux store
   */
  const { masterAssetType } = useSelector((state) => state.AssetStore);
  const { assetTypeWiseList } = useSelector((state) => state.rosterStore);
  const { pmScheduleData } = useSelector((state) => state.pmActivityStore);

  /**
   * 🔹 Handle PM Schedule Details Response and populate form
   */
  useEffect(() => {
    if (pmScheduleData?.pm_details && pmScheduleData?.pm_details !== null) {
      // Populate form with existing data
      setValue("pm_activity_title", pmScheduleData?.pm_details?.title || "");
      setValue("frequency", pmScheduleData?.pm_details?.frequency || "");
      setValue(
        "schedule_start_date",
        pmScheduleData?.pm_details?.schedule_start_date
          ? moment(
            pmScheduleData?.pm_details.schedule_start_date,
            "YYYY-MM-DD"
          ).format("DD/MM/YYYY")
          : ""
      );
      setValue("status", pmScheduleData?.pm_details?.status || "");
    }
  }, [pmScheduleData?.pm_details]);

  /**
   * 🔹 Initial API call to fetch master asset types
   */
  useEffect(() => {
    if (branch?.currentBranch?.client_uuid) {
      dispatch(
        actionMasterAssetType({
          client_uuid: branch.currentBranch.client_uuid,
        })
      );
    }
  }, [branch?.currentBranch]);

  /**
   * 🔹 Fetch asset-type-wise list when asset type changes
   */
  useEffect(() => {
    if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && pmScheduleData?.asset_type && pmScheduleData?.asset_type !== null && pmScheduleData?.asset_type_id && pmScheduleData?.asset_type_id !== null) {
      dispatch(
        actionAssetTypeWiseList({
          branch_uuid: branch?.currentBranch?.uuid,
          asset_type: pmScheduleData?.asset_type,
          asset_type_id: pmScheduleData?.asset_type_id
        })
      );
    }
  }, [branch?.currentBranch, pmScheduleData?.asset_type]);

  /**
   * 🔹 Handle Master Asset Type Response
   */
  useEffect(() => {
    if (!masterAssetType) return;
    dispatch(resetMasterAssetTypeResponse());

    if (masterAssetType?.result === true) {
      setAssetTypeMasterOption(masterAssetType?.response ?? []);
      if (pmScheduleData?.assets !== null && pmScheduleData?.assets?.length > 0) {
        setValue("asset_type", pmScheduleData?.assets[0]?.asset_type_id)
        const updated = { ...pmScheduleData, asset_type: pmScheduleData?.assets[0]?.asset_type, asset_type_id: pmScheduleData?.assets[0]?.asset_type_id };
        dispatch(actionPMScheduleData(updated));
      } else {
        if (
          masterAssetType?.response?.length > 0 &&
          !pmScheduleData?.asset_type
        ) {
          const firstAsset = masterAssetType.response[0];
          setValue("asset_type", firstAsset?.id);
          const updated = { ...pmScheduleData, asset_type: firstAsset?.name, asset_type_id: firstAsset?.id };
          dispatch(actionPMScheduleData(updated));
        }
      }
    } else {
      setAssetTypeMasterOption([]);
      switch (masterAssetType?.status) {
        case UNAUTHORIZED:
          logout();
          break;
        case ERROR:
          break;
        case SERVER_ERROR:
          toast.dismiss();
          showSnackbar({
            message: masterAssetType?.message,
            severity: "error",
          });
          break;
        default:
          break;
      }
    }
  }, [masterAssetType]);

  /**
   * 🔹 Handle Asset Type Wise List Response
   */
  useEffect(() => {
    if (!assetTypeWiseList) return;
    dispatch(resetAssetTypeWiseListResponse());

    if (assetTypeWiseList?.result === true) {
      const data = assetTypeWiseList?.response ?? [];
      setAssetTypeWiseListOptions(data);
      setAssetTypeWiseListOriginalData(data);
    } else {
      setAssetTypeWiseListOptions([]);
      setAssetTypeWiseListOriginalData([]);
      switch (assetTypeWiseList?.status) {
        case UNAUTHORIZED:
          logout();
          break;
        case SERVER_ERROR:
          toast.dismiss();
          showSnackbar({
            message: assetTypeWiseList?.message,
            severity: "error",
          });
          break;
        default:
          break;
      }
    }
  }, [assetTypeWiseList]);

  /**
   * 🔹 Filter search results
   */
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered =
        assetTypeWiseListOriginalData?.filter(
          (item) =>
            item?.asset_description
              ?.toLowerCase()
              ?.includes(searchQuery.toLowerCase()) ||
            item?.type?.toLowerCase()?.includes(searchQuery.toLowerCase())
        ) ?? [];
      setAssetTypeWiseListOptions(filtered);
    } else {
      setAssetTypeWiseListOptions(assetTypeWiseListOriginalData ?? []);
    }
  }, [searchQuery]);

  /**
   * 🔹 Handlers
   * @description : Handlers for search input changes
   */
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Grid container spacing={4} sx={{ mt: 1 }}>
      {/* 🔹 LEFT PANEL: Select Asset */}
      <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
        <TypographyComponent fontSize={"16px"} fontWeight={600}>
          Select Asset
        </TypographyComponent>

        <Card
          sx={{
            borderRadius: '16px',
            padding: '24px',
            gap: '32px',
            border: `1px solid ${theme.palette.grey[300]}`,
            mt: 2,
            height: 680
          }}>
          <CardContent sx={{ p: 0 }}>
            <Stack>
              <Controller
                name="asset_type"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={field?.value ?? ""}
                    label={
                      <FormLabel
                        label="Select Asset Type "
                        required={false}
                      />
                    }
                    onChange={(event) => {
                      field.onChange(event);
                      let objData = Object.assign({}, pmScheduleData);
                      let objCurrent = getObjectById(
                        assetTypeMasterOption,
                        event.target.value
                      );
                      objData.asset_type = objCurrent.name;
                      objData.asset_type_id = event.target.value
                      dispatch(actionPMScheduleData(objData));
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      IconComponent: ChevronDownIcon,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 220,
                            scrollbarWidth: "thin",
                          },
                        },
                      },
                    }}
                    error={Boolean(errors.asset_type)}
                    {...(errors.asset_type && {
                      helperText: errors.asset_type.message,
                    })}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Asset Type</em>
                    </MenuItem>
                    {assetTypeMasterOption &&
                      assetTypeMasterOption.map((option) => (
                        <MenuItem
                          key={option?.id}
                          value={option?.id}
                          color={theme.palette.primary[900]}
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: 550,
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
                )}
              />
            </Stack>
            <Stack sx={{ my: 2 }}>
              <SearchInput
                id="search-assets"
                placeholder="Search"
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={handleSearchQueryChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <SearchIcon stroke={theme.palette.grey[500]} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <List dense sx={{
              p: 0,
              height: 420,
              flexGrow: 1,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '2px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
                borderRadius: '2px'
              }
            }}>
              {(assetTypeWiseListOptions ?? []).length > 0 ? (
                assetTypeWiseListOptions.map((asset) => {
                  const isChecked = (pmScheduleData?.assets ?? []).some(
                    (item) =>
                      item.asset_id === asset.id &&
                      item.asset_type === asset.type
                  );

                  return (
                    <ListItem
                      key={asset.id}
                      disablePadding
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1.5,
                        px: 1,
                        borderBottom: `1px solid ${theme.palette.grey[300]}`,
                      }}
                    >
                      <Box>
                        <TypographyComponent fontSize={16} fontWeight={400}>
                          {asset?.asset_description ?? "N/A"}
                        </TypographyComponent>
                        <TypographyComponent
                          fontSize={14}
                          fontWeight={400}
                          sx={{ color: theme.palette.grey[600] }}
                        >
                          {asset?.type ?? "N/A"}
                        </TypographyComponent>
                      </Box>

                      <AntSwitch
                        checked={isChecked}
                        onChange={(event) => {
                          const updated = { ...pmScheduleData };
                          let updatedAssets = [...(updated.assets ?? [])];

                          if (event.target.checked) {
                            // Add asset if not already selected
                            if (
                              !updatedAssets.some(
                                (item) =>
                                  item.asset_id === asset.id &&
                                  item.asset_type === asset.type
                              )
                            ) {
                              updatedAssets.push({
                                asset_id: asset.id,
                                asset_type: asset.type,
                                asset_type_id: asset.asset_type_id,
                                asset_description: asset.asset_description,
                                location: asset.location,
                                frequency_exceptions: [],
                              });
                            }
                          } else {
                            // Remove asset if unchecked
                            updatedAssets = updatedAssets.filter(
                              (item) =>
                                !(
                                  item.asset_id === asset.id &&
                                  item.asset_type === asset.type
                                )
                            );
                          }

                          updated.assets = updatedAssets;
                          dispatch(actionPMScheduleData(updated));
                        }}
                      />
                    </ListItem>
                  );
                })
              ) : (
                <EmptyContent
                  imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND}
                  title="No Asset Found"
                  subTitle=""
                />
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* 🔹 MIDDLE PANEL: Selected Asset Details */}
      <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
        <Stack
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Stack sx={{ mb: 2 }}>
            <TypographyComponent fontSize={"16px"} fontWeight={600}>
              Selected Asset Details
            </TypographyComponent>
          </Stack>
          <Stack>
            <TypographyComponent fontSize={"16px"} fontWeight={600}>
              ({pmScheduleData?.assets?.length || 0})
            </TypographyComponent>
          </Stack>
        </Stack>

        <Card
          sx={{
            borderRadius: '16px',
            padding: '12px',
            gap: '16px',
            border: `1px solid ${theme.palette.grey[300]}`,
            height: 680,
            flexGrow: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '2px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
              borderRadius: '2px'
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            {(pmScheduleData?.assets ?? []).length > 0 ? (
              pmScheduleData.assets.map((asset, index) => (
                <React.Fragment key={asset.asset_id || index}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ py: 1 }}
                  >
                    {/* Asset Name */}
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{ color: theme.palette.grey[1000] }}
                      >
                        Asset Name
                      </TypographyComponent>

                      <TypographyComponent
                        fontSize={14}
                        fontWeight={600}
                        sx={{ color: theme.palette.grey[400] }}
                      >
                        {asset?.asset_name ?? "N/A"}
                      </TypographyComponent>
                    </Grid>

                    {/* Asset Type */}
                    <Grid size={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                      <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{ color: theme.palette.grey[1000] }}
                      >
                        Asset Type
                      </TypographyComponent>

                      <TypographyComponent
                        fontSize={14}
                        fontWeight={600}
                        sx={{ color: theme.palette.grey[400] }}
                      >
                        {asset?.asset_type ?? "N/A"}
                      </TypographyComponent>
                    </Grid>

                    {/* Delete Icon */}
                    <Grid
                      size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
                      sx={{
                        paddingLeft: 5,
                      }}
                    >
                      <IconButton
                        color="error"
                        onClick={() => {
                          const updated = { ...pmScheduleData };
                          updated.assets = (updated.assets ?? []).filter(
                            (item) =>
                              !(
                                item.asset_id === asset.asset_id &&
                                item.asset_type === asset.asset_type
                              )
                          );
                          dispatch(actionPMScheduleData(updated));
                        }}
                      >
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </Grid>
                  </Grid>

                  {index < pmScheduleData.assets.length - 1 && (
                    <Divider
                      sx={{
                        my: 1.5,
                        borderColor: theme.palette.grey[300],
                      }}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Stack sx={{ py: 2 }}>
                <EmptyContent
                  imageUrl={"/assets/person-details.png"}
                  title="Select Asset to get details"
                  subTitle=""
                />
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* 🔹 RIGHT PANEL: PM Activity Group */}
      <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
        <TypographyComponent
          fontSize={"16px"}
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          PM Activity Details
        </TypographyComponent>

        <Card
          sx={{
            borderRadius: "16px",
            padding: "12px",
            gap: "16px",
            border: `1px solid ${theme.palette.grey[300]}`,
            height: 680,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <DatePickerWrapper>
              <Grid container sx={{ gap: "18px" }}>
                {/* PM Activity Title */}
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Controller
                    name="pm_activity_title"
                    control={control}
                    rules={{
                      required: "PM Activity Title is required",
                      maxLength: {
                        value: 255,
                        message: "Maximum length is 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        value={field?.value || ""}
                        label={
                          <FormLabel
                            label="PM Activity Title"
                            fontSize={14}
                            fontWeight={500}
                            required={true}
                          />
                        }
                        placeholder="Enter activity title"
                        onChange={(e) => field.onChange(e)}
                        inputProps={{ maxLength: 255 }}
                        error={Boolean(errors.pm_activity_title)}
                        {...(errors.pm_activity_title && {
                          helperText: errors.pm_activity_title.message,
                        })}
                      />
                    )}
                  />
                </Grid>
                {/* Frequency */}
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Controller
                    name="frequency"
                    control={control}
                    rules={{
                      required: "Frequency is required",
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        value={field?.value || ""}
                        label={
                          <FormLabel label="Frequency" required={true} />
                        }
                        placeholder="Select frequency"
                        onChange={(e) => field.onChange(e)}
                        error={Boolean(errors.frequency)}
                        {...(errors.frequency && {
                          helperText: errors.frequency.message,
                        })}
                        SelectProps={{
                          displayEmpty: true,
                          IconComponent: ChevronDownIcon,
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
                        <MenuItem value="" disabled>
                          <em>Select Frequency</em>
                        </MenuItem>

                        {getPmActivityFrequencyArray &&
                          getPmActivityFrequencyArray.map((option) => (
                            <MenuItem
                              key={option?.name}
                              value={option?.name}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                maxWidth: 440,
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
                    )}
                  />
                </Grid>
                {/* Schedule Start Date */}
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Controller
                    name="schedule_start_date"
                    control={control}
                    rules={{
                      required: "Schedule Start Date is required",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        id="schedule_start_date"
                        customInput={
                          <CustomTextField
                            size="small"
                            label={
                              <FormLabel
                                label="Schedule Start Date"
                                required={true}
                              />
                            }
                            fullWidth
                            placeholder="DD/MM/YYYY"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <IconButton
                                    edge="start"
                                    onMouseDown={(e) => e.preventDefault()}
                                  >
                                    <CalendarIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            error={Boolean(errors.schedule_start_date)}
                            {...(errors.schedule_start_date && {
                              helperText: errors.schedule_start_date.message,
                            })}
                          />
                        }
                        value={field.value}
                        selected={
                          field?.value
                            ? moment(field.value, "DD/MM/YYYY").toDate()
                            : null
                        }
                        showYearDropdown={true}
                        onChange={(date) => {
                          const formattedDate =
                            moment(date).format("DD/MM/YYYY");
                          field.onChange(formattedDate);
                        }}
                      />
                    )}
                  />
                </Grid>
                {/* Status */}
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        value={field?.value || ""}
                        label={<FormLabel label="Status" required={true} />}
                        placeholder="Select status"
                        onChange={(e) => field.onChange(e)}
                        error={Boolean(errors.status)}
                        {...(errors.status && {
                          helperText: errors.status.message,
                        })}
                        SelectProps={{
                          displayEmpty: true,
                          IconComponent: ChevronDownIcon,
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
                        <MenuItem value="" disabled>
                          <em>Select Status</em>
                        </MenuItem>

                        {getMasterPMActivityEditStatus &&
                          getMasterPMActivityEditStatus.map((option) => (
                            <MenuItem
                              key={option?.name}
                              value={option?.name}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                maxWidth: 440,
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
                    )}
                  />
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
