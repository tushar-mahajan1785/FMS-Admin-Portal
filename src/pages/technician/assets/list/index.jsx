import { useEffect, useState } from "react";
import { Box, Divider, Stack, useTheme } from "@mui/material";
import TypographyComponent from "../../../../components/custom-typography";
import BottomNav from "../../../../components/bottom-navbar";
import { TechnicianNavbarHeader } from "../../../../components/technician/navbar-header";
import { getInitials, getPMActivityLabel } from "../../../../utils";
import { useNavigate } from "react-router-dom";

export default function TechnicianAssetList() {
    const theme = useTheme()
    const navigate = useNavigate();
    const [getAssetTypesList, setGetAssetTypesList] = useState([])
    const [getAssetList, setGetAssetList] = useState([])
    const [value, setValue] = useState(2);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState('');

    useEffect(() => {
        setGetAssetTypesList([
            {
                "id": 1,
                "asset_type_id": 1,
                "title": "Electric",
                "total_groups": 2,
                "total_assets": 5,
                "total_checklists": 120,
                "total_completed": 3,
                "total_overdue": 74,
                "total_abnormal": 2,
                "total_pending": 40,
                "total_not_approved": 1
            },
            {
                "id": 2,
                "asset_type_id": 2,
                "title": "Cooling",
                "total_groups": 1,
                "total_assets": 2,
                "total_checklists": 48,
                "total_completed": 0,
                "total_overdue": 32,
                "total_abnormal": 0,
                "total_pending": 16,
                "total_not_approved": 0
            },
            {
                "id": 3,
                "asset_type_id": 3,
                "title": "BMS",
                "total_groups": 1,
                "total_assets": 2,
                "total_checklists": 48,
                "total_completed": 1,
                "total_overdue": 29,
                "total_abnormal": 1,
                "total_pending": 16,
                "total_not_approved": 1
            },
            {
                "id": 9,
                "asset_type_id": 9,
                "title": "Operating",
                "total_groups": 1,
                "total_assets": 3,
                "total_checklists": 72,
                "total_completed": 0,
                "total_overdue": 46,
                "total_abnormal": 2,
                "total_pending": 24,
                "total_not_approved": 0
            }
        ])
        setGetAssetList([
            {
                "id": 3,
                "title": "Solar energy equipment",
                "group_name": "Electric Tower 1",
                "total_documents": 2,
                "total_active_tickets": 6,
                "upcoming_pm_activity_date": "2025-12-18",
            },
            {
                "id": 44,
                "title": "Cash and Cash Equivalents",
                "group_name": "Operating Tower Phase I",
                "total_documents": 1,
                "total_active_tickets": 65,
                "upcoming_pm_activity_date": "2025-12-20",
            },
            {
                "id": 4,
                "title": " MBC (Miniature Circuit Breaker)",
                "group_name": "Electric Tower 1",
                "total_documents": 4,
                "total_active_tickets": 45,
                "upcoming_pm_activity_date": "2025-12-25",
            },
            {
                "id": 9,
                "title": "Electric vehicles (EVs)",
                "group_name": "Electric Tower 1",
                "total_documents": 5,
                "total_active_tickets": 5,
                "upcoming_pm_activity_date": "2025-12-29",
            },
            {
                "id": 45,
                "title": "PPE (Property, Plant, and Equipment)",
                "group_name": "Operating Tower Phase I",
                "total_documents": 7,
                "total_active_tickets": 23,
                "upcoming_pm_activity_date": "2025-12-23",
            },
            {
                "id": 46,
                "title": "Patents (intangible asset)",
                "group_name": "Operating Tower Phase I",
                "total_documents": 2,
                "total_active_tickets": 56,
                "upcoming_pm_activity_date": "2025-12-26",
            }
        ])
    }, [])

    const colorPalette = [
        theme.palette.primary[600], // violet
        theme.palette.info[600], // blue
        theme.palette.error[600], // red
        theme.palette.success[600], // green
        theme.palette.warning[600], // amber
    ];

    const getColorByIndex = (index = 0) => {
        return colorPalette[index % colorPalette.length];
    };

    return (
        <Stack rowGap={1.2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader />
            <Stack sx={{ flexDirection: 'row', gap: 1.2, borderRadius: '8px', width: '100%', overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                <Stack
                    onClick={() => setSelectedAssetTypeId('')}
                    sx={{
                        flexDirection: 'row', alignItems: 'center',
                        background: selectedAssetTypeId === '' ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px',
                        borderRadius: '8px', justifyContent: 'center', cursor: 'pointer'
                    }}
                >
                    <TypographyComponent fontSize={16} fontWeight={500} sx={{ textAlign: 'center', alignItems: 'center', textWrap: 'nowrap', color: selectedAssetTypeId === '' ? theme.palette.common.white : theme.palette.common.black }}>All Assets</TypographyComponent>
                </Stack>
                {
                    getAssetTypesList && getAssetTypesList !== null && getAssetTypesList.length > 0 ?
                        getAssetTypesList.map((objData, index) => {
                            const color = getColorByIndex(index)
                            // console.log('-------getColorFromString(objData?.title)---------', getColorFromString(objData?.title))
                            return (<Stack
                                key={index}
                                sx={{
                                    flexDirection: 'row', alignItems: 'center', gap: 0.8,
                                    background: selectedAssetTypeId === objData?.asset_type_id ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px', textWrap: 'nowrap',
                                    borderRadius: '8px', justifyContent: 'center', cursor: 'pointer',
                                    border: `1px solid ${theme.palette.grey[100]}`,
                                }}
                                onClick={() => setSelectedAssetTypeId(objData?.asset_type_id)}
                            >
                                <Box
                                    sx={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: "15px",
                                        border: selectedAssetTypeId === objData?.asset_type_id ? `1.2px solid ${color}` : `1px solid ${color}`,
                                        color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: color }}>{getInitials(objData?.title, 1)}</TypographyComponent>
                                </Box>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ textAlign: 'center', color: selectedAssetTypeId === objData?.asset_type_id ? theme.palette.common.white : theme.palette.common.black }}>{objData?.title}</TypographyComponent>
                            </Stack>)
                        })
                        :
                        <></>
                }
            </Stack>
            <Stack gap={1.3} sx={{ width: '100%' }}>
                {
                    getAssetList && getAssetList !== null && getAssetList.length > 0 ?
                        getAssetList.map((asset, index) => {
                            return (<Stack
                                sx={{
                                    borderRadius: '8px',
                                    p: '16px',
                                    width: '100%',
                                    border: `1px solid ${theme.palette.grey[100]}`,
                                    backgroundColor: theme.palette.common.white,
                                }}
                                onClick={() => {
                                    navigate(`view/${asset?.id}`)
                                }}
                            >
                                {/* Top section */}
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        sx={{
                                            height: 40,
                                            width: 40,
                                            borderRadius: 1.5,
                                            backgroundColor: getColorByIndex(index),
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: theme.palette.common.white,
                                        }}
                                    >
                                        {getInitials(asset?.title, 1)}
                                    </Box>

                                    <Stack>
                                        <TypographyComponent fontSize={16} fontWeight={600}>
                                            {asset?.title}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                            {asset?.group_name}
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
                                            {asset?.total_documents && asset?.total_documents !== null && asset?.total_documents > 0 ? String(asset?.total_documents).padStart(2, "0") : 0}
                                        </TypographyComponent>
                                    </Stack>

                                    <Stack>
                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                            Active Tickets
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={600}>
                                            {asset?.total_active_tickets && asset?.total_active_tickets !== null && asset?.total_active_tickets > 0 ? String(asset?.total_active_tickets).padStart(2, "0") : 0}
                                        </TypographyComponent>
                                    </Stack>

                                    <Stack>
                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                            PM Activity
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={600}>
                                            {asset?.upcoming_pm_activity_date && asset?.upcoming_pm_activity_date !== null ? getPMActivityLabel(asset?.upcoming_pm_activity_date) : 'N/A'}
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>
                            </Stack>)
                        })
                        :
                        <></>
                }
            </Stack>
            <BottomNav value={value} onChange={setValue} />
        </Stack>
    )
}