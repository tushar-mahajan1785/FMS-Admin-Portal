import { useTheme } from '@emotion/react'
import { Box, Chip, Divider, Drawer, Grid, IconButton, Stack, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
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
import { IMAGES_SCREEN_NO_DATA, LIST_LIMIT } from '../../../constants'
import ServerSideListComponents from '../../../components/server-side-list-component'
import EmptyContent from '../../../components/empty_content'
import AlertTriangleIcon from '../../../assets/icons/AlertTriangleIcon'

export const InventoryDetails = ({ open, handleClose, detail }) => {
    const theme = useTheme()
    const { hasPermission } = useAuth()

    const [filterJson] = useState(["Overview", "Complete History", "Consumption History", "Restock History"]);
    const [selectedFilter, setSelectedFilter] = useState("Overview");
    const [inventoryDetailsData] = useState({
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
        "image_url": "https://fms-super-admin.interdev.in/fms/ticket/10/10_1762840033061.jpg"
    })
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [transactionHistoryData, setTransactionHistoryData] = useState([])

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
                            gap: 0.5, // ⭐ This creates space between chips
                            flexWrap: 'wrap', // ⭐ This allows files to wrap to the next line
                            maxHeight: '100%',
                            overflowY: 'auto', // Optional: adds a scrollbar if files are numerous
                            p: 0.5
                        }}
                    >
                        {
                            params?.row?.files && params.row.files.length > 0 ?
                                params.row.files.map((file, index) => {
                                    const fileName = file.split("/").pop();
                                    return (
                                        <Chip
                                            key={index}
                                            label={fileName}
                                            size="small"
                                        />
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
            console.log('detail', detail)
            setTotal(10)
            setTransactionHistoryData([{
                id: 1,
                date: '2024-06-10 22:01:01',
                supplier: 'Cooltech Sipplies',
                quantity: '50 Kilograms',
                invoice_no: 'INV-8788',
                stock_after: '200 Kilograms',
                additional_info: "Restocked via purchase order PO-4523",
                files: ["https://fms-super-admin.interdev.in/fms/ticket/10/10_1762840033061.jpg", "https://fms-super-admin.interdev.in/fms/ticket/8/8_1763011390575.jpg"]
            },

            {
                id: 1,
                date: '2024-06-10 09:01:01',
                supplier: 'Cooltech Sipplies',
                quantity: '50 Kilograms',
                invoice_no: 'INV-8788',
                stock_after: '200 Kilograms',
                additional_info: "Restocked via purchase order PO-4523",
                files: ["https://fms-super-admin.interdev.in/fms/ticket/10/10_1762840033061.jpg"]
            }])
        }

    }, [open])

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
                <TypographyComponent fontSize={32} fontWeight={400} sx={{ fontWeight: 'bold', color: title === 'Current Stock' ? '#673ab7' : 'text.primary' }}>
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
                        <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.grey[700]}`, background: theme.palette.common.white, borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                            <BoxPlusIcon stroke={theme.palette.grey[700]} size={22} />
                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[700] }}>
                                Restock
                            </TypographyComponent>
                        </Stack>
                        <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', border: `1px solid${theme.palette.grey[700]}`, background: theme.palette.common.white, borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
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

                        {/* 1. Image Card (Takes 2 grid units) */}
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

                        {/* 2. Current Stock Tile (Takes 2 grid units) */}
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Current Stock"
                                value={`${inventoryDetailsData?.initial_quantity && inventoryDetailsData?.initial_quantity !== null ? `${inventoryDetailsData?.initial_quantity}  ${inventoryDetailsData?.unit}` : ''}`}
                                subtext={`Min: ${inventoryDetailsData?.minimum_quantity && inventoryDetailsData?.minimum_quantity !== null ? `${inventoryDetailsData?.minimum_quantity} ${inventoryDetailsData?.unit}` : ''}`}
                                icon={<BoxIcon stroke={theme.palette.primary[600]} size={24} />}
                                iconBgColor={theme.palette.primary[100]}
                            />
                        </Grid>

                        {/* 3. Total Restocked Tile (Takes 2.5 grid units) */}
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Total Restocked"
                                value={`${inventoryDetailsData?.restocked_quantity && inventoryDetailsData?.restocked_quantity !== null ? `${inventoryDetailsData?.restocked_quantity}  ${inventoryDetailsData?.unit}` : ''}`}
                                subtext="All Time"
                                icon={<BoxPlusIcon stroke={theme.palette.success[600]} size={24} />}
                                iconBgColor={theme.palette.success[100]}
                            />
                        </Grid>

                        {/* 4. Total Consumed Tile (Takes 2.5 grid units) */}
                        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
                            <InfoTile
                                title="Total Consumed"
                                value={`${inventoryDetailsData?.consumed_quantity && inventoryDetailsData?.consumed_quantity !== null ? `${inventoryDetailsData?.consumed_quantity}  ${inventoryDetailsData?.unit}` : ''}`}
                                subtext="All Time"
                                icon={<StairDownIcon stroke={theme.palette.warning[600]} size={24} />}
                                iconBgColor={theme.palette.warning[100]}
                            />
                        </Grid>

                        {/* 5. Last Restocked Tile (Takes 2 grid units) */}
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
                    <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px', pb: 1.5 }}>
                        <SectionHeader sx={{ mt: 0, mb: 0, px: 1, pt: 1 }} title={'Complete Transaction History'} show_progress={false} />
                        {transactionHistoryData && transactionHistoryData !== null && transactionHistoryData.length > 0 ? (
                            <ServerSideListComponents
                                height={300}
                                rows={transactionHistoryData}
                                columns={columns}
                                isCheckbox={false}
                                total={total}
                                page={page}
                                onPageChange={setPage}
                                pageSize={LIST_LIMIT}
                            />
                        ) : (
                            <Stack sx={{ height: 300 }}>
                                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Transaction History Found'} subTitle={''} />
                            </Stack>
                        )}
                    </Stack>
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
                                    Current stock (8 kg) is below the minimum level (15 kg). Consider restocking soon to avoid stockouts.
                                </TypographyComponent>
                            </Stack>
                        </Stack>
                        <Stack>
                            <Stack sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', background: theme.palette.warning[600], borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                                <BoxPlusIcon stroke={theme.palette.common.white} size={22} />
                                <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.common.white }}>
                                    Restock
                                </TypographyComponent>
                            </Stack>
                        </Stack>

                    </Stack>
                </Stack>
            </Stack>
        </Drawer >
    )
}
