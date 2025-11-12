/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Chip, IconButton, InputAdornment, MenuItem, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TicketIcon from '../../../assets/icons/TicketIcon';
import OpenTicketIcon from '../../../assets/icons/OpenTicketIcon';
import OnHoldTicketIcon from '../../../assets/icons/OnHoldTicketIcon';
import OverDueIcon from '../../../assets/icons/OverdueIcon';
import CircleCloseIcon from '../../../assets/icons/CircleCloseIcon';
import { ERROR, getMasterTicketStatus, getPriorityArray, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import EmptyContent from '../../../components/empty_content';
import FullScreenLoader from '../../../components/fullscreen-loader';
import TypographyComponent from '../../../components/custom-typography';
import CustomChip from "../../../components/custom-chip";
import EyeIcon from '../../../assets/icons/EyeIcon';
import AddTicket from '../add';
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { actionTicketsList, resetTicketsListResponse } from '../../../store/tickets';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ServerSideListComponents from '../../../components/server-side-list-component';
import { SearchInput } from '../../../components/common';
import SearchIcon from '../../../assets/icons/SearchIcon';
import CustomTextField from '../../../components/text-field';
import { actionMasterAssetType, resetMasterAssetTypeResponse } from '../../../store/asset';
import { useBranch } from '../../../hooks/useBranch';
import { ViewTicket } from '../view';
import moment from 'moment';
import { getFormattedDuration } from '../../../utils';

export const TicketList = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const navigate = useNavigate()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()

    // media query
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'))

    // store
    const { ticketsList } = useSelector(state => state.ticketsStore)
    const { masterAssetType } = useSelector(state => state.AssetStore)

    const [searchQuery, setSearchQuery] = useState('')
    const [recentTicketsData, setRecentTicketsData] = useState([])
    const [originalRecentTicketsData, setOriginalRecentTicketsData] = useState([])
    const [openAddTicket, setOpenAddTicket] = useState(false)
    const [openViewTicket, setOpenViewTicket] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedPriority, setSelectedPriority] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedAssetTypes, setSelectedAssetTypes] = useState('')
    const [masterAssetTypeOptions, setMasterAssetTypeOptions] = useState([])
    const [masterTicketStatusOptions] = useState(getMasterTicketStatus)
    const [currentTicketDetails, setCurrentTicketDetails] = useState(null)

    const columns = [
        {
            flex: 0.12,
            field: 'ticket_no',
            headerName: 'Ticket No.',
            renderCell: (params) => {
                return (
                    <>
                        {
                            hasPermission('TICKET_VIEW') ?
                                <Stack sx={{ cursor: 'pointer', justifyContent: 'center', height: '100%' }} onClick={() => {
                                    setCurrentTicketDetails(params?.row)
                                    setOpenViewTicket(true)
                                }}>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.primary[600], textDecoration: 'underline' }}>{params?.row?.ticket_no}</TypographyComponent>
                                </Stack>
                                :
                                <Stack sx={{ justifyContent: 'center', height: '100%' }}>
                                    <TypographyComponent fontSize={14} fontWeight={400}>{params?.row?.ticket_no}</TypographyComponent>
                                </Stack>
                        }
                    </>

                )
            }
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
    * @dependency : masterAssetType
    * @type : HANDLE API RESULT
    * @description : Handle the result of master Asset Type List API
    */
    useEffect(() => {
        if (masterAssetType && masterAssetType !== null) {
            dispatch(resetMasterAssetTypeResponse())
            if (masterAssetType?.result === true) {
                setMasterAssetTypeOptions(masterAssetType?.response)
            } else {
                setMasterAssetTypeOptions([])
                switch (masterAssetType?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetMasterAssetTypeResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: masterAssetType?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [masterAssetType])

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
                setOriginalRecentTicketsData(ticketsList?.response?.data)
                let objData = ticketsList?.response?.counts
                setGetArrTicketCounts(prevArr =>
                    prevArr.map(item => ({
                        ...item,
                        value: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );
                setTotal(ticketsList?.response?.counts?.total_tickets)
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setRecentTicketsData([])
                setOriginalRecentTicketsData([])
                setTotal(0)
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

    // Initial Render
    useEffect(() => {
        if (branch?.currentBranch?.client_uuid && branch?.currentBranch?.client_uuid !== null) {
            dispatch(actionMasterAssetType({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
        }

    }, [branch?.currentBranch?.client_uuid])

    /**
     * Ticket list API Call on change of Page
     */
    useEffect(() => {
        if (page !== null) {
            dispatch(actionTicketsList({
                page: page,
                limit: LIST_LIMIT,
                branch_uuid: branch?.currentBranch?.uuid,
                priority: selectedPriority,
                status: selectedStatus,
                asset_type: selectedAssetTypes
            }))
        }

    }, [page, selectedPriority, selectedStatus, selectedAssetTypes])


    //handle search query
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the ticket list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (originalRecentTicketsData && originalRecentTicketsData !== null && originalRecentTicketsData.length > 0) {
                var filteredData = originalRecentTicketsData.filter(
                    item =>
                        (item?.sr_no && item?.sr_no.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.ticket_no && item?.ticket_no.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.asset_name && item?.asset_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.location && item?.location.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.problem && item?.problem.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setRecentTicketsData(filteredData)
                } else {
                    setRecentTicketsData([])
                }
            }
        } else {
            setRecentTicketsData(originalRecentTicketsData)
        }
    }, [searchQuery])

    return (
        <React.Fragment>
            <Stack>
                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                        <Stack >
                            <IconButton
                                onClick={() => {
                                    navigate('/tickets')
                                }}
                            >
                                <KeyboardBackspaceIcon fontSize={isMDDown ? "medium" : "large"} />
                            </IconButton>
                        </Stack>
                        <Stack>
                            <TypographyComponent color={theme.palette.grey.primary} fontSize={24} fontWeight={500}>
                                Tickets List
                            </TypographyComponent>
                        </Stack>
                    </Stack>
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
                                        <Typography
                                            fontSize={14}
                                            fontWeight={400}
                                            sx={{ color: theme.palette.grey[650], lineHeight: "20px" }}
                                        >
                                            {item.labelTop}
                                        </Typography>
                                        <Typography
                                            fontSize={14}
                                            fontWeight={400}
                                            sx={{ color: theme.palette.grey[650], lineHeight: "20px" }}
                                        >
                                            {item.labelBottom}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Typography
                                    fontSize={24}
                                    fontWeight={700}
                                    sx={{
                                        color: theme.palette.primary[600],
                                        mt: 0.3,
                                    }}
                                >
                                    {item.value.toString().padStart(2, "0")}
                                </Typography>
                            </Stack>
                        </Card>
                    ))}
                </Box>
                <Stack sx={{ border: `1px solid ${theme.palette.grey[200]}`, borderRadius: '8px', background: theme.palette.common.white, pb: 1 }}>
                    <Stack sx={{ flexDirection: 'row', background: theme.palette.common.white, width: '100%', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', py: 1 }}>
                        <Stack sx={{ flexDirection: 'row', columnGap: 1, height: '100%', padding: '15px' }}>
                            <Stack>
                                <TypographyComponent fontSize={18} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>Tickets List</TypographyComponent>
                            </Stack>
                            <Chip
                                label={`${recentTicketsData?.length.toString().padStart(2, "0")} Tickets`}
                                size="small"
                                sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontSize: 14, fontWeight: 500 }}
                            />
                        </Stack>
                        <Stack sx={{ paddingRight: '15px', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <SearchInput
                                id="search-tickets"
                                placeholder="Search Tickets"
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
                                    setSelectedStatus(event.target.value)
                                }}
                                SelectProps={{
                                    displayEmpty: true,
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: 220,
                                                scrollbarWidth: 'thin'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value=''>
                                    <em>All Status</em>
                                </MenuItem>
                                {masterTicketStatusOptions &&
                                    masterTicketStatusOptions.map(option => (
                                        <MenuItem
                                            key={option?.name}
                                            value={option?.name}
                                            sx={{
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                maxWidth: 300,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
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
                                    setSelectedPriority(event.target.value)
                                }}
                                SelectProps={{
                                    displayEmpty: true,
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: 220,
                                                scrollbarWidth: 'thin'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value=''>
                                    <em>All Priorities</em>
                                </MenuItem>
                                {getPriorityArray &&
                                    getPriorityArray.map(option => (
                                        <MenuItem
                                            key={option?.name}
                                            value={option?.name}
                                            sx={{
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                maxWidth: 300,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
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
                                    setSelectedAssetTypes(event.target.value)
                                }}
                                SelectProps={{
                                    displayEmpty: true,
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: 220,
                                                scrollbarWidth: 'thin'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value=''>
                                    <em>All Asset Types</em>
                                </MenuItem>
                                {masterAssetTypeOptions &&
                                    masterAssetTypeOptions.map(option => (
                                        <MenuItem
                                            key={option?.name}
                                            value={option?.name}
                                            sx={{
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                maxWidth: 300,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
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
                    ) : recentTicketsData && recentTicketsData !== null && recentTicketsData.length > 0 ? (
                        <ServerSideListComponents
                            rows={recentTicketsData}
                            columns={columns}
                            isCheckbox={false}
                            total={total}
                            page={page}
                            onPageChange={setPage}
                            pageSize={LIST_LIMIT}
                        />
                    ) : (
                        <Stack sx={{ height: 580 }}>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Tickets Found'} subTitle={''} />
                        </Stack>
                    )}
                </Stack>
            </Stack>
            <AddTicket
                open={openAddTicket}
                handleClose={(data) => {
                    setOpenAddTicket(false)
                    if (data === 'save') {
                        dispatch(actionTicketsList({
                            page: page,
                            limit: LIST_LIMIT,
                            branch_uuid: branch?.currentBranch?.uuid,
                            priority: selectedPriority,
                            status: selectedStatus,
                            asset_type: selectedAssetTypes
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
                            page: page,
                            limit: LIST_LIMIT,
                            branch_uuid: branch?.currentBranch?.uuid,
                            priority: selectedPriority,
                            status: selectedStatus,
                            asset_type: selectedAssetTypes
                        }))
                        window.localStorage.removeItem('ticket_update')
                    }
                }}
            />
        </React.Fragment>
    )
}
