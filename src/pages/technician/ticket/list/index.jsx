import { Avatar, Box, Grid, InputAdornment, Stack, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header';
import BottomNav from '../../../../components/bottom-navbar';
import TypographyComponent from '../../../../components/custom-typography';
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants';
import moment from 'moment';
import HistoryIcon from '../../../../assets/icons/HistoryIcon';
import MessageDotsIcon from '../../../../assets/MessageDotsIcon';
import PaperClipIcon from '../../../../assets/icons/PaperClipIcon';
import { getCurrentStatusColor } from '../../../../utils';
import { SearchInput } from '../../../../components/common';
import SearchIcon from '../../../../assets/icons/SearchIcon';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { useBranch } from '../../../../hooks/useBranch';
import { useAuth } from '../../../../hooks/useAuth';
import { actionTechnicianTicketList, resetTechnicianTicketListResponse } from '../../../../store/technician/tickets';
import AddTechnicianTicket from '../add';

export default function TicketsList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const { logout } = useAuth()

    const [value, setValue] = useState(3);
    const [overviewTickets, setOverviewTickets] = useState([])
    const [ticketStatusArray] = useState([{
        title: "Open",
        value: "Open"
    },
    {
        title: "Overdue",
        value: "Overdue"
    },
    {
        title: "Rejected",
        value: "Rejected"
    },
    {
        title: "Closed",
        value: "Closed"
    },
    {
        title: "Re Open",
        value: "Re Open"
    },
    {
        title: "On Hold",
        value: "On Hold"
    }
    ])
    const [selectedTicketsStatus, setSelectedTicketsStatus] = useState('')

    const [ticketsData, setTicketsData] = useState([])
    const [ticketsOriginalData, setTicketsOriginalData] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [openAddTicketPopup, setOpenAddTicketPopup] = useState(false)

    // store
    const { technicianTicketList } = useSelector(state => state.technicianTicketsStore)

    /**
     * useEffect
     * @dependency : technicianTicketList
     * @type : HANDLE API RESULT
     * @description : Handle the result of technician ticket List API
     */
    useEffect(() => {
        if (technicianTicketList && technicianTicketList !== null) {
            dispatch(resetTechnicianTicketListResponse())
            if (technicianTicketList?.result === true) {
                let objData = Object.assign({}, technicianTicketList?.response?.counts)
                setOverviewTickets(prevArr =>
                    prevArr?.map(item => ({
                        ...item,
                        count: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );
                setTicketsData(technicianTicketList?.response?.data)
                setTicketsOriginalData(technicianTicketList?.response?.data)
            } else {
                let objData = {
                    total_on_hold: 0,
                    total_active: 0,
                    total_closed: 0
                }
                setOverviewTickets(prevArr =>
                    prevArr?.map(item => ({
                        ...item,
                        count: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );
                // setTicketsData[[]]
                // setTicketsOriginalData[[]]
                switch (technicianTicketList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianTicketListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianTicketList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianTicketList])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
      * Filter the tickets list
      */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (ticketsOriginalData && ticketsOriginalData !== null && ticketsOriginalData.length > 0) {
                var filteredData = ticketsOriginalData.filter(
                    item =>
                        (item?.asset_name && item?.asset_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.ticket_no && item?.ticket_no.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.status && item?.status.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setTicketsData(filteredData)
                } else {
                    setTicketsData([])
                }
            }
        } else {
            setTicketsData(ticketsOriginalData)
        }
    }, [searchQuery])

    /**
     * Initial Render Call ticket list API
     */
    useEffect(() => {
        setOverviewTickets([
            {
                title: "Active",
                count: 0,
                key: 'total_active'
            },
            {
                title: "On-Hold",
                count: 0,
                key: 'total_on_hold'
            },
            {
                title: "Closed",
                count: 0,
                key: 'total_closed'
            }
        ])


    }, [])

    const handleFloatingAddClick = () => {
        console.log("FAB clicked from BottomNav");
        setOpenAddTicketPopup(true)
    };

    /**
     * Get Ticket list API Call
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionTechnicianTicketList({
                branch_uuid: branch?.currentBranch?.uuid,
                status: selectedTicketsStatus
            }))
        }
    }, [branch?.currentBranch?.uuid, selectedTicketsStatus])

    return (
        <React.Fragment>
            <Stack rowGap={1.2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
                <TechnicianNavbarHeader />
                <Stack sx={{ rowGap: 1 }}>
                    <TypographyComponent fontSize={18} fontWeight={500}
                    // onClick={() => {
                    //     setOpenAddTicketPopup(true)
                    // }}
                    >Tickets Overview</TypographyComponent>
                    <Grid container spacing={1} sx={{ maxWidth: '100%' }}>
                        {
                            overviewTickets && overviewTickets !== null && overviewTickets.length > 0 ?
                                overviewTickets.map((objChecklist, index) => {
                                    return (<Grid size={{ xs: 4, sm: 4 }} sx={{ background: theme.palette.common.white, justifyContent: 'center', alignItems: 'center', p: 2.5, textAlign: 'center', borderRadius: '8px' }} key={index}>
                                        <TypographyComponent fontSize={24} fontWeight={600}>{objChecklist?.count !== null ? objChecklist?.count?.toString().padStart(2, "0") : '00'}</TypographyComponent>
                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{objChecklist?.title}</TypographyComponent>
                                    </Grid>
                                    )
                                })
                                :
                                <></>
                        }
                    </Grid>
                </Stack>
                <Stack sx={{ width: '100%' }}>
                    <Stack gap={1} sx={{ flexDirection: 'row', alignItems: 'center', width: '100%', py: 1, overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                        <Stack
                            onClick={() => setSelectedTicketsStatus('')}
                            sx={{
                                flexDirection: 'row', alignItems: 'center',
                                background: selectedTicketsStatus === '' ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px',
                                borderRadius: '8px', justifyContent: 'center', cursor: 'pointer'
                            }}
                        >
                            <TypographyComponent fontSize={16} fontWeight={500} sx={{ textAlign: 'center', alignItems: 'center', textWrap: 'nowrap', color: selectedTicketsStatus === '' ? theme.palette.common.white : theme.palette.common.black }}>All</TypographyComponent>
                        </Stack>
                        {ticketStatusArray && ticketStatusArray.length > 0 ?
                            ticketStatusArray.map((objTicket, index) => (
                                <Stack
                                    key={index}
                                    sx={{
                                        flexDirection: 'row', alignItems: 'center', gap: 0.8,
                                        background: selectedTicketsStatus === objTicket?.title ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px', textWrap: 'nowrap',
                                        borderRadius: '8px', justifyContent: 'center', cursor: 'pointer',
                                        border: `1px solid ${theme.palette.grey[100]}`,
                                    }}
                                    onClick={() => {
                                        setSelectedTicketsStatus(objTicket?.title)

                                        // if (objTicket?.documents && objTicket?.documents.length > 0) {
                                        //     setTicketsData(objTicket?.documents);
                                        // } else {
                                        //     setTicketsData([]);
                                        // }

                                    }}
                                >
                                    <TypographyComponent fontSize={16} fontWeight={600} sx={{ textWrap: 'nowrap', color: selectedTicketsStatus === objTicket?.title ? theme.palette.common.white : theme.palette.text.primary }}>
                                        {objTicket?.title && objTicket?.title !== null ? objTicket?.title : ''}
                                    </TypographyComponent>
                                </Stack>
                            )) : <></>}
                    </Stack>
                    <Stack sx={{ mt: 1.5, mb: 0.2 }}>
                        <SearchInput
                            id="search-users"
                            placeholder="Search ticket here..."
                            variant="outlined"
                            size="small"
                            sx={{ background: theme.palette.common.white }}
                            onChange={handleSearchQueryChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon stroke={theme.palette.grey[500]} size={18} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                    <Stack gap={1} sx={{ borderRadius: '8px', mt: 1, height: '550px', overflowY: 'scroll' }}>
                        {ticketsData && ticketsData !== null && ticketsData.length > 0 ?
                            ticketsData?.map((ticket, index) => {

                                return (
                                    <>
                                        <Stack
                                            key={index}
                                            sx={{
                                                borderRadius: 2,
                                                p: 2,
                                                backgroundColor: "#fff",
                                            }}
                                            onClick={() => {
                                                navigate(`view/${ticket?.uuid}`)
                                            }}
                                        >
                                            <Stack spacing={1}>

                                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    {/* Ticket number */}
                                                    <TypographyComponent
                                                        fontSize={14}
                                                        fontWeight={500}
                                                        sx={{ color: "#7C3AED", textDecoration: "underline" }} // violet like screenshot
                                                    >
                                                        {ticket.ticket_no}
                                                    </TypographyComponent>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: getCurrentStatusColor(ticket?.status, 'code'),
                                                            borderRadius: '8px',
                                                            padding: '4px 12px',
                                                            display: 'inline-flex',
                                                        }}
                                                    >
                                                        <TypographyComponent title={ticket?.status} variant="body2" sx={{ color: theme.palette.common.white, fontWeight: 'medium' }}>
                                                            {ticket?.status}
                                                        </TypographyComponent>
                                                    </Box>
                                                </Stack>
                                                <TypographyComponent fontSize={16} fontWeight={600}>
                                                    {ticket?.asset_name}
                                                </TypographyComponent>

                                                {/* Description */}
                                                <TypographyComponent
                                                    fontSize={14}
                                                    sx={{ color: theme.palette.grey[500] }}
                                                >
                                                    {ticket?.description}
                                                </TypographyComponent>

                                                {/* Footer */}
                                                <Stack direction="row" gap={1.5} alignItems="center" mt={0.5}>
                                                    <Stack direction="row" gap={'2px'} alignItems="center" justifyContent={'center'}>
                                                        <HistoryIcon size={14} />
                                                        <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                            {ticket?.created_at && ticket?.created_at !== null ? moment(ticket?.created_at).fromNow() : ''}
                                                        </TypographyComponent>

                                                    </Stack>
                                                    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                        <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                    </Stack>
                                                    <Stack direction="row" gap={'4px'} alignItems="center" justifyContent={'center'}>
                                                        <MessageDotsIcon size={14} />
                                                        <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                            {ticket?.updates && ticket?.updates !== null ? ticket?.updates : ''} Updates
                                                        </TypographyComponent>
                                                    </Stack>
                                                    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                        <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                    </Stack>
                                                    <Stack direction="row" gap={'4px'} alignItems="center" justifyContent={'center'}>
                                                        <PaperClipIcon size={14} />
                                                        <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                            {ticket?.attachments && ticket?.attachments !== null ? ticket?.attachments : ''} Attachments
                                                        </TypographyComponent>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </>
                                );
                            })
                            :
                            <Stack sx={{ background: theme.palette.common.white, py: 15, mt: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                                <TypographyComponent fontSize={16} fontWeight={400}>No Tickets Found</TypographyComponent>
                            </Stack>
                        }

                    </Stack>
                </Stack>
                <BottomNav value={value} onChange={setValue}
                    onFabClick={handleFloatingAddClick} />
            </Stack>
            <AddTechnicianTicket
                open={openAddTicketPopup}
                handleClose={() => {
                    setOpenAddTicketPopup(false)
                }}
            />
        </React.Fragment>
    )
}
