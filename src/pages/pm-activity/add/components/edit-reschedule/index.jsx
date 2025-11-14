/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import moment from "moment";
import TypographyComponent from "../../../../../components/custom-typography";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import FormLabel from "../../../../../components/form-label";
import CalendarIcon from "../../../../../assets/icons/CalendarIcon";
import CustomTextField from "../../../../../components/text-field";
import DatePickerWrapper from "../../../../../components/datapicker-wrapper";
import { useSelector } from "react-redux";

export default function ReschedulePopup({
  open,
  handleClose,
  selectedActivity,
}) {
  const theme = useTheme();
  const isMDDown = useMediaQuery(theme.breakpoints.down("md"));

  const { pmScheduleData } = useSelector((state) => state.PmActivityStore);

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_schedule_date: "",
      new_date: "",
      reason_for_reschedule: "",
    },
  });

  useEffect(() => {
    if (open === true) {
      console.log("----selectedActivity-------", selectedActivity);
      if (
        selectedActivity !== null &&
        selectedActivity?.frequency_data !== null &&
        selectedActivity?.frequency_data?.date !== null
      ) {
        console.log("Details od date", selectedActivity?.frequency_data?.date);
        setValue(
          "current_schedule_date",
          moment(selectedActivity?.frequency_data?.date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          )
        );
      }
    }
  }, [pmScheduleData, open]);

  const onSubmit = (data) => {
    reset();
    handleClose(data, "save");
  };

  return (
    <Dialog
      fullWidth
      fullScreen={isMDDown}
      maxWidth="md"
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          overflow: "visible",
          borderRadius: 3,
        },
      }}
      scroll="paper"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack flexDirection="row" alignItems="center">
            <Stack columnGap={1}>
              <TypographyComponent fontSize={16} fontWeight={600}>
                Reschedule #{selectedActivity?.frequency_data?.id} PM Activity
              </TypographyComponent>
              <TypographyComponent
                fontSize={14}
                fontWeight={400}
                sx={{ color: theme.palette.grey[700] }}
              >
                Reschedule PM Activity #{selectedActivity?.frequency_data?.id}
              </TypographyComponent>
            </Stack>
          </Stack>
        </Stack>
      </DialogTitle>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            borderRadius: 2,
            scrollbarWidth: "thin",
            backgroundColor: "white",
            px: "24px",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          <DatePickerWrapper>
            <Grid
              container
              sx={{
                borderRadius: "16px",
                border: `1px solid ${theme.palette.grey[300]}`,
                padding: "24px",
              }}
            >
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{
                    color: theme.palette.grey[700],
                  }}
                >
                  Asset Name
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  {selectedActivity?.asset_description}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  Frequency
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  {pmScheduleData?.pm_details?.frequency}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  Schedule Date
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  {pmScheduleData?.pm_details?.schedule_start_date !== null &&
                    moment(
                      pmScheduleData?.pm_details?.schedule_start_date,
                      "DD/MM/YYYY"
                    ).format("DD MMM YYYY")}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  Location
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  {selectedActivity?.location}
                </TypographyComponent>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                <Controller
                  name="current_schedule_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="current_schedule_date"
                      customInput={
                        <CustomTextField
                          size="small"
                          label={
                            <FormLabel
                              label="Current Schedule Date"
                              required={false}
                            />
                          }
                          fullWidth
                          InputProps={{
                            startAdornment: (
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
                          error={Boolean(errors.current_schedule_date)}
                          {...(errors.current_schedule_date && {
                            helperText: errors.current_schedule_date.message,
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
                      disabled={true}
                      onChange={(date) => {
                        const formattedDate = moment(date).format("DD/MM/YYYY");
                        field.onChange(formattedDate);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                <Controller
                  name="new_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="new_date"
                      customInput={
                        <CustomTextField
                          size="small"
                          label={
                            <FormLabel label="New Date" required={false} />
                          }
                          fullWidth
                          InputProps={{
                            startAdornment: (
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
                          error={Boolean(errors.new_date)}
                          {...(errors.new_date && {
                            helperText: errors.new_date.message,
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
                        const formattedDate = moment(date).format("DD/MM/YYYY");
                        field.onChange(formattedDate);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <Controller
                  name="reason_for_reschedule"
                  control={control}
                  rules={{
                    required: "Name is required",
                    maxLength: {
                      value: 255,
                      message: "Maximum length is 255 characters",
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      placeholder={"Enter note"}
                      inputProps={{ maxLength: 255 }}
                      value={field?.value}
                      minRows={3}
                      multiline
                      label={
                        <FormLabel
                          label="Reason For Reschedule"
                          required={true}
                        />
                      }
                      onChange={field.onChange}
                      error={Boolean(errors.reason_for_reschedule)}
                      {...(errors.reason_for_reschedule && {
                        helperText: errors.reason_for_reschedule.message,
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </DialogContent>
      </form>
      <DialogActions sx={{ mx: 1, mb: 1, gap: 2 }}>
        <Button
          onClick={() => {
            reset();
            handleClose();
          }}
          variant="outlined"
          sx={{
            borderColor: theme.palette.grey[300],
            color: theme.palette.grey[700],
            borderRadius: "8px",
            px: 4,
            textTransform: "capitalize",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          sx={{
            backgroundColor: theme.palette.primary[600],
            color: theme.palette.common.white,
            borderRadius: "8px",
            px: 4,
            textTransform: "capitalize",
            fontWeight: 600,
            "&:disabled": {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          Confirm Reschedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}
