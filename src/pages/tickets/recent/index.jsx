import React, { useState } from 'react'
import MyBreadcrumbs from '../../../components/breadcrumb'
import { Box, Button, Card, CardContent, Chip, Grid, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import TicketIcon from '../../../assets/icons/TicketIcon';
import OpenTicketIcon from '../../../assets/icons/OpenTicketIcon';
import OnHoldTicketIcon from '../../../assets/icons/OnHoldTicketIcon';
import OverDueIcon from '../../../assets/OverdueIcon';
import CircleCloseIcon from '../../../assets/icons/CircleCloseIcon';
import { IMAGES_SCREEN_NO_DATA } from '../../../constants';
import EmptyContent from '../../../components/empty_content';
import ListComponents from '../../../components/list-components';
import FullScreenLoader from '../../../components/fullscreen-loader';
import TypographyComponent from '../../../components/custom-typography';
import CustomChip from "../../../components/custom-chip";
import EyeIcon from '../../../assets/icons/EyeIcon';
import { TicketsByStatusChart } from './components/tickets-by-status';
import { SixMonthsTotalTicketChart } from './components/six-months-total-tickets';

export const RecentTicket = () => {
  const theme = useTheme()
  const [recentTicketsData] = useState([{
    id: 1,
    ticket_no: 'VF-2025-0001674',
    sr_no: '0005',
    asset_name: 'SERVICE-LIFT',
    location: 'Centre Core Service Lift',
    problem: 'we observed the abnormal sound in flushing pump room A . kindly arrange your engineer ASAP.',
    created_on: '23/09/1867',
    total_time: '03:00 Hrs',
    status: 'Open'
  },
  {
    id: 2,
    ticket_no: 'VF-2025-0001621',
    sr_no: '0005',
    asset_name: 'SERVICE-LIFT',
    location: 'Centre Core Service Lift',
    problem: 'we observed the abnormal sound in flushing pump room A . kindly arrange your engineer ASAP.',
    created_on: '23/09/1867',
    total_time: '03:00 Hrs',
    status: 'Closed'
  },
  {
    id: 3,
    ticket_no: 'VF-2025-0001625',
    sr_no: '0005',
    asset_name: 'SERVICE-LIFT',
    location: 'Centre Core Service Lift',
    problem: 'we observed the abnormal sound in flushing pump room A . kindly arrange your engineer ASAP.',
    created_on: '23/09/1867',
    total_time: '03:00 Hrs',
    status: 'On Hold'
  },
  {
    id: 4,
    ticket_no: 'VF-2025-0001621',
    sr_no: '0005',
    asset_name: 'SERVICE-LIFT',
    location: 'Centre Core Service Lift',
    problem: 'we observed the abnormal sound in flushing pump room A . kindly arrange your engineer ASAP.',
    created_on: '23/09/1867',
    total_time: '03:00 Hrs',
    status: 'Closed'
  },
  {
    id: 5,
    ticket_no: 'VF-2025-0001625',
    sr_no: '0005',
    asset_name: 'SERVICE-LIFT',
    location: 'Centre Core Service Lift',
    problem: 'we observed the abnormal sound in flushing pump room A . kindly arrange your engineer ASAP.',
    created_on: '23/09/1867',
    total_time: '03:00 Hrs',
    status: 'On Hold'
  },
  ])
  const [loadingList] = useState(false)

  const columns = [
    {
      flex: 0.07,
      field: 'sr_no',
      headerName: 'Sr. No.'
    },
    {
      flex: 0.1,
      field: 'ticket_no',
      headerName: 'Ticket No.'
    },
    {
      flex: 0.1,
      field: 'asset_name',
      headerName: 'Asset Name'
    },
    {
      flex: 0.15,
      field: 'location',
      headerName: 'Location'
    },
    {
      flex: 0.3,
      field: 'problem',
      headerName: 'Problem'
    },
    {
      flex: 0.1,
      field: 'created_on',
      headerName: 'Created On'
    },
    {
      flex: 0.1,
      field: 'total_time',
      headerName: 'Total Time'
    },
    {
      flex: 0.1,
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        let color = 'primary'
        switch (params?.row?.status) {
          case 'Open':
            color = 'success'
            break
          case 'Closed':
            color = 'primary'
            break
          case 'On Hold':
            color = 'warning'
            break
          case 'Rejected':
            color = 'error'
            break
          default:
            color = 'primary'
        }
        return (
          <React.Fragment><CustomChip text={params?.row?.status} colorName={color} /></React.Fragment>
        )
      }
    },
    {
      flex: 0.04,
      sortable: false,
      field: "",
      headerName: 'Action',
      renderCell: () => {
        return (
          <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Details" followCursor placement="top">
                {/* open employee details */}
                <IconButton
                  onClick={() => {
                    // setEmployeeData(params.row)
                    // setOpenEmployeeDetailsPopup(true)
                  }}
                >
                  <EyeIcon stroke={'#181D27'} />
                </IconButton>
              </Tooltip>
            </Box>
          </React.Fragment>
        );
      },
    },
  ];

  const data = [
    { labelTop: "Total", labelBottom: "Tickets", value: 1389, icon: <TicketIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Open", labelBottom: "Tickets", value: 42, icon: <OpenTicketIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "On-Hold", labelBottom: "Tickets", value: 2, icon: <OnHoldTicketIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Overdue", labelBottom: "Tickets", value: 0, icon: <OverDueIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Closed", labelBottom: "Tickets", value: 1345, icon: <CircleCloseIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
  ];

  return (
    <Stack>
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <MyBreadcrumbs />
        <Stack>
          <Button
            size={'small'}
            sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
            onClick={() => {

            }}
            variant='contained'
          >
            <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} />
            Add New Ticket
          </Button>
        </Stack>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "8px",
          columnGap: 2
        }}
      >
        {data.map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 0.5,
              p: 2,
              my: 2,
              borderRadius: '8px',
              overflow: "hidden",
              bgcolor: "#fff",

            }}
          >
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center' }}>
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
                    sx={{ color: theme.palette.grey[650], fontSize: "0.85rem", lineHeight: '20px' }}
                  >
                    {item.labelTop}
                  </Typography>

                  {/* Label Bottom */}
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    sx={{ color: theme.palette.grey[650], fontSize: "0.85rem", lineHeight: '20px' }}
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
      <Grid container columnGap={2} sx={{ mt: 1, mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
          <TicketsByStatusChart />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4.5, xl: 4.5 }}>
          <SixMonthsTotalTicketChart />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4.5, xl: 4.5 }}>

        </Grid>
      </Grid>

      <Stack sx={{ border: `1px solid ${theme.palette.grey[200]}`, borderRadius: '8px' }}>
        <Stack sx={{ flexDirection: 'row', background: theme.palette.common.white, width: '100%', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px' }}>
          <Stack sx={{ flexDirection: 'row', columnGap: 1, height: '100%', padding: '15px' }}>
            <Stack>
              <TypographyComponent fontSize={18} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>Recent Tickets</TypographyComponent>
            </Stack>
            <Chip
              label={`100 Tickets`}
              size="small"
              sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontSize: 14, fontWeight: 500 }}
            />
          </Stack>
          <Stack sx={{ paddingRight: '15px' }}>
            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.common.black }}>View All</TypographyComponent>
          </Stack>
        </Stack>
        {loadingList ? (
          <FullScreenLoader open={true} />
        ) : recentTicketsData && recentTicketsData !== null && recentTicketsData.length > 0 ? (
          <ListComponents
            height={320}
            rows={recentTicketsData}
            columns={columns}
            isCheckbox={false}
            onChange={(selectedIds) => {
              console.log("Selected row IDs in UsersList:", selectedIds);
            }}
          />
        ) : (
          <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No User Found'} subTitle={''} />
        )}
      </Stack>
    </Stack>
  )
}
