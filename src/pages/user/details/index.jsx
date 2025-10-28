/* eslint-disable react-hooks/exhaustive-deps */
import { Drawer, Button, Stack, Divider, Grid, IconButton, CircularProgress, useTheme, Tooltip } from "@mui/material";
import UserIcon from "../../../assets/icons/UserIcon";
import FormHeader from "../../../components/form-header";
import SectionHeader from "../../../components/section-header";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import FieldBox from "../../../components/field-box";
import { decrypt } from "../../../utils";
import PhoneCallIcon from "../../../assets/icons/PhoneCallIcon";
import MailIcon from "../../../assets/icons/MailIcon";
import { actionDeleteUsers, actionUsersDetails, actionUsersList, resetDeleteUsersResponse, resetUsersDetailsResponse } from "../../../store/users";
import TypographyComponent from "../../../components/custom-typography";
import { actionGetUserProfileDetails } from "../../../store/common";

export default function UserDetails({ open, objData, toggle, screen }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission, user } = useAuth()
    const { showSnackbar } = useSnackbar()

    //Stores
    const { usersDetails, deleteUsers } = useSelector(state => state.UsersStore)

    //States
    const [openViewDeleteUserPopup, setOpenViewDeleteUserPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [viewUserData, setViewUserData] = useState(null)
    const [userDetailData, setUserDetailData] = useState(null)
    const [loadingUserDetail, setLoadingUserDetail] = useState(false)

    /**
     * Initial Render
     * @action : actionUsersDetails
     * @description : Call user details api at Initial
     */
    useEffect(() => {
        if (open === true) {
            setViewLoadingDelete(false)
            if (objData && objData !== null) {
                setLoadingUserDetail(true)
                dispatch(actionUsersDetails({ uuid: objData?.uuid }))
            }
        }
    }, [open])

    /**
     * useEffect
     * @dependency : usersDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of user details API
     */
    useEffect(() => {
        if (usersDetails && usersDetails !== null) {
            dispatch(resetUsersDetailsResponse())
            if (usersDetails?.result === true) {
                setLoadingUserDetail(false)
                setUserDetailData(usersDetails?.response)
            } else {
                setLoadingUserDetail(false)
                setUserDetailData(null)
                switch (usersDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetUsersDetailsResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: usersDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [usersDetails])

    /**
     * useEffect
     * @dependency : deleteUsers
     * @type : HANDLE API RESULT
     * @description : Handle the result of user delete API
     */
    useEffect(() => {
        if (deleteUsers && deleteUsers !== null) {
            dispatch(resetDeleteUsersResponse())
            if (deleteUsers?.result === true) {
                setOpenViewDeleteUserPopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: deleteUsers?.message, severity: "success" })
                dispatch(actionUsersList())
                handleClose('delete')
                if (screen && screen === "my-profile") {
                    if (user && user?.employee_id && user?.employee_id !== null) {
                        dispatch(actionGetUserProfileDetails({ id: user?.employee_id }))
                    }
                }
            } else {
                setViewLoadingDelete(false)
                switch (deleteUsers?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteUsersResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteUsers?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteUsers])

    const handleClose = (data) => {
        toggle(data)
    }

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: 750 } } }}
            >

                <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<UserIcon stroke={theme.palette.primary[600]} size={18} />}
                        title="View User Details"
                        subtitle="View and manage user information"
                        actions={[
                            hasPermission("USERS_DELETE") && (userDetailData && userDetailData !== null && userDetailData?.uuid !== user?.user_uuid) && (
                                <Tooltip title="Delete" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let details = {
                                                uuid: userDetailData.uuid,
                                                title: `Delete User`,
                                                text: `Are you sure you want to delete this user? This action cannot be undone.`
                                            }
                                            setViewUserData(details)
                                            setOpenViewDeleteUserPopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            )
                        ].filter(Boolean)}
                    />
                    <Divider sx={{ m: 2 }} />
                    {loadingUserDetail ? (
                        <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={30} />
                            <TypographyComponent fontSize={20} fontWeight={600}>Loading...</TypographyComponent>
                        </Stack>

                    ) : userDetailData && userDetailData !== null ? (
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
                            <SectionHeader title="Basic User Information" progress={100} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Full Name */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Full Name" value={userDetailData?.full_name && userDetailData?.full_name !== null ? userDetailData?.full_name : ''} />
                                </Grid>
                                {/* Designation */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Designation" value={userDetailData?.designation && userDetailData?.designation !== null ? userDetailData?.designation : ''} />
                                </Grid>
                                {/* Email */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Email" value={userDetailData?.email && userDetailData?.email !== null ? decrypt(userDetailData?.email) : ''} icon={<MailIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* User Contact */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox
                                        label="User Contact"
                                        value={
                                            userDetailData?.country_code && userDetailData?.country_code !== null &&
                                                userDetailData?.mobile_number && userDetailData?.mobile_number !== null ?
                                                `${userDetailData?.country_code}${decrypt(userDetailData?.mobile_number)}` : ''
                                        }
                                        icon={<PhoneCallIcon />} />
                                </Grid>
                                {/* Gender */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Gender" value={userDetailData?.gender && userDetailData?.gender !== null ? userDetailData?.gender : ''} />
                                </Grid>
                                {/* Role */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Role" value={userDetailData?.role_name && userDetailData?.role_name !== null ? userDetailData?.role_name : ''} />
                                </Grid>
                                {/* Reporting To */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Reporting To" value={userDetailData?.reporting_to_name && userDetailData?.reporting_to_name !== null ? userDetailData?.reporting_to_name : ''} />
                                </Grid>
                                {/* Status */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Status" value={userDetailData?.status && userDetailData?.status !== null ? userDetailData?.status : ''} />
                                </Grid>
                            </Grid>
                        </Stack>)
                        :
                        <></>
                    }
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
            <AlertPopup
                open={openViewDeleteUserPopup}
                icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                color={theme.palette.error[600]}
                objData={viewUserData}
                actionButtons={[
                    <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                        setOpenViewDeleteUserPopup(false)
                    }}>
                        Cancel
                    </Button >
                    ,
                    <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                        setViewLoadingDelete(true)
                        if (userDetailData?.uuid && userDetailData?.uuid !== null) {
                            dispatch(actionDeleteUsers({
                                uuid: userDetailData?.uuid
                            }))
                        }
                    }}>
                        {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                    </Button>
                ]
                }
            />
        </React.Fragment>
    );
}
