import { useTheme } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IMAGES_SCREEN_NO_DATA } from '../../constants';
import { Box, Divider, FormControlLabel, Grid, ListItem, ListItemButton, ListItemText, Stack, useMediaQuery } from '@mui/material';
import EmptyContent from '../../components/empty_content';
import TypographyComponent from '../../components/custom-typography';
import ChevronRightIcon from '../../assets/icons/ChevronRight';
import CircleCheckIcon from '../../assets/icons/CircleCheck';

export const ProfileMyPermission = () => {
    const theme = useTheme()

    //media query
    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'));

    const [userPermissions, setUserPermissions] = useState([]);
    const [roleManagementData, setRoleManagementData] = useState(null);

    const { getUserProfileDetails } = useSelector(state => state.CommonStore)


    /**
     * useEffect
     * @dependency : getUserProfileDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of user profile details API
     */
    useEffect(() => {
        if (getUserProfileDetails && getUserProfileDetails !== null) {
            if (getUserProfileDetails?.result === true) {
                if (getUserProfileDetails?.response?.permissions && getUserProfileDetails?.response?.permissions !== null && getUserProfileDetails?.response?.permissions.length > 0) {
                    setUserPermissions(getUserProfileDetails?.response?.permissions)
                }

            } else {
                setUserPermissions([])
            }
        }
    }, [getUserProfileDetails])

    /**
       * update module_id and module_name in roleManagementData store
       */
    useEffect(() => {
        let getPermissionData = Object.assign({}, roleManagementData)

        if (userPermissions && userPermissions !== null && userPermissions.length > 0) {
            let objRole = userPermissions.find(role => role.is_selected === true)

            if (objRole) {
                getPermissionData.module_id = objRole.id
                getPermissionData.module_name = objRole.title
            } else {
                getPermissionData.module_id = userPermissions[0].id
                getPermissionData.module_name = userPermissions[0].title
            }
        } else {
            getPermissionData.module_id = ''
            getPermissionData.module_name = ''
        }

        setRoleManagementData(getPermissionData)
    }, [userPermissions])

    return (
        <React.Fragment>
            {
                userPermissions && userPermissions !== null && userPermissions?.length > 0 ?
                    <Grid
                        container
                        flexDirection={'row'}
                        columnGap={0}
                        sx={{
                            border: `1px solid ${theme.palette.grey[300]}`, borderRadius: 2,
                            width: '100%',
                            '&::-webkit-scrollbar': {
                                height: '8px', // Visible scrollbar height
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.grey[400], // Scrollbar thumb color
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: theme.palette.grey[600], // Hover color
                            }
                        }}
                    >
                        <Grid
                            size={{ xs: 4, sm: 3, md: 3, lg: 3, xl: 3 }}
                            sx={{
                                height: '74vh',
                                overflow: 'hidden',
                                '&::-webkit-scrollbar': {
                                    width: '0px', // adjust this value to make the scrollbar thinner,
                                    height: '0px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#ccc', // color of the scrollbar thumb
                                    borderRadius: '0px'
                                },
                                overflowY: 'scroll'
                            }}
                        >
                            {userPermissions && userPermissions !== null && userPermissions?.length > 0 ? (
                                userPermissions.map((permission, index) => (
                                    <ListItem
                                        key={`permission-item-${index}`}
                                        sx={{
                                            alignItems: 'center',
                                            overflow: 'hidden',
                                            justifyContent: 'space-between',
                                            px: 0,
                                            py: 0,
                                            backgroundColor: permission.id === roleManagementData?.module_id ? theme.palette.primary[100] : '',
                                            borderTopLeftRadius: permission.id === roleManagementData?.module_id ? 5 : ''
                                        }}
                                        secondaryAction={
                                            permission.id === roleManagementData?.module_id && !isSMDown ? (
                                                <ChevronRightIcon />
                                            ) : (
                                                <></>
                                            )
                                        }
                                    >
                                        <ListItemButton
                                            onClick={() => {
                                                let selectedId = permission.id
                                                let arrRolePermission = Object.assign([], userPermissions)

                                                let updatedRoleData = arrRolePermission.map((level) => {
                                                    let currentObj = Object.assign({}, level)
                                                    if (currentObj.is_selected) {
                                                        currentObj.is_selected = false
                                                    }
                                                    if (currentObj.id === selectedId) {
                                                        currentObj.is_selected = true
                                                    }

                                                    return currentObj
                                                })
                                                setUserPermissions(updatedRoleData)
                                            }}
                                            sx={{
                                                px: isSMDown ? 1 : 2,
                                                py: isSMDown ? 1.5 : 2.5,
                                                borderBottom:
                                                    userPermissions && userPermissions !== null && index < userPermissions.length - 1
                                                        ? '1px dashed #ACACAC'
                                                        : 'none'
                                            }}
                                        >
                                            <ListItemText
                                                primaryTypographyProps={{
                                                    sx: {
                                                        fontWeight: `${permission.id === roleManagementData?.module_id ? 600 : 0}`,
                                                        color: theme =>
                                                            `${permission.id === roleManagementData?.module_id ? theme.palette.primary[600] : ''}`
                                                    }
                                                }}
                                            >
                                                {permission?.title}
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            ) : (
                                <></>
                            )}
                        </Grid>
                        <Grid size={{ xs: 8, sm: 9, md: 9, lg: 9, xl: 9 }} sx={{ backgroundColor: theme.palette.primary[100], borderTopRightRadius: 5 }}>
                            <Box sx={{ backgroundColor: '#FFF', margin: isSMDown ? '10px' : '20px', padding: isSMDown ? '10px' : '20px', height: '68vh', borderRadius: 2 }}>
                                {userPermissions &&
                                    userPermissions !== null &&
                                    userPermissions
                                        .filter((objPermission) => objPermission?.id === roleManagementData?.module_id)
                                        .map(objRolePermission => {
                                            return (
                                                <div key={objRolePermission.id}>
                                                    <Stack flexDirection={{ xs: 'column', sm: 'row', alignItems: isSMDown ? 'start' : 'center' }} justifyContent={'space-between'}>
                                                        <TypographyComponent sx={{ color: theme => `${theme.palette.common.black}`, mb: isSMDown ? 1 : 3 }} fontSize={22}>
                                                            {objRolePermission?.title}
                                                        </TypographyComponent>
                                                    </Stack>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#FFF',
                                                            overflowY: 'scroll',
                                                            height: objRolePermission.permissions && objRolePermission.permissions !== null && objRolePermission.permissions.length > 0 ? (isSMDown ? '50vh' : '52vh') : '',
                                                            '&::-webkit-scrollbar': {
                                                                width: '5px',
                                                                height: 0
                                                            },
                                                            '&::-webkit-scrollbar-thumb': {
                                                                backgroundColor: '#ccc',
                                                                borderRadius: '5px'
                                                            }
                                                        }}>
                                                        {objRolePermission.permissions &&
                                                            objRolePermission.permissions !== null && (
                                                                <>
                                                                    {objRolePermission.permissions.every(item => item.value === 0) ?
                                                                        (
                                                                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={`No Permissions given for ${objRolePermission?.title}`} subTitle={''} />
                                                                        ) : (
                                                                            // 🚀 At least one is non-zero
                                                                            objRolePermission.permissions.map((objPermission) => (
                                                                                <>
                                                                                    {
                                                                                        objPermission?.value === 1 ?
                                                                                            <Stack key={objPermission.id} flexDirection={'column'}>
                                                                                                <FormControlLabel
                                                                                                    labelPlacement="end"
                                                                                                    sx={{
                                                                                                        m: 0,
                                                                                                        gap: 1,
                                                                                                        '.MuiTypography-root': { fontWeight: 500, fontSize: 14 },
                                                                                                    }}
                                                                                                    control={<CircleCheckIcon stroke={theme.palette.primary[600]} size={24} />}
                                                                                                    label={
                                                                                                        <Stack justifyContent={'flex-end'}>
                                                                                                            <TypographyComponent fontSize={16} fontWeight={600} >
                                                                                                                {objPermission?.permissions_name}
                                                                                                            </TypographyComponent>
                                                                                                            <TypographyComponent fontSize={14} sx={{ fontStyle: 'italic' }}>
                                                                                                                {objPermission?.description}
                                                                                                            </TypographyComponent>
                                                                                                        </Stack>
                                                                                                    }
                                                                                                />
                                                                                                <Divider sx={{ my: 2 }} />
                                                                                            </Stack>
                                                                                            :
                                                                                            <></>
                                                                                    }
                                                                                </>

                                                                            ))

                                                                        )
                                                                    }
                                                                </>)}
                                                    </Box>
                                                </div>
                                            )
                                        })}
                            </Box>
                        </Grid>
                    </Grid>
                    :
                    <React.Fragment>
                        <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Permissions Found'} subTitle={''} />
                    </React.Fragment>
            }
        </React.Fragment>
    )
}
