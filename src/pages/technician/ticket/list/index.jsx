import { Avatar, Box, Chip, Divider, Grid, InputAdornment, Stack, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header';
import BottomNav from '../../../../components/bottom-navbar';
import TypographyComponent from '../../../../components/custom-typography';
import { IMAGES_SCREEN_NO_DATA } from '../../../../constants';
import _ from 'lodash';
import moment from 'moment';
import HistoryIcon from '../../../../assets/icons/HistoryIcon';
import MessageDotsIcon from '../../../../assets/MessageDotsIcon';
import PaperClipIcon from '../../../../assets/icons/PaperClipIcon';
import { getCurrentStatusColor } from '../../../../utils';
import CustomChip from '../../../../components/custom-chip';
import AddressIcon from '../../../../assets/icons/AddressIcon';
import MapPinIcon from '../../../../assets/icons/MapPinIcon';
import { SearchInput } from '../../../../components/common';
import SearchIcon from '../../../../assets/icons/SearchIcon';
import { useNavigate } from 'react-router-dom';

export default function TicketsList() {
    const theme = useTheme()
    const navigate = useNavigate();

    const [value, setValue] = useState(3);
    const [overviewTickets, setOverviewTickets] = useState([])
    const [ticketStatusArray, setTicketStatusArray] = useState([{
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
    const [selectedTickets, setSelectedTickets] = useState('')
    const [assetDetails, setAssetDetails] = useState({
        "id": 3,
        "title": "Solar energy equipment",
        "group_name": "Electric Tower 1",
        "total_documents": 2,
        "total_active_tickets": 6,
        "upcoming_pm_activity_date": "2025-12-18",
        "document_categories": [
            {
                "id": 78,
                "uuid": "A8BwJXhfNaAPvqi7dZIoUrghC1GfVXfiJezo",
                "category_name": "Archive Files",
                "category_short_name": "Archive",
                "description": "Archived and historical documents",
                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/icon/78/78_1765190269783.svg",
                "is_selected": true,
                "documents": [
                    {
                        "id": 33,
                        "uuid": "qFxjdw5D4hRRJsylBweYGpMSdkoO3LixOxKI",
                        "file_name": "HVAC_Emergency_Shutdown_Services.jpg",
                        "version": "ver_4XSgDGlZ6BFxGDeJwSQNea3UuYcz",
                        "uploaded_by": "Avinash Suryawanshi",
                        "upload_date": "8 DEC 2025",
                        "file_size": "0.04 MB",
                        "notes": "new file document new file document new file document new file document",
                        "file_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/document/33/group/11/objTicket/73/objTicket.jpg"
                    },
                    {
                        "id": 34,
                        "uuid": "obqzyRinIAyf0XNBwaY8kD3GFZFfnYUyhXpO",
                        "file_name": "file-sample.pdf",
                        "version": "ver_jeXAEQRwY3umEMgSDukTPCeTxjQA",
                        "uploaded_by": "Avinash Suryawanshi",
                        "upload_date": "8 DEC 2025",
                        "file_size": "0.14 MB",
                        "notes": "new file",
                        "file_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/document/34/group/11/objTicket/73/file-sample.pdf"
                    }
                ]
            },
            {
                "id": 77,
                "uuid": "eCryENxTKTqZIqSfsdvoCP18IscdBr5PeaDT",
                "category_name": "Miscellaneous  Files",
                "category_short_name": "Miscellaneous",
                "description": "Archived and historical documents",
                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/icon/77/77_1765190247971.svg",
                "documents": [
                    {
                        "id": 33,
                        "uuid": "qFxjdw5D4hRRJsylBweYGpMSdkoO3LixOxKI",
                        "file_name": "objTicket.jpg",
                        "version": "ver_4XSgDGlZ6BFxGDeJwSQNea3UuYcz",
                        "uploaded_by": "Avinash Suryawanshi",
                        "upload_date": "8 DEC 2025",
                        "file_size": "0.04 MB",
                        "notes": "new file document",
                        "file_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/document/33/group/11/objTicket/73/objTicket.jpg"
                    }
                ]
            },
            {
                "id": 76,
                "uuid": "rQ4nCHhuRsZ6uY8x6JkLHH2XkwtyinxQqf4I",
                "category_name": "Vendor Policies",
                "category_short_name": "Vendor",
                "description": "Vendor agreements, warranties, and policies",
                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/icon/76/76_1765190216329.svg",
                "documents": []
            },
            {
                "id": 75,
                "uuid": "d0u3NBp2unJ1XajTBLMHO8AAtJjXGuKAOUny",
                "category_name": "Safety Documents",
                "category_short_name": "Safety",
                "description": "Safety protocols, MSDS, and compliance documents",
                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/icon/75/75_1765190189547.svg",
                "documents": []
            },
            {
                "id": 74,
                "uuid": "cYbXloDaAjZla6KZ8osRBNOs4LMrtzic8VMF",
                "category_name": "Standard Operating Procedures",
                "category_short_name": "SOP",
                "description": "Day-to-day operational procedures and guidelines",
                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/icon/74/74_1765190166370.svg",
                "documents": []
            },
            {
                "id": 73,
                "uuid": "no2wNAMjnNjPLOqPnZlTJbCXTppdbY3dLBLE",
                "category_name": "Emergency Operating Procedures",
                "category_short_name": "EOP",
                "description": "Critical emergency procedures and protocols",
                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/icon/73/73_1765190134201.svg",
                "documents": []
            }
        ],
        "tickets": [
            {
                id: 1,
                "name": "AC not working",
                "ticket_no": "VF-2025-0001677",
                "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
                "created_at": "2025-12-01T10:30:00Z",
                "updates": 2,
                "attachments": 1,
            },
            {
                id: 2,
                "name": "HVAC Unit - Tower A",
                "ticket_no": "VF-2025-0001677",
                "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
                "created_at": "2025-12-01T10:30:00Z",
                "updates": 2,
                "attachments": 3,
            },
            {
                id: 3,
                "name": "HVAC Unit - Tower B",
                "ticket_no": "VF-2025-0001677",
                "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
                "created_at": "2025-12-01T10:30:00Z",
                "updates": 2,
                "attachments": 2,
            }
        ]
    })

    const [ticketsData, setTicketsData] = useState([
        {
            "id": 1,
            "uuid": "2wsdfggfdssdfvg",
            "name": "AC not working",
            "asset_name": "Battery Monitoring System",
            "status": "Open",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 1,
        },
        {
            "id": 2,
            "uuid": "fghj567890-ss",
            "name": "HVAC Unit - Tower A",
            "asset_name": "Solar energy equipment",
            "status": "Overdue",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 3,
        },
        {
            "id": 3,
            "uuid": 'dfghjkl4567890ss',
            "name": "HVAC Unit - Tower B",
            "asset_name": "MBC(Miniature Circuit Breaker)",
            "status": "Rejected",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 2,
        },
        {
            "id": 4,
            "uuid": "dfghjrty4567",
            "name": "AC not working",
            "asset_name": "Electric Vehicles (EVs)",
            "status": "Closed",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 1,
        },
        {
            "id": 5,
            "uuid": "dfghjrsdfg345ty4567",
            "name": "HVAC Unit - Tower A",
            "asset_name": "LG AC",
            "status": "Re Open",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 3,
        },
        {
            "id": 6,
            "uuid": "dfghjr345ty4567",
            "name": "HVAC Unit - Tower B",
            "asset_name": "AC",
            "status": "On Hold",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 2,
        }
    ])
    const [ticketsOriginalData, setTicketsOriginalData] = useState([
        {
            "id": 1,
            "uuid": "2wsdfggfdssdfvg",
            "name": "AC not working",
            "asset_name": "Battery Monitoring System",
            "status": "Open",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 1,
        },
        {
            "id": 2,
            "uuid": "fghj567890-ss",
            "name": "HVAC Unit - Tower A",
            "asset_name": "Solar energy equipment",
            "status": "Overdue",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 3,
        },
        {
            "id": 3,
            "uuid": 'dfghjkl4567890ss',
            "name": "HVAC Unit - Tower B",
            "asset_name": "MBC(Miniature Circuit Breaker)",
            "status": "Rejected",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 2,
        },
        {
            "id": 4,
            "uuid": "dfghjrty4567",
            "name": "AC not working",
            "asset_name": "Electric Vehicles (EVs)",
            "status": "Closed",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 1,
        },
        {
            "id": 5,
            "uuid": "dfghjrsdfg345ty4567",
            "name": "HVAC Unit - Tower A",
            "asset_name": "LG AC",
            "status": "Re Open",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 3,
        },
        {
            "id": 6,
            "uuid": "dfghjr345ty4567",
            "name": "HVAC Unit - Tower B",
            "asset_name": "AC",
            "status": "On Hold",
            "location": "Pimpri, Kashid Park, Pune, Maharashtra, India, 411061",
            "ticket_no": "VF-2025-0001677",
            "description": "While routine check we observe high vibration in Source A Cond Pump. No. 03. so kindly arrange your technician and resolve the issue ASAP",
            "created_at": "2025-12-01T10:30:00Z",
            "updates": 2,
            "attachments": 2,
        }
    ])
    const [searchQuery, setSearchQuery] = useState('')

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
 * Initial Render
 */
    useEffect(() => {
        setOverviewTickets([
            {
                title: "Active",
                count: 0
            },
            {
                title: "On-Hold",
                count: 0
            },
            {
                title: "Closed",
                count: 0
            }
        ])
    }, [])

    return (
        <Stack rowGap={1.2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader />
            <Stack sx={{ rowGap: 1 }}>
                <TypographyComponent fontSize={18} fontWeight={500}>Tickets Overview</TypographyComponent>
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
                        onClick={() => setSelectedTickets('')}
                        sx={{
                            flexDirection: 'row', alignItems: 'center',
                            background: selectedTickets === '' ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px',
                            borderRadius: '8px', justifyContent: 'center', cursor: 'pointer'
                        }}
                    >
                        <TypographyComponent fontSize={16} fontWeight={500} sx={{ textAlign: 'center', alignItems: 'center', textWrap: 'nowrap', color: selectedTickets === '' ? theme.palette.common.white : theme.palette.common.black }}>All</TypographyComponent>
                    </Stack>
                    {ticketStatusArray && ticketStatusArray.length > 0 ?
                        ticketStatusArray.map((objTicket, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    flexDirection: 'row', alignItems: 'center', gap: 0.8,
                                    background: selectedTickets === objTicket?.title ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px', textWrap: 'nowrap',
                                    borderRadius: '8px', justifyContent: 'center', cursor: 'pointer',
                                    border: `1px solid ${theme.palette.grey[100]}`,
                                }}
                                onClick={() => {
                                    setSelectedTickets(objTicket?.title)

                                    // if (objTicket?.documents && objTicket?.documents.length > 0) {
                                    //     setTicketsData(objTicket?.documents);
                                    // } else {
                                    //     setTicketsData([]);
                                    // }

                                }}
                            >
                                <TypographyComponent fontSize={16} fontWeight={600} sx={{ textWrap: 'nowrap', color: selectedTickets === objTicket?.title ? theme.palette.common.white : theme.palette.text.primary }}>
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
                        <Stack sx={{ background: theme.palette.common.white, py: 2, mt: 0, alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                            <TypographyComponent fontSize={16} fontWeight={400}>No Tickets Found</TypographyComponent>
                        </Stack>
                    }

                </Stack>
            </Stack>
            <BottomNav value={value} onChange={setValue} />
        </Stack>
    )
}
