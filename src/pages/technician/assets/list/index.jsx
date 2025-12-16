import { useEffect, useState } from "react";
import { Avatar, Box, Divider, Stack, useTheme } from "@mui/material";
import TypographyComponent from "../../../../components/custom-typography";
import BottomNav from "../../../../components/bottom-navbar";
import { TechnicianNavbarHeader } from "../../../../components/technician/navbar-header";
import { getInitials, getPMActivityLabel } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionTechnicianAssetList, actionTechnicianAssetTypeList, resetTechnicianAssetListResponse, resetTechnicianAssetTypeListResponse } from "../../../../store/technician/assets";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../../constants";
import { useBranch } from "../../../../hooks/useBranch";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { useAuth } from "../../../../hooks/useAuth";
import FullScreenLoader from "../../../../components/fullscreen-loader";

export default function TechnicianAssetList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const { logout } = useAuth()


    const [loadingList, setLoadingList] = useState(false)
    const [getAssetTypesList, setGetAssetTypesList] = useState([])
    const [getAssetList, setGetAssetList] = useState([])
    const [value, setValue] = useState(2);
    const [selectedAssetTypeValue, setSelectedAssetTypeValue] = useState('');

    // store
    const { technicianAssetList, technicianAssetTypeList } = useSelector(state => state.technicianAssetStore)

    /**
     * Initial Render Call Asset Type list
     */
    useEffect(() => {
        if (branch?.currentBranch?.client_uuid && branch?.currentBranch?.client_uuid !== null) {
            dispatch(actionTechnicianAssetTypeList({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
        }

    }, [branch?.currentBranch?.client_uuid])

    /**
     * Call Asset List API on select of Asset Type
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            setLoadingList(true)
            dispatch(actionTechnicianAssetList({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type: selectedAssetTypeValue && selectedAssetTypeValue !== null ? selectedAssetTypeValue : ''
            }))
        }
    }, [branch?.currentBranch?.uuid, selectedAssetTypeValue])

    /**
     * useEffect
     * @dependency : technicianAssetTypeList
     * @type : HANDLE API RESULT
     * @description : Handle the result of technician asset type List API
     */
    useEffect(() => {
        if (technicianAssetTypeList && technicianAssetTypeList !== null) {
            dispatch(resetTechnicianAssetTypeListResponse())
            if (technicianAssetTypeList?.result === true) {
                setGetAssetTypesList(technicianAssetTypeList?.response)
            } else {
                setGetAssetTypesList[[]]
                switch (technicianAssetTypeList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianAssetTypeListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianAssetTypeList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianAssetTypeList])
    /**
     * useEffect
     * @dependency : technicianAssetList
     * @type : HANDLE API RESULT
     * @description : Handle the result of technician asset List API
     */
    useEffect(() => {
        if (technicianAssetList && technicianAssetList !== null) {
            dispatch(resetTechnicianAssetListResponse())
            if (technicianAssetList?.result === true) {
                setLoadingList(false)
                setGetAssetList(technicianAssetList?.response)
            } else {
                setLoadingList(false)
                setGetAssetList([])
                switch (technicianAssetList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianAssetListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianAssetList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianAssetList])

    //Color palatte
    const colorPalette = [
        theme.palette.primary[600], // violet
        theme.palette.info[600], // blue
        theme.palette.error[600], // red
        theme.palette.success[600], // green
        theme.palette.warning[600], // amber
    ];

    //Get Color by index
    const getColorByIndex = (index = 0) => {
        return colorPalette[index % colorPalette.length];
    };

    return (
        <Stack rowGap={1.2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader />
            <Stack sx={{ flexDirection: 'row', gap: 1.2, borderRadius: '8px', width: '100%', overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                <Stack
                    onClick={() => setSelectedAssetTypeValue('')}
                    sx={{
                        flexDirection: 'row', alignItems: 'center',
                        background: selectedAssetTypeValue === '' ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px',
                        borderRadius: '8px', justifyContent: 'center', cursor: 'pointer'
                    }}
                >
                    <TypographyComponent fontSize={16} fontWeight={500} sx={{ textAlign: 'center', alignItems: 'center', textWrap: 'nowrap', color: selectedAssetTypeValue === '' ? theme.palette.common.white : theme.palette.common.black }}>All Assets</TypographyComponent>
                </Stack>
                {
                    getAssetTypesList && getAssetTypesList !== null && getAssetTypesList.length > 0 ?
                        getAssetTypesList.map((objData, index) => {
                            const color = getColorByIndex(index)
                            return (<Stack
                                key={index}
                                sx={{
                                    flexDirection: 'row', alignItems: 'center', gap: 0.8,
                                    background: selectedAssetTypeValue === objData?.name ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px', textWrap: 'nowrap',
                                    borderRadius: '8px', justifyContent: 'center', cursor: 'pointer',
                                    border: `1px solid ${theme.palette.grey[100]}`,
                                }}
                                onClick={() => setSelectedAssetTypeValue(objData?.name)}
                            >
                                <Box
                                    sx={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: "15px",
                                        border: selectedAssetTypeValue === objData?.name ? `1.2px solid ${color}` : `1px solid ${color}`,
                                        color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: color }}>{getInitials(objData?.name, 1)}</TypographyComponent>
                                </Box>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ textAlign: 'center', color: selectedAssetTypeValue === objData?.name ? theme.palette.common.white : theme.palette.common.black }}>{objData?.name}</TypographyComponent>
                            </Stack>)
                        })
                        :
                        <></>
                }
            </Stack>
            <Stack gap={1.3} sx={{ width: '100%' }}>
                {loadingList ? (
                    <FullScreenLoader open={true} />
                ) :
                    getAssetList && getAssetList !== null && getAssetList.length > 0 ?
                        getAssetList?.map((asset, index) => {
                            return (<Stack
                                sx={{
                                    borderRadius: '8px',
                                    p: '16px',
                                    width: '100%',
                                    border: `1px solid ${theme.palette.grey[100]}`,
                                    backgroundColor: theme.palette.common.white,
                                }}
                                onClick={() => {
                                    navigate(`view/${asset?.uuid}`)
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
                        <Stack sx={{ background: theme.palette.common.white, py: 15, mt: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                            <TypographyComponent fontSize={16} fontWeight={400}>No Assets Found</TypographyComponent>
                        </Stack>
                }
            </Stack>
            <BottomNav value={value} onChange={setValue} />
        </Stack>
    )
}