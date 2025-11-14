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

    const columns = [
        {
            flex: 0.05,
            field: 'date',
            headerName: 'Date & Time',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params.row.date && params.row.date !== null ?
                                <Stack>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params.row.date && params.row.date !== null ? moment(params.row.date, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY') : ''}
                                    </TypographyComponent>
                                    <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} >
                                        {params.row.date && params.row.date !== null ? moment(params.row.date, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A') : ''}
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
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params.row.quantity && params.row.quantity !== null ? `+ ${params.row.quantity}` : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.08,
            field: 'supplier',
            headerName: 'Supplier'
        },
        {
            flex: 0.05,
            field: 'invoice_no',
            headerName: 'Invoice No.'
        },
        {
            flex: 0.06,
            field: 'stock_after',
            headerName: 'Stock After'
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
                            params?.row?.files && params.row.files.length > 0 ?
                                params.row.files.map((file, index) => {

                                    return (
                                        <React.Fragment>
                                            <TypographyComponent
                                                fontSize={14}
                                                fontWeight={400}
                                                sx={{ cursor: 'pointer', color: theme.palette.primary[600], textDecoration: 'underline', borderRight: index + 1 < params.row.files.length ? `1.5px solid ${theme.palette.grey[900]}` : 'none', paddingRight: 0.7 }}
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
        //     renderCell: (params) => {
        //         return (
        //             <>
        //                 <Stack sx={{ justifyContent: 'center', flexDirection: 'row' }}>
        //                     {
        //                         params?.row?.files && params?.row?.files !== null && params?.row?.files.length > 0 ?
        //                             params?.row?.files.map((file, index) => {
        //                                 return (
        //                                     <Stack key={index}><TypographyComponent>{file.split("/").pop()}</TypographyComponent></Stack>
        //                                 )
        //                             })
        //                             :
        //                             <></>
        //                     }
        //                 </Stack>
        //             </>

        //         )
        //     }
    ];

    useEffect(() => {
        if (open === true) {
            setViewLoadingDelete(false)
            console.log('detail', detail)
            setSelectedStartDate(moment().startOf('month').format('DD/MM/YYYY'))
            setSelectedEndDate(moment().format('DD/MM/YYYY'))
            dispatch(actionGetInventoryDetails({
                uuid: detail?.uuid
            }))
            //-----development purpose-----
            setTotal(20)
            setTransactionHistoryData([{
                id: 1,
                date: '2024-06-10 22:01:01',
                supplier: 'Cooltech Sipplies',
                quantity: '50 Kilograms',
                invoice_no: 'INV-8788',
                stock_after: '200 Kilograms',
                additional_info: "Restocked via purchase order PO-4523",
                files: [
                    {
                        "id": 22,
                        "image_url": "https://fms-super-admin.interdev.in/fms/ticket/8/8_1762780539544.jpg",
                        "file_name": "8_1762780539544.jpg"
                    },
                    {
                        "id": 21,
                        "image_url": "https://fms-super-admin.interdev.in/fms/ticket/8/8_1763011390575.jpg",
                        "file_name": "8_1763011390575.jpg"
                    },
                    {
                        "id": 20,
                        "image_url": "https://fms-super-admin.interdev.in/fms/ticket/10/10_1762840033061.jpg",
                        "file_name": "10_1762840033061.jpg"
                    }
                ]
            },
            {
                id: 2,
                date: '2024-06-10 09:01:01',
                supplier: 'Cooltech Sipplies',
                quantity: '50 Kilograms',
                invoice_no: 'INV-8788',
                stock_after: '200 Kilograms',
                additional_info: "Restocked via purchase order PO-4523",
                files: [{
                    "id": 20,
                    "image_url": "https://fms-super-admin.interdev.in/fms/ticket/10/10_1762840033061.jpg",
                    "file_name": "10_1762840033061.jpg"
                }]
            }])
            setInventoryDetailsData({
                "uuid": "tyyg7687878787878",
                "item_id": "INV-98989",
                "item_name": "R-22 Refrigerant Gas",
                "category": "Chemicals",
                "description": "cdddddddddddddd",
                "initial_quantity": "100",
                "minimum_quantity": "120",
                "critical_quantity": "101",
                "unit": "Kilograms",
                "storage_location": "asdfvgb",
                "contact_country_code": "+91",
                "contact": "9876543222",
                "email": "vijay+4@mail.com",
                "supplier_name": 27,
                "restocked_quantity": "50",
                "consumed_quantity": "30",
                "status": "Out Of Stock",
                "last_restocked_date": "2025-04-01",
                "image_url": "https://fms-super-admin.interdev.in/fms/ticket/8/8_1763011390575.jpg"
            })
            //---------------------------
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

            dispatch(actionGetInventoryTransactionHistory({
                type: selectedFilter,
                inventory_uuid: detail?.uuid,
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
                // setInventoryDetailsData(null)
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
                setTransactionHistoryData(getInventoryTransactionHistory?.response.data)
                setTotal(getInventoryTransactionHistory?.response?.total_records)
            } else {
                // setTransactionHistoryData(null)
                // setTotal(0)
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
                // minWidth: 200,
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
                <TypographyComponent fontSize={32} fontWeight={500} sx={{ color: title === 'Current Stock' ? '#673ab7' : 'text.primary' }}>
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
                    currentStatus={inventoryDetailsData?.status && inventoryDetailsData?.status !== null ? inventoryDetailsData?.status : ''}
                    subtitle="View and manage inventory item details"
                    actions={[
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                    rightSection={<Stack flexDirection={'row'} gap={2} sx={{ mx: 3, alignItems: 'center' }}>
                        <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.grey[700]}`, background: theme.palette.common.white, borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                            <BoxIcon stroke={theme.palette.grey[700]} size={22} />
                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>
                                Record Usage
                            </TypographyComponent>
                        </Stack>
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
                                            // let objData = {
                                            //     uuid: inventoryDetailsData?.ticket_uuid,
                                            //     title: `Delete Ticket`,
                                            //     text: `Are you sure you want to delete this ticket? This action cannot be undone.`
                                            // }
                                            // setViewTicketData(objData)
                                            // setOpenViewDeleteTicketPopup(true)
                                            let objData = {
                                                uuid: inventoryDetailsData?.inventory_uuid,
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
                        // flexGrow: 1,
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
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <Stack sx={{
                                height: '100%',
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
                                value={`${inventoryDetailsData?.initial_quantity && inventoryDetailsData?.initial_quantity !== null ? `${inventoryDetailsData?.initial_quantity}  ${inventoryDetailsData?.unit}` : ''}`}
                                subtext={`Min: ${inventoryDetailsData?.minimum_quantity && inventoryDetailsData?.minimum_quantity !== null ? `${inventoryDetailsData?.minimum_quantity} ${inventoryDetailsData?.unit}` : ''}`}
                                icon={<BoxIcon stroke={theme.palette.primary[600]} size={24} />}
                                iconBgColor={theme.palette.primary[100]}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Total Restocked"
                                value={`${inventoryDetailsData?.restocked_quantity && inventoryDetailsData?.restocked_quantity !== null ? `${inventoryDetailsData?.restocked_quantity}  ${inventoryDetailsData?.unit}` : ''}`}
                                subtext="All Time"
                                icon={<BoxPlusIcon stroke={theme.palette.success[600]} size={24} />}
                                iconBgColor={theme.palette.success[100]}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Total Consumed"
                                value={`${inventoryDetailsData?.consumed_quantity && inventoryDetailsData?.consumed_quantity !== null ? `${inventoryDetailsData?.consumed_quantity}  ${inventoryDetailsData?.unit}` : ''}`}
                                subtext="All Time"
                                icon={<StairDownIcon stroke={theme.palette.warning[600]} size={24} />}
                                iconBgColor={theme.palette.warning[100]}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Last Restocked"
                                value={`${inventoryDetailsData?.last_restocked_date && inventoryDetailsData?.last_restocked_date !== null ? `${moment(inventoryDetailsData?.last_restocked_date, 'YYYY-MM-DD').format('DD MMM')}` : ''}`}
                                subtext={`${inventoryDetailsData?.last_restocked_date && inventoryDetailsData?.last_restocked_date !== null ? `${moment(inventoryDetailsData?.last_restocked_date, 'YYYY-MM-DD').fromNow()}` : ''}`}
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
                                                    minDate={selectedEndDate ? moment(selectedEndDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
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
                            <Grid container spacing={2} sx={{ height: 390 }}>
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
                                                <FieldBox textColor={theme.palette.grey[900]} label="Description" value={inventoryDetailsData?.description && inventoryDetailsData?.description !== null ? inventoryDetailsData?.description : ''} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                            </Grid>
                                            {/* Storage Location */}
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Storage Location" value={inventoryDetailsData?.storage_location && inventoryDetailsData?.storage_location !== null ? inventoryDetailsData?.storage_location : ''} />
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
                                                <FieldBox textColor={theme.palette.grey[900]} label="Total Restocked" value={inventoryDetailsData?.total_restocked && inventoryDetailsData?.total_restocked !== null ? inventoryDetailsData?.total_restocked : ''} />
                                            </Grid>
                                            {/* Total Consumed */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 8, xl: 8 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Total Consumed" value={inventoryDetailsData?.total_consumed && inventoryDetailsData?.total_consumed !== null ? inventoryDetailsData?.total_consumed : ''} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                            </Grid>
                                            {/* Added On */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Added On" value={inventoryDetailsData?.added_on && inventoryDetailsData?.added_on !== null ? inventoryDetailsData?.added_on : ''} />
                                            </Grid>
                                            {/* Added By */}
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 8, xl: 8 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Added By" value={inventoryDetailsData?.added_by && inventoryDetailsData?.added_by !== null ? inventoryDetailsData?.added_by : ''} />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Grid>
                            </Grid>
                            :
                            <React.Fragment>
                                <SectionHeader sx={{ mt: 0, mb: 0, px: 1 }} title={'Complete Transaction History'} show_progress={false} />
                                <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px', pb: 1.5, marginTop: '-28px' }}>
                                    {transactionHistoryData && transactionHistoryData !== null && transactionHistoryData.length > 0 ? (
                                        <ServerSideListComponents
                                            height={275}
                                            borderRadius='8px'
                                            rows={transactionHistoryData}
                                            columns={columns}
                                            isCheckbox={false}
                                            total={total}
                                            page={page}
                                            onPageChange={setPage}
                                            pageSize={LIST_LIMIT}
                                        />
                                    ) : (
                                        <Stack sx={{ height: 275 }}>
                                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Transaction History Found'} subTitle={''} />
                                        </Stack>
                                    )}
                                </Stack>
                            </React.Fragment>
                    }

                    {
                        inventoryDetailsData?.initial_quantity !== null && inventoryDetailsData?.minimum_quantity && Number(inventoryDetailsData?.initial_quantity) < Number(inventoryDetailsData?.minimum_quantity) ?
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
                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.warning[700] }}>
                                            Low Stock Alert
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.warning[600] }}>
                                            Current stock ({Number(inventoryDetailsData?.initial_quantity)} {inventoryDetailsData?.unit}) is below the minimum level ({Number(inventoryDetailsData?.minimum_quantity)} {inventoryDetailsData?.unit}). Consider restocking soon to avoid stockouts.
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>
                                <Stack>
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
                                </Stack>

                            </Stack>
                            :
                            <></>
                    }
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
                    if (data == 'save') {
                        dispatch(actionGetInventoryDetails({
                            uuid: detail?.uuid
                        }))
                    }
                }}
            />
            <RestockInventory
                open={openRestockInventoryPopup}
                handleClose={(data) => {
                    setOpenRestockInventoryPopup(false)
                    if (data == 'save') {
                        // dispatch(actionGetInventoryDetails({
                        //     uuid: detail?.uuid
                        // }))
                    }
                }}
            />
        </Drawer >
    )
}
