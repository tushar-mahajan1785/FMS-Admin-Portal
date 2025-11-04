/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import EmptyContent from "../../../components/empty_content";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useBranch } from "../../../hooks/useBranch";
import toast from "react-hot-toast";
import { actionManageGroupsDetails, actionManageGroupsList, actionDeleteManageGroups, resetDeleteManageGroupsResponse, resetManageGroupsDetailsResponse, resetRosterDataResponse } from "../../../store/roster";
import { Box, Button, Card, CardContent, CircularProgress, Divider, Drawer, Grid, IconButton, Stack, Tooltip } from "@mui/material";
import TypographyComponent from "../../../components/custom-typography";
import ListComponents from "../../../components/list-components";
import { decrypt } from "../../../utils";
import EditManageGroups from "../edit";
import FormHeader from "../../../components/form-header";
import ClientsIcon from "../../../assets/icons/ClientsIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon"
import EditIcon from "../../../assets/icons/EditIcon"
import AlertPopup from "../../../components/alert-confirm"
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon"

export default function ManageGroupsDetails({ open, objData, page, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    // store
    const { manageGroupsDetails, deleteManageGroups } = useSelector(state => state.rosterStore)

    // state
    const [openViewDeleteManageGroupPopup, setOpenViewDeleteManageGroupPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [openViewEditManageGroupPopup, setOpenViewEditManageGroupPopup] = useState(false)
    const [viewManageGroupData, setViewManageGroupData] = useState(null)
    const [manageGroupDetailData, setManageGroupDetailData] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    // list columns
    const columns = [
        {
            flex: 0.3,
            field: 'name',
            headerName: 'Employee Name'
        },
        {
            flex: 0.1,
            field: 'employee_id',
            headerName: 'Employee ID'
        },
        {
            flex: 0.1,
            field: 'employee_type',
            headerName: 'Employee Type'
        },
        {
            flex: 0.1,
            field: "contact_number",
            headerName: "Contact Number",
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params.row.contact_number && params.row.contact_number !== null ?
                                <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                                    {`${params.row.contact_country_code && params.row.contact_country_code !== null ? params.row.contact_country_code : ''}${decrypt(params.row.contact_number)}`}
                                </TypographyComponent>
                                :
                                <></>
                        }

                    </Stack>
                )
            }
        }
    ];

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {
            setLoadingDetail(true)
            setViewLoadingDelete(false)
            if (objData?.uuid && objData?.uuid !== null) {
                dispatch(actionManageGroupsDetails({
                    uuid: objData?.uuid,
                    branch_uuid: branch?.currentBranch?.uuid,
                }))
            }
        }
    }, [open])

    /**
   * useEffect
   * @dependency : manageGroupsDetails
   * @type : HANDLE API RESULT
   * @description : Handle the result of manage group Details API
   */
    useEffect(() => {
        if (manageGroupsDetails && manageGroupsDetails !== null) {
            dispatch(resetManageGroupsDetailsResponse())
            if (manageGroupsDetails?.result === true) {
                setManageGroupDetailData(manageGroupsDetails?.response)
                setLoadingDetail(false)
            } else {
                setLoadingDetail(false)
                setManageGroupDetailData(null)
                switch (manageGroupsDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetManageGroupsDetailsResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: manageGroupsDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [manageGroupsDetails])

    /**
    * useEffect
    * @dependency : deleteManageGroups
    * @type : HANDLE API RESULT
    * @description : Handle the result of delete manage group API
    */
    useEffect(() => {
        if (deleteManageGroups && deleteManageGroups !== null) {
            dispatch(resetDeleteManageGroupsResponse())
            if (deleteManageGroups?.result === true) {
                setOpenViewDeleteManageGroupPopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: deleteManageGroups?.message, severity: "success" })
                handleClose()
                dispatch(actionManageGroupsList({
                    branch_uuid: branch?.currentBranch?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
            } else {
                setViewLoadingDelete(false)
                switch (deleteManageGroups?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteManageGroupsResponse())
                        toast.dismiss()
                        showSnackbar({ message: deleteManageGroups?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteManageGroups?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteManageGroups])

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: '86%' } } }}
            >
                <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<ClientsIcon stroke={theme.palette.primary[600]} size={18} />}
                        title="View Group Details"
                        subtitle="View Group Details"
                        actions={[
                            hasPermission("MANAGE_GROUPS_DELETE") && (
                                // open delete manage groups popup
                                <Tooltip title="Delete" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let details = {
                                                uuid: manageGroupDetailData.uuid,
                                                title: `Delete Manage Groups`,
                                                text: `Are you sure you want to delete this manage groups? This action cannot be undone.`
                                            }
                                            setViewManageGroupData(details)
                                            setOpenViewDeleteManageGroupPopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                            hasPermission("MANAGE_GROUPS_EDIT") && (
                                // open edit manage groups
                                <Tooltip title="Edit" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            setViewManageGroupData(manageGroupDetailData)
                                            setOpenViewEditManageGroupPopup(true)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                        ].filter(Boolean)}
                    />
                    <Divider sx={{ m: 2 }} />
                    {loadingDetail ? (
                        <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={30} />
                            <TypographyComponent fontSize={20} fontWeight={600}>Loading...</TypographyComponent>
                        </Stack>

                    ) : manageGroupDetailData && manageGroupDetailData !== null ? (
                        <Stack
                            sx={{
                                px: 2,
                                flexGrow: 1,
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '2px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#ccc',
                                    borderRadius: '2px'
                                }
                            }}
                        >

                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Box>
                                    <TypographyComponent fontSize={16} fontWeight={600}>
                                        Group Details
                                    </TypographyComponent>
                                    <Card
                                        sx={{
                                            borderRadius: '16px',
                                            padding: '12px',
                                            gap: '16px',
                                            border: `1px solid ${theme.palette.grey[300]}`,
                                            my: 2
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            {manageGroupDetailData?.assets && manageGroupDetailData.assets.length > 0 ? (
                                                manageGroupDetailData.assets.map((asset, index) => (
                                                    <React.Fragment key={asset.asset_id || index}>
                                                        <Grid container spacing={2} alignItems="center" sx={{ py: 1 }}>
                                                            <Grid
                                                                size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}
                                                                sx={{ borderRight: `1px solid ${theme.palette.grey[300]}` }}
                                                            >
                                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                                    Asset Name
                                                                </TypographyComponent>
                                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                                    {asset?.asset_name ?? 'N/A'}
                                                                </TypographyComponent>
                                                            </Grid>

                                                            <Grid
                                                                size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}
                                                                sx={{ borderRight: `1px solid ${theme.palette.grey[300]}` }}
                                                            >
                                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                                    Asset Type
                                                                </TypographyComponent>
                                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                                    {asset?.asset_type ?? 'N/A'}
                                                                </TypographyComponent>
                                                            </Grid>
                                                            <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                                    Group Name
                                                                </TypographyComponent>
                                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                                    {asset?.roster_group_name ?? 'N/A'}
                                                                </TypographyComponent>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Divider only between items */}
                                                        {index < manageGroupDetailData.assets.length - 1 && (
                                                            <Divider sx={{ my: 1.5, borderColor: theme.palette.grey[300] }} />
                                                        )}
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <TypographyComponent
                                                    fontSize={16}
                                                    fontWeight={400}
                                                    sx={{ textAlign: 'center', py: 2 }}
                                                >
                                                    No Employees Selected
                                                </TypographyComponent>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <TypographyComponent fontSize={16} fontWeight={600} sx={{ mb: 2 }}>
                                        Selected Employees
                                    </TypographyComponent>
                                    <Card sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.grey[300]}`, my: 2 }}>
                                        <CardContent>
                                            {manageGroupDetailData.employees && manageGroupDetailData.employees !== null && manageGroupDetailData.employees.length > 0 ? (
                                                <ListComponents
                                                    rows={manageGroupDetailData.employees}
                                                    columns={columns}
                                                    isCheckbox={false}
                                                    height={200}
                                                    onChange={(selectedIds) => {
                                                        console.log("Selected row IDs in UsersList:", selectedIds);
                                                    }}
                                                />
                                            ) : (
                                                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Employee Found'} subTitle={''} />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Grid>

                        </Stack>

                    ) : (
                        <Stack sx={{ height: '100%' }}>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Details Found'} subTitle={''} />
                        </Stack>
                    )}

                    <Divider sx={{ m: 2 }} />
                    <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                        <Button
                            sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                            onClick={handleClose}
                            variant='contained'
                        >
                            Close
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
            {
                openViewEditManageGroupPopup &&
                <EditManageGroups
                    open={openViewEditManageGroupPopup}
                    objData={viewManageGroupData}
                    handleClose={(data) => {
                        if (data && data !== null && data === 'save') {
                            if (objData?.uuid && objData?.uuid !== null) {
                                dispatch(actionManageGroupsDetails({
                                    uuid: objData?.uuid,
                                    branch_uuid: branch?.currentBranch?.uuid
                                }))
                                dispatch(actionManageGroupsList({
                                    branch_uuid: branch?.currentBranch?.uuid,
                                    page: page,
                                    limit: LIST_LIMIT
                                }))
                            }
                        }
                        setOpenViewEditManageGroupPopup(false)
                        setViewManageGroupData(null)
                        dispatch(resetRosterDataResponse())
                    }}
                />
            }
            {
                openViewDeleteManageGroupPopup &&
                <AlertPopup
                    open={openViewDeleteManageGroupPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={viewManageGroupData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenViewDeleteManageGroupPopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                            setViewLoadingDelete(true)
                            if (manageGroupDetailData?.uuid && manageGroupDetailData?.uuid !== null) {
                                dispatch(actionDeleteManageGroups({
                                    uuid: manageGroupDetailData?.uuid
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment>
    );
}