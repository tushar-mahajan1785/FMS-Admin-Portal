import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Stack, useTheme } from '@mui/material';
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

export default function Dashboard() {
  const theme = useTheme()

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <TypographyComponent fontSize={20} fontWeight={500}>Facility Management Dashboard</TypographyComponent>
          <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Welcome back! Here's what's happening today.</TypographyComponent>
        </Box>
        <Box textAlign="right">
          <TypographyComponent fontSize={20} fontWeight={500}>09:41 AM</TypographyComponent>
          <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Tuesday, Dec 09</TypographyComponent>
        </Box>
      </Stack>

      {/* Stats Row */}
      <Grid container spacing={2} mt={2}>
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
                  <TypographyComponent fontSize={36} fontWeight={500}>433</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>200</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Active</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>233</TypographyComponent>
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
                  <TypographyComponent fontSize={36} fontWeight={500}>278</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>200</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Completed</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>00</TypographyComponent>
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
                  <TypographyComponent fontSize={36} fontWeight={500}>433</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>430</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>On Duty</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>03</TypographyComponent>
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
                  <TypographyComponent fontSize={36} fontWeight={500}>435</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Total</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>08</TypographyComponent>
                  <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Low</TypographyComponent>
                </Stack>
                <Stack>
                  <TypographyComponent fontSize={36} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>01</TypographyComponent>
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
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9, xl: 9 }}>
          <Card sx={{ height: 300, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">Bar Chart</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
          <Card sx={{ height: 300, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">Pie Chart</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Widgets */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Asset Health */}
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <ActivityIcon />
            <TypographyComponent fontSize={20} fontWeight={500}>Asset Health Overview</TypographyComponent>
          </Stack>

          <Card sx={{ borderRadius: 3, height: 460 }}>
            <CardContent>

            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming PM */}
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <TypographyComponent fontSize={20} fontWeight={500}>Upcoming PM Activities</TypographyComponent>
          <Card sx={{ borderRadius: 3, height: 672 }}>
            <CardContent>

            </CardContent>
          </Card>
        </Grid>

        {/* System Updates */}
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <TypographyComponent fontSize={20} fontWeight={500}>System Updates</TypographyComponent>
          <Card sx={{ borderRadius: 3, height: 672 }}>
            <CardContent>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
