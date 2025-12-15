/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, Box, useTheme, Paper, Divider, Avatar, IconButton, CircularProgress, Button } from "@mui/material";
import TypographyComponent from "../../../components/custom-typography";
import CheckboxIcon from "../../../assets/icons/CheckboxIcon";
import SquareCrossIcon from "../../../assets/icons/SquareCrossIcon";
import MailIcon from "../../../assets/icons/MailIcon";
import PhoneCallIcon from "../../../assets/icons/PhoneCallIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import ChangePasswordIcon from "../../../assets/icons/ChangePasswordIcon";
import LogoutIcon from '@mui/icons-material/Logout';
import { actionTechnicianEmployeeLogout, actionTechnicianEmployeeProfile, resetTechnicianEmployeeLogoutResponse, resetTechnicianEmployeeProfileResponse } from "../../../store/technician/profile";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { decrypt } from "../../../utils";
import CloseIcon from "../../../assets/icons/CloseIcon";
import moment from "moment";
import MapPinIcon from "../../../assets/icons/MapPinIcon"
import AlertPopup from "../../../components/alert-confirm";
import ChangePassword from "../change-password"

export default function TechnicianProfile() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, user } = useAuth()
    const { showSnackbar } = useSnackbar()

    // store
    const { technicianEmployeeProfile, technicianEmployeeLogout } = useSelector(state => state.technicianProfileStore)

    const [profileDetails, setProfileDetails] = useState(null)
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [openChangePasswordPopup, setOpenChangePasswordPopup] = useState(false)
    // const [loading, setLoading] = useState(false);

    /**
       * Initial Render
       */
    useEffect(() => {
        if (user?.employee_id && user?.employee_id !== null) {
            dispatch(actionTechnicianEmployeeProfile({ employee_id: user?.employee_id }))
        }
    }, [user?.employee_id])

    /**
          * useEffect
          * @dependency : technicianEmployeeProfile
          * @type : HANDLE API RESULT
          * @description : Handle the result of technician Employee Profile API
         */
    useEffect(() => {
        if (technicianEmployeeProfile && technicianEmployeeProfile !== null) {
            dispatch(resetTechnicianEmployeeProfileResponse())
            if (technicianEmployeeProfile?.result === true) {
                setProfileDetails(technicianEmployeeProfile?.response)
            } else {
                setProfileDetails(null)
                switch (technicianEmployeeProfile?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianEmployeeProfileResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianEmployeeProfile?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianEmployeeProfile])

    /**
     * useEffect
     * @dependency : technicianEmployeeLogout
     * @type : HANDLE API RESULT
     * @description : Handle the result of logout API
     */
    useEffect(() => {
        if (technicianEmployeeLogout && technicianEmployeeLogout !== null) {
            dispatch(resetTechnicianEmployeeLogoutResponse())
            if (technicianEmployeeLogout?.result === true) {
                setLoadingLogout(false)
                logout('logout')
            } else {
                setLoadingLogout(false)
                switch (technicianEmployeeLogout?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianEmployeeLogoutResponse())
                        showSnackbar({ message: technicianEmployeeLogout?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianEmployeeLogout?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianEmployeeLogout])

    const handleLogout = () => {
        setLoadingLogout(true)
        dispatch(actionTechnicianEmployeeLogout())
    };

    return (
        <React.Fragment>
            <Stack sx={{ pb: 10 }}>
                <Box
                    sx={{
                        height: 320,
                        background: "linear-gradient(180deg, #6941C6 0%, #6E30FF 100%)",
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        color: "white",
                        mx: -10,
                        mt: -2,
                    }}
                >
                    <Stack alignItems="center" mt={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                padding: 2,
                                position: 'relative',
                                width: '100%'
                            }}
                        >
                            {/* The Circular Avatar */}
                            <Avatar
                                src={profileDetails && profileDetails?.image_url || ''}
                                alt={profileDetails?.name || 'User'}
                                sx={{
                                    width: 110,
                                    height: 110,
                                    bgcolor: theme.palette.primary[600],
                                    border: `4px solid ${theme.palette.background.paper}`,
                                    boxShadow: theme.shadows[3]
                                }}
                            >
                                {/* Fallback initials if no image is present */}
                                {profileDetails?.name ? profileDetails?.name.charAt(0) : ''}
                            </Avatar>
                            {
                                profileDetails?.image_url && profileDetails?.image_url !== null ?
                                    <>
                                        {/* The Reset/Remove Icon Overlay */}
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 20,
                                                left: '49.7%',
                                                transform: 'translateX(30px)',
                                                backgroundColor: theme.palette.common.white,
                                                border: `1px solid ${theme.palette.grey[300]}`,
                                                padding: '6px',
                                                '&:hover': { backgroundColor: theme.palette.grey[100] }
                                            }}
                                            onClick={() => {
                                                // setOpenResetProfilePopup(true)
                                            }}
                                        >
                                            {/* {loading ? <CircularProgress size={18} /> : <CloseIcon size={14} />} */}
                                        </IconButton>
                                    </>
                                    :
                                    <></>
                            }
                        </Box>
                        <TypographyComponent fontSize={24} fontWeight={600} sx={{ mt: 2, }}>
                            {profileDetails?.name && profileDetails?.name !== null ? profileDetails?.name : '-'}
                        </TypographyComponent>
                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.8 }}>{profileDetails?.role && profileDetails?.role !== null ? profileDetails?.role : '-'}</TypographyComponent>
                        <Box
                            sx={{
                                mt: 1,
                                px: 2,
                                py: "4px",
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.common.white}`,
                                background: "rgba(255,255,255,0.25)",
                            }}
                        >
                            <TypographyComponent fontSize={16} fontWeight={400} >EMP ID: {profileDetails?.employee_id && profileDetails?.employee_id !== null ? profileDetails?.employee_id : '-'}</TypographyComponent>
                        </Box>
                    </Stack>
                </Box>

                {/* ---------------- CHECKLIST OVERVIEW ---------------- */}
                <Box sx={{ mt: 2 }}>
                    <TypographyComponent fontSize={20} fontWeight={600} sx={{ mb: 1 }}>
                        Checklist Overview
                    </TypographyComponent>

                    <Stack direction="row" spacing={2}>
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                borderRadius: 3,
                                p: '16px',
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1,
                                bgcolor: theme.palette.common.white,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: theme.palette.success[50],
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CheckboxIcon size={'24'} stroke={theme.palette.success[600]} />
                            </Box>

                            <Stack>
                                <TypographyComponent fontSize={26} fontWeight={500} sx={{ color: theme.palette.common.black }}>
                                    {profileDetails?.overall_count?.completed && profileDetails?.overall_count?.completed !== null ? profileDetails?.overall_count?.completed : '00'}
                                </TypographyComponent>
                                <TypographyComponent fontSize={16} sx={{ color: theme.palette.grey[600] }}>Completed</TypographyComponent>
                            </Stack>
                        </Paper>
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                borderRadius: 3,
                                p: '16px',
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1,
                                bgcolor: theme.palette.common.white,
                            }}
                        >
                            {/* Icon Box */}
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: theme.palette.error[50],
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <SquareCrossIcon size={'26'} stroke={theme.palette.error[600]} />
                            </Box>

                            <Stack>
                                <TypographyComponent fontSize={26} fontWeight={500} sx={{ color: theme.palette.common.black }}>
                                    {profileDetails?.overall_count?.overdue && profileDetails?.overall_count?.overdue !== null ? profileDetails?.overall_count?.overdue : '00'}
                                </TypographyComponent>
                                <TypographyComponent fontSize={16} sx={{ color: theme.palette.grey[600] }}>Missed</TypographyComponent>
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <TypographyComponent fontSize={20} fontWeight={600} sx={{ mb: 1 }}>
                        Contact Information
                    </TypographyComponent>

                    <Stack sx={{ p: 2, background: theme.palette.common.white, borderRadius: '8px', rowGap: 2 }}>
                        {/* Email */}
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <MailIcon stroke={theme.palette.success[800]} />
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>Email</TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={400}>
                                    {profileDetails?.email && profileDetails?.email !== null ? decrypt(profileDetails?.email) : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Stack>

                        {/* Phone */}
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <PhoneCallIcon stroke1={theme.palette.success[400]} stroke2={theme.palette.success[400]} />
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>Phone</TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={400}>{profileDetails?.contact && profileDetails?.contact !== null ? `${profileDetails?.contact_country_code} ${decrypt(profileDetails?.contact)}` : '--'}</TypographyComponent>
                            </Stack>
                        </Stack>

                        {/* Address */}
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <MapPinIcon stroke={theme.palette.primary[600]} size={20} />
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>
                                    Address
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={400}>
                                    {profileDetails?.address && profileDetails?.address !== null ? profileDetails?.address : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Stack>

                        {/* Onboarding Date */}
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <CalendarIcon stroke={theme.palette.warning[800]} />
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>
                                    Onboarding Date
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={400}>{profileDetails?.created_at && profileDetails?.created_at !== null ? moment(profileDetails?.created_at).format("MMM DD, YYYY") : '--'}</TypographyComponent>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <TypographyComponent fontSize={20} fontWeight={600} sx={{ mb: 1 }}>Settings</TypographyComponent>
                    <Stack elevation={0} sx={{ p: '16px', background: theme.palette.common.white, borderRadius: '8px' }}>
                        {/* Change Password */}
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <ChangePasswordIcon size={16} stroke={theme.palette.grey[800]} />
                            <TypographyComponent fontSize={20} fontWeight={400} onClick={() => { setOpenChangePasswordPopup(true) }} >Change Password</TypographyComponent>
                        </Stack>
                        <Divider sx={{ my: 0.5 }} />
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mt: 2, color: theme.palette.error[700], cursor: "pointer" }}
                        >
                            <LogoutIcon sx={{ color: theme.palette.error[700] }} fontSize="small" />
                            <TypographyComponent fontSize={20} fontWeight={400} onClick={() => { setOpenLogoutConfirm(true); }}>Logout</TypographyComponent>
                        </Stack>
                    </Stack>
                </Box>
            </Stack >
            <AlertPopup
                open={openLogoutConfirm}
                icon={<LogoutIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                color={theme.palette.error[600]}
                objData={{
                    id: 1,
                    status: 'A',
                    title: `Logout Confirmation`,
                    text: `Are you sure you want to Logout? This action cannot be undone.`
                }}
                actionButtons={[
                    <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                        setOpenLogoutConfirm(false)
                    }}>
                        Cancel
                    </Button >
                    ,
                    <Button key="logout" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={loadingLogout} onClick={() => {
                        handleLogout();
                    }}>
                        {/* Logout */}
                        {loadingLogout ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Logout'}
                    </Button>
                ]
                }
            />
            <ChangePassword
                open={openChangePasswordPopup}
                handleClose={() => setOpenChangePasswordPopup(false)}
            />
        </React.Fragment>

    );
}
