/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Button, Stack, useTheme, LinearProgress } from '@mui/material';
import TypographyComponent from '../../components/custom-typography';
import AlertTriangleIcon from '../../assets/icons/AlertTriangleIcon';
import StopwatchIcon from '../../assets/icons/StopwatchIcon';
import ClientsIcon from '../../assets/icons/ClientsIcon';
import AssetIcon from '../../assets/icons/AssetIcon';
import QuickIcon from '../../assets/icons/QuickIcon';
import CalenderPlusIcon from '../../assets/icons/CalenderPlusIcon';
import AddIcon from '@mui/icons-material/Add';
import BoxOnePlusIcon from '../../assets/icons/BoxOnePlusIcon';
import DocumentPlusIcon from '../../assets/icons/DocumentPlusIcon';
import FileCheckIcon from '../../assets/icons/FileCheckIcon';
import AssetRightIcon from '../../assets/icons/AssetRightIcon';
import UserIcon from '../../assets/icons/UserIcon'
import ActivityIcon from '../../assets/icons/ActivityIcon';
import CalendarStatsIcon from '../../assets/icons/CalendarStatsIcon';
import BellIcon from '../../assets/icons/BellIcon';
import { getInitials, usePagination, valueFormatter } from '../../utils';
import BatchIcon from '../../assets/icons/BatchIcon';
import StarEmptyIcon from '../../assets/icons/StarEmptyIcon';
import StarFilledIcon from '../../assets/icons/StarFilledIcon';
import ClockIcon from '../../assets/icons/ClockIcon';
import { useNavigate } from 'react-router-dom';
import Chart from "react-apexcharts";
import { PieChart } from '@mui/x-charts/PieChart';
import moment from 'moment';
import EmptyContent from '../../components/empty_content';
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../constants';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { actionGetDashboardDetails, resetGetDashboardDetailsResponse } from '../../store/dashboard';
import SuccessCircleCheckIcon from '../../assets/icons/SucessCircleCheckIcon';
import CircleExclamationMarkIcon from '../../assets/icons/CircleExclamationMarkIcon';
import CalendarTodayIcon from '../../assets/icons/CalendarTodayIcon';
import DescriptionOutlinedIcon from '../../assets/icons/DescriptionOutlinedIcon';
import { useBranch } from "../../hooks/useBranch"

export default function Dashboard() {
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const branch = useBranch()

  // store
  const { getDashboardDetails } = useSelector(state => state.dashboardStore)

  // state
  const [dashboardDetails, setDashboardDetails] = useState(null)

  // dashboard API call
  useEffect(() => {
    dispatch(actionGetDashboardDetails({ date: moment().format("YYYY-MM-DD"), branch_uuid: branch?.currentBranch?.uuid }))
  }, [])

  /**
    * useEffect
    * @dependency : getDashboardDetails
    * @type : HANDLE API RESULT
    * @description : Handle the result of get Dashboard Details API
    */
  useEffect(() => {
    if (getDashboardDetails && getDashboardDetails !== null) {
      dispatch(resetGetDashboardDetailsResponse())
      if (getDashboardDetails?.result === true) {
        setDashboardDetails(getDashboardDetails?.response)
      } else {
        setDashboardDetails(null)
        switch (getDashboardDetails?.status) {
          case UNAUTHORIZED:
            logout()
            break
          case ERROR:
            dispatch(resetGetDashboardDetailsResponse())
            break
          case SERVER_ERROR:
            showSnackbar({ message: getDashboardDetails?.message, severity: "error" })
            break
          default:
            break
        }
      }
    }
  }, [getDashboardDetails])

  const series = [
    {
      name: "Shift-wise Employees",
      data:
        dashboardDetails?.employees?.shift_wise &&
          dashboardDetails?.employees?.shift_wise.length > 0
          ? dashboardDetails?.employees?.shift_wise.map((d) => d.count)
          : [],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "9px",
        dataLabels: {
          position: "right",
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      offsetX: 10,
      style: {
        colors: [theme.palette.text.secondary],
        fontSize: "13px",
      },
      formatter: (val) => val.toLocaleString(),
    },
    xaxis: {
      categories: dashboardDetails?.employees?.shift_wise?.map((d) => d.shift),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "13px",
        },
        formatter: (val) =>
          val >= 1000 ? `${(val / 1000).toFixed(0).padStart(2, "0")}K` : val,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "13px",
        },
      },
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: true, // vertical lines
        },
      },
      yaxis: {
        lines: {
          show: false, // hide horizontal lines
        },
      },
      padding: {
        left: 10,
        right: 20,
      },
    },
    colors: [theme.palette.primary[600]],
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val) => `${val.toLocaleString()} employees`,
      },
    },
  };

  // pagination
  const assetPagination = usePagination(dashboardDetails?.assets?.health_overview, 5);
  const pmPagination = usePagination(dashboardDetails?.pm_activities?.upcoming, 5);
  const updatesPagination = usePagination(dashboardDetails?.system_updates, 5);

  const getIcon = (type) => {
    switch (type) {
      case 'PM_ACTIVITY': return <SuccessCircleCheckIcon color="success" />;
      case 'CHECKLIST': return <CircleExclamationMarkIcon color="warning" />;
      case 'TICKET': return <CalendarTodayIcon color="warning" size={24} />;
      case 'DOCUMENT': return <DescriptionOutlinedIcon color="warning" />;
      default: return <></>;
    }
  };

  return (
    <Box >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <TypographyComponent fontSize={20} fontWeight={500}>Facility Management Dashboard</TypographyComponent>
          <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Welcome back! Here's what's happening today.</TypographyComponent>
        </Box>
        <Box textAlign="right">
          <TypographyComponent fontSize={20} fontWeight={500}>{moment().format("hh:mm A")}</TypographyComponent>
          <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{moment().format("dddd, MMM DD")}</TypographyComponent>
        </Box>
      </Stack>

      {/* Stats Row */}
      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
          <Card sx={{ borderRadius: '20px', paddingTop: '16px', paddingX: '12px', gap: '12px' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyComponent fontSize={20} fontWeight={500} sx={{ color: theme.palette.warning[600] }}>Tickets</TypographyComponent>
                <Box
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: "8px",
                    backgroundColor: theme.palette.warning[50],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlertTriangleIcon stroke={theme.palette.warning[600]} />
                </Box>
              </Stack>
              <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={500}>{dashboardDetails?.tickets?.total && dashboardDetails?.tickets?.total !== null ? String(dashboardDetails?.tickets?.total).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.tickets?.active && dashboardDetails?.tickets?.active !== null ? String(dashboardDetails?.tickets?.active).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Active</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.tickets?.closed && dashboardDetails?.tickets?.closed !== null ? String(dashboardDetails?.tickets?.closed).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Closed</TypographyComponent>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
          <Card sx={{ borderRadius: '20px', paddingTop: '16px', paddingX: '12px', gap: '12px' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyComponent fontSize={20} fontWeight={500} sx={{ color: theme.palette.error[600] }}>Checklist</TypographyComponent>
                <Box
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: "8px",
                    backgroundColor: theme.palette.error[50],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <StopwatchIcon stroke={theme.palette.error[600]} />
                </Box>
              </Stack>
              <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={500}>{dashboardDetails?.checklists?.total && dashboardDetails?.checklists?.total !== null ? String(dashboardDetails?.checklists?.total).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.checklists?.completed && dashboardDetails?.checklists?.completed !== null ? String(dashboardDetails?.checklists?.completed).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Completed</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.checklists?.skipped && dashboardDetails?.checklists?.skipped !== null ? String(dashboardDetails?.checklists?.skipped).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Skipped</TypographyComponent>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
          <Card sx={{ borderRadius: '20px', paddingTop: '16px', paddingX: '12px', gap: '12px' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyComponent fontSize={20} fontWeight={500} sx={{ color: theme.palette.primary[600] }}>Employees</TypographyComponent>
                <Box
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: "8px",
                    backgroundColor: theme.palette.primary[50],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClientsIcon stroke={theme.palette.primary[600]} />
                </Box>
              </Stack>
              <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={500}>{dashboardDetails?.employees?.total && dashboardDetails?.employees?.total !== null ? String(dashboardDetails?.employees?.total).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.employees?.on_duty && dashboardDetails?.employees?.on_duty !== null ? String(dashboardDetails?.employees?.on_duty).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>On Duty</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.employees?.absent && dashboardDetails?.employees?.absent !== null ? String(dashboardDetails?.employees?.absent).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>On Leave</TypographyComponent>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
          <Card sx={{ borderRadius: '20px', paddingTop: '16px', paddingX: '12px', gap: '12px' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyComponent fontSize={20} fontWeight={500} sx={{ color: theme.palette.success[600] }}>Assets</TypographyComponent>
                <Box
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: "8px",
                    backgroundColor: theme.palette.success[50],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AssetIcon stroke={theme.palette.success[600]} />
                </Box>
              </Stack>
              <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={500}>{dashboardDetails?.assets?.total && dashboardDetails?.assets?.total !== null ? String(dashboardDetails?.assets?.total).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.assets?.low && dashboardDetails?.assets?.low !== null ? String(dashboardDetails?.assets?.low).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Low</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{dashboardDetails?.assets?.critical && dashboardDetails?.assets?.critical !== null ? String(dashboardDetails?.assets?.critical).padStart(2, '0') : '00'}</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Critical</TypographyComponent>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box
        mt={3}
        sx={{
          background: "linear-gradient(135deg, #9810FA, #155DFC)",
          p: 3,
          borderRadius: 4
        }}
      >
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <QuickIcon />
          <TypographyComponent fontSize={20} fontWeight={500} sx={{ color: theme.palette.common.white }}>Quick Actions</TypographyComponent>
        </Stack>
        <Stack sx={{ my: 1 }}>
          <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.common.white }}>Essential shortcuts to common tasks</TypographyComponent>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 6, md: 1.7, lg: 1.7, xl: 1.7 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#155DFC',
                color: theme.palette.common.white,
                borderRadius: 2,
                py: '12px',
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: '#155DFC' }
              }}
              onClick={() => {
                navigate('/manage-shift')
              }}
            >
              <Stack spacing={1} alignItems={'center'}>
                <CalenderPlusIcon />
                <TypographyComponent fontSize={16} fontWeight={400}>Create Shift</TypographyComponent>
              </Stack>
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 1.7, lg: 1.7, xl: 1.7 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#E7000B',
                color: theme.palette.common.white,
                borderRadius: 2,
                py: '12px',
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: '#E7000B' }
              }}
              onClick={() => {
                navigate('/tickets')
              }}
            >
              <Stack spacing={1} alignItems={'center'}>
                <AddIcon />
                <TypographyComponent fontSize={16} fontWeight={400}>Create Ticket</TypographyComponent>
              </Stack>
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 1.7, lg: 1.7, xl: 1.7 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#A11FFF',
                color: theme.palette.common.white,
                borderRadius: 2,
                py: '12px',
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: '#A11FFF' }
              }}
              onClick={() => {
                navigate('/pm-activity')
              }}
            >
              <Stack spacing={1} alignItems={'center'}>
                <BoxOnePlusIcon />
                <TypographyComponent fontSize={16} fontWeight={400}>Create PM Activity</TypographyComponent>
              </Stack>
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 1.7, lg: 1.7, xl: 1.7 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#F97E02',
                color: theme.palette.common.white,
                borderRadius: 2,
                py: '12px',
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: '#F97E02' }
              }}
              onClick={() => {
                navigate('/documents')
              }}
            >
              <Stack spacing={1} alignItems={'center'}>
                <DocumentPlusIcon />
                <TypographyComponent fontSize={16} fontWeight={400}>Upload Doc</TypographyComponent>
              </Stack>
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 1.7, lg: 1.7, xl: 1.7 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#00A63E',
                color: theme.palette.common.white,
                borderRadius: 2,
                py: '12px',
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: '#00A63E' }
              }}
              onClick={() => {
                navigate('/checklist')
              }}
            >
              <Stack spacing={1} alignItems={'center'}>
                <FileCheckIcon />
                <TypographyComponent fontSize={16} fontWeight={400}>New Checklist</TypographyComponent>
              </Stack>
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 1.7, lg: 1.7, xl: 1.7 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#39AEF6',
                color: theme.palette.common.white,
                borderRadius: 2,
                py: '12px',
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: '#39AEF6' }
              }}
              onClick={() => {
                navigate('/assets')
              }}
            >
              <Stack spacing={1} alignItems={'center'}>
                <AssetRightIcon />
                <TypographyComponent fontSize={16} fontWeight={400}>New Assets</TypographyComponent>
              </Stack>
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 1.7, lg: 1.7, xl: 1.7 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#E600A9',
                color: theme.palette.common.white,
                borderRadius: 2,
                py: '12px',
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: '#E600A9' }
              }}
              onClick={() => {
                navigate('/employees')
              }}
            >
              <Stack spacing={1} alignItems={'center'}>
                <UserIcon stroke={theme.palette.common.white} size={24} />
                <TypographyComponent fontSize={16} fontWeight={400}>Add Employee</TypographyComponent>
              </Stack>
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9, xl: 9 }}>
          <Card sx={{ height: 350, borderRadius: 3 }}>
            <CardContent>
              <TypographyComponent fontSize={16} fontWeight={400}>Shift wise Employee Count</TypographyComponent>
              {
                dashboardDetails?.employees?.shift_wise && dashboardDetails?.employees?.shift_wise !== null && dashboardDetails?.employees?.shift_wise?.length > 0 ?
                  <Chart
                    options={options}
                    series={series}
                    type="bar"
                    height={300}
                  />
                  :
                  <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Employee Found'} subTitle={''} mt={0} />
              }
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
          <Card sx={{ height: 350, borderRadius: 3 }}>
            <CardContent>
              <TypographyComponent fontSize={16} fontWeight={400}>Asset type wise Asset Count</TypographyComponent>
              {
                dashboardDetails?.assets?.type_wise && dashboardDetails?.assets?.type_wise !== null && dashboardDetails?.assets?.type_wise?.length > 0 ?
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ position: "relative", width: 250, height: 250, mt: 2 }}>
                      <PieChart
                        height={250}
                        width={250}
                        series={[
                          {
                            data: dashboardDetails?.assets?.type_wise,
                            innerRadius: 90,
                            outerRadius: 120,
                            arcLabelMinAngle: 20,
                            valueFormatter,
                          },
                        ]}
                        sx={{
                          "& .MuiChartsLegend-root": {
                            display: "none",
                          },
                          "& svg": {
                            margin: "0 auto",
                            display: "block",
                          },
                        }}
                        slotProps={{ legend: { hidden: true } }}
                      />

                      {/* Center overlay text */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <TypographyComponent
                          fontSize={26}
                          fontWeight={700}
                          sx={{ color: theme.palette.text.primary, lineHeight: 1 }}
                        >
                          {dashboardDetails?.assets?.type_wise_count}
                        </TypographyComponent>

                        <TypographyComponent
                          fontSize={14}
                          fontWeight={500}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          Total Assets
                        </TypographyComponent>
                      </Box>
                    </Box>
                  </Box>
                  :
                  <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Asset Found'} subTitle={''} mt={0} />
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        {/* Asset Health Overview */}
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <ActivityIcon />
            <TypographyComponent fontSize={20} fontWeight={500}>Asset Health Overview</TypographyComponent>
          </Stack>
          <Card sx={{ borderRadius: 3, mt: 1, height: 700 }}>
            <CardContent>
              {
                assetPagination?.paginatedData !== null && assetPagination?.paginatedData?.length > 0 ?
                  <React.Fragment>
                    <Stack spacing={3} sx={{ height: 640 }}>
                      {assetPagination?.paginatedData.map((item, index) => (
                        <Stack direction="row" gap={2} alignItems="center">
                          <Box
                            sx={{
                              height: 64,
                              width: 64,
                              borderRadius: "8px",
                              backgroundColor: theme.palette.primary[50],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TypographyComponent fontSize={30} fontWeight={600} sx={{ color: theme.palette.primary[600] }}>{getInitials(item.name, 1)}</TypographyComponent>
                          </Box>
                          <Box key={index} sx={{ width: '100%' }}>
                            <Stack direction="row" justifyContent="space-between">
                              <TypographyComponent fontSize={16} fontWeight={400}>{item.name}</TypographyComponent>
                              <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>{item.total} Assets</TypographyComponent>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={(item.healthy / item.total) * 100}
                              sx={{
                                height: 8,
                                borderRadius: 5,
                                mt: 1,
                                background: item.warning > 0 ? theme.palette.warning[400] : theme.palette.error[400],
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: theme.palette.success[400],
                                },
                              }} />
                            <Stack direction="row" spacing={2} mt={1}>
                              <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.success[600] }}>{item.healthy} healthy</TypographyComponent>
                              {item.warning > 0 && <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.warning[600] }}>{item.warning} warning</TypographyComponent>}
                              {item.critical > 0 && <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.error[600] }}>{item.critical} critical</TypographyComponent>}
                            </Stack>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                    <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                      {Array.from({ length: assetPagination.totalPages }).map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => assetPagination.setPage(index)}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            bgcolor: assetPagination.page === index ? theme.palette.primary[600] : theme.palette.primary[200],
                            transition: '0.3s',
                          }}
                        />
                      ))}
                    </Stack>
                  </React.Fragment>
                  :
                  <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Asset Health Overview Found'} subTitle={''} />
              }
            </CardContent>
          </Card>
        </Grid>
        {/* Upcoming PM Activities */}
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <CalendarStatsIcon />
              <TypographyComponent fontSize={20} fontWeight={500}>Upcoming PM Activities</TypographyComponent>
            </Stack>
            <Box sx={{ bgcolor: theme.palette.error[600], px: 2, py: 0.5, borderRadius: 2, color: theme.palette.common.white, fontSize: 16 }}>{moment().format("MMMM YYYY")}</Box>
          </Stack>
          <Card sx={{ borderRadius: 3, mt: 1, height: 700 }}>
            <CardContent>
              {
                pmPagination.paginatedData && pmPagination.paginatedData !== null && pmPagination.paginatedData?.length > 0 ?
                  <React.Fragment>
                    <Stack spacing={2} sx={{ height: 640 }}>
                      {pmPagination.paginatedData.map((item, index) => (
                        <Box key={index} sx={{ padding: '14px', borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
                          <Stack direction="row" justifyContent="space-between" mt={1}>
                            <Stack>
                              <TypographyComponent fontSize={16} fontWeight={400}>{item.title}</TypographyComponent>
                              <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                {item?.assets?.length
                                  ? item.assets.join(", ")
                                  : "-"}
                              </TypographyComponent>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{moment(item.date, "YYYY-MM-DD").format("DD MMM YYYY")}</TypographyComponent>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                            <ClockIcon stroke={theme.palette.grey[400]} />
                            <TypographyComponent fontSize={12} fontWeight={400} sx={{ color: theme.palette.grey[400] }}>{item.time}</TypographyComponent>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                    <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                      {Array.from({ length: pmPagination.totalPages }).map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => pmPagination.setPage(index)}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            bgcolor: pmPagination.page === index ? theme.palette.primary[600] : theme.palette.primary[200],
                            transition: '0.3s',
                          }}
                        />
                      ))}
                    </Stack>
                  </React.Fragment>
                  :
                  <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Upcoming PM Activities Found'} subTitle={''} />
              }
            </CardContent>
          </Card>
        </Grid>
        {/* System Updates */}
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <BellIcon />
              <TypographyComponent fontSize={20} fontWeight={500}>System Updates</TypographyComponent>
            </Stack>
            <Box sx={{ bgcolor: theme.palette.error[600], px: 2, py: 0.5, borderRadius: 2, color: theme.palette.common.white, fontSize: 16 }}>{dashboardDetails?.system_updates !== null && dashboardDetails?.system_updates?.length > 0 ? `${dashboardDetails?.system_updates?.length} New` : '0 New'}</Box>
          </Stack>
          <Card sx={{ borderRadius: 3, mt: 1, height: 700 }}>
            <CardContent>
              {
                updatesPagination.paginatedData && updatesPagination.paginatedData !== null && updatesPagination.paginatedData?.length > 0 ?
                  <React.Fragment>
                    <Stack spacing={2} sx={{ height: 640 }}>
                      {updatesPagination.paginatedData.map((item, index) => (
                        <Stack key={index} direction="row" spacing={2} sx={{ padding: '14px', borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
                          {getIcon(item?.type)}
                          <Box>
                            <TypographyComponent fontSize={16} fontWeight={400}>{item.title}</TypographyComponent>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500], mt: 1 }}>{item.description}</TypographyComponent>
                            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                              <ClockIcon stroke={theme.palette.grey[400]} />
                              <TypographyComponent fontSize={12} fontWeight={400} sx={{ color: theme.palette.grey[400] }}>{item.time}</TypographyComponent>
                            </Stack>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                    <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                      {Array.from({ length: updatesPagination.totalPages }).map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => updatesPagination.setPage(index)}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            bgcolor: updatesPagination.page === index ? theme.palette.primary[600] : theme.palette.primary[200],
                            transition: '0.3s',
                          }}
                        />
                      ))}
                    </Stack>
                  </React.Fragment>
                  :
                  <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No System Updates Found'} subTitle={''} />
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
