/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, Chip, Divider, Grid, IconButton, InputAdornment, MenuItem, Stack, Tooltip, useTheme } from '@mui/material';
import MyBreadcrumbs from '../../../components/breadcrumb';
import TypographyComponent from '../../../components/custom-typography';
import BoxIcon from '../../../assets/icons/BoxIcon';
import CheckboxIcon from '../../../assets/icons/CheckboxIcon';
import ActivityIcon from '../../../assets/icons/ActivityIcon';
import AlertTriangleIcon from '../../../assets/icons/AlertTriangleIcon';
import { SearchInput } from '../../../components/common';
import CustomTextField from '../../../components/text-field';
import { ERROR, getInventoryStockStatus, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import SearchIcon from '../../../assets/icons/SearchIcon';
import moment from 'moment';
import EmptyContent from '../../../components/empty_content';
import ServerSideListComponents from '../../../components/server-side-list-component';
import FullScreenLoader from '../../../components/fullscreen-loader';
import CustomChip from '../../../components/custom-chip';
import EyeIcon from '../../../assets/icons/EyeIcon';
import BoxPlusIcon from '../../../assets/icons/BoxPlusIcon';
import { useDispatch, useSelector } from 'react-redux';
import { actionInventoryList, resetInventoryListResponse } from '../../../store/inventory';
import { useBranch } from '../../../hooks/useBranch';
import { useSnackbar } from '../../../hooks/useSnackbar';
import AddInventory from '../add';
import { InventoryDetails } from '../details';

export default function InventoryList() {
    const theme = useTheme()
    const { hasPermission } = useAuth();
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()
    //Stores
    const { inventoryList } = useSelector(state => state.inventoryStore)


    //States
    const [selectedStatus, setSelectedStatus] = useState('')
    const [masterInventoryStockStatusOptions] = useState(getInventoryStockStatus)
    const [searchQuery, setSearchQuery] = useState('')
    const [inventoryListData, setInventoryListData] = useState([{
        id: 1,
        item_id: 'INV-000121',
        name: 'Air filter 16X16',
        initial_quantity: 16,
        minimum_quantity: 5,
        stock_status: 'Low Stock',
        updated_on: '2024-06-10 22:03:90'
    },
    {
        id: 2,
        item_id: 'INV-000122',
        name: 'Compressor Oil (1L)',
        initial_quantity: 8,
        minimum_quantity: 20,
        stock_status: 'Out Of Stock',
        updated_on: '2024-06-10 21:09:12'
    },
    {
        id: 3,
        item_id: 'INV-000123',
        name: 'Drain Pump Kit',
        initial_quantity: 44,
        minimum_quantity: 20,
        stock_status: 'Good Stock',
        updated_on: '2024-06-10 09:02:12'
    }
    ])
    const [originalInventoryListData, setOriginalInventoryListData] = useState([{
        id: 1,
        item_id: 'INV-000121',
        name: 'Air filter 16X16',
        initial_quantity: 16,
        minimum_quantity: 5,
        stock_status: 'Low Stock',
        updated_on: '2024-06-10 22:03:90'
    },
    {
        id: 2,
        item_id: 'INV-000122',
        name: 'Compressor Oil (1L)',
        initial_quantity: 8,
        minimum_quantity: 20,
        stock_status: 'Out Of Stock',
        updated_on: '2024-06-10 21:09:12'
    },
    {
        id: 3,
        item_id: 'INV-000123',
        name: 'Drain Pump Kit',
        initial_quantity: 44,
        minimum_quantity: 20,
        stock_status: 'Good Stock',
        updated_on: '2024-06-10 09:02:12'
    }
    ])
    const [loadingList, setLoadingList] = useState(false)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [openAddInventoryPopup, setOpenAddInventoryPopup] = useState(false);
    const [openViewInventoryPopup, setOpenViewInventoryPopup] = useState(false);
    const [inventoryData, setInventoryData] = useState(null);
    const [arrRecentlyAddedItems, setArrRecentlyAddedItems] = useState([{
        id: 1,
        item_id: 'INV-000121',
        name: 'Air filter 16X16',
        initial_quantity: 16,
        minimum_quantity: 5,
        stock_status: 'In Stock',
        updated_on: '2024-06-10 11:03:12'
    },
    {
        id: 2,
        item_id: 'INV-000122',
        name: 'Compressor Oil (1L)',
        initial_quantity: 8,
        minimum_quantity: 20,
        stock_status: 'In Stock',
        updated_on: '2024-04-13 21:09:12'
    },
    {
        id: 3,
        item_id: 'INV-000123',
        name: 'Drain Pump (1L)',
        initial_quantity: 8,
        minimum_quantity: 20,
        stock_status: 'In Stock',
        updated_on: '2024-04-13 21:09:12'
    },
    {
        id: 4,
        item_id: 'INV-000123',
        name: 'Drain Pump 2333 (1L)',
        initial_quantity: 8,
        minimum_quantity: 20,
        stock_status: 'In Stock',
        updated_on: '2024-04-13 21:09:12'
    }
    ]);
    //Default Inventory Counts Array
    const [getArrInventoryCounts, setGetArrInventoryCounts] = useState([
        { labelTop: "Total", labelBottom: "Items", key: 'total_items', value: 0, icon: <BoxIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
        { labelTop: "Items", labelBottom: "In Stock", key: 'in_stock_items', value: 0, icon: <CheckboxIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
        { labelTop: "Items", labelBottom: "Out Of Stock", key: 'out_of_stock_items', value: 0, icon: <ActivityIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
        { labelTop: "Critical", labelBottom: "Items", key: 'critical_items', value: 0, icon: <AlertTriangleIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    ]);

    const columns = [
        {
            flex: 0.08,
            field: 'item_id',
            headerName: 'Item ID',
            renderCell: (params) => {
                return (
                    <>

                        <Stack sx={{ justifyContent: 'center', height: '100%' }}>
                            <TypographyComponent fontSize={14} fontWeight={400}>{params?.row?.item_id}</TypographyComponent>
                        </Stack>
                    </>

                )
            }
        },
        {
            flex: 0.11,
            field: 'name',
            headerName: 'Name / Description'
        },
        {
            flex: 0.07,
            field: 'quantity',
            headerName: 'Quantity',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <TypographyComponent color={theme.palette.grey[900]} fontSize={14} fontWeight={500} sx={{ lineHeight: '20px' }}>
                            {params.row.initial_quantity && params.row.initial_quantity !== null ? `${params.row.initial_quantity} pcs` : ''}
                        </TypographyComponent>
                        <TypographyComponent color={theme.palette.grey[500]} fontSize={14} fontWeight={400} >
                            {params.row.minimum_quantity && params.row.minimum_quantity !== null ? `Min: ${params.row.minimum_quantity}` : ''}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.08,
            field: 'updated_on',
            headerName: 'Updated On',
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params.row.updated_on && params.row.updated_on !== null ?
                                <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                                    {params.row.updated_on && params.row.updated_on !== null ? moment(params.row.updated_on, 'YYYY-MM-DD').format('DD MMM YYYY') : ''}
                                </TypographyComponent>
                                :
                                <></>
                        }

                    </Stack>
                )
            }
        },
        {
            flex: 0.09,
            field: "stock_status",
            headerName: "Status",
            renderCell: (params) => {
                let color = 'primary'
                switch (params?.row?.stock_status) {
                    case 'Low Stock':
                        color = 'warning'
                        break
                    case 'Out Of Stock':
                        color = 'error'
                        break
                    case 'Good Stock':
                        color = 'success'
                        break
                    default:
                        color = 'primary'
                }
                return (
                    <React.Fragment><CustomChip text={params?.row?.stock_status} colorName={color} /></React.Fragment>
                )
            }
        },
        {
            flex: 0.16,
            sortable: false,
            field: "",
            headerName: 'Action',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, height: '100%' }}>
                        {
                            hasPermission('INVENTORY_VIEW') ?
                                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                                    <Tooltip title="Details" followCursor placement="top">
                                        <IconButton
                                            onClick={() => {
                                                setInventoryData(params?.row)
                                                setOpenViewInventoryPopup(true)
                                            }}
                                        >
                                            <EyeIcon stroke={'#181D27'} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                :
                                <></>
                        }
                        <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.info[500]}`, background: theme.palette.info[50], borderRadius: '6px', padding: '5px 8px', cursor: 'pointer' }}>
                            <BoxIcon stroke={theme.palette.info[700]} />
                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.info[700] }}>
                                Record Usage
                            </TypographyComponent>
                        </Stack>
                        <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.primary[600]}`, background: theme.palette.common.white, borderRadius: '6px', padding: '5px 8px', cursor: 'pointer' }}>
                            <BoxPlusIcon stroke={theme.palette.primary[500]} />
                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.primary[600] }}>
                                Restock
                            </TypographyComponent>
                        </Stack>

                    </Stack>
                );
            },
        },
    ];

    /**
     * useEffect
     * @dependency : inventoryList
     * @type : HANDLE API RESULT
     * @description : Handle the result of inventory List API
     */
    useEffect(() => {
        if (inventoryList && inventoryList !== null) {
            dispatch(resetInventoryListResponse())
            if (inventoryList?.result === true) {
                setInventoryListData(inventoryList?.response?.data)
                setOriginalInventoryListData(inventoryList?.response?.data)
                let objData = inventoryList?.response?.counts
                setGetArrInventoryCounts(prevArr =>
                    prevArr.map(item => ({
                        ...item,
                        value: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );
                setTotal(inventoryList?.response?.counts?.total_items)
                setArrRecentlyAddedItems(inventoryList?.response?.recently_added_items)
                setLoadingList(false)
            } else {
                setLoadingList(false)
                // setInventoryListData([])
                // setOriginalInventoryListData([])
                // setArrRecentlyAddedItems([])
                // setTotal(0)
                // let objData = {
                //     total_items: 0,
                //     in_stock_items: 0,
                //     out_of_stock_items: 0,
                //     critical_items: 0
                // }
                // setGetArrInventoryCounts(prevArr =>
                //     prevArr.map(item => ({
                //         ...item,
                //         value: objData[item.key] !== undefined ? objData[item.key] : 0
                //     }))
                // );
                switch (inventoryList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetInventoryListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: inventoryList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [inventoryList])

    // Initial Render
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && page && page !== null) {
            dispatch(actionInventoryList({
                status: selectedStatus,
                branch_uuid: branch?.currentBranch?.uuid,
                page: page,
                limit: LIST_LIMIT
            }))
        }

    }, [branch?.currentBranch?.uuid, selectedStatus, page])

    //handle search query
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the inventory list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (originalInventoryListData && originalInventoryListData !== null && originalInventoryListData.length > 0) {
                var filteredData = originalInventoryListData.filter(
                    item =>
                        (item?.item_id && item?.item_id.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.name && item?.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.stock_status && item?.stock_status.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setInventoryListData(filteredData)
                } else {
                    setInventoryListData([])
                }
            }
        } else {
            setInventoryListData(originalInventoryListData)
        }
    }, [searchQuery])

    return (
        <React.Fragment>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <MyBreadcrumbs />
                {
                    hasPermission('INVENTORY_ADD') ?
                        <Stack>
                            <Button
                                size={'small'}
                                sx={{ textTransform: "capitalize", px: 4, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                                onClick={() => {
                                    setOpenAddInventoryPopup(true)
                                }}
                                variant='contained'
                            >
                                <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} />
                                Add New Item
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
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(4, 1fr)",
                }}
                sx={{
                    my: 2,
                    alignItems: "stretch",
                }}
            >
                {getArrInventoryCounts && getArrInventoryCounts !== null && getArrInventoryCounts.length > 0 && getArrInventoryCounts.map((item, index) => (
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
                            height: "100%",
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
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9, xl: 9 }}>
                    <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, background: theme.palette.common.white, borderRadius: '8px', pb: 2 }}>
                        <Stack sx={{ flexDirection: 'row', background: theme.palette.common.white, width: '100%', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', py: 1 }}>
                            <Stack sx={{ flexDirection: 'row', columnGap: 1, height: '100%', padding: '15px' }}>
                                <Stack>
                                    <TypographyComponent fontSize={18} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>Inventory List</TypographyComponent>
                                </Stack>
                                <Chip
                                    label={`${inventoryListData?.length.toString().padStart(2, "0")} Tickets`}
                                    size="small"
                                    sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontSize: 14, fontWeight: 500 }}
                                />
                            </Stack>
                            <Stack sx={{ paddingRight: '15px', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                <SearchInput
                                    id="search-inventory"
                                    placeholder="Search Inventory"
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
                                    sx={{ width: 165 }}
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
                                    {masterInventoryStockStatusOptions &&
                                        masterInventoryStockStatusOptions.map(option => (
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
                        ) : inventoryListData && inventoryListData !== null && inventoryListData.length > 0 ? (
                            <ServerSideListComponents
                                height={512}
                                rows={inventoryListData}
                                columns={columns}
                                isCheckbox={false}
                                total={total}
                                page={page}
                                onPageChange={setPage}
                                pageSize={LIST_LIMIT}
                            />
                        ) : (
                            <Stack sx={{ height: 512 }}>
                                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Inventory Found'} subTitle={''} />
                            </Stack>
                        )}
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <Stack rowGap={3}>
                        <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, background: theme.palette.common.white, borderRadius: '8px', px: '22px', py: '20px' }}>
                            <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[900], mb: 3 }}>
                                Recently Added Items
                            </TypographyComponent>
                            <Stack sx={{
                                height: 228,
                                overflowY: "auto",
                                scrollbarWidth: "thin",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: theme.palette.grey[400],
                                    borderRadius: "3px",
                                },
                            }}>
                                {
                                    arrRecentlyAddedItems && arrRecentlyAddedItems !== null && arrRecentlyAddedItems.length > 0 ? (
                                        arrRecentlyAddedItems.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <Grid container spacing={1}>
                                                    <Grid size={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>
                                                            {item?.item_id && item?.item_id !== null ? item?.item_id : ''}
                                                        </TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                                            {item?.name && item?.name !== null ? item?.name : ''}
                                                        </TypographyComponent>
                                                    </Grid>
                                                    <Grid size={{ xs: 3.5, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 }}>
                                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>
                                                            {item?.updated_on && item?.updated_on !== null ? moment(item?.updated_on, 'YYYY-MM-DD').format('DD MMM YYYY') : ''}
                                                        </TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                                            {item?.updated_on && item?.updated_on !== null ? moment(item?.updated_on, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A') : ''}
                                                        </TypographyComponent>
                                                    </Grid>
                                                    <Grid size={{ xs: 3.5, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 }}>
                                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.success[700] }}>
                                                            {item?.initial_quantity && item?.initial_quantity !== null ? `+${item?.initial_quantity} pcs` : ''}
                                                        </TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                                            Avl: {item?.initial_quantity && item?.initial_quantity !== null ? item?.initial_quantity : ''}
                                                        </TypographyComponent>
                                                    </Grid>{
                                                        index < arrRecentlyAddedItems.length - 1 ?
                                                            <Divider sx={{ width: '100%', my: 1.2 }} />
                                                            :
                                                            <></>
                                                    }
                                                </Grid>
                                            </React.Fragment>
                                        ))
                                    )
                                        :
                                        <></>
                                }
                            </Stack>
                        </Stack>
                        <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, background: theme.palette.common.white, borderRadius: '8px', px: '22px', py: '20px' }}>
                            <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[900], mb: 3 }}>
                                Recently Used Items
                            </TypographyComponent>
                            <Stack sx={{
                                height: 228,
                                overflowY: "auto",
                                scrollbarWidth: "thin",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: theme.palette.grey[400],
                                    borderRadius: "3px",
                                },
                            }}>
                                {
                                    arrRecentlyAddedItems && arrRecentlyAddedItems !== null && arrRecentlyAddedItems.length > 0 ? (
                                        arrRecentlyAddedItems.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <Grid container spacing={1}>
                                                    <Grid size={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>
                                                            {item?.item_id && item?.item_id !== null ? item?.item_id : ''}
                                                        </TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                                            {item?.name && item?.name !== null ? item?.name : ''}
                                                        </TypographyComponent>
                                                    </Grid>
                                                    <Grid size={{ xs: 3.5, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 }}>
                                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>
                                                            {item?.updated_on && item?.updated_on !== null ? moment(item?.updated_on, 'YYYY-MM-DD').format('DD MMM YYYY') : ''}
                                                        </TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                                            {item?.updated_on && item?.updated_on !== null ? moment(item?.updated_on, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A') : ''}
                                                        </TypographyComponent>
                                                    </Grid>
                                                    <Grid size={{ xs: 3.5, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 }}>
                                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.error[700] }}>
                                                            {item?.initial_quantity && item?.initial_quantity !== null ? `-${item?.initial_quantity} pcs` : ''}
                                                        </TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                                            Avl: {item?.initial_quantity && item?.initial_quantity !== null ? item?.initial_quantity : ''}
                                                        </TypographyComponent>
                                                    </Grid>{
                                                        index < arrRecentlyAddedItems.length - 1 ?
                                                            <Divider sx={{ width: '100%', my: 1.2 }} />
                                                            :
                                                            <></>
                                                    }

                                                </Grid>
                                            </React.Fragment>
                                        ))
                                    )
                                        :
                                        <></>
                                }
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
            <AddInventory
                open={openAddInventoryPopup}
                type={'add'}
                handleClose={(data) => {
                    setOpenAddInventoryPopup(false)
                    if (data == 'save') {
                        dispatch(actionInventoryList({
                            status: selectedStatus,
                            branch_uuid: branch?.currentBranch?.uuid,
                            page: page,
                            limit: LIST_LIMIT
                        }))
                    }
                }}
            />
            <InventoryDetails
                open={openViewInventoryPopup}
                detail={inventoryData}
                handleClose={() => {
                    setOpenViewInventoryPopup(false)
                    setInventoryData(null)
                }}
            />
        </React.Fragment>
    )
}
