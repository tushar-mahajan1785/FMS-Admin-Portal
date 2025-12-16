import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft';
import { Stack, Divider, Grid, Avatar } from '@mui/material';
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header';
import TypographyComponent from '../../../../components/custom-typography';
import moment from 'moment';
import { TechnicianShowHistoryComponent } from '../../../../components/technician-history-component';
import { useDispatch, useSelector } from 'react-redux';
import { actionTechnicianTicketDetails, resetTechnicianTicketDetailsResponse } from '../../../../store/technician/tickets';
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { useBranch } from '../../../../hooks/useBranch';
import { useAuth } from '../../../../hooks/useAuth';
import FullScreenLoader from '../../../../components/fullscreen-loader';

export default function TicketView() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const { logout } = useAuth()

    const { ticketUuid } = useParams()

    // store
    const { technicianTicketDetails } = useSelector(state => state.technicianTicketsStore)

    const [ticketDetails, setTicketDetails] = useState({
        "ticket_id": 1,
        "ticket_uuid": "TMSQRw2nUSAsSfddiRLngdci6WAIfQ8Q",
        "ticket_no": "TKT-1763449512305",
        "asset_type": "Electric",
        "asset_name": "Battery Monitoring system",
        "location": "Pimpri",
        "priority": "Medium",
        "category": "BMS",
        "serial_no": "9876543",
        "vendor_id": "VEN002",
        "vendor": "PQR Ven",
        "created_by": "Admin",
        "created_on": "2025-11-18 12:35:12",
        "last_updated": "2025-11-18 12:38:41",
        "status": "Rejected",
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
                        "file_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/document/33/group/11/category/73/objTicket.jpg"
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
                        "file_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/document/34/group/11/category/73/file-sample.pdf"
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
                        "file_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/document/33/group/11/category/73/objTicket.jpg"
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
        ],
        "history_by_status": [
            {
                "status_type": "Open Statement",
                "entries": [
                    {
                        "id": 1,
                        "status": "Open",
                        "is_editable": 0,
                        "timestamp": "2025-11-18 12:35:12",
                        "title": "TR-10 VCB Not operate through TNC switch",
                        "user_id": 3,
                        "user": "Abhijeet Madake",
                        "description": "We observed that closing coil 11vdc faulty. Now replaced new one 110vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
                        "files": [
                            {
                                "id": 3,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449512337.docx",
                                "file_name": "1_1763449512337.docx"
                            },
                            {
                                "id": 2,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449512336.pdf",
                                "file_name": "1_1763449512336.pdf"
                            },
                            {
                                "id": 1,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449512315.jpg",
                                "file_name": "1_1763449512315.jpg"
                            }
                        ]
                    }
                ]
            },
            {
                "status_type": "On Hold Statement",
                "entries": [
                    {
                        "id": 2,
                        "status": "On Hold",
                        "is_editable": 0,
                        "timestamp": "2025-11-18 12:36:23",
                        "title": "Holding the BMS 1",
                        "user_id": 3,
                        "user": "Abhijeet Madake",
                        "description": "We observed that closing coil 11vdc faulty. Now replaced new one 110vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
                        "files": [
                            {
                                "id": 5,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449606193.jpg",
                                "file_name": "1_1763449606193.jpg"
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "status": "On Hold",
                        "is_editable": 0,
                        "timestamp": "2025-11-18 12:37:07",
                        "title": "New BMS",
                        "user_id": 1,
                        "user": "Akshata Thorat",
                        "description": "We observed that closing coil 11vdc faulty. Now replaced new one 110vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok. We observed that closing coil 11vdc faulty. Now replaced new one",
                        "files": [
                            {
                                "id": 6,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449627751.jpg",
                                "file_name": "1_1763449627751.jpg"
                            }
                        ]
                    }
                ]
            },
            {
                "status_type": "Open Statement",
                "entries": [
                    {
                        "id": 4,
                        "status": "Open",
                        "is_editable": 0,
                        "timestamp": "2025-11-18 12:37:31",
                        "title": "Opening",
                        "user_id": 2,
                        "user": "Avinash Suryawanshi",
                        "description": "Opening the BMS ticket We observed that closing coil 11vdc faulty. Now replaced new one 110vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
                        "files": [
                            {
                                "id": 8,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449651869.png",
                                "file_name": "1_1763449651869.png"
                            },
                            {
                                "id": 7,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449651864.pdf",
                                "file_name": "1_1763449651864.pdf"
                            }
                        ]
                    }
                ]
            },
            {
                "status_type": "Closed Statement",
                "entries": [
                    {
                        "id": 5,
                        "status": "Closed",
                        "is_editable": 0,
                        "timestamp": "2025-11-18 12:37:50",
                        "title": "Closing",
                        "user_id": 1,
                        "user": "Akshata Thorat",
                        "description": "Closing the BMS Ticket We observed that closing coil 11vdc faulty. Now replaced new one 110vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
                        "files": []
                    }
                ]
            },
            {
                "status_type": "Re Open Statement",
                "entries": [
                    {
                        "id": 6,
                        "status": "Re Open",
                        "is_editable": 0,
                        "timestamp": "2025-11-18 12:38:17",
                        "title": "Reopening the BMS",
                        "user_id": 2,
                        "user": "Avinash Suryawanshi",
                        "description": "Reopening the BMS Ticket We observed that closing coil 11vdc faulty. Now replaced new one 110vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
                        "files": []
                    }
                ]
            },
            {
                "status_type": "Rejected Statement",
                "entries": [
                    {
                        "id": 7,
                        "status": "Rejected",
                        "is_editable": 0,
                        "timestamp": "2025-11-18 12:38:41",
                        "title": "Rejecting",
                        "user_id": 2,
                        "user": "Avinash Suryawanshi",
                        "description": "Rejecting the Ticket We observed that closing coil 11vdc faulty. Now replaced new one 110vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
                        "files": [
                            {
                                "id": 9,
                                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/2/ticket/1/1_1763449721264.pdf",
                                "file_name": "1_1763449721264.pdf"
                            }
                        ]
                    }
                ]
            }
        ]
    })
    const [loadingDetail, setLoadingDetail] = useState(false)

    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && ticketUuid && ticketUuid !== null) {
            setLoadingDetail(true)
            dispatch(actionTechnicianTicketDetails({
                branch_uuid: branch?.currentBranch?.uuid,
                ticket_uuid: ticketUuid
            }))
        }
    }, [branch?.currentBranch?.uuid, ticketUuid])

    /**
     * useEffect
     * @dependency : technicianTicketDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of technician asset details API
     */
    useEffect(() => {
        if (technicianTicketDetails && technicianTicketDetails !== null) {
            dispatch(resetTechnicianTicketDetailsResponse())
            if (technicianTicketDetails?.result === true) {
                setLoadingDetail(false)
                setTicketDetails(technicianTicketDetails?.response)
            } else {
                setLoadingDetail(false)
                setTicketDetails(null)
                switch (technicianTicketDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianTicketDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianTicketDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianTicketDetails])

    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate('/tickets')
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>Ticket {ticketDetails?.ticket_no && ticketDetails?.ticket_no !== null ? `#${ticketDetails?.ticket_no}` : ''}</TypographyComponent>
            </Stack>} />

            {loadingDetail ?
                <FullScreenLoader open={true} />
                :
                <></>
            }
            <Stack>
                <TypographyComponent fontSize={18} fontWeight={500}>Ticket Information</TypographyComponent>
                <Stack sx={{ background: theme.palette.common.white, p: '16px', borderRadius: '8px', mt: 1 }}>
                    <Grid container spacing={2.2}>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Ticket No
                                </TypographyComponent>
                                <TypographyComponent fontSize={18} fontWeight={500}>
                                    {ticketDetails?.ticket_no && ticketDetails?.ticket_no !== null ? ticketDetails?.ticket_no : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Created On
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.created_on && ticketDetails?.created_on !== null ? moment(ticketDetails?.created_on, 'YYYY-MM-DD hh:mm').format('DD MMM YYYY, hh:mm') : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}><Divider sx={{ color: theme.palette.grey[300] }} /></Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Asset Name
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.asset_name && ticketDetails?.asset_name !== null ? ticketDetails?.asset_name : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Asset Type
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.asset_type && ticketDetails?.asset_type !== null ? ticketDetails?.asset_type : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}><Divider sx={{ color: theme.palette.grey[300] }} /></Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Created By
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.created_by && ticketDetails?.created_by !== null ? ticketDetails?.created_by : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Updated On
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.last_updated && ticketDetails?.last_updated !== null ? moment(ticketDetails?.last_updated, 'YYYY-MM-DD hh:mm').format('DD MMM YYYY, hh:mm') : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}><Divider sx={{ color: theme.palette.grey[300] }} /></Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Location
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.location && ticketDetails?.location !== null ? ticketDetails?.location : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
            <Stack>
                <TypographyComponent fontSize={18} fontWeight={500}>Ticket Updates</TypographyComponent>
                {
                    ticketDetails?.history_by_status && ticketDetails?.history_by_status !== null && ticketDetails?.history_by_status.length > 0 ?
                        <Stack>
                            {/* Show Tickets History */}
                            <TechnicianShowHistoryComponent
                                historyArray={ticketDetails?.history_by_status}
                                title="title"
                                description="description"
                                files="files"
                                user="user"
                            />
                        </Stack>
                        :
                        <Stack sx={{ background: theme.palette.common.white, py: 6, mt: 1, borderRadius: '8px', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                            <TypographyComponent fontSize={16} fontWeight={400}>No Ticket Updates Found</TypographyComponent>
                        </Stack>
                }

            </Stack>



        </Stack >
    )
}
