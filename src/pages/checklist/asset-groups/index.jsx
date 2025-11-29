import { Box, Button, Card, Divider, Grid, Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import TypographyComponent from "../../../components/custom-typography";
import CheckboxIcon from "../../../assets/icons/CheckboxIcon";
import AlertTriangleIcon from "../../../assets/icons/AlertTriangleIcon";
import EyeIcon from "../../../assets/icons/EyeIcon";
import { StyledLinearProgress } from "../../../components/common";
import { getPercentage } from "../../../utils";
import ClockIcon from "../../../assets/icons/ClockIcon";
import FileXIcon from "../../../assets/icons/FileXIcon";
import { useNavigate, useParams } from "react-router-dom";
import ChevronLeftIcon from "../../../assets/icons/ChevronLeft";
import AddIcon from '@mui/icons-material/Add';
import AddChecklistAssetGroup from "./add";
import { useDispatch, useSelector } from "react-redux";
import { actionChecklistGroupList, resetChecklistGroupListResponse } from "../../../store/checklist";
import { useBranch } from "../../../hooks/useBranch";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import FullScreenLoader from "../../../components/fullscreen-loader";
import EmptyContent from "../../../components/empty_content";

export default function ChecklistAssetGroups() {
    const theme = useTheme()
    const navigate = useNavigate()
    const { assetId } = useParams()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    //Stores
    const { checklistGroupList } = useSelector(state => state.checklistStore)

    //Default Checklists Counts Array
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)
    const [arrAssetGroupsData, setArrAssetGroupsData] = useState([])
    const [openAddChecklistAssetGroup, setOpenAddChecklistAssetGroup] = useState(false)
    const [loadingList, setLoadingList] = useState(false)

    /**
     * Initial call Checklist group list API
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && assetId && assetId !== null) {
            setLoadingList(true)
            dispatch(actionChecklistGroupList({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type_id: assetId
            }))
        }

    }, [branch?.currentBranch?.uuid, assetId])

    /**
       * useEffect
       * @dependency : checklistGroupList
       * @type : HANDLE API RESULT
       * @description : Handle the result of checklist group List API
      */
    useEffect(() => {
        if (checklistGroupList && checklistGroupList !== null) {
            dispatch(resetChecklistGroupListResponse())
            if (checklistGroupList?.result === true) {
                setGetCurrentAssetGroup(checklistGroupList?.response)
                if (checklistGroupList?.response?.group_data && checklistGroupList?.response?.group_data !== null && checklistGroupList?.response?.group_data.length > 0) {
                    setArrAssetGroupsData(checklistGroupList?.response?.group_data)
                } else {
                    setArrAssetGroupsData([])
                }

                setLoadingList(false)
            } else {
                setLoadingList(false)
                // let data = [
                //     {
                //         "id": 1,
                //         "asset_type_id": "1",
                //         "title": "DG Sets",
                //         "total_groups": "2",
                //         "total_assets": "15",
                //         "total_checklists": "36",
                //         "total_completed": "12",
                //         "total_overdue": "2",
                //         "total_abnormal": "4",
                //         "total_pending": "24",
                //         "total_not_approved": "2"
                //     },
                //     {
                //         "id": 2,
                //         "asset_type_id": "2",
                //         "title": "PAC Units",
                //         "total_groups": "5",
                //         "total_assets": "10",
                //         "total_checklists": "20",
                //         "total_completed": "12",
                //         "total_overdue": "2",
                //         "total_abnormal": "4",
                //         "total_pending": "8",
                //         "total_not_approved": "2",
                //     },
                //     {
                //         "id": 3,
                //         "asset_type_id": "3",
                //         "title": "HVAC Systems",
                //         "total_groups": "2",
                //         "total_assets": "15",
                //         "total_checklists": "36",
                //         "total_completed": "12",
                //         "total_overdue": "2",
                //         "total_abnormal": "4",
                //         "total_pending": "24",
                //         "total_not_approved": "2"
                //     },
                //     {
                //         "id": 4,
                //         "asset_type_id": "4",
                //         "title": "Chillers",
                //         "total_groups": "3",
                //         "total_assets": "12",
                //         "total_checklists": "10",
                //         "total_completed": "8",
                //         "total_overdue": "2",
                //         "total_abnormal": "4",
                //         "total_pending": "1",
                //         "total_not_approved": "1"
                //     },
                //     {
                //         "id": 5,
                //         "asset_type_id": "5",
                //         "title": "RMU",
                //         "total_groups": "3",
                //         "total_assets": "12",
                //         "total_checklists": "9",
                //         "total_completed": "5",
                //         "total_overdue": "2",
                //         "total_abnormal": "4",
                //         "total_pending": "4",
                //         "total_not_approved": "2"
                //     },
                //     {
                //         "id": 6,
                //         "asset_type_id": "6",
                //         "total_groups": "3",
                //         "title": "CRAH",
                //         "total_assets": "12",
                //         "total_checklists": "9",
                //         "total_completed": "6",
                //         "total_overdue": "2",
                //         "total_abnormal": "3",
                //         "total_pending": "24",
                //         "total_not_approved": "2"
                //     },
                //     {
                //         "id": 7,
                //         "asset_type_id": "7",
                //         "title": "PSU",
                //         "total_groups": "2",
                //         "total_assets": "15",
                //         "total_checklists": "36",
                //         "total_completed": "12",
                //         "total_overdue": "2",
                //         "total_abnormal": "4",
                //         "total_pending": "24",
                //         "total_not_approved": "2"
                //     }
                // ];

                // setArrAssetGroupsData(data)
                setGetCurrentAssetGroup(null)
                setArrAssetGroupsData([])
                switch (checklistGroupList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetChecklistGroupListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: checklistGroupList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupList])


    return (<>
        <React.Fragment>
            <Stack sx={{ flexDirection: { xs: 'row', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 3 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate('/checklist')
                }}>
                    <ChevronLeftIcon size={26} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={18} fontWeight={400}>Back to Asset Types</TypographyComponent>
            </Stack>
            <Stack sx={{
                p: '12px',
                height: "100%",
                width: '100%',
                borderRadius: "16px",
                border: `1px solid ${theme.palette.primary[600]}`,
                backgroundColor: theme.palette.common.white,
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: "space-between",
                alignItems: { xs: 'flex-start', sm: 'center' },
                rowGap: 2,
            }}>
                <Stack sx={{ rowGap: 1, width: '100%', }}>
                    <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} gap={1} alignItems={{ sm: 'flex-start', md: 'center' }}>
                        <TypographyComponent fontSize={16} fontWeight={500}>
                            {`${getCurrentAssetGroup?.title && getCurrentAssetGroup?.title !== null ? getCurrentAssetGroup?.title : ''} Checklist & Reading Report`}
                        </TypographyComponent>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_groups} Groups</TypographyComponent>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_assets} Assets</TypographyComponent>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_checklists} Checklists</TypographyComponent>
                            {/* </Stack> */}
                        </Stack>
                    </Stack>
                    <Grid container rowGap={1} sx={{ width: '100%' }}>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <CheckboxIcon size={'20'} stroke={theme.palette.success[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.success[600] }}>{getCurrentAssetGroup?.total_completed} Completed</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <AlertTriangleIcon size={'20'} stroke={theme.palette.error[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.error[600] }}>{getCurrentAssetGroup?.total_overdue} Overdue</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <AlertTriangleIcon size={'20'} stroke={theme.palette.warning[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.warning[600] }}>{getCurrentAssetGroup?.total_abnormal} Abnormal</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <ClockIcon size={'18'} stroke={theme.palette.warning[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.warning[600] }}>{getCurrentAssetGroup?.total_pending} Pending</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2.5, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <FileXIcon size={'20'} stroke={theme.palette.grey[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_not_approved} Not Approved</TypographyComponent>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
                <Stack>
                    <Button
                        size={'small'}
                        sx={{ textTransform: "capitalize", textWrap: 'nowrap', px: 2, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            setOpenAddChecklistAssetGroup(true)
                        }}
                        variant='contained'
                    >
                        <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} />
                        Create New Group
                    </Button>
                </Stack>

            </Stack>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
                <TypographyComponent fontSize={16} fontWeight={600}>Assets Groups</TypographyComponent>
            </Stack>
            <Grid container spacing={3}>
                {loadingList ? (
                    <FullScreenLoader open={true} />
                ) : arrAssetGroupsData && arrAssetGroupsData !== null && arrAssetGroupsData?.length > 0 ?
                    arrAssetGroupsData?.map((objAsset) => (
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }} key={objAsset?.id}>
                            <Card
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    width: '100%',
                                    borderRadius: "16px",
                                    border: `1px solid ${theme.palette.primary[600]}`,
                                    backgroundColor: theme.palette.common.white,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>
                                    <Stack direction="row" gap={2} alignItems="center">
                                        <Box>
                                            <TypographyComponent fontSize={16} fontWeight={500}>
                                                {objAsset?.group_name}
                                            </TypographyComponent>
                                            <Stack flexDirection={'row'} sx={{ gap: '16px' }}>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_assets} Assets</TypographyComponent>
                                                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                </Stack>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_checklists} Checklists</TypographyComponent>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                    <Box>
                                        <Stack sx={{ cursor: 'pointer', flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.success[50], border: `1px solid ${theme.palette.success[200]}` }}
                                            onClick={() => {
                                                navigate(`view/${objAsset?.group_uuid}`)
                                            }}>
                                            <EyeIcon size={'20'} stroke={theme.palette.success[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.success[600] }}> View</TypographyComponent>
                                        </Stack>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                            Today's Progress
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.primary[600] }}>
                                            {getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? Math.round(getPercentage(objAsset?.total_completed, objAsset?.total_checklists)) : 0}% Complete
                                        </TypographyComponent>
                                    </Stack>
                                    <Stack sx={{ width: '100%' }}>
                                        <Box sx={{ width: '100%', mr: 1 }}>
                                            <StyledLinearProgress variant="determinate" value={getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? getPercentage(objAsset?.total_completed, objAsset?.total_checklists) : 0} bgColor={theme.palette.primary[600]} />
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
                    ))
                    :
                    <Stack sx={{ height: '100%', width: '100%', background: theme.palette.common.white, pb: 20, borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}` }}>
                        <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Asset Groups Found'} subTitle={''} />
                    </Stack>
                }
            </Grid>
            <AddChecklistAssetGroup
                open={openAddChecklistAssetGroup}
                handleClose={(data) => {
                    setOpenAddChecklistAssetGroup(false)
                    if (data == 'save') {
                        setLoadingList(true)
                        dispatch(actionChecklistGroupList({
                            branch_uuid: branch?.currentBranch?.uuid,
                            asset_type_id: assetId
                        }))
                    }
                }}
            />
        </React.Fragment>
    </>)

}