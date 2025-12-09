import { Box, Card, Chip, Grid, Stack, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import TypographyComponent from '../../../../components/custom-typography'
import { getPercentage, isCurrentTimeInRange } from '../../../../utils'
import { StyledLinearProgress } from '../../../../components/common'
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft'
import AlertTriangleIcon from '../../../../assets/icons/AlertTriangleIcon'
import CheckboxIcon from '../../../../assets/icons/CheckboxIcon'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { actionTechnicianGetChecklistAssetTimes, resetTechnicianChecklistGroupListResponse, resetTechnicianGetChecklistAssetTimesResponse } from '../../../../store/technician/checklist'
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants'
import { useAuth } from '../../../../hooks/useAuth'
import { useSnackbar } from '../../../../hooks/useSnackbar'
import { useBranch } from '../../../../hooks/useBranch'
import FullScreenLoader from '../../../../components/fullscreen-loader'

export const ChecklistSelectTimeSlot = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { assetId, groupUuid, assetTypeId } = useParams()

    const [loadingList, setLoadingList] = useState(false)
    const [getCurrentAssetDetailsData, setGetCurrentAssetDetailsData] = useState(null)
    const [getTimesArray, setGetTimesArray] = useState([])

    const { technicianGetChecklistAssetTimes } = useSelector(state => state.technicianChecklistStore)

    /**
    * Initial Render
    */
    useEffect(() => {

        setGetCurrentAssetDetailsData({
            "asset_type_id": "1",
            "title": "GF-BMS UPS Room-A",
            "total_groups": 2,
            "total_assets": 5,
            "interval": '3 Hrs',
            "total_checklists": 36,
            "total_completed": 15,
            "total_overdue": 0,
            "total_abnormal": 6,
            "total_pending": 0,
            "total_not_approved": 15,
        })
        let times = [
            {
                "to": "02:00",
                "from": "00:00",
                "uuid": "2b3e61e4-bf47-4a72-b44f-0594fc05384f"
            },
            {
                "to": "04:00",
                "from": "02:00",
                "uuid": "6b75553c-a30e-4adb-8d9b-fbbd9d330613"
            },
            {
                "to": "06:00",
                "from": "04:00",
                "uuid": "b714b8de-5376-4ab1-b24a-899cde56d7c4"
            },
            {
                "to": "08:00",
                "from": "06:00",
                "uuid": "c79d301a-a0a0-4548-b091-ace8492431b0"
            },
            {
                "to": "10:00",
                "from": "08:00",
                "uuid": "48c701e9-07a7-45d1-86c9-2e6c32abe201"
            },
            {
                "to": "12:00",
                "from": "10:00",
                "uuid": "55cd008f-cec4-46a5-bf8b-cd8ec7d76016"
            },
            {
                "to": "14:00",
                "from": "12:00",
                "uuid": "a189e6ad-fc25-46b6-adb8-bf1f71c1f791"
            },
            {
                "to": "16:00",
                "from": "14:00",
                "uuid": "4854a4b2-dc76-42f0-a7d2-891ad033fbd3"
            },
            {
                "to": "18:00",
                "from": "16:00",
                "uuid": "8366367f-6332-4714-95cd-dd2895e1d0ef"
            },
            {
                "to": "20:00",
                "from": "18:00",
                "uuid": "896e145f-6375-4b38-8a69-877097507148"
            },
            {
                "to": "22:00",
                "from": "20:00",
                "uuid": "98fbe09f-e9f4-4295-80b8-f56687bc0f12"
            },
            {
                "to": "00:00",
                "from": "22:00",
                "uuid": "286c2ae1-02f5-4006-8c32-c9ff7449db36"
            }
        ]
        // Helper to check if now is between timeObj.from and timeObj.to
        // const matched = times?.find(t => isCurrentTimeInRange(t.from, t.to));

        // let updated = times?.map((timeObj) => ({
        //     ...timeObj,
        //     is_selected: matched?.uuid == timeObj?.uuid ? true : false
        // }))
        setGetTimesArray(times)
    }, [])

    /**
     * Initial call Checklist group list API
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && assetId && assetId !== null) {
            setLoadingList(true)
            dispatch(actionTechnicianGetChecklistAssetTimes({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_id: assetId
            }))
        }

    }, [branch?.currentBranch?.uuid, assetId])

    /**
       * useEffect
       * @dependency : technicianGetChecklistAssetTimes
       * @type : HANDLE API RESULT
       * @description : Handle the result of checklist group List API
      */
    useEffect(() => {
        if (technicianGetChecklistAssetTimes && technicianGetChecklistAssetTimes !== null) {
            dispatch(resetTechnicianGetChecklistAssetTimesResponse())
            if (technicianGetChecklistAssetTimes?.result === true) {
                setGetCurrentAssetDetailsData(technicianGetChecklistAssetTimes?.response)
                if (technicianGetChecklistAssetTimes?.response?.times && technicianGetChecklistAssetTimes?.response?.times !== null && technicianGetChecklistAssetTimes?.response?.times.length > 0) {
                    setGetTimesArray(technicianGetChecklistAssetTimes?.response?.times)
                } else {
                    setGetTimesArray([])
                }
                setLoadingList(false)
            } else {
                setLoadingList(false)
                // setGetCurrentAssetDetailsData(null)
                // setGetTimesArray([])
                switch (technicianGetChecklistAssetTimes?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianChecklistGroupListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianGetChecklistAssetTimes?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianGetChecklistAssetTimes])


    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate(`/checklist/checklist-groups/${assetTypeId}/select-assets/${groupUuid}`)
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>Select Time Slot</TypographyComponent>
            </Stack>} />
            <Stack sx={{ rowGap: 1 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }} key={`${getCurrentAssetDetailsData?.id}`}>
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
                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            }}
                            onClick={() => {
                                navigate(`select-assets/${getCurrentAssetDetailsData?.id}`)
                            }}
                        >
                            <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>
                                <Stack flexDirection={'row'} gap={2} justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>

                                    <Box>
                                        <TypographyComponent fontSize={18} fontWeight={500}>
                                            {getCurrentAssetDetailsData?.title}
                                        </TypographyComponent>
                                    </Box>
                                    <Chip size='small' label={getCurrentAssetDetailsData?.interval} sx={{ background: theme.palette.primary[600], borderRadius: '4px', padding: '0px 1px', color: theme.palette.common.white, fontSize: '12px' }}>
                                    </Chip>
                                </Stack>

                            </Stack>
                            <Stack>
                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.7 }}>
                                    <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                        Time Slot Progress
                                    </TypographyComponent>
                                    <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.success[700] }}>
                                            {`(${getCurrentAssetDetailsData?.total_completed.toString().padStart(2, "0")}/${getCurrentAssetDetailsData?.total_checklists.toString().padStart(2, "0")})`}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.success[700] }}>
                                            {getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists) ? Math.round(getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists)) : 0}%
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ width: '100%' }}>
                                    <Box sx={{ width: '100%', mr: 1 }}>
                                        <StyledLinearProgress variant="determinate" value={getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists) ? getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists) : 0} bgColor={theme.palette.success[700]} />
                                    </Box>
                                </Stack>
                                <Stack flexDirection={'row'} sx={{ gap: '12px', marginTop: 1.5 }}>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetDetailsData?.total_groups && getCurrentAssetDetailsData?.total_groups !== null ? getCurrentAssetDetailsData?.total_groups.toString().padStart(2, "0") : 0} Completed</TypographyComponent>
                                    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                    </Stack>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetDetailsData?.total_assets && getCurrentAssetDetailsData?.total_assets !== null ? getCurrentAssetDetailsData?.total_assets.toString().padStart(2, "0") : 0} Pending</TypographyComponent>
                                    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                    </Stack>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetDetailsData?.total_checklists && getCurrentAssetDetailsData?.total_checklists !== null ? getCurrentAssetDetailsData?.total_checklists.toString().padStart(2, "0") : 0} Skipped</TypographyComponent>
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
            <Stack sx={{ rowGap: 1 }}>
                {loadingList ? (
                    <FullScreenLoader open={true} />
                ) :
                    getTimesArray && getTimesArray !== null && getTimesArray.length > 0 ?
                        getTimesArray.map((objTime, indexTime) => {
                            return (<Stack key={indexTime}
                                sx={{
                                    flexDirection: 'row', justifyContent: 'space-between',
                                    alignItems: 'center', background: theme.palette.common.white,
                                    padding: '16px',
                                    borderRadius: '8px',
                                    cursor: isCurrentTimeInRange(objTime?.from, objTime?.to) ? 'pointer' : 'default',
                                    border: isCurrentTimeInRange(objTime?.from, objTime?.to) ? `1px solid ${theme.palette.primary[600]}` : ''
                                }}
                                onClick={() => {
                                    if (isCurrentTimeInRange(objTime?.from, objTime?.to)) {
                                        navigate(`view/${objTime?.uuid}`)
                                    }

                                }}
                            >
                                <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: isCurrentTimeInRange(objTime?.from, objTime?.to) ? theme.palette.primary[500] : theme.palette.grey[500] }}>
                                    {`${objTime?.from}-${objTime?.to}`}
                                </TypographyComponent>
                                <Stack sx={{ flexDirection: 'row', gap: 0.5, alignItems: 'center' }}>
                                    <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.warning[50], border: `1px solid ${theme.palette.warning[200]}` }}>
                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.warning[600] }}>{objTime?.total_abnormal && objTime?.total_abnormal !== null ? objTime?.total_abnormal : 0} Abnormal</TypographyComponent>
                                    </Stack>
                                    <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', border: `1px solid ${theme.palette.success[600]}` }}>
                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.success[600] }}> Approved</TypographyComponent>
                                    </Stack>
                                    {/* <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}` }}>
                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>Not Approved</TypographyComponent>
                                    </Stack> */}
                                    <CheckboxIcon size={'24'} stroke={theme.palette.success[600]} />
                                    <AlertTriangleIcon size={'24'} stroke={theme.palette.error[600]} />
                                </Stack>

                            </Stack>)
                        })
                        :
                        <></>
                }
            </Stack>

        </Stack >
    )
}
