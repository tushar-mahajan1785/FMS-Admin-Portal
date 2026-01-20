import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Card, Divider, Grid, Stack, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import TypographyComponent from '../../../../components/custom-typography'
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants'
import EmptyContent from '../../../../components/empty_content'
import { getPercentage } from '../../../../utils'
import { StyledLinearProgress } from '../../../../components/common'
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilledAssetsList from '../filled-assets'

export default function ChecklistGroups() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { assetTypeId } = useParams()

    //States
    const [arrChecklistGroupsData, setArrChecklistGroupsData] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)
    const [openFilledAssetsPopup, setOpenFilledAssetsPopup] = useState(false)
    const [groupDetail, setGroupDetail] = useState(null)

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
                setGetCurrentAssetGroup(null)
                setArrChecklistGroupsData([])
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

    return (
        <React.Fragment>
            <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
                <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                        navigate('/checklist')
                    }}>
                        <ChevronLeftIcon size={24} />
                    </Stack>
                    <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>{getCurrentAssetGroup?.title && getCurrentAssetGroup?.title !== null ? getCurrentAssetGroup?.title : ''} Asset Groups</TypographyComponent>
                </Stack>} />

                <Stack sx={{ rowGap: '12px', width: '100%', padding: '16px', background: theme.palette.common.white, borderRadius: '8px' }}>
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
                                            backgroundColor: theme.palette.common.white,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            boxShadow: 'none',
                                            border: `1px solid ${theme.palette.grey[100]}`,
                                        }}
                                        onClick={() => {
                                            // navigate(`select-assets/${objAsset?.group_uuid}`)
                                            navigate(`view/${objAsset?.group_uuid}`)
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
                                                        {`(${objAsset?.total_completed && objAsset?.total_completed !== null ? objAsset?.total_completed?.toString().padStart(2, "0") : 0}/${objAsset?.total_checklists && objAsset?.total_checklists !== null ? objAsset?.total_checklists?.toString().padStart(2, "0") : 0})`}
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
                                            <Stack flexDirection={'row'} sx={{ gap: '12px', marginTop: 1.5, alignItems: 'center' }}>
                                                <TypographyComponent
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenFilledAssetsPopup(true)
                                                        setGroupDetail(objAsset)
                                                    }}
                                                    fontSize={14} fontWeight={400} sx={{ color: theme.palette.common.white, border: `1px solid ${theme.palette.primary[600]}`, borderRadius: 5, paddingX: 1, background: theme.palette.primary[600], cursor: 'pointer' }}>{objAsset?.total_assets && objAsset?.total_assets !== null ? objAsset?.total_assets.toString().padStart(2, "0") : 0} Assets</TypographyComponent>
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
                            <Stack sx={{ background: theme.palette.common.white, py: 5, mt: 0, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                                <TypographyComponent fontSize={16} fontWeight={400}>No Asset Groups Found</TypographyComponent>
                            </Stack>
                        }
                    </Grid>
                </Stack>
            </Stack>
            <FilledAssetsList
                open={openFilledAssetsPopup}
                details={groupDetail}
                label={`${groupDetail?.group_name} - Filled Assets Overview`}
                handleClose={() => {
                    setOpenFilledAssetsPopup(false)
                    setGroupDetail(null)
                }} />
        </React.Fragment>
    )
}
