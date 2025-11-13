/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
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
} from "@mui/material";
import moment from "moment";

export default function ReschedulePopup({
  open,
  onClose,
  selectedActivity,
  onConfirm,
}) {
  const theme = useTheme();
  const isMDDown = useMediaQuery(theme.breakpoints.down("md"));

  // States
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");

  /**
   * Handle confirm reschedule
   */
  const handleConfirm = () => {
    if (newDate && reason.trim()) {
      onConfirm({
        activityId: selectedActivity?.id,
        newDate: moment(newDate).format("DD MMM YYYY"),
        reason: reason.trim(),
      });
      // Reset form
      setNewDate("");
      setReason("");
    }
  };

  /**
   * Handle close popup
   */
  const handleClose = () => {
    setNewDate("");
    setReason("");
    onClose();
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
              <Typography fontSize={16} fontWeight={600}>
                Reschedule #{selectedActivity?.id} PM Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reschedule PM Activity #{selectedActivity?.id}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogTitle>

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
        {/* Parent Grid Container */}
        <Grid
          spacing={4}
          mb={3}
          direction="row"
          sx={{
            borderRadius: "16px",
            padding: "24px",
            border: `1px solid ${theme.palette.grey[300]}`,
            height: "100%",
          }}
          size={{ xs: 12, sm: 12, md: 12 }}
        >
          {/* Asset Information Table - Full Width */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ mb: 3 }}>
            <TableContainer
              component={Paper}
              sx={{
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: 2,
              }}
            >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.grey[50],
                        borderRight: `1px solid ${theme.palette.grey[300]}`,
                        width: "25%",
                      }}
                    >
                      Asset Name
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>HVAC-T1L1001</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.grey[50],
                        borderRight: `1px solid ${theme.palette.grey[300]}`,
                        borderLeft: `1px solid ${theme.palette.grey[300]}`,
                        width: "25%",
                      }}
                    >
                      Frequency
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>Monthly</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.grey[50],
                        borderRight: `1px solid ${theme.palette.grey[300]}`,
                      }}
                    >
                      Schedule Date
                    </TableCell>
                    <TableCell>05 Jan 2026</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.grey[50],
                        borderRight: `1px solid ${theme.palette.grey[300]}`,
                        borderLeft: `1px solid ${theme.palette.grey[300]}`,
                      }}
                    >
                      Location
                    </TableCell>
                    <TableCell>T2-L2, Technical room 2A-02</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Date Selection Section */}
          <Grid container spacing={4} sx={{ width: "100%" }}>
            {/* Current Schedule Date */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Current Schedule Date
              </Typography>
              <TextField
                fullWidth
                value={
                  selectedActivity?.date
                    ? moment(selectedActivity.date).format("DD MMM YYYY")
                    : "N/A"
                }
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.grey[50],
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                This is a hint text to help user.
              </Typography>
            </Grid>

            {/* New Schedule Date */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                New Schedule Date
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                This is a hint text to help user.
              </Typography>
            </Grid>
          </Grid>

          {/* Reason for Reschedule - Full Width */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Reason for Reschedule
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter notes"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              This is a hint text to help user.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ mx: 1, mb: 1, gap: 2 }}>
        <Button
          onClick={handleClose}
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
          onClick={handleConfirm}
          variant="contained"
          disabled={!newDate || !reason.trim()}
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
