import { Box, Card, Divider, Grid, Stack, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import TypographyComponent from '../../../../components/custom-typography'
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants'
import EmptyContent from '../../../../components/empty_content'
import { getColorAndBackgroundForAssetType, getInitials, getPercentage } from '../../../../utils'
import { StyledLinearProgress } from '../../../../components/common'
import AssetIcon from '../../../../assets/icons/AssetIcon'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../../../components/bottom-navbar'
import { useDispatch, useSelector } from 'react-redux'
import { actionTechnicianChecklistAssetTypeList, resetTechnicianChecklistAssetTypeListResponse } from '../../../../store/technician/checklist'
import { useBranch } from '../../../../hooks/useBranch'
import { useAuth } from '../../../../hooks/useAuth'
import { useSnackbar } from '../../../../hooks/useSnackbar'
import FullScreenLoader from '../../../../components/fullscreen-loader'

export default function AssetTypesChecklist() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    const [overviewChecklists, setOverviewChecklists] = useState([])
    const [arrAssetTypesData, setArrAssetTypesData] = useState([])
    const [loadingList, setLoadingList] = useState(false)

    //Stores
    const { technicianChecklistAssetTypeList } = useSelector(state => state.technicianChecklistStore)

    /**
     * Initial call Asset type list API
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            setLoadingList(true)
            dispatch(actionTechnicianChecklistAssetTypeList({
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
    }, [branch?.currentBranch?.uuid])

    /**
      * useEffect
      * @dependency : technicianChecklistAssetTypeList
      * @type : HANDLE API RESULT
      * @description : Handle the result of inventory category List API
     */
    useEffect(() => {
        if (technicianChecklistAssetTypeList && technicianChecklistAssetTypeList !== null) {
            dispatch(resetTechnicianChecklistAssetTypeListResponse())
            if (technicianChecklistAssetTypeList?.result === true) {

                // Use map to iterate through the array and assign colors
                const updatedAssetTypesData = technicianChecklistAssetTypeList?.response?.asset_types && technicianChecklistAssetTypeList?.response?.asset_types !== null && technicianChecklistAssetTypeList?.response?.asset_types?.length > 0 ? technicianChecklistAssetTypeList?.response?.asset_types?.map((asset, index) => {
                    // 1. Calculate the cyclic index (0, 1, 2, 3, 4, 5, 0, 1, ...)
                    const colorIndex = index % 10;

                    // 2. Get the color object for the cyclic index
                    const colors = getColorAndBackgroundForAssetType(String(colorIndex));

                    // 3. Return the updated asset object with the new colors
                    return {
                        ...asset,
                        background_color: colors.backgroundColor,
                        border_color: theme.palette.common.white,
                        icon_color: theme.palette.common.white,
                        icon_background: colors.color,
                    };
                }) : [];
                setArrAssetTypesData(updatedAssetTypesData)

                let objData = technicianChecklistAssetTypeList?.response?.overall_totals
                setOverviewChecklists(prevArr =>
                    prevArr.map(item => ({
                        ...item,
                        count: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );

                setLoadingList(false)
            } else {
                setLoadingList(false)
                // setArrAssetTypesData([])
                let objData = {
                    pending_count: 0,
                    missing_count: 0,
                    completed_count: 0
                }
                setOverviewChecklists(prevArr =>
                    prevArr.map(item => ({
                        ...item,
                        count: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );
                switch (technicianChecklistAssetTypeList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianChecklistAssetTypeListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianChecklistAssetTypeList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianChecklistAssetTypeList])

    /**
    * Initial Render
    */
    useEffect(() => {
        setOverviewChecklists([
            {
                title: "Pending",
                count: 3,
                key: 'pending_count'
            },
            {
                title: "Missed",
                count: 0,
                key: 'missing_count'
            },
            {
                title: "Completed",
                count: 12,
                key: 'completed_count'
            }
        ])
        let data = [
            {
                "id": 1,
                "asset_type_id": 1,
                "title": "Electric",
                "total_groups": 2,
                "total_assets": 5,
                "total_checklists": 36,
                "total_completed": 2,
                "total_overdue": 0,
                "total_abnormal": 1,
                "total_pending": 0,
                "total_not_approved": 3
            },
            {
                "id": 2,
                "asset_type_id": 2,
                "title": "Cooling",
                "total_groups": 1,
                "total_assets": 2,
                "total_checklists": 13,
                "total_completed": 5,
                "total_overdue": 0,
                "total_abnormal": 2,
                "total_pending": 0,
                "total_not_approved": 6
            },
            {
                "id": 3,
                "asset_type_id": 3,
                "title": "BMS",
                "total_groups": 0,
                "total_assets": 0,
                "total_checklists": 20,
                "total_completed": 5,
                "total_overdue": 0,
                "total_abnormal": 0,
                "total_pending": 0,
                "total_not_approved": 0
            },
            {
                "id": 9,
                "asset_type_id": 9,
                "title": "Operating",
                "total_groups": 0,
                "total_assets": 0,
                "total_checklists": 16,
                "total_completed": 9,
                "total_overdue": 0,
                "total_abnormal": 0,
                "total_pending": 0,
                "total_not_approved": 0
            }
        ]
        const updatedAssetTypesData = data && data !== null && data?.length > 0 ? data?.map((asset, index) => {
            // 1. Calculate the cyclic index (0, 1, 2, 3, 4, 5, 0, 1, ...)
            const colorIndex = index % 10;

            // 2. Get the color object for the cyclic index
            const colors = getColorAndBackgroundForAssetType(String(colorIndex));

            // 3. Return the updated asset object with the new colors
            return {
                ...asset,
                background_color: colors.backgroundColor,
                border_color: theme.palette.common.white,
                icon_color: theme.palette.common.white,
                icon_background: colors.color,
                // icon_color: colors.backgroundColor,
                // icon_background: theme.palette.common.white,
            };
        }) : [];
        setArrAssetTypesData(updatedAssetTypesData)
    }, [])


    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader />
            <Stack sx={{ rowGap: 1 }}>
                <TypographyComponent fontSize={18} fontWeight={500}>Today’s Checklist Overview</TypographyComponent>
                <Grid container spacing={1} sx={{ maxWidth: '100%' }}>
                    {
                        overviewChecklists && overviewChecklists !== null && overviewChecklists.length > 0 ?
                            overviewChecklists.map((objChecklist, index) => {
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
            <Stack sx={{ rowGap: 1 }}>
                <TypographyComponent fontSize={18} fontWeight={500}>Asset Groups</TypographyComponent>
                <Grid container spacing={2}>
                    {loadingList ? (
                        <FullScreenLoader open={true} />
                    ) : arrAssetTypesData && arrAssetTypesData !== null && arrAssetTypesData?.length > 0 ?
                        arrAssetTypesData?.map((objAsset, index) => (
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }} key={`${objAsset?.id}-${index}`}>
                                <Card
                                    sx={{
                                        p: '16px',
                                        height: "100%",
                                        width: '100%',
                                        borderRadius: "8px",
                                        // border: `1px solid ${theme.palette.primary[600]}`,
                                        backgroundColor: theme.palette.common.white,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                    }}
                                    onClick={() => {
                                        navigate(`checklist-groups/${objAsset?.asset_type_id}`)
                                    }}
                                >
                                    <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>
                                        <Stack direction="row" gap={2} alignItems="center">
                                            <Box
                                                sx={{
                                                    height: 48,
                                                    width: 48,
                                                    borderRadius: "8px",
                                                    backgroundColor: objAsset?.icon_background,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: theme.palette.common.white,
                                                    fontWeight: 600,
                                                    fontSize: 18
                                                }}
                                            >
                                                {getInitials(objAsset?.title, 1)}
                                                {/* <AssetIcon stroke={objAsset?.border_color} size={18} /> */}
                                            </Box>
                                            <Box>
                                                <TypographyComponent fontSize={18} fontWeight={500}>
                                                    {objAsset?.title}
                                                </TypographyComponent>
                                                <Stack flexDirection={'row'} sx={{ gap: '12px' }}>
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

                                    </Stack>
                                    <Divider sx={{ my: 2 }} />
                                    <Box>
                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                                Today’s Overall Progress
                                            </TypographyComponent>
                                            <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: objAsset?.icon_background }}>
                                                {getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? Math.round(getPercentage(objAsset?.total_completed, objAsset?.total_checklists)) : 0}% Complete
                                            </TypographyComponent>
                                        </Stack>
                                        <Stack sx={{ width: '100%' }}>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <StyledLinearProgress variant="determinate" value={getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? getPercentage(objAsset?.total_completed, objAsset?.total_checklists) : 0} bgColor={objAsset?.icon_background} />
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                        :
                        <Stack sx={{ height: '100%', width: '100%', background: theme.palette.common.white, pb: 20, borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}` }}>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Asset Groups Found'} subTitle={''} />
                        </Stack>
                    }
                </Grid>
            </Stack>
        </Stack >
    )
}
