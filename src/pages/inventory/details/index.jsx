/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from '@emotion/react'
import { Box, Button, CircularProgress, Divider, Drawer, Grid, IconButton, InputAdornment, Stack, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormHeader from '../../../components/form-header'
import CloseIcon from '../../../assets/icons/CloseIcon'
import TotalPMIcon from '../../../assets/icons/TotalPMIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import { useAuth } from '../../../hooks/useAuth'
import BoxIcon from '../../../assets/icons/BoxIcon'
import TypographyComponent from '../../../components/custom-typography'
import BoxPlusIcon from '../../../assets/icons/BoxPlusIcon'
import CalendarIcon from '../../../assets/icons/CalendarIcon'
import StairDownIcon from '../../../assets/icons/StairDownIcon'
import moment from 'moment'
import SectionHeader from '../../../components/section-header'
import EditCircleIcon from '../../../assets/icons/EditCircleIcon'
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from '../../../constants'
import ServerSideListComponents from '../../../components/server-side-list-component'
import EmptyContent from '../../../components/empty_content'
import AlertTriangleIcon from '../../../assets/icons/AlertTriangleIcon'
import FieldBox from '../../../components/field-box'
import { useDispatch, useSelector } from 'react-redux'
import { actionDeleteInventory, actionGetInventoryDetails, actionGetInventoryTransactionHistory, resetDeleteInventoryResponse, resetGetInventoryDetailsResponse, resetGetInventoryTransactionHistoryResponse } from '../../../store/inventory'
import { useSnackbar } from '../../../hooks/useSnackbar'
import AlertPopup from '../../../components/alert-confirm'
import { useBranch } from '../../../hooks/useBranch'
import AlertCircleIcon from '../../../assets/icons/AlertCircleIcon'
import DatePicker from 'react-datepicker'
import CustomTextField from '../../../components/text-field'
import DatePickerWrapper from '../../../components/datapicker-wrapper'
import AddInventory from '../add'
import { RestockInventory } from '../restock'
import { InventoryConsumption } from '../consumption'
import ArrowDownIcon from '../../../assets/icons/ArrowDownIcon'
import ArrowUpIcon from '../../../assets/icons/ArrowUpIcon'
import UserCircleIcon from '../../../assets/icons/UserCircleIcon'
import _ from 'lodash'

export const InventoryDetails = ({ open, handleClose, detail }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { showSnackbar } = useSnackbar()
    const { logout, hasPermission } = useAuth()
    const branch = useBranch()

    //Stores
    const { getInventoryDetails, getInventoryTransactionHistory, deleteInventory } = useSelector(state => state.inventoryStore)

    //States
    const [filterJson] = useState(["Overview", "Complete History", "Consumption History", "Restock History"]);
    const [selectedFilter, setSelectedFilter] = useState("Overview");
    const [inventoryDetailsData, setInventoryDetailsData] = useState(null)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [transactionHistoryData, setTransactionHistoryData] = useState([])
    const [openViewDeleteInventoryPopup, setOpenViewDeleteInventoryPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [viewInventoryData, setViewInventoryData] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [openEditInventoryPopup, setOpenEditInventoryPopup] = useState(false);
    const [openRestockInventoryPopup, setOpenRestockInventoryPopup] = useState(false);
    const [openConsumptionInventoryPopup, setOpenConsumptionInventoryPopup] = useState(false);
    const [showLowStockMessage, setShowLowStockMessage] = useState(1)
    const [loadingList, setLoadingList] = useState(0)
    const [screenType, setScreenType] = useState(null)

    const columnsCompleteHistory = [
        {
            flex: 0.05,
            field: 'date',
            headerName: 'Date & Time',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params?.row?.date && params?.row?.date !== null ?
                                <Stack>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params?.row?.date && params?.row?.date !== null ? moment(params?.row?.date, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY') : ''}
                                    </TypographyComponent>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params?.row?.date && params?.row?.date !== null ? moment(params?.row?.date, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A') : ''}
                                    </TypographyComponent>
                                </Stack>
                                :
                                <></>
                        }

                    </Stack>
                )
            }
        },
        {
            flex: 0.06,
            field: 'transaction_type',
            headerName: 'Transaction Type',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params?.row?.transaction_type && params?.row?.transaction_type !== null && params?.row?.transaction_type == 'RESTOCK' ?
                                <Stack flexDirection={'row'}>
                                    <ArrowUpIcon stroke={theme.palette.success[700]} size={22} />
                                    <TypographyComponent color={theme.palette.success[700]} fontSize={14} fontWeight={400} >
                                        Restocked
                                    </TypographyComponent>
                                </Stack>
                                :
                                <>
                                    {
                                        params?.row?.transaction_type == 'USAGE' ?
                                            <Stack flexDirection={'row'}>
                                                <ArrowDownIcon stroke={theme.palette.error[700]} size={22} />
                                                <TypographyComponent color={theme.palette.error[700]} fontSize={14} fontWeight={400} >
                                                    Consumed
                                                </TypographyComponent>
                                            </Stack>
                                            :
                                            <></>
                                    }
                                </>
                        }

                    </Stack>
                )
            }
        },
        {
            flex: 0.05,
            field: 'quantity',
            headerName: 'Quantity',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <TypographyComponent color={params?.row?.transaction_type == 'RESTOCK' ? theme.palette.success[700] : theme.palette.error[700]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params?.row?.quantity && params?.row?.quantity !== null ? `${params?.row?.transaction_type == 'RESTOCK' ? '+' : '-'}${params?.row?.quantity} ${params?.row?.unit && params?.row?.unit !== null ? params?.row?.unit : ''}` : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.06,
            field: 'stock_before',
            headerName: 'Stock Before',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params?.row?.stock_before !== null ? `+${params?.row?.stock_before} ${params?.row?.unit && params?.row?.unit !== null ? params?.row?.unit : ''}` : 0}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.06,
            field: 'stock_after',
            headerName: 'Stock After',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params?.row?.stock_after !== null && params?.row?.transaction_type && params?.row?.transaction_type !== null && params?.row?.transaction_type == 'RESTOCK' ?
                                <Stack flexDirection={'row'}>
                                    <ArrowUpIcon stroke={theme.palette.success[700]} size={22} />
                                    <TypographyComponent color={theme.palette.success[700]} fontSize={14} fontWeight={400} >
                                        {params?.row?.stock_after !== null ? params?.row?.stock_after : ''}
                                    </TypographyComponent>
                                </Stack>
                                :
                                <>
                                    {
                                        params?.row?.stock_after !== null && params?.row?.transaction_type == 'USAGE' ?
                                            <Stack flexDirection={'row'}>
                                                <ArrowDownIcon stroke={theme.palette.error[700]} size={22} />
                                                <TypographyComponent color={theme.palette.error[700]} fontSize={14} fontWeight={400} >
                                                    {params?.row?.stock_after !== null ? params?.row?.stock_after : ''}
                                                </TypographyComponent>
                                            </Stack>
                                            :
                                            <></>
                                    }
                                </>
                        }

                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: 'details',
            headerName: 'Details',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        <Stack>
                            <TypographyComponent title={params?.row?.additional_info} color={theme.palette.grey[900]} fontSize={14} fontWeight={400} >
                                {params?.row?.additional_info && params?.row?.additional_info !== null ? _.truncate(params?.row?.additional_info, { length: 45 }) : ''}
                            </TypographyComponent>
                            <TypographyComponent title={params?.row?.used_for} color={theme.palette.grey[600]} fontSize={12} fontWeight={400} >
                                {params?.row?.used_for && params?.row?.used_for !== null ? _.truncate(params?.row?.used_for, { length: 50 }) : ''}
                            </TypographyComponent>
                        </Stack>
                    </Stack>
                )
            }
        },
        {
            flex: 0.08,
            field: 'created_by',
            headerName: 'Performed By',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', height: '100%', gap: 0.5 }}>
                        <UserCircleIcon stroke={theme.palette.grey[900]} size={24} />
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500}>
                            {params?.row?.created_by && params?.row?.created_by !== null ? params?.row?.created_by : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        }
    ];

    const columnsConsumptionHistory = [
        {
            flex: 0.05,
            field: 'date',
            headerName: 'Date & Time',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params?.row?.date && params?.row?.date !== null ?
                                <Stack>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params?.row?.date && params?.row?.date !== null ? moment(params?.row?.date, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY') : ''}
                                    </TypographyComponent>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params?.row?.date && params?.row?.date !== null ? moment(params?.row?.date, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A') : ''}
                                    </TypographyComponent>
                                </Stack>
                                :
                                <></>
                        }

                    </Stack>
                )
            }
        },
        {
            flex: 0.05,
            field: 'quantity',
            headerName: 'Quantity',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <TypographyComponent color={theme.palette.error[700]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params?.row?.quantity && params?.row?.quantity !== null ? `- ${params?.row?.quantity} ${params?.row?.unit && params?.row?.unit !== null ? params?.row?.unit : ''}` : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.08,
            field: 'used_by',
            headerName: 'Used By',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', height: '100%', gap: 0.5 }}>
                        <UserCircleIcon stroke={theme.palette.grey[900]} size={24} />
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500}>
                            {params?.row?.used_by && params?.row?.used_by !== null ? params?.row?.used_by : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: 'details',
            headerName: 'Details',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        <Stack>
                            <TypographyComponent title={params?.row?.additional_info} color={theme.palette.grey[900]} fontSize={14} fontWeight={400} >
                                {params?.row?.additional_info && params?.row?.additional_info !== null ? _.truncate(params?.row?.additional_info, { length: 45 }) : ''}
                            </TypographyComponent>
                            <TypographyComponent title={params?.row?.used_for} color={theme.palette.grey[600]} fontSize={12} fontWeight={400} >
                                {params?.row?.used_for && params?.row?.used_for !== null ? _.truncate(params?.row?.used_for, { length: 50 }) : ''}
                            </TypographyComponent>
                        </Stack>
                    </Stack>
                )
            }
        },
        {
            flex: 0.05,
            field: 'ticket_no',
            headerName: 'Ticket No'
        },
        {
            flex: 0.06,
            field: 'stock_after',
            headerName: 'Stock After',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params?.row?.stock_after !== null ? `+${params?.row?.stock_after} ${params?.row?.unit && params?.row?.unit !== null ? params?.row?.unit : ''}` : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
    ];

    const columnsRestockHistory = [
        {
            flex: 0.05,
            field: 'date',
            headerName: 'Date & Time',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params?.row?.date && params?.row?.date !== null ?
                                <Stack>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params?.row?.date && params?.row?.date !== null ? moment(params?.row?.date, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY') : ''}
                                    </TypographyComponent>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params?.row?.date && params?.row?.date !== null ? moment(params?.row?.date, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A') : ''}
                                    </TypographyComponent>
                                </Stack>
                                :
                                <></>
                        }

                    </Stack>
                )
            }
        },
        {
            flex: 0.05,
            field: 'quantity',
            headerName: 'Quantity',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <TypographyComponent color={theme.palette.success[700]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params?.row?.quantity && params?.row?.quantity !== null ? `+${params?.row?.quantity} ${params?.row?.unit && params?.row?.unit !== null ? params?.row?.unit : ''}` : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.08,
            field: 'supplier',
            headerName: 'Supplier',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', height: '100%', gap: 0.5 }}>
                        <UserCircleIcon stroke={theme.palette.grey[900]} size={24} />
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500}>
                            {params?.row?.supplier && params?.row?.supplier !== null ? params?.row?.supplier : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.05,
            field: 'invoice_no',
            headerName: 'Invoice No.'
        },
        {
            flex: 0.06,
            field: 'stock_after',
            headerName: 'Stock After',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params?.row?.stock_after !== null ? `+${params?.row?.stock_after} ${params?.row?.unit && params?.row?.unit !== null ? params?.row?.unit : ''}` : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: 'additional_info',
            headerName: 'Additional Information',
        },
        {
            flex: 0.12,
            field: 'files',
            headerName: 'Attachments',
            renderCell: (params) => {
                return (
                    <Stack
                        sx={{
                            justifyContent: 'flex-start', // Align to start for better wrapping
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 0.7, // ⭐ This creates space between chips
                            flexWrap: 'wrap', // ⭐ This allows files to wrap to the next line
                            height: '100%',
                            // overflowY: 'auto', // Optional: adds a scrollbar if files are numerous
                            p: 0.5
                        }}
                    >
                        {
                            params?.row?.files && params?.row?.files.length > 0 ?
                                params?.row?.files.map((file, index) => {

                                    return (
                                        <React.Fragment>
                                            <TypographyComponent
                                                fontSize={14}
                                                fontWeight={400}
                                                sx={{ cursor: 'pointer', color: theme.palette.primary[600], textDecoration: 'underline', borderRight: index + 1 < params?.row?.files.length ? `1.5px solid ${theme.palette.grey[900]}` : 'none', paddingRight: 0.7 }}
                                                onClick={() => {
                                                    window.open(file?.image_url, '_blank')
                                                }}
                                            >{file?.file_name}
                                            </TypographyComponent>
                                        </React.Fragment>
                                    )
                                })
                                :
                                <></>
                        }
                    </Stack>
                )
            }
        }
    ];

    /**
     * function to return columns as per Selected filter
     * @param {*} filter 
     * @returns 
     */
    const getCurrentColumn = (filter) => {
        let columns = columnsCompleteHistory
        switch (filter) {
            case 'Complete History':
                columns = columnsCompleteHistory
                break;
            case 'Consumption History':
                columns = columnsConsumptionHistory
                break;
            case 'Restock History':
                columns = columnsRestockHistory
                break;

            default:
                break;
        }
        return columns
    }

    useEffect(() => {
        if (open === true) {
            setScreenType('view')
            setViewLoadingDelete(false)
            console.log('detail', detail)
            setSelectedStartDate(moment().startOf('month').format('DD/MM/YYYY'))
            setSelectedEndDate(moment().format('DD/MM/YYYY'))
            if (detail?.uuid && detail?.uuid !== null) {
                dispatch(actionGetInventoryDetails({
                    uuid: detail?.uuid
                }))
            }
        }
        return () => {
            setInventoryDetailsData(null)
            setViewLoadingDelete(false)
            setTransactionHistoryData([])
            setTotal(0)
            setPage(1)
            setViewInventoryData(null)
            setSelectedStartDate(null)
            setSelectedEndDate(null)
            setShowLowStockMessage(1)
            setLoadingList(false)
            setScreenType(null)
        }
    }, [open])

    useEffect(() => {
        if (selectedFilter !== 'Overview' && branch?.currentBranch?.uuid !== null && page && page !== null) {
            if (!selectedStartDate || !selectedEndDate) return;

            const start = moment(selectedStartDate, "DD/MM/YYYY");
            const end = moment(selectedEndDate, "DD/MM/YYYY");

            // ❗ Show toast if start > end
            if (start.isAfter(end)) {
                showSnackbar({
                    message: "Start date cannot be greater than end date.",
                    severity: "error",
                });
                return;
            }

            // ❗ Show toast if end < start (optional - same as above)
            if (end.isBefore(start)) {
                showSnackbar({
                    message: "End date cannot be smaller than start date.",
                    severity: "error",
                });
                return;
            }
            let filterValue = selectedFilter
            switch (selectedFilter) {
                case 'Restock History':
                    filterValue = 'RESTOCK'
                    break;
                case 'Consumption History':
                    filterValue = 'USAGE'
                    break;
                case 'Complete History':
                    filterValue = 'ALL'
                    break;

                default:
                    break;
            }
            setLoadingList(true)
            dispatch(actionGetInventoryTransactionHistory({
                filter_type: filterValue,
                inventory_uuid: detail?.uuid && detail?.uuid !== null ? detail?.uuid : inventoryDetailsData?.uuid,
                branch_uuid: branch?.currentBranch?.uuid,
                page: page,
                limit: LIST_LIMIT,
                start_date: moment(selectedStartDate, "DD/MM/YYYY").format('YYYY-MM-DD'),
                end_date: moment(selectedEndDate, "DD/MM/YYYY").format('YYYY-MM-DD')
            }))
        }

    }, [branch?.currentBranch?.uuid, selectedFilter, page, selectedStartDate, selectedEndDate])

    /**
        * useEffect
        * @dependency : getInventoryDetails
        * @type : HANDLE API RESULT
        * @description : Handle the result of inventory details API
        */
    useEffect(() => {
        if (getInventoryDetails && getInventoryDetails !== null) {
            dispatch(resetGetInventoryDetailsResponse())
            if (getInventoryDetails?.result === true) {
                setInventoryDetailsData(getInventoryDetails?.response)
            } else {
                setInventoryDetailsData(null)
                switch (getInventoryDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetInventoryDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getInventoryDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getInventoryDetails])

    /**
        * useEffect
        * @dependency : getInventoryTransactionHistory
        * @type : HANDLE API RESULT
        * @description : Handle the result of inventory transaction history API
        */
    useEffect(() => {
        if (getInventoryTransactionHistory && getInventoryTransactionHistory !== null) {
            dispatch(resetGetInventoryTransactionHistoryResponse())
            if (getInventoryTransactionHistory?.result === true) {
                setLoadingList(false)
                setTransactionHistoryData(getInventoryTransactionHistory?.response.data)
                setTotal(getInventoryTransactionHistory?.response?.total_records)
            } else {
                setTransactionHistoryData(null)
                setTotal(0)
                setLoadingList(false)
                switch (getInventoryTransactionHistory?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetInventoryTransactionHistoryResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getInventoryTransactionHistory?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getInventoryTransactionHistory])

    /**
     * useEffect
     * @dependency : deleteInventory
     * @type : HANDLE API RESULT
     * @description : Handle the result of delete inventory API
     */
    useEffect(() => {
        if (deleteInventory && deleteInventory !== null) {
            dispatch(resetDeleteInventoryResponse())
            if (deleteInventory?.result === true) {
                setOpenViewDeleteInventoryPopup(false)
                setViewLoadingDelete(false)
                setViewInventoryData(null)
                showSnackbar({ message: deleteInventory?.message, severity: "success" })
                handleClose('delete')
            } else {
                setViewLoadingDelete(false)
                switch (deleteInventory?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteInventoryResponse())
                        showSnackbar({ message: deleteInventory?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: deleteInventory?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteInventory])


    // Component to render each info tile
    const InfoTile = ({ title, value, subtext, icon, iconBgColor }) => {
        return (
            <Stack sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid ${theme.palette.grey[300]}`,
                padding: '16px',
                borderRadius: '8px',
            }}>
                {/* <CardContent> */}
                {/* Title and Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[650] }}>
                        {title}
                    </TypographyComponent>
                    <Box
                        sx={{
                            backgroundColor: iconBgColor,
                            borderRadius: '6px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                {/* Main Value */}
                <TypographyComponent fontSize={32} fontWeight={500} sx={{ color: title === 'Current Stock' ? theme.palette.primary[600] : 'text.primary' }}>
                    {value}
                </TypographyComponent>

                {/* Subtext */}
                <TypographyComponent fontSize={16} fontWeight={400} sx={{ display: 'block', mt: 0.5 }}>
                    {subtext}
                </TypographyComponent>
                {/* </CardContent> */}
            </Stack>
        );
    };

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: '100%', xl: '86%' } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<TotalPMIcon stroke={theme.palette.primary[600]} size={20} />}
                    title={`${inventoryDetailsData?.item_name && inventoryDetailsData?.item_name !== null ? `${inventoryDetailsData?.item_name}` : ''}`}
                    currentStatus={inventoryDetailsData?.stock_status && inventoryDetailsData?.stock_status !== null ? inventoryDetailsData?.stock_status : ''}
                    subtitle="View and manage inventory item details"
                    actions={[
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                    need_responsive={1}
                    rightSection={<Stack flexDirection={{ xs: 'row', sm: 'row' }} gap={{ xs: 1, sm: 2 }} sx={{ mx: 3, alignItems: 'center' }}>
                        {
                            Number(inventoryDetailsData?.current_stock) > 0 ?
                                <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.grey[700]}`, background: theme.palette.common.white, borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}
                                    onClick={() => {
                                        setOpenConsumptionInventoryPopup(true)
                                    }}
                                >
                                    <BoxIcon stroke={theme.palette.grey[700]} size={22} />
                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>
                                        Record Usage
                                    </TypographyComponent>
                                </Stack>
                                :
                                <></>
                        }
                        <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.grey[700]}`, background: theme.palette.common.white, borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}
                            onClick={() => {
                                setOpenRestockInventoryPopup(true)
                            }}
                        >
                            <BoxPlusIcon stroke={theme.palette.grey[700]} size={22} />
                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>
                                Restock
                            </TypographyComponent>
                        </Stack>
                        <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.grey[700]}`, background: theme.palette.common.white, borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}
                            onClick={() => {
                                setOpenEditInventoryPopup(true)
                            }}
                        >
                            <EditCircleIcon stroke={theme.palette.grey[700]} size={22} />
                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>
                                Edit Item
                            </TypographyComponent>
                        </Stack>
                        {
                            hasPermission('INVENTORY_DELETE') ?
                                <Tooltip title="Delete" followCursor placement="top">
                                    {/* open setting delete popup */}
                                    <IconButton
                                        onClick={() => {
                                            let objData = {
                                                uuid: inventoryDetailsData?.uuid,
                                                title: `Delete Inventory`,
                                                text: `Are you sure you want to delete this inventory? This action cannot be undone.`
                                            }
                                            setViewInventoryData(objData)
                                            setOpenViewDeleteInventoryPopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                :
                                <></>
                        }
                    </Stack>}
                />
                < Divider sx={{ mb: 3, mx: 2 }} />
                <Stack
                    sx={{
                        px: 2,
                        width: '100%',
                        overflowY: 'auto',
                        rowGap: 3,
                        '&::-webkit-scrollbar': {
                            width: '2px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '2px'
                        }
                    }}
                >
                    {
                        showLowStockMessage == 1 && inventoryDetailsData?.stock_status && inventoryDetailsData?.stock_status !== null && ['Out Of Stock', 'Low Stock'].includes(inventoryDetailsData?.stock_status) ?
                            <>
                                {
                                    inventoryDetailsData?.stock_status == 'Low Stock' ?
                                        <Stack sx={{ border: `1px solid ${theme.palette.warning[600]}`, alignItems: 'center', borderRadius: '8px', flexDirection: 'row', justifyContent: 'space-between', padding: '16px', background: theme.palette.warning[100] }}>
                                            <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        backgroundColor: theme.palette.warning[600],
                                                        borderRadius: '6px',
                                                        padding: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <AlertTriangleIcon stroke={theme.palette.common.white} size={22} />
                                                </Box>
                                                <Stack>
                                                    <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: theme.palette.warning[700] }}>
                                                        Low Stock Alert
                                                    </TypographyComponent>
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.warning[600] }}>
                                                        Current stock ({Number(inventoryDetailsData?.current_stock)}{inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? ` ${inventoryDetailsData?.unit}` : ''})  is above the minimum level but below the critical level ({Number(inventoryDetailsData?.critical_quantity)}{inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? ` ${inventoryDetailsData?.unit}` : ''}). Consider restocking soon to avoid stockouts.
                                                    </TypographyComponent>
                                                </Stack>
                                            </Stack>
                                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                <Stack
                                                    onClick={() => {
                                                        setOpenRestockInventoryPopup(true)
                                                    }}
                                                    sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', background: theme.palette.warning[600], borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                                                    <BoxPlusIcon stroke={theme.palette.common.white} size={22} />
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.common.white }}>
                                                        Restock
                                                    </TypographyComponent>
                                                </Stack>
                                                <Stack>
                                                    <Tooltip title="Hide Message" followCursor placement="top">
                                                        <IconButton
                                                            variant="outlined"
                                                            color='primary'
                                                            sx={{
                                                                background: theme.palette.warning[600], borderRadius: '6px', padding: '12px 12px',
                                                                '&:hover': { backgroundColor: theme.palette.warning[500] },
                                                            }}
                                                            onClick={() => {
                                                                setShowLowStockMessage(0)
                                                            }}
                                                        >
                                                            <CloseIcon size={16} stroke='white' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        :
                                        <Stack sx={{ border: `1px solid ${theme.palette.error[600]}`, alignItems: 'center', borderRadius: '8px', flexDirection: 'row', justifyContent: 'space-between', padding: '16px', background: theme.palette.error[100] }}>
                                            <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        backgroundColor: theme.palette.error[600],
                                                        borderRadius: '6px',
                                                        padding: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <AlertTriangleIcon stroke={theme.palette.common.white} size={22} />
                                                </Box>
                                                <Stack>
                                                    <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: theme.palette.error[700] }}>
                                                        Running Out Of Stock
                                                    </TypographyComponent>
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.error[600] }}>
                                                        Current stock ({Number(inventoryDetailsData?.current_stock)}{inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? ` ${inventoryDetailsData?.unit}` : ''}) is below the minimum level ({Number(inventoryDetailsData?.minimum_quantity)}{inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? ` ${inventoryDetailsData?.unit}` : ''}). Consider restocking soon to avoid stockouts.
                                                    </TypographyComponent>
                                                </Stack>
                                            </Stack>
                                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                <Stack
                                                    onClick={() => {
                                                        setOpenRestockInventoryPopup(true)
                                                    }}
                                                    sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', background: theme.palette.error[600], borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                                                    <BoxPlusIcon stroke={theme.palette.common.white} size={22} />
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.common.white }}>
                                                        Restock
                                                    </TypographyComponent>
                                                </Stack>
                                                <Stack>
                                                    <Tooltip title="Hide Message" followCursor placement="top">
                                                        <IconButton
                                                            variant="outlined"
                                                            color='primary'
                                                            sx={{
                                                                background: theme.palette.error[600], borderRadius: '6px', padding: '12px 12px',
                                                                '&:hover': { backgroundColor: theme.palette.error[500] },
                                                            }}
                                                            onClick={() => {
                                                                setShowLowStockMessage(0)
                                                            }}
                                                        >
                                                            <CloseIcon size={16} stroke='white' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                }
                            </>
                            :
                            <></>
                    }
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <Stack sx={{
                                height: { xs: '200px', sm: '100%' },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                border: `1px solid ${theme.palette.grey[300]}`,
                                padding: '16px',
                                backgroundImage: inventoryDetailsData?.image_url ? `url(${inventoryDetailsData.image_url})` : undefined,
                                backgroundColor: inventoryDetailsData?.image_url ? "transparent" : theme.palette.primary[50],
                                borderRadius: '8px',
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}>
                                {!inventoryDetailsData?.image_url || inventoryDetailsData?.image_url == '' || inventoryDetailsData?.image_url == null ?
                                    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[900] }}>
                                            No Image Available
                                        </TypographyComponent>
                                    </Stack>
                                    :
                                    <></>
                                }
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Current Stock"
                                value={`${inventoryDetailsData?.current_stock && inventoryDetailsData?.current_stock !== null ? `${inventoryDetailsData?.current_stock}  ${inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? inventoryDetailsData?.unit : ''}` : 0}`}
                                subtext={`Min: ${inventoryDetailsData?.minimum_quantity && inventoryDetailsData?.minimum_quantity !== null ? `${inventoryDetailsData?.minimum_quantity} ${inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? inventoryDetailsData?.unit : ''}` : ''}`}
                                icon={<BoxIcon stroke={theme.palette.primary[600]} size={24} />}
                                iconBgColor={theme.palette.primary[100]}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Total Restocked"
                                value={`${inventoryDetailsData?.restocked_quantity && inventoryDetailsData?.restocked_quantity !== null ? `${inventoryDetailsData?.restocked_quantity}  ${inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? inventoryDetailsData?.unit : ''}` : 0}`}
                                subtext="All Time"
                                icon={<BoxPlusIcon stroke={theme.palette.success[600]} size={24} />}
                                iconBgColor={theme.palette.success[100]}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Total Consumed"
                                value={`${inventoryDetailsData?.consumed_quantity && inventoryDetailsData?.consumed_quantity !== null ? `${inventoryDetailsData?.consumed_quantity}  ${inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? inventoryDetailsData?.unit : ''}` : 0}`}
                                subtext="All Time"
                                icon={<StairDownIcon stroke={theme.palette.warning[600]} size={24} />}
                                iconBgColor={theme.palette.warning[100]}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Last Restocked"
                                value={`${inventoryDetailsData?.last_restock_date && inventoryDetailsData?.last_restock_date !== null ? `${moment(inventoryDetailsData?.last_restock_date, 'YYYY-MM-DD').format('DD MMM')}` : ''}`}
                                subtext={`${inventoryDetailsData?.last_restock_date && inventoryDetailsData?.last_restock_date !== null ? `${moment(inventoryDetailsData?.last_restock_date, 'YYYY-MM-DD').fromNow()}` : ''}`}
                                icon={<CalendarIcon stroke={theme.palette.info[600]} size={24} />}
                                iconBgColor={theme.palette.info[100]}
                            />
                        </Grid>
                    </Grid>
                    <Stack sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'row' }, rowGap: 1.5, justifyContent: 'space-between' }}>
                        <Box
                            sx={{
                                borderRadius: "16px",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                alignItems: "flex-start"
                            }}
                        >
                            {
                                filterJson && filterJson.length > 0 && filterJson?.map((filter, index) => (
                                    <Stack
                                        key={index}
                                        sx={{
                                            background:
                                                selectedFilter === filter ? theme.palette.primary[600] : theme.palette.common.white,
                                            border: selectedFilter ===
                                                filter
                                                ? "none"
                                                : `1px solid ${theme.palette.grey[500]}`,
                                            color: selectedFilter ===
                                                filter
                                                ? theme.palette.common.white
                                                : theme.palette.grey[700],
                                            borderRadius: "8px",
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setPage(1)
                                            setSelectedFilter(filter);
                                        }}
                                    >
                                        <TypographyComponent fontSize={14} fontWeight={400}>
                                            {filter}
                                        </TypographyComponent>
                                    </Stack>
                                ))
                            }
                        </Box>
                        {
                            selectedFilter !== 'Overview' ?
                                <Box>
                                    <DatePickerWrapper>
                                        <Stack sx={{ flexDirection: 'row', gap: 2 }}>
                                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5, border: `1px solid ${theme.palette.grey[400]}`, borderRadius: '6px', p: 0.5 }}>
                                                <TypographyComponent fontSize={14}>START&nbsp;DATE</TypographyComponent>
                                                <DatePicker
                                                    id='start_date'
                                                    placeholderText='Start Date'
                                                    customInput={
                                                        <CustomTextField
                                                            size='small'
                                                            fullWidth
                                                            sx={{ width: '145px' }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position='start'>
                                                                        <IconButton
                                                                            edge='start'
                                                                            onMouseDown={e => e.preventDefault()}
                                                                        >
                                                                            <CalendarIcon />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    }
                                                    value={selectedStartDate}
                                                    selected={selectedStartDate ? moment(selectedStartDate, 'DD/MM/YYYY').toDate() : null}
                                                    showYearDropdown={true}
                                                    onChange={date => {
                                                        const formattedDate = moment(date).format('DD/MM/YYYY')
                                                        setSelectedStartDate(formattedDate)
                                                    }}
                                                />
                                            </Stack>
                                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5, border: `1px solid ${theme.palette.grey[400]}`, borderRadius: '6px', p: 0.5 }}>
                                                <TypographyComponent fontSize={14}>END&nbsp;DATE</TypographyComponent>
                                                <DatePicker
                                                    id='end_date'
                                                    placeholderText='End Date'
                                                    customInput={
                                                        <CustomTextField
                                                            size='small'
                                                            fullWidth
                                                            sx={{ width: '145px', p: 0 }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position='start'>
                                                                        <IconButton
                                                                            edge='start'
                                                                            onMouseDown={e => e.preventDefault()}
                                                                        >
                                                                            <CalendarIcon />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    }
                                                    value={selectedEndDate}
                                                    selected={selectedEndDate ? moment(selectedEndDate, 'DD/MM/YYYY').toDate() : null}
                                                    minDate={selectedStartDate ? moment(selectedStartDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
                                                    showYearDropdown={true}
                                                    onChange={date => {
                                                        const formattedDate = moment(date).format('DD/MM/YYYY')
                                                        setSelectedEndDate(formattedDate)
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </DatePickerWrapper>
                                </Box>
                                : <></>
                        }

                    </Stack>
                    {
                        selectedFilter === 'Overview' ?
                            <Grid container spacing={2} sx={{ height: { md: 'auto', lg: 390 } }}>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }} >
                                    <SectionHeader sx={{ mt: 0, mb: 0, px: 1, pt: 1 }} title={'Basic Information'} show_progress={false} />
                                    <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px', pb: 1.5, marginTop: '-5px' }}>
                                        <Grid container>
                                            {/* Item ID */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Item ID" value={inventoryDetailsData?.item_id && inventoryDetailsData?.item_id !== null ? inventoryDetailsData?.item_id : ''} />
                                            </Grid>
                                            {/* Item Name */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Item Name" value={inventoryDetailsData?.item_name && inventoryDetailsData?.item_name !== null ? inventoryDetailsData?.item_name : ''} />
                                            </Grid>
                                            {/* Category */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Category" value={inventoryDetailsData?.category && inventoryDetailsData?.category !== null ? inventoryDetailsData?.category : ''} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                            </Grid>
                                            {/* Description */}
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Description" type="description" length={90} value={inventoryDetailsData?.description && inventoryDetailsData?.description !== null ? inventoryDetailsData?.description : ''} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                            </Grid>
                                            {/* Storage Location */}
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Storage Location" type="description" length={85} value={inventoryDetailsData?.storage_location && inventoryDetailsData?.storage_location !== null ? inventoryDetailsData?.storage_location : ''} />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                                    <SectionHeader sx={{ mt: 0, mb: 0, px: 1, pt: 1 }} title={'Vendor Information'} show_progress={false} />
                                    <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px', pb: 1.5, marginTop: '-5px' }}>
                                        <Grid container>
                                            {/* Name */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Name" value={inventoryDetailsData?.supplier_name && inventoryDetailsData?.supplier_name !== null ? inventoryDetailsData?.supplier_name : ''} />
                                            </Grid>
                                            {/* Email */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Email" value={inventoryDetailsData?.email && inventoryDetailsData?.email !== null ? inventoryDetailsData?.email : ''} />
                                            </Grid>
                                            {/* Contact */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Contact" value={inventoryDetailsData?.contact && inventoryDetailsData?.contact !== null ? inventoryDetailsData?.contact : ''} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                            </Grid>
                                            {/* Total Restocked */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Total Restocked" is_number={'1'} value={inventoryDetailsData?.restocked_quantity && inventoryDetailsData?.restocked_quantity !== null ? `${inventoryDetailsData?.restocked_quantity} ${inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? ` ${inventoryDetailsData?.unit}` : ''}` : ''} />
                                            </Grid>
                                            {/* Total Consumed */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 8, xl: 8 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Total Consumed" is_number={'1'} value={inventoryDetailsData?.consumed_quantity && inventoryDetailsData?.consumed_quantity !== null ? `${inventoryDetailsData?.consumed_quantity} ${inventoryDetailsData?.unit && inventoryDetailsData?.unit !== null ? ` ${inventoryDetailsData?.unit}` : ''}` : 0} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                            </Grid>
                                            {/* Added On */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Added On" value={inventoryDetailsData?.updated_on && inventoryDetailsData?.updated_on !== null ? moment(inventoryDetailsData?.updated_on, 'YYYY-MM-DD').format('DD MMMM YYYY') : ''} />
                                            </Grid>
                                            {/* Added By */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 8, xl: 8 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Added By" value={inventoryDetailsData?.created_by && inventoryDetailsData?.created_by !== null ? inventoryDetailsData?.created_by : ''} />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Grid>
                            </Grid>
                            :
                            <React.Fragment>
                                <SectionHeader sx={{ mt: 0, mb: 0, px: 1 }} title={'Complete Transaction History'} show_progress={false} />
                                <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px', pb: 1.5, marginTop: '-28px' }}>
                                    {loadingList ? (
                                        <Stack sx={{ alignItems: 'center', minHeight: 275, justifyContent: 'center' }}>
                                            <CircularProgress sx={{ color: theme.palette.grey[900] }} />
                                        </Stack>
                                    ) : transactionHistoryData && transactionHistoryData !== null && transactionHistoryData.length > 0 ? (
                                        <ServerSideListComponents
                                            height={275}
                                            borderRadius='8px'
                                            rows={transactionHistoryData}
                                            columns={getCurrentColumn(selectedFilter)}
                                            isCheckbox={false}
                                            total={total}
                                            page={page}
                                            onPageChange={setPage}
                                            pageSize={LIST_LIMIT}
                                        />
                                    ) : (
                                        <Stack sx={{ height: 275 }}>
                                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} imageSize={200} mt={2} title={'No Transaction History Found'} subTitle={''} />
                                        </Stack>
                                    )}
                                </Stack>
                            </React.Fragment>
                    }
                    {/* low alert */}
                </Stack>
            </Stack>
            <Divider sx={{ mt: 2 }} />
            <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'space-between'} gap={2}>
                <Stack flexDirection={'row'} sx={{ columnGap: 1 }}>

                </Stack>
                <Stack>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleClose()
                        }}
                        variant='contained'
                    >
                        Close
                    </Button>
                </Stack>
                {/* </Stack> */}

            </Stack>
            {
                openViewDeleteInventoryPopup &&
                <AlertPopup
                    open={openViewDeleteInventoryPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={viewInventoryData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenViewDeleteInventoryPopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {

                            if (viewInventoryData?.uuid && viewInventoryData?.uuid !== null) {
                                setViewLoadingDelete(true)
                                dispatch(actionDeleteInventory({
                                    uuid: viewInventoryData?.uuid
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
            <AddInventory
                open={openEditInventoryPopup}
                type={'edit'}
                details={inventoryDetailsData}
                handleClose={(data) => {
                    setOpenEditInventoryPopup(false)
                    if (data == 'save' && screenType == 'view') {
                        if (detail?.uuid && detail?.uuid !== null) {
                            dispatch(actionGetInventoryDetails({
                                uuid: detail?.uuid
                            }))
                        }
                    }
                }}
            />
            <RestockInventory
                open={openRestockInventoryPopup}
                restockData={inventoryDetailsData}
                handleClose={(data) => {
                    setOpenRestockInventoryPopup(false)
                    if (data == 'save' && screenType == 'view') {
                        if (detail?.uuid && detail?.uuid !== null) {
                            dispatch(actionGetInventoryDetails({
                                uuid: detail?.uuid
                            }))
                        }
                    }
                }}
            />
            <InventoryConsumption
                open={openConsumptionInventoryPopup}
                consumeData={inventoryDetailsData}
                handleClose={(data) => {
                    setOpenConsumptionInventoryPopup(false)
                    if (data == 'save' && screenType == 'view') {
                        if (detail?.uuid && detail?.uuid !== null) {
                            dispatch(actionGetInventoryDetails({
                                uuid: detail?.uuid
                            }))
                        }

                    }
                }}
            />
        </Drawer>
    )
}
