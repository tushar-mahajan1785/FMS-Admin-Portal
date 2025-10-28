import { useTheme } from '@emotion/react';
import { Avatar, Grid, Stack, IconButton, Box, CircularProgress, Button, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FieldBox from '../../components/field-box';
import { concatMultipleStrings, decrypt, getFormData } from '../../utils';
import MailIcon from '../../assets/icons/MailIcon';
import PhoneCallIcon from '../../assets/icons/PhoneCallIcon';
import { useDispatch, useSelector } from 'react-redux';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { actionGetUserProfileDetails, actionUserProfileUpload, actionUserProfileUploadReset, resetUserProfileUploadResetResponse, resetUserProfileUploadResponse } from '../../store/common';
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../constants';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useAuth } from '../../hooks/useAuth';
import TypographyComponent from '../../components/custom-typography';
import EmptyContent from '../../components/empty_content';
import CloseIcon from '../../assets/icons/CloseIcon';
import AlertPopup from '../../components/alert-confirm';
import AlertCircleIcon from '../../assets/icons/AlertCircleIcon';
import IdBadgeIcon from '../../assets/icons/IdBadgeIcon';
import SectionHeader from '../../components/section-header';
import AddressIcon from '../../assets/icons/AddressIcon';

export const UserProfileDetails = () => {
    const theme = useTheme()
    const dispatch = useDispatch();
    const { user, logout, setUser } = useAuth();
    const { showSnackbar } = useSnackbar()

    //State
    const [loading, setLoading] = useState(false);
    const [userDetailData, setUserDetailData] = useState(null);
    const [openResetProfilePopup, setOpenResetProfilePopup] = useState(false);
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)

    //Stores
    const { getUserProfileDetails, userProfileUpload, userProfileUploadReset } = useSelector(state => state.CommonStore)

    // Handler function for file selection and preview
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // TODO: Add your API call here to upload 'file' to the backend
                let objData = {
                    user_uuid: user?.user_uuid
                }
                var images = []
                if (file !== undefined && file !== null && file !== '') {
                    images.push({
                        title: 'file',
                        data: file
                    })
                }

                var objFormData = getFormData(objData, images)
                setLoading(true)
                dispatch(actionUserProfileUpload(objFormData))
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * useEffect
     * @description : Handle the result of user profile details API and set initial image
     */
    useEffect(() => {
        // Mocking the data flow from the API/Redux state
        if (getUserProfileDetails && getUserProfileDetails?.result === true) {
            const data = getUserProfileDetails.response;
            setUserDetailData(data);
        } else {
            setUserDetailData(null)
        }
    }, [getUserProfileDetails])

    /**
      * useEffect
      * @dependency : userProfileUpload
      * @type : HANDLE API RESULT
      * @description : Handle the result of users profile upload API
      */
    useEffect(() => {
        if (userProfileUpload && userProfileUpload !== null) {
            dispatch(resetUserProfileUploadResponse())
            if (userProfileUpload?.result === true) {
                setLoading(false)
                showSnackbar({ message: userProfileUpload?.message, severity: "success" })
                dispatch(actionGetUserProfileDetails({ id: user?.employee_id }))
                if (userProfileUpload?.response?.image_url && userProfileUpload?.response?.image_url !== null) {
                    let userData = Object.assign({}, user)
                    userData.image_url = userProfileUpload?.response?.image_url
                    setUser(userData)
                }
            } else {
                setLoading(false)
                switch (userProfileUpload?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetUserProfileUploadResponse())
                        showSnackbar({ message: userProfileUpload?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: userProfileUpload?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [userProfileUpload])

    /**
 * useEffect
 * @dependency : userProfileUploadReset
 * @type : HANDLE API RESULT
 * @description : Handle the result of delete Clients API
 */
    useEffect(() => {
        if (userProfileUploadReset && userProfileUploadReset !== null) {
            dispatch(resetUserProfileUploadResetResponse())
            if (userProfileUploadReset?.result === true) {
                setOpenResetProfilePopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: userProfileUploadReset?.message, severity: "success" })

                dispatch(actionGetUserProfileDetails({ id: user?.employee_id }))
                let userData = Object.assign({}, user)
                userData.image_url = null
                setUser(userData)

            } else {
                setViewLoadingDelete(false)
                switch (userProfileUploadReset?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetUserProfileUploadResetResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: userProfileUploadReset?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [userProfileUploadReset])

    // Fallback/Loading state
    if (!userDetailData) {
        return <></>;
    }

    return (
        <React.Fragment>
            <Stack
                sx={{
                    px: 1,
                    flexGrow: 1,
                    overflowY: 'auto',
                    backgroundColor: theme.palette.primary[25],
                    height: { xs: '100%', sm: '70vh' },
                    '&::-webkit-scrollbar': { width: '2px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '2px' }
                }}
            >
                {
                    userDetailData && userDetailData !== null ?
                        <Grid container spacing={{ xs: '0px', sm: '2px', md: '0px' }} sx={{ borderRadius: '16px', padding: { xs: '0px', sm: '6x', backgroundColor: theme.palette.primary[25] }, marginBottom: 2 }}>
                            {/* ------------------------------------ */}
                            {/* 🖼️ PROFILE PICTURE UPLOAD & DISPLAY SECTION 🖼️ */}
                            {/* ------------------------------------ */}
                            <Stack sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                                width: '100%',
                                marginBottom: 4
                            }}>
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
                                        src={user && user?.image_url || ''}
                                        alt={userDetailData?.full_name || 'User'}
                                        sx={{
                                            width: 110,
                                            height: 110,
                                            bgcolor: theme.palette.primary[600],
                                            border: `4px solid ${theme.palette.background.paper}`,
                                            boxShadow: theme.shadows[3]
                                        }}
                                    >
                                        {/* Fallback initials if no image is present */}
                                        {userDetailData?.full_name ? userDetailData.full_name.charAt(0) : ''}
                                    </Avatar>

                                    {
                                        userDetailData?.image_url && userDetailData?.image_url !== null ?
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
                                                        setOpenResetProfilePopup(true)
                                                    }}
                                                >
                                                    {/* <input disabled={loading ? true : false} hidden accept="image/*" type="file" onChange={handleImageUpload} /> */}
                                                    {loading ? <CircularProgress size={18} /> : <CloseIcon size={14} />}
                                                </IconButton>
                                            </>
                                            :
                                            <></>
                                    }

                                </Box>
                                <Stack sx={{ alignItems: 'center', width: '100%' }}>
                                    <Button
                                        color="primary"
                                        aria-label="upload picture"
                                        component="label"
                                        size='small'
                                        sx={{ background: theme.palette.primary[600], fontWeight: 600, fontSize: '14px', textTransform: "capitalize" }}
                                        variant="contained"
                                        startIcon={<PhotoCameraIcon fontSize={'small'} />}
                                        onClick={handleImageUpload}
                                    >
                                        <input disabled={loading ? true : false} hidden accept="image/*" type="file" onChange={handleImageUpload} />
                                        {loading ? <CircularProgress size={18} /> : 'Upload'}
                                    </Button>
                                </Stack>

                                <TypographyComponent fontSize={22} sx={{ textAlign: 'center', mt: 1 }}>{userDetailData?.name && userDetailData?.name !== null ? userDetailData?.name : ''}</TypographyComponent>
                                <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', my: 0, py: 0, flexDirection: 'row', columnGap: 0.1 }}><IdBadgeIcon stroke1={theme.palette.primary[600]} size={16} /><TypographyComponent fontSize={14}>{userDetailData?.employee_id}</TypographyComponent></Stack>
                                {/* <TypographyComponent fontSize={14} sx={{ textAlign: 'center', color: theme.palette.grey[600] }}>{userDetailData?.designation && userDetailData?.designation !== null ? userDetailData?.designation : ''}</TypographyComponent> */}



                            </Stack>
                            {/* ------------------------------------ */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} sx={{ px: 2 }}>
                                <SectionHeader title="Basic Information" progress={100} />
                                <Divider />
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
                                        userDetailData?.contact_country_code && userDetailData?.contact_country_code !== null &&
                                            userDetailData?.contact && userDetailData?.contact !== null ?
                                            `${userDetailData?.contact_country_code}${decrypt(userDetailData?.contact)}` : ''
                                    }
                                    icon={<PhoneCallIcon stroke1={theme.palette.primary[600]} />} />
                            </Grid>

                            {/* Gender */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Age" value={userDetailData?.age && userDetailData?.age !== null ? userDetailData?.age : ''} />
                            </Grid>

                            {/* Role */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Role" value={userDetailData?.role && userDetailData?.role !== null ? userDetailData?.role : ''} />
                            </Grid>

                            {/* Company Name */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Company Name" value={userDetailData?.company_name && userDetailData?.company_name !== null ? userDetailData?.company_name : ''} />
                            </Grid>

                            {/* Reporting To */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Manager" value={userDetailData?.manager_name && userDetailData?.manager_name !== null ? userDetailData?.manager_name : ''} />
                            </Grid>

                            {/* Client Information */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, pt: 3 }} sx={{ mt: 2, px: 2 }}>
                                <SectionHeader title="Client Information" progress={100} />
                                <Divider />
                            </Grid>

                            {/* client name */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Client" value={userDetailData?.client?.name && userDetailData?.client?.name !== null ? userDetailData?.client?.name : ''} />
                            </Grid>

                            {/* Company Name */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Client Code" value={userDetailData?.client?.client_code && userDetailData?.client?.client_code !== null ? userDetailData?.client?.client_code : ''} icon={<IdBadgeIcon stroke1={theme.palette.primary[600]} />} />
                            </Grid>

                            {/* contact */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox
                                    label="Contact"
                                    value={
                                        userDetailData?.client?.country_code && userDetailData?.client?.country_code !== null &&
                                            userDetailData?.client?.contact_number && userDetailData?.client?.contact_number !== null ?
                                            `${userDetailData?.client?.country_code}${decrypt(userDetailData?.client?.contact_number)}` : ''
                                    }
                                    icon={<PhoneCallIcon stroke1={theme.palette.primary[600]} />} />
                            </Grid>

                            {/* location */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Location" value={userDetailData?.client?.location && userDetailData?.client?.location !== null ? userDetailData?.client?.location : ''} />
                            </Grid>
                            {/* client group name */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Client Group" value={userDetailData?.client?.client_group_name && userDetailData?.client?.client_group_name !== null ? userDetailData?.client?.client_group_name : ''} />
                            </Grid>

                            {/* Branch Information */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, pt: 3 }} sx={{ mt: 2, px: 2 }}>
                                <SectionHeader title="Branch Information" progress={100} />
                                <Divider />
                            </Grid>

                            {/* branch name */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Branch Name" value={userDetailData?.branch?.name && userDetailData?.branch?.name !== null ? userDetailData?.branch?.name : ''} />
                            </Grid>

                            {/* Branch code */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Branch Code" value={userDetailData?.branch?.branch_code && userDetailData?.branch?.branch_code !== null ? userDetailData?.branch?.branch_code : ''} icon={<IdBadgeIcon stroke1={theme.palette.primary[600]} />} />
                            </Grid>

                            {/* contact */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox
                                    label="Contact"
                                    value={
                                        userDetailData?.branch?.country_code && userDetailData?.branch?.country_code !== null &&
                                            userDetailData?.branch?.contact_no && userDetailData?.branch?.contact_no !== null ?
                                            `${userDetailData?.branch?.country_code}${decrypt(userDetailData?.branch?.contact_no)}` : ''
                                    }
                                    icon={<PhoneCallIcon stroke1={theme.palette.primary[600]} />} />
                            </Grid>

                            {/* location */}
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <FieldBox label="Email" value={userDetailData?.branch?.email && userDetailData?.branch?.email !== null ? decrypt(userDetailData?.branch?.email) : ''} icon={<MailIcon stroke={theme.palette.primary[600]} />} />
                            </Grid>

                            {/* Branch address */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <FieldBox label="Branch Address" value={userDetailData?.branch && userDetailData?.branch !== null ? concatMultipleStrings(userDetailData?.branch) : ''} icon={<AddressIcon stroke={theme.palette.primary[600]} />} />
                            </Grid>

                        </Grid>
                        :
                        <React.Fragment>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Profile Details Found'} subTitle={''} />
                        </React.Fragment>
                }
            </Stack>
            {
                openResetProfilePopup &&
                <AlertPopup
                    open={openResetProfilePopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                    color={theme.palette.error[600]}
                    objData={{
                        uuid: '',
                        title: `Reset Profile`,
                        text: `Are you sure you want to reset profile photo? This action cannot be undone.`
                    }}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenResetProfilePopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                            setViewLoadingDelete(true)
                            if (userDetailData?.uuid && userDetailData?.uuid !== null) {
                                dispatch(actionUserProfileUploadReset({
                                    uuid: userDetailData?.uuid
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment >
    )
}