import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft';
import { Stack, Box, Divider, Avatar } from '@mui/material';
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header';
import TypographyComponent from '../../../../components/custom-typography';
import { getInitials, getPMActivityLabel } from '../../../../utils';
import moment from 'moment';
import _ from 'lodash';
import { IMAGES_SCREEN_NO_DATA } from '../../../../constants';
import ClockIcon from '../../../../assets/icons/ClockIcon';
import DocumentIcon from '../../../../assets/icons/DocumentIcon';
import PaperClipIcon from '../../../../assets/icons/PaperClipIcon';
import MessageDotsIcon from '../../../../assets/MessageDotsIcon';
import HistoryIcon from '../../../../assets/icons/HistoryIcon';

export default function TechnicianAssetView() {
    const navigate = useNavigate()
    const theme = useTheme()

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
        ]
    })

    const [documentArray, setDocumentArray] = useState([
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
    ])
    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate('/assets')
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>{assetDetails?.title}</TypographyComponent>
            </Stack>} />
            <Stack
                sx={{
                    borderRadius: '8px',
                    p: '16px',
                    width: '100%',
                    border: `1px solid ${theme.palette.grey[100]}`,
                    backgroundColor: theme.palette.common.white,
                }}
            >
                {/* Top section */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={{
                            height: 40,
                            width: 40,
                            borderRadius: 1.5,
                            backgroundColor: theme.palette.primary[600],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: theme.palette.common.white,
                        }}
                    >
                        {getInitials(assetDetails?.title, 1)}
                    </Box>

                    <Stack>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.title && assetDetails?.title !== null ? assetDetails?.title : ''}
                        </TypographyComponent>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            {assetDetails?.group_name && assetDetails?.group_name !== null ? assetDetails?.group_name : ''}
                        </TypographyComponent>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Bottom stats */}
                <Stack direction="row" justifyContent="space-between">
                    <Stack>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            Documents
                        </TypographyComponent>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.total_documents && assetDetails?.total_documents !== null && assetDetails?.total_documents > 0 ? String(assetDetails?.total_documents).padStart(2, "0") : 0}
                        </TypographyComponent>
                    </Stack>

                    <Stack>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            Active Tickets
                        </TypographyComponent>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.total_active_tickets && assetDetails?.total_active_tickets !== null && assetDetails?.total_active_tickets > 0 ? String(assetDetails?.total_active_tickets).padStart(2, "0") : 0}
                        </TypographyComponent>
                    </Stack>

                    <Stack>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            PM Activity
                        </TypographyComponent>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.upcoming_pm_activity_date && assetDetails?.upcoming_pm_activity_date !== null ? getPMActivityLabel(assetDetails?.upcoming_pm_activity_date) : 'N/A'}
                        </TypographyComponent>
                    </Stack>
                </Stack>
            </Stack>
            <Stack sx={{ width: '100%' }}>
                <TypographyComponent fontSize={18} fontWeight={500} >
                    Documents
                </TypographyComponent>
                <Stack gap={1} sx={{ flexDirection: 'row', alignItems: 'center', width: '100%', py: 1, overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                    {assetDetails?.document_categories && assetDetails?.document_categories.length > 0 ?
                        assetDetails?.document_categories.map((category, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    flexDirection: 'row', alignItems: 'center', gap: 0.8,
                                    background: category?.is_selected == true ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px', textWrap: 'nowrap',
                                    borderRadius: '8px', justifyContent: 'center', cursor: 'pointer',
                                    border: `1px solid ${theme.palette.grey[100]}`,
                                }}
                                onClick={() => {
                                    let details = Object.assign({}, assetDetails);
                                    let documentCategory = Object.assign([], details.document_categories);
                                    documentCategory.forEach((cat) => {
                                        if (cat?.id == category?.id) {
                                            cat.is_selected = true;
                                        } else {
                                            cat.is_selected = false;
                                        }
                                    })
                                    details.document_categories = documentCategory;
                                    setAssetDetails(details);
                                    if (category?.documents && category?.documents.length > 0) {
                                        setDocumentArray(category?.documents);
                                    } else {
                                        setDocumentArray([]);
                                    }

                                }}
                            >
                                <TypographyComponent fontSize={16} fontWeight={600} sx={{ textWrap: 'nowrap', color: category?.is_selected == true ? theme.palette.common.white : theme.palette.text.primary }}>
                                    {category?.category_short_name && category?.category_short_name !== null ? category?.category_short_name : ''}
                                </TypographyComponent>
                            </Stack>
                        )) : <></>}
                </Stack>
                <Stack gap={1} sx={{ background: theme.palette.common.white, p: 2, borderRadius: '8px', mt: 1, minHeight: '150px', maxHeight: '250px', overflowY: 'scroll' }}>
                    {documentArray && documentArray !== null && documentArray.length > 0 ?
                        documentArray?.map((doc, index) => {
                            const fileName = doc?.file_name || "";
                            const ext = fileName.split('.').pop().toLowerCase();

                            let iconPath = "/asset/pdf-file.png"; // default

                            if (ext === "jpg" || ext === "jpeg" || ext === "png") {
                                iconPath = "/assets/jpg-file.png";
                            } else if (ext === "pdf") {
                                iconPath = "/assets/pdf-file.png";
                            }

                            return (
                                <>
                                    <Stack key={index} gap={0.5}>
                                        {/* Row */}
                                        <Stack direction="row" justifyContent="space-between" gap={2}>
                                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }} >
                                                {/* File badge */}
                                                <img
                                                    src={iconPath}
                                                    alt="file icon"
                                                    style={{ width: 24, height: 24 }}
                                                />

                                                {/* File info */}
                                                <Stack spacing={0.3}>
                                                    <TypographyComponent fontSize={16} fontWeight={600}>
                                                        {doc.file_name && doc.file_name !== null ? _.truncate(doc.file_name, { length: 28 }) : ''}
                                                    </TypographyComponent>
                                                </Stack>
                                            </Stack>

                                            {/* Version + date */}
                                            <Stack alignItems="flex-end" gap={0.5}>
                                                <TypographyComponent fontSize={14} fontWeight={600}>
                                                    {doc.version && doc.version !== null ? _.truncate(doc.version, { length: 8 }) : ''}
                                                </TypographyComponent>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" gap={2}>
                                            <Stack direction="row" gap={1.5}>
                                                {/* File info */}
                                                <Stack gap={0.3}>
                                                    <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                        {doc.notes}
                                                    </TypographyComponent>
                                                </Stack>
                                            </Stack>

                                            {/* Version + date */}
                                            <Stack alignItems="flex-end" gap={0.5}>
                                                <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500], textWrap: 'nowrap' }}>
                                                    {moment(doc.updated_at).format("D MMM YYYY")}
                                                </TypographyComponent>
                                            </Stack>
                                        </Stack>

                                        {/* Divider except last item */}

                                    </Stack>
                                    {index !== documentArray.length - 1 && <Divider sx={{ mx: -2, my: 0.5, color: theme.palette.grey[200] }} />}
                                </>
                            );
                        })
                        :
                        <Stack sx={{ background: theme.palette.common.white, py: 2, mt: 0, alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                            <TypographyComponent fontSize={16} fontWeight={400}>No Documents Found</TypographyComponent>
                        </Stack>
                    }

                </Stack>
            </Stack>

            <Stack sx={{ width: '100%' }}>
                <TypographyComponent fontSize={18} fontWeight={500} >
                    Active Tickets
                </TypographyComponent>
                <Stack gap={1} sx={{ alignItems: 'center', width: '100%', py: 1 }}>
                    {
                        assetDetails?.tickets && assetDetails?.tickets !== null && assetDetails?.tickets.length > 0 ?
                            assetDetails?.tickets.map((objTicket, index) => {
                                return (
                                    <Stack
                                        key={index}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        <Stack spacing={1}>
                                            {/* Title */}
                                            <TypographyComponent fontSize={16} fontWeight={600}>
                                                {objTicket.name}
                                            </TypographyComponent>

                                            {/* Ticket number */}
                                            <TypographyComponent
                                                fontSize={14}
                                                fontWeight={500}
                                                sx={{ color: "#7C3AED", textDecoration: "underline" }} // violet like screenshot
                                            >
                                                {objTicket.ticket_no}
                                            </TypographyComponent>

                                            {/* Description */}
                                            <TypographyComponent
                                                fontSize={14}
                                                sx={{ color: theme.palette.grey[500] }}
                                            >
                                                {objTicket.description}
                                            </TypographyComponent>

                                            {/* Footer */}
                                            <Stack direction="row" gap={2} alignItems="center" mt={0.5}>
                                                <Stack direction="row" gap={'2px'} alignItems="center" justifyContent={'center'}>
                                                    <HistoryIcon size={14} />
                                                    <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                        {objTicket?.created_at && objTicket?.created_at !== null ? moment(objTicket?.created_at).fromNow() : ''}
                                                    </TypographyComponent>
                                                </Stack>

                                                <Stack direction="row" gap={'4px'} alignItems="center" justifyContent={'center'}>
                                                    <MessageDotsIcon size={14} />
                                                    <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                        {objTicket?.updates && objTicket?.updates !== null ? objTicket?.updates : ''} Updates
                                                    </TypographyComponent>
                                                </Stack>
                                                <Stack direction="row" gap={'4px'} alignItems="center" justifyContent={'center'}>
                                                    <PaperClipIcon size={14} />
                                                    <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                        {objTicket?.attachments && objTicket?.attachments !== null ? objTicket?.attachments : ''} Attachments
                                                    </TypographyComponent>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                )
                            })
                            :
                            <></>
                    }
                </Stack>
            </Stack>

        </Stack >
    )
}
