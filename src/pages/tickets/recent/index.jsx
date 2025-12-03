/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import MyBreadcrumbs from '../../../components/breadcrumb';
import { Box, Button, Card, Chip, Grid, IconButton, Stack, Tooltip, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TicketIcon from '../../../assets/icons/TicketIcon';
import OpenTicketIcon from '../../../assets/icons/OpenTicketIcon';
import OnHoldTicketIcon from '../../../assets/icons/OnHoldTicketIcon';
import OverDueIcon from '../../../assets/icons/OverdueIcon';
import CircleCloseIcon from '../../../assets/icons/CircleCloseIcon';
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import EmptyContent from '../../../components/empty_content';
import FullScreenLoader from '../../../components/fullscreen-loader';
import TypographyComponent from '../../../components/custom-typography';
import CustomChip from "../../../components/custom-chip";
import EyeIcon from '../../../assets/icons/EyeIcon';
import { TicketsByStatusChart } from './components/tickets-by-status';
import { SixMonthsTotalTicketChart } from './components/six-months-total-tickets';
import AddTicket from '../add';
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { actionTicketsList, resetTicketsListResponse } from '../../../store/tickets';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { TicketsByAssetTypesChart } from './components/tickets-by-asset-types';
import ServerSideListComponents from '../../../components/server-side-list-component';
import { useBranch } from '../../../hooks/useBranch';
import { ViewTicket } from '../view';
import moment from 'moment';
import { getFormattedDuration } from '../../../utils';

export default function RecentTicket() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { logout, hasPermission } = useAuth()
  const navigate = useNavigate()
  const branch = useBranch()
  const { showSnackbar } = useSnackbar()

  //Stores
  const { ticketsList } = useSelector(state => state.ticketsStore)

  //States
  const [recentTicketsData, setRecentTicketsData] = useState([])
  const [openAddTicket, setOpenAddTicket] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [openViewTicket, setOpenViewTicket] = useState(false)
  const [currentTicketDetails, setCurrentTicketDetails] = useState(null)
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      flex: 0.12,
      field: 'ticket_no',
      headerName: 'Ticket No.'
    },
    {
      flex: 0.1,
      field: 'asset_name',
      headerName: 'Asset Name'
    },
    {
      flex: 0.12,
      field: 'location',
      headerName: 'Location'
    },
    {
      flex: 0.2,
      field: 'problem',
      headerName: 'Problem'
    },
    {
      flex: 0.1,
      field: 'priority',
      headerName: 'Priority'
    },
    {
      flex: 0.1,
      field: 'created_on',
      headerName: 'Created On',
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%', justifyContent: 'center' }}>
            {
              params.row.created_on && params.row.created_on !== null ?
                <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                  {params.row.created_on && params.row.created_on !== null ? moment(params.row.created_on, 'YYYY-MM-DD').format('DD MMM YYYY') : ''}
                </TypographyComponent>
                :
                <></>
            }
          </Stack>
        )
      }
    },
    {
      flex: 0.1,
      field: 'total_time',
      headerName: 'Total Time',
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%', justifyContent: 'center' }}>
            {
              params?.row?.first_created_at && params?.row?.first_created_at !== null && !['Open'].includes(params.row.status) ?
                <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                  {params?.row?.first_created_at && params?.row?.first_created_at !== null ? getFormattedDuration(params?.row?.first_created_at, params?.row?.last_updated_at) : ''}
                </TypographyComponent>
                :
                <>--:-- Hrs</>
            }
          </Stack>
        )
      }
    },
    {
      flex: 0.1,
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        let color = 'primary'
        switch (params?.row?.status) {
          case 'Open':
            color = 'primary'//'#6941C6'
            break
          case 'Re Open':
            color = 'info'//'#039BE5'
            break
          case 'Closed':
            color = 'success'//'#039855'
            break
          case 'On Hold':
            color = 'warning'//#FEC84B'
            break
          case 'Rejected':
            color = 'error'//'#D32F2F'
            break
          case 'Overdue':
            color = 'warning'//'#F79009'
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
      renderCell: (params) => {
        return (
          <React.Fragment>
            {
              hasPermission('TICKET_VIEW') ?
                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                  <Tooltip title="Details" followCursor placement="top">
                    {/* open ticket details */}
                    <IconButton
                      onClick={() => {
                        setCurrentTicketDetails(params?.row)
                        setOpenViewTicket(true)
                      }}
                    >
                      <EyeIcon stroke={'#181D27'} />
                    </IconButton>
                  </Tooltip>
                </Box>
                :
                <></>
            }
          </React.Fragment>
        );
      },
    },
  ];

  //Default Ticket Counts Array
  const [getArrTicketCounts, setGetArrTicketCounts] = useState([
    { labelTop: "Total", labelBottom: "Tickets", key: 'total_tickets', value: 0, icon: <TicketIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Open", labelBottom: "Tickets", key: 'open_tickets', value: 0, icon: <OpenTicketIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "On-Hold", labelBottom: "Tickets", key: 'on_hold_tickets', value: 0, icon: <OnHoldTicketIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Re Open", labelBottom: "Tickets", key: 'reopen_tickets', value: 0, icon: <OpenTicketIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Overdue", labelBottom: "Tickets", key: 'overdue_tickets', value: 0, icon: <OverDueIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Closed", labelBottom: "Tickets", key: 'closed_tickets', value: 0, icon: <CircleCloseIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    { labelTop: "Rejected", labelBottom: "Tickets", key: 'reject_tickets', value: 0, icon: <CircleCloseIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
  ]);

  /**
     * If redirect from Download open view for current ticket
     */
  useEffect(() => {

    let previousData = window.localStorage.getItem('previous_route_details');
    let parsedData = JSON.parse(previousData)
    if (parsedData?.redirect_from === 'download') {
      setCurrentTicketDetails({ uuid: parsedData?.uuid })
      setOpenViewTicket(true)
      localStorage.removeItem('previous_route_details')
    } else {
      localStorage.removeItem('previous_route_details')
    }
  }, [])

  /**
  * useEffect
  * @dependency : ticketsList
  * @type : HANDLE API RESULT
  * @description : Handle the result of ticket List API
  */
  useEffect(() => {
    if (ticketsList && ticketsList !== null) {
      dispatch(resetTicketsListResponse())
      if (ticketsList?.result === true) {
        setRecentTicketsData(ticketsList?.response?.data)
        let objData = ticketsList?.response?.counts
        setGetArrTicketCounts(prevArr =>
          prevArr.map(item => ({
            ...item,
            value: objData[item.key] !== undefined ? objData[item.key] : 0
          }))
        );

        setLoadingList(false)
        setTotal(ticketsList?.response?.counts?.total_tickets)

      } else {
        setLoadingList(false)
        setRecentTicketsData([])
        let objData = {
          total_tickets: 0,
          open_tickets: 0,
          overdue_tickets: 0,
          on_hold_tickets: 0,
          closed_tickets: 0
        }
        setGetArrTicketCounts(prevArr =>
          prevArr.map(item => ({
            ...item,
            value: objData[item.key] !== undefined ? objData[item.key] : 0
          }))
        );
        setTotal(0)
        switch (ticketsList?.status) {
          case UNAUTHORIZED:
            logout()
            break
          case ERROR:
            dispatch(resetTicketsListResponse())
            break
          case SERVER_ERROR:
            showSnackbar({ message: ticketsList?.message, severity: "error" })
            break
          default:
            break
        }
      }
    }
  }, [ticketsList])

  /**
   * Ticket list API Call on change of Page
   */
  useEffect(() => {
    if (page !== null) {
      dispatch(actionTicketsList({
        type: 'recent',
        branch_uuid: branch?.currentBranch?.uuid,
        page: page,
        limit: LIST_LIMIT
      }))
    }

  }, [page])

  return (
    <React.Fragment>
      <Stack>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <MyBreadcrumbs />
          {
            hasPermission('TICKET_ADD') ?
              <Stack>
                <Button
                  size={'small'}
                  sx={{ textTransform: "capitalize", px: 4, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                  onClick={() => {
                    setOpenAddTicket(true)
                  }}
                  variant='contained'
                >
                  <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} />
                  Add New Ticket
                </Button>
              </Stack>
              :
              <></>
          }

        </Stack>
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",  // mobile: 1 per row
            sm: "repeat(3, 1fr)",  // small tablets: 2 per row
            md: "repeat(4, 1fr)",  // tablets: 4 per row
            lg: "repeat(7, 1fr)",  // desktops: 7 per row
          }}
          sx={{
            my: 2,
            alignItems: "stretch", // ensures equal height
          }}
        >
          {getArrTicketCounts.map((item, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                borderRadius: "8px",
                bgcolor: "#fff",
                height: "100%", // equal height cards
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Stack direction="row" spacing={1} alignItems="center">
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
                    <TypographyComponent
                      fontSize={14}
                      fontWeight={400}
                      sx={{ color: theme.palette.grey[650], lineHeight: "20px" }}
                    >
                      {item.labelTop}
                    </TypographyComponent>
                    <TypographyComponent
                      fontSize={14}
                      fontWeight={400}
                      sx={{ color: theme.palette.grey[650], lineHeight: "20px" }}
                    >
                      {item.labelBottom}
                    </TypographyComponent>
                  </Stack>
                </Stack>

                <TypographyComponent
                  fontSize={24}
                  fontWeight={700}
                  sx={{
                    color: theme.palette.primary[600],
                    mt: 0.3,
                  }}
                >
                  {item.value.toString().padStart(2, "0")}
                </TypographyComponent>
              </Stack>
            </Card>
          ))}
        </Box>
        <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3.2 }}>
            <TicketsByStatusChart />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4.4 }}>
            <SixMonthsTotalTicketChart />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4.4 }}>
            <TicketsByAssetTypesChart />
          </Grid>
        </Grid>
        <Stack sx={{ border: `1px solid ${theme.palette.grey[200]}`, borderRadius: '8px', background: theme.palette.common.white, pb: 1 }}>
          <Stack sx={{ flexDirection: 'row', background: theme.palette.common.white, width: '100%', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px' }}>
            <Stack sx={{ flexDirection: 'row', columnGap: 1, height: '100%', padding: '15px' }}>
              <Stack>
                <TypographyComponent fontSize={18} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>Recent Tickets</TypographyComponent>
              </Stack>
              <Chip
                label={`${total.toString().padStart(2, "0")} Tickets`}
                size="small"
                sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontSize: 14, fontWeight: 500 }}
              />
            </Stack>
            <Stack sx={{ paddingRight: '15px', cursor: 'pointer' }} onClick={() => {
              navigate('all')
            }}>
              <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.common.black }}>View All</TypographyComponent>
            </Stack>
          </Stack>
          {loadingList ? (
            <FullScreenLoader open={true} />
          ) : recentTicketsData && recentTicketsData !== null && recentTicketsData.length > 0 ? (
            <ServerSideListComponents
              height={480}
              rows={recentTicketsData}
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
            <Stack sx={{ height: 480 }}>
              <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Tickets Found'} subTitle={''} />
            </Stack>

          )}
        </Stack>
      </Stack>
      <AddTicket
        open={openAddTicket}
        handleClose={(data) => {
          setOpenAddTicket(false)
          if (data == 'save') {
            dispatch(actionTicketsList({
              type: 'recent',
              branch_uuid: branch?.currentBranch?.uuid,
              page: page,
              limit: LIST_LIMIT
            }))
          }
        }}
      />
      <ViewTicket
        open={openViewTicket}
        detail={currentTicketDetails}
        handleClose={(data) => {
          setOpenViewTicket(false)
          setCurrentTicketDetails(null)
          let is_update = window.localStorage.getItem('ticket_update')

          if (data === 'delete' || JSON.parse(is_update) == true) {
            dispatch(actionTicketsList({
              type: 'recent',
              branch_uuid: branch?.currentBranch?.uuid,
              page: page,
              limit: LIST_LIMIT
            }))
            window.localStorage.removeItem('ticket_update')
          }


        }}
      />
    </React.Fragment>
  )
}
