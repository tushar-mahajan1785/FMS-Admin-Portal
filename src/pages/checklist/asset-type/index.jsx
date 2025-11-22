import { Box, Button, Card, Divider, Grid, IconButton, InputAdornment, Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import MyBreadcrumbs from "../../../components/breadcrumb";
import TypographyComponent from "../../../components/custom-typography";
import BoxIcon from "../../../assets/icons/BoxIcon";
import CheckboxIcon from "../../../assets/icons/CheckboxIcon";
import ActivityIcon from "../../../assets/icons/ActivityIcon";
import AlertTriangleIcon from "../../../assets/icons/AlertTriangleIcon";
import EyeIcon from "../../../assets/icons/EyeIcon";
import ArrowRightIcon from "../../../assets/icons/ArrowRightIcon";
import ProgressBar from "../../../components/progress-bar";
import { SearchInput, StyledLinearProgress } from "../../../components/common";
import { getPercentage } from "../../../utils";
import AssetIcon from "../../../assets/icons/AssetIcon";
import ClockIcon from "../../../assets/icons/ClockIcon";
import FileXIcon from "../../../assets/icons/FileXIcon";
import SearchIcon from "../../../assets/icons/SearchIcon";
import { useNavigate } from "react-router-dom";

export default function ChecklistAssetTypes() {
    const theme = useTheme()
    const navigate = useNavigate()

    //Default Checklists Counts Array
    const [getChecklistCounts] = useState([
        { labelTop: "Total", labelBottom: "Checklist Groups", key: 'total_items', value: 0, icon: <BoxIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
        { labelTop: "Total", labelBottom: "Assets", key: 'in_stock_items', value: 0, icon: <CheckboxIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
        { labelTop: "Completed", labelBottom: "Today", key: 'out_of_stock_items', value: 0, icon: <ActivityIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
        { labelTop: "Pending", labelBottom: "Today", key: 'critical_items', value: 0, icon: <AlertTriangleIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
        { labelTop: "Overdue", labelBottom: "Checklists", key: 'critical_items', value: 0, icon: <AlertTriangleIcon size={'24'} stroke={theme.palette.primary[600]} />, color: theme.palette.primary[50] },
    ]);
    const [searchQuery, setSearchQuery] = useState('')
    const [arrAssetTypesData, setArrAssetTypesData] = useState([])
    const [arrAssetTypesOriginalData, setArrAssetTypesOriginalData] = useState([])

    const getColorAndBackgroundForAssetType = (index) => {
        let color = {
            color: '#7F56D9',
            backgroundColor: '#F9F5FF'
        };

        switch (String(index)) {
            case '0':
                color = {
                    color: '#7F56D9',
                    backgroundColor: '#F9F5FF'
                };
                break;
            case '1':
                color = {
                    color: '#039855',
                    backgroundColor: '#ECFDF3'
                };
                break;
            case '2':
                color = {
                    color: '#1E88E5',
                    backgroundColor: '#E3F2FD'
                };
                break;
            case '3':
                color = {
                    color: '#DC6803',
                    backgroundColor: '#FFFCF5'
                };
                break;
            case '4':
                color = {
                    color: '#039BE5',
                    backgroundColor: '#E1F5FE'
                };
                break;
            case '5':
                color = {
                    color: '#FFB300',
                    backgroundColor: '#FFF8E1'
                };
                break;
            default:
                // Fallback to the initial defined color if something unexpected happens
                break;
        }
        return color;
    };

    /**
     * Filter the Assets types list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (arrAssetTypesOriginalData && arrAssetTypesOriginalData !== null && arrAssetTypesOriginalData.length > 0) {
                var filteredData = arrAssetTypesOriginalData.filter(
                    item =>
                        (item?.title && item?.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setArrAssetTypesData(filteredData)
                } else {
                    setArrAssetTypesData([])
                }
            }
        } else {
            setArrAssetTypesData(arrAssetTypesOriginalData)
        }
    }, [searchQuery])

    useEffect(() => {
        let data = [
            {
                "id": 1,
                "asset_type_id": "1",
                "title": "DG Sets",
                "total_groups": "2",
                "total_assets": "15",
                "total_checklists": "36",
                "total_completed": "12",
                "total_overdue": "2",
                "total_abnormal": "4",
                "total_pending": "24",
                "total_not_approved": "2"
            },
            {
                "id": 2,
                "asset_type_id": "2",
                "title": "PAC Units",
                "total_groups": "5",
                "total_assets": "10",
                "total_checklists": "20",
                "total_completed": "12",
                "total_overdue": "2",
                "total_abnormal": "4",
                "total_pending": "8",
                "total_not_approved": "2",
            },
            {
                "id": 3,
                "asset_type_id": "3",
                "title": "HVAC Systems",
                "total_groups": "2",
                "total_assets": "15",
                "total_checklists": "36",
                "total_completed": "12",
                "total_overdue": "2",
                "total_abnormal": "4",
                "total_pending": "24",
                "total_not_approved": "2"
            },
            {
                "id": 4,
                "asset_type_id": "4",
                "title": "Chillers",
                "total_groups": "3",
                "total_assets": "12",
                "total_checklists": "10",
                "total_completed": "8",
                "total_overdue": "2",
                "total_abnormal": "4",
                "total_pending": "1",
                "total_not_approved": "1"
            },
            {
                "id": 5,
                "asset_type_id": "5",
                "title": "RMU",
                "total_groups": "3",
                "total_assets": "12",
                "total_checklists": "9",
                "total_completed": "5",
                "total_overdue": "2",
                "total_abnormal": "4",
                "total_pending": "4",
                "total_not_approved": "2"
            },
            {
                "id": 6,
                "asset_type_id": "6",
                "total_groups": "3",
                "title": "CRAH",
                "total_assets": "12",
                "total_checklists": "9",
                "total_completed": "6",
                "total_overdue": "2",
                "total_abnormal": "3",
                "total_pending": "24",
                "total_not_approved": "2"
            },
            {
                "id": 7,
                "asset_type_id": "7",
                "title": "PSU",
                "total_groups": "2",
                "total_assets": "15",
                "total_checklists": "36",
                "total_completed": "12",
                "total_overdue": "2",
                "total_abnormal": "4",
                "total_pending": "24",
                "total_not_approved": "2"
            }
        ];
        // Determine the number of unique color cases (0, 1, 2, 3, 4, 5)
        const NUMBER_OF_COLOR_CASES = 6;

        // Use map to iterate through the array and assign colors
        const updatedAssetTypesData = data && data !== null && data.length > 0 ? data?.map((asset, index) => {
            // 1. Calculate the cyclic index (0, 1, 2, 3, 4, 5, 0, 1, ...)
            const colorIndex = index % NUMBER_OF_COLOR_CASES;

            // 2. Get the color object for the cyclic index
            const colors = getColorAndBackgroundForAssetType(String(colorIndex));

            // 3. Return the updated asset object with the new colors
            return {
                ...asset,
                // The asset's main background_color gets the color property
                background_color: colors.backgroundColor,

                // The border_color gets the backgroundColor property
                border_color: colors.color,

                // The icon_color gets the color property
                icon_color: colors.backgroundColor,

                // The icon_background gets the backgroundColor property
                icon_background: theme.palette.common.white,
            };
        }) : [];
        setArrAssetTypesData(updatedAssetTypesData)
        setArrAssetTypesOriginalData(updatedAssetTypesData)

    }, [])

    return (<>
        <React.Fragment>
            <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                <TypographyComponent color={theme.palette.text.primary} fontSize={24} fontWeight={500}>Checklist Management</TypographyComponent>
            </Stack>
            <Box
                display="grid"
                gap={2}
                gridTemplateColumns={{
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(5, 1fr)",
                    lg: "repeat(5, 1fr)",
                }}
                sx={{
                    my: 2,
                    alignItems: "stretch",
                }}
            >
                {getChecklistCounts && getChecklistCounts !== null && getChecklistCounts.length > 0 && getChecklistCounts.map((item, index) => (
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
                                        backgroundColor: theme.palette.primary[100],
                                        color: theme.palette.primary[600],
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
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
                <TypographyComponent fontSize={16} fontWeight={600}>Assets Types Groups</TypographyComponent>
                <SearchInput
                    id="search-assets"
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                    sx={{ background: 'white', width: '507px' }}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 1 }}>
                                <SearchIcon stroke={theme.palette.grey[500]} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <Grid container spacing={3}>
                {arrAssetTypesData && arrAssetTypesData?.length > 0 &&
                    arrAssetTypesData.map((objAsset) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }} key={objAsset.id}>
                            <Card
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    width: '100%',
                                    borderRadius: "16px",
                                    border: `1px solid ${objAsset.border_color}`,
                                    backgroundColor: objAsset.background_color,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>
                                    <Stack direction="row" gap={2} alignItems="center">
                                        <Box
                                            sx={{
                                                height: 64,
                                                width: 64,
                                                borderRadius: "8px",
                                                backgroundColor: objAsset.icon_background,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <AssetIcon stroke={objAsset.border_color} size={18} />
                                        </Box>
                                        <Box>
                                            <TypographyComponent fontSize={16} fontWeight={500}>
                                                {objAsset.title}
                                            </TypographyComponent>
                                            <Stack flexDirection={'row'} sx={{ gap: '16px' }}>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_groups} Groups</TypographyComponent>
                                                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                </Stack>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_assets} Assets</TypographyComponent>
                                                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                </Stack>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_checklists} Checklists</TypographyComponent>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                    <Box >
                                        <IconButton
                                            onClick={() => {
                                                navigate(`asset-groups/${objAsset?.asset_type_id}`)
                                            }}
                                        >
                                            <ArrowRightIcon />
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                            Today's Overall Progress
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: objAsset.border_color }}>
                                            {Math.round(getPercentage(objAsset.total_completed, objAsset.total_checklists))}% Complete
                                        </TypographyComponent>
                                    </Stack>

                                    <Stack sx={{ width: '100%' }}>
                                        <Box sx={{ width: '100%', mr: 1 }}>
                                            <StyledLinearProgress variant="determinate" value={getPercentage(objAsset.total_completed, objAsset.total_checklists)} bgColor={objAsset.border_color} />
                                        </Box>
                                    </Stack>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Stack sx={{ gap: 1 }}>
                                    <Stack direction="row" spacing={1.5} sx={{ textWrap: 'wrap' }}>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.success[50], border: `1px solid ${theme.palette.success[200]}` }}>
                                            <CheckboxIcon size={'20'} stroke={theme.palette.success[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.success[600] }}>{objAsset?.total_completed} Completed</TypographyComponent>
                                        </Stack>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.error[50], border: `1px solid ${theme.palette.error[200]}` }}>
                                            <AlertTriangleIcon size={'20'} stroke={theme.palette.error[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.error[600] }}>{objAsset?.total_overdue} Overdue</TypographyComponent>
                                        </Stack>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.warning[50], border: `1px solid ${theme.palette.warning[200]}` }}>
                                            <AlertTriangleIcon size={'20'} stroke={theme.palette.warning[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.warning[600] }}>{objAsset?.total_abnormal} Abnormal</TypographyComponent>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} sx={{ textWrap: 'wrap' }}>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.warning[50], border: `1px solid ${theme.palette.warning[200]}` }}>
                                            <ClockIcon size={'18'} stroke={theme.palette.warning[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.warning[600] }}>{objAsset?.total_pending} Pending</TypographyComponent>
                                        </Stack>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.grey[50], border: `1px solid ${theme.palette.grey[200]}` }}>
                                            <FileXIcon size={'20'} stroke={theme.palette.grey[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_not_approved} Not Approved</TypographyComponent>
                                        </Stack>
                                    </Stack>
                                </Stack>

                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </React.Fragment>
    </>)

}