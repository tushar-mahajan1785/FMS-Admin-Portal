import { Box, Card, Divider, Grid, Stack, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import TypographyComponent from '../../../../components/custom-typography'
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants'
import EmptyContent from '../../../../components/empty_content'
import { getColorAndBackgroundForAssetType, getPercentage } from '../../../../utils'
import { StyledLinearProgress } from '../../../../components/common'
import AssetIcon from '../../../../assets/icons/AssetIcon'
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft'
import AlertTriangleIcon from '../../../../assets/icons/AlertTriangleIcon'
import CheckboxIcon from '../../../../assets/icons/CheckboxIcon'
import ClockIcon from '../../../../assets/icons/ClockIcon'
import FileXIcon from '../../../../assets/icons/FileXIcon'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useBranch } from '../../../../hooks/useBranch'
import { useAuth } from '../../../../hooks/useAuth'
import { useSnackbar } from '../../../../hooks/useSnackbar'
import { actionTechnicianChecklistGroupList, resetTechnicianChecklistGroupListResponse } from '../../../../store/technician/checklist'
import FullScreenLoader from '../../../../components/fullscreen-loader'

export default function ChecklistGroups() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { assetTypeId } = useParams()

    const [arrChecklistGroupsData, setArrChecklistGroupsData] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)

    //Stores
    const { technicianChecklistGroupList } = useSelector(state => state.technicianChecklistStore)

    /**
     * Initial call Checklist group list API
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && assetTypeId && assetTypeId !== null) {
            setLoadingList(true)
            dispatch(actionTechnicianChecklistGroupList({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type_id: assetTypeId
            }))
        }

    }, [branch?.currentBranch?.uuid, assetTypeId])

    /**
       * useEffect
       * @dependency : technicianChecklistGroupList
       * @type : HANDLE API RESULT
       * @description : Handle the result of checklist group List API
      */
    useEffect(() => {
        if (technicianChecklistGroupList && technicianChecklistGroupList !== null) {
            dispatch(resetTechnicianChecklistGroupListResponse())
            if (technicianChecklistGroupList?.result === true) {
                setGetCurrentAssetGroup(technicianChecklistGroupList?.response)
                if (technicianChecklistGroupList?.response?.group_data && technicianChecklistGroupList?.response?.group_data !== null && technicianChecklistGroupList?.response?.group_data.length > 0) {
                    setArrChecklistGroupsData(technicianChecklistGroupList?.response?.group_data)
                } else {
                    setArrChecklistGroupsData([])
                }
                setLoadingList(false)
            } else {
                setLoadingList(false)
                // setGetCurrentAssetGroup(null)
                // setArrChecklistGroupsData([])
                switch (technicianChecklistGroupList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianChecklistGroupListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianChecklistGroupList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianChecklistGroupList])

    /**
    * Initial Render
    */
    useEffect(() => {
        let data = [
            {
                "id": 1,
                "uuid": 'sdfghjk',
                "asset_type_id": 1,
                "title": "GF-BMS UPS Room-A",
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
                "uuid": 'sdfg234hjk',
                "asset_type_id": 2,
                "title": "T2-L3 -BMS UPS Room-B",
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
                "uuid": 'sdfghjk2222',
                "asset_type_id": 3,
                "title": "GF-Mechanical UPS Room-A",
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
                "uuid": 'sdf345ghjk',
                "asset_type_id": 9,
                "title": "GF-Mechanical UPS Room-B",
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
        setArrChecklistGroupsData(updatedAssetTypesData)
        setGetCurrentAssetGroup({
            "asset_type_id": "1",
            "title": "Electric",
            "total_groups": 2,
            "total_assets": 5,
            "total_checklists": 36,
            "total_completed": 15,
            "total_overdue": 0,
            "total_abnormal": 6,
            "total_pending": 0,
            "total_not_approved": 15,
        })
    }, [])


    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate('/checklist')
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>UPS Asset List</TypographyComponent>
            </Stack>} />

            <Stack sx={{ rowGap: '12px', width: '100%', padding: '16px', background: theme.palette.common.white, borderRadius: '8px', boxShadow: "0 1px 4px rgba(0,0,0,0.08)", }}>
                <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 2 }}>
                    <Stack>
                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>Groups</TypographyComponent>
                        <TypographyComponent fontSize={18} fontWeight={600} sx={{ color: theme.palette.grey[900] }}>{getCurrentAssetGroup?.total_groups && getCurrentAssetGroup?.total_groups !== null ? getCurrentAssetGroup?.total_groups.toString().padStart(2, "0") : '0'}</TypographyComponent>
                    </Stack>
                    <Stack>
                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>Assets</TypographyComponent>
                        <TypographyComponent fontSize={18} fontWeight={600} sx={{ color: theme.palette.grey[900] }}>{getCurrentAssetGroup?.total_assets && getCurrentAssetGroup?.total_assets !== null ? getCurrentAssetGroup?.total_assets.toString().padStart(2, "0") : '0'}</TypographyComponent>
                    </Stack>
                    <Stack>
                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>Checklists</TypographyComponent>
                        <TypographyComponent fontSize={18} fontWeight={600} sx={{ color: theme.palette.grey[900] }}>{getCurrentAssetGroup?.total_checklists && getCurrentAssetGroup?.total_checklists !== null ? getCurrentAssetGroup?.total_checklists.toString().padStart(2, "0") : '0'}</TypographyComponent>
                    </Stack>
                </Stack>
                <Divider sx={{ my: 1 }} />
                {/* </Stack> */}
                <Grid container rowGap={2} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                            <CheckboxIcon size={'20'} stroke={theme.palette.success[600]} />
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ ml: 1, color: theme.palette.success[600] }}>{getCurrentAssetGroup?.total_completed && getCurrentAssetGroup?.total_completed !== null ? getCurrentAssetGroup?.total_completed : 0} Completed</TypographyComponent>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                            <ClockIcon size={'18'} stroke={theme.palette.warning[600]} />
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ ml: 1, color: theme.palette.warning[600] }}>{getCurrentAssetGroup?.total_pending && getCurrentAssetGroup?.total_pending !== null ? getCurrentAssetGroup?.total_pending : 0} Pending</TypographyComponent>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                            <AlertTriangleIcon size={'20'} stroke={theme.palette.error[600]} />
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ ml: 1, color: theme.palette.error[600] }}>{getCurrentAssetGroup?.total_overdue && getCurrentAssetGroup?.total_overdue !== null ? getCurrentAssetGroup?.total_overdue : 0} Overdue</TypographyComponent>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                            <AlertTriangleIcon size={'20'} stroke={theme.palette.warning[600]} />
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ ml: 1, color: theme.palette.warning[600] }}>{getCurrentAssetGroup?.total_abnormal && getCurrentAssetGroup?.total_abnormal !== null ? getCurrentAssetGroup?.total_abnormal : 0} Abnormal</TypographyComponent>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 4, md: 2.5, lg: 2, xl: 1.2 }}>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                            <FileXIcon size={'20'} stroke={theme.palette.grey[600]} />
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ ml: 1, color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_not_approved && getCurrentAssetGroup?.total_not_approved !== null ? getCurrentAssetGroup?.total_not_approved : 0} Not Approved</TypographyComponent>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
            <Stack sx={{ rowGap: 1 }}>
                <Grid container spacing={2}>
                    {loadingList ? (
                        <FullScreenLoader open={true} />
                    ) : arrChecklistGroupsData && arrChecklistGroupsData !== null && arrChecklistGroupsData?.length > 0 ?
                        arrChecklistGroupsData?.map((objAsset, index) => (
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
                                        navigate(`select-assets/${objAsset?.group_uuid}`)
                                    }}
                                >
                                    <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>
                                        <Stack direction="row" gap={2} alignItems="center">

                                            <Box>
                                                <TypographyComponent fontSize={18} fontWeight={500}>
                                                    {objAsset?.group_name}
                                                </TypographyComponent>

                                            </Box>
                                        </Stack>

                                    </Stack>
                                    <Stack>
                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.7 }}>
                                            <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                                Today’s Progress
                                            </TypographyComponent>
                                            <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
                                                <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.success[700] }}>
                                                    {`(${objAsset?.total_completed.toString().padStart(2, "0")}/${objAsset?.total_checklists.toString().padStart(2, "0")})`}
                                                </TypographyComponent>
                                                <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.success[700] }}>
                                                    {getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? Math.round(getPercentage(objAsset?.total_completed, objAsset?.total_checklists)) : 0}%
                                                </TypographyComponent>
                                            </Stack>


                                        </Stack>
                                        <Stack sx={{ width: '100%' }}>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <StyledLinearProgress variant="determinate" value={getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? getPercentage(objAsset?.total_completed, objAsset?.total_checklists) : 0} bgColor={theme.palette.success[700]} />
                                            </Box>
                                        </Stack>
                                        <Stack flexDirection={'row'} sx={{ gap: '12px', marginTop: 1.5 }}>
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_assets && objAsset?.total_assets !== null ? objAsset?.total_assets.toString().padStart(2, "0") : 0} Assets</TypographyComponent>
                                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                            </Stack>
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_assets && objAsset?.total_assets !== null ? objAsset?.total_assets.toString().padStart(2, "0") : 0} Hr Interval</TypographyComponent>
                                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                            </Stack>
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_checklists && objAsset?.total_checklists !== null ? objAsset?.total_checklists.toString().padStart(2, "0") : 0} Checklists</TypographyComponent>
                                        </Stack>
                                    </Stack>
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
