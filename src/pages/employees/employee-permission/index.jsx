/* eslint-disable react-hooks/exhaustive-deps */

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@emotion/react";
import {
    Box,
    Divider,
    FormControlLabel,
    Grid,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { AntSwitch, BootstrapDialog } from '../../../components/common';
import TwoColorIconCircle from '../../../components/two-layer-icon';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import CopyIcon from '../../../assets/icons/CopyIcon';
import ChevronRightIcon from '../../../assets/icons/ChevronRight';
import { actionEmployeeList, actionEmployeeWisePermissionSave, resetEmployeeWisePermissionSaveResponse } from '../../../store/employee';
import { useDispatch, useSelector } from 'react-redux';
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import toast from 'react-hot-toast';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useAuth } from '../../../hooks/useAuth';
import EmptyContent from '../../../components/empty_content';
import TypographyComponent from '../../../components/custom-typography';
import { useBranch } from '../../../hooks/useBranch';

export default function EmployeeWisePermissions({ open, handleClose, detail, page }) {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const branch = useBranch()

    // store
    const { employeeWisePermissionSave } = useSelector(state => state.employeeStore)

    // media query
    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'));

    // state
    const [loading, setLoading] = useState(false)
    const [rolePermission, setRolePermission] = useState([])
    const [canSave, setCanSave] = useState(false)
    const [roleManagementData, setRoleManagementData] = useState(null)

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {
            setCanSave(false)
            if (detail && detail !== null && detail?.permissions && detail?.permissions !== null && detail?.permissions.length > 0) {
                setRolePermission(detail.permissions)
            }
        }
    }, [open])

    /**
        * update module_id and module_name in roleManagementData
        */
    useEffect(() => {
        let getPermissionData = Object.assign({}, roleManagementData)

        if (rolePermission && rolePermission !== null && rolePermission.length > 0) {
            let objRole = rolePermission.find(role => role.is_selected === true)

            if (objRole) {
                getPermissionData.module_id = objRole.id
                getPermissionData.module_name = objRole.title
            } else {
                getPermissionData.module_id = rolePermission[0].id
                getPermissionData.module_name = rolePermission[0].title
            }
        } else {
            getPermissionData.module_id = ''
            getPermissionData.module_name = ''
        }

        setRoleManagementData(getPermissionData)
    }, [rolePermission])

    /**
    * useEffect
    * @dependency : employeeWisePermissionSave
    * @type : HANDLE API RESULT
    * @description : Handle the result of employee Wise Permission Save API
    */
    useEffect(() => {
        if (employeeWisePermissionSave && employeeWisePermissionSave !== null) {
            dispatch(resetEmployeeWisePermissionSaveResponse())
            if (employeeWisePermissionSave?.result === true) {
                setRolePermission(employeeWisePermissionSave?.response?.permissions)
                toast.dismiss()
                showSnackbar({ message: 'Employee Permissions Updated Successfully', severity: "success" })
                setLoading(false)
                dispatch(actionEmployeeList({
                    branch_uuid: branch?.currentBranch?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
                setCanSave(false)
            } else {
                setLoading(false)
                setCanSave(false)
                switch (employeeWisePermissionSave?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeWisePermissionSaveResponse())
                        toast.dismiss()
                        showSnackbar({ message: employeeWisePermissionSave?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: employeeWisePermissionSave?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeWisePermissionSave])

    return (
        <BootstrapDialog
            fullWidth
            fullScreen={isMDDown}
            maxWidth={'xl'}
            onClose={() => handleClose()}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            scroll="paper"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 1.5 }} id="customized-dialog-title">
                <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                >
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                        <TwoColorIconCircle
                            IconComponent={<HttpsOutlinedIcon fontSize={'small'} sx={{ color: theme.palette.primary[600] }} />}
                            color={theme.palette.primary[600]}
                            size={40}
                        />
                        <Stack flexDirection={isSMDown ? 'column' : 'row'} columnGap={1}>
                            <TypographyComponent fontSize={20} fontWeight={500}>
                                EmployeeWise Permission For
                            </TypographyComponent>
                            <TypographyComponent fontSize={20} fontWeight={500} color={theme.palette.primary[600]}>
                                {detail?.name && detail?.name !== null ? detail?.name : ''}
                            </TypographyComponent>
                        </Stack>

                    </Stack>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            color: theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{
                height: '88vh',
                borderRadius: 2,
                overflowX: 'scroll',
                backgroundColor: 'white',
                padding: 3,
                whiteSpace: 'nowrap',
                width: '100%',
                marginTop: isSMDown ? 2 : ''
            }}>
                {
                    rolePermission && rolePermission !== null && rolePermission.length > 0 ?
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
                                    height: '70vh',
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
                                {rolePermission && rolePermission !== null && rolePermission?.length > 0 ? (
                                    rolePermission.map((permission, index) => (
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
                                                permission.id === roleManagementData?.module_id ? (
                                                    <ChevronRightIcon />
                                                ) : (
                                                    <></>
                                                )
                                            }
                                        >
                                            <ListItemButton
                                                onClick={() => {
                                                    let selectedId = permission.id
                                                    let arrRolePermission = Object.assign([], rolePermission)

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
                                                    setRolePermission(updatedRoleData)

                                                }}
                                                sx={{
                                                    px: 2,
                                                    py: 2.5,
                                                    borderBottom:
                                                        rolePermission && rolePermission !== null && index < rolePermission.length - 1
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
                                <Box sx={{ backgroundColor: '#FFF', margin: '20px', padding: '20px', height: isSMDown ? '80vh' : '67vh', borderRadius: 2 }}>
                                    {rolePermission &&
                                        rolePermission !== null &&
                                        rolePermission
                                            .filter((objPermission) => objPermission?.id === roleManagementData?.module_id)
                                            .map(objRolePermission => {
                                                let isAll = objRolePermission.permissions.every(permission => permission.value == 1)
                                                return (
                                                    <div key={objRolePermission.id}>
                                                        <Stack flexDirection={{ xs: 'column', sm: 'row', alignItems: 'center' }} justifyContent={'space-between'}>
                                                            <TypographyComponent fontSize={22} sx={{ color: theme => `${theme.palette.common.black}`, mb: 3 }}>
                                                                {objRolePermission.title}
                                                            </TypographyComponent>
                                                            {objRolePermission?.permissions !== null && objRolePermission?.permissions?.length > 1 ?
                                                                <FormControlLabel
                                                                    sx={{ minWidth: 120, mb: 3 }}
                                                                    control={
                                                                        <AntSwitch
                                                                            checked={isAll}
                                                                            onChange={(event) => {
                                                                                const isChecked = event.target.checked;
                                                                                const updatedPermissions = rolePermission.map((module) => {
                                                                                    if (module.id === roleManagementData?.module_id) {
                                                                                        const updatedModule = { ...module };
                                                                                        updatedModule.permissions = updatedModule?.permissions.map((permission) => ({
                                                                                            ...permission,
                                                                                            value: isChecked ? 1 : 0,
                                                                                        }));
                                                                                        return updatedModule;
                                                                                    }
                                                                                    return module;
                                                                                });
                                                                                setRolePermission(updatedPermissions);
                                                                                setCanSave(true);
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={<TypographyComponent fontSize={18} sx={{ ml: 1 }}>Select All</TypographyComponent>}
                                                                />
                                                                :
                                                                <></>
                                                            }
                                                        </Stack>
                                                        <Divider sx={{ mb: 2 }} />
                                                        <Box
                                                            sx={{
                                                                backgroundColor: '#FFF',
                                                                overflowY: 'scroll',
                                                                height: objRolePermission.permissions && objRolePermission.permissions !== null && objRolePermission.permissions.length > 0 ? '55vh' : '',
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
                                                                objRolePermission.permissions !== null &&
                                                                objRolePermission.permissions.map((objPermission, index) => (
                                                                    <Stack key={objPermission.id} flexDirection={'column'}>
                                                                        <FormControlLabel
                                                                            labelPlacement="end"
                                                                            sx={{
                                                                                m: 0,
                                                                                gap: 1,
                                                                                '.MuiTypography-root': { fontWeight: 500, fontSize: 14 },
                                                                            }}
                                                                            control={
                                                                                <AntSwitch
                                                                                    checked={objPermission.value}
                                                                                    onChange={e => {
                                                                                        setCanSave(true)

                                                                                        //update the toggle value in role permissions array
                                                                                        let arrPermissionsMenu = Object.assign([], rolePermission)

                                                                                        let objCurrentPermissionIndex = arrPermissionsMenu.findIndex(
                                                                                            permission => permission?.id === objRolePermission?.id
                                                                                        )

                                                                                        if (objCurrentPermissionIndex > -1) {
                                                                                            let objCurrentPermission = Object.assign(
                                                                                                {},
                                                                                                arrPermissionsMenu[objCurrentPermissionIndex]
                                                                                            )
                                                                                            let arrPermissions = Object.assign([], objCurrentPermission?.permissions)
                                                                                            let objCurrent = Object.assign({}, arrPermissions[index])

                                                                                            objCurrent.value = e.target.checked === true ? 1 : 0
                                                                                            arrPermissions[index] = objCurrent
                                                                                            objCurrentPermission.permissions = arrPermissions
                                                                                            arrPermissionsMenu[objCurrentPermissionIndex] = objCurrentPermission
                                                                                            setRolePermission(arrPermissionsMenu)
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            }
                                                                            label={
                                                                                <Stack justifyContent={'flex-end'}>
                                                                                    <TypographyComponent fontSize={16} fontWeight={600}>
                                                                                        {objPermission.permissions_name}
                                                                                    </TypographyComponent>
                                                                                    <TypographyComponent variant='caption' fontSize={14} fontWeight={400} sx={{ fontStyle: 'italic' }}>
                                                                                        {objPermission?.description}
                                                                                    </TypographyComponent>
                                                                                </Stack>
                                                                            }
                                                                        />
                                                                        <Divider sx={{ my: 2 }} />
                                                                    </Stack>
                                                                ))}
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
            </DialogContent>
            <DialogActions sx={{ m: 0.5 }}>
                <Button color="secondary" variant="outlined" sx={{ color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<CopyIcon stroke={'white'} size={13} />}
                    sx={{
                        textTransform: 'capitalize',
                        background: canSave ? theme.palette.primary[600] : theme.palette.grey[300],
                        color: theme.palette.common.white
                    }}
                    disabled={canSave ? false : true}
                    onClick={() => {
                        setLoading(true)

                        let objData = {
                            id: detail?.id,
                            permissions: rolePermission,

                        }
                        dispatch(actionEmployeeWisePermissionSave(objData))

                    }}>
                    {loading ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Save Changes'}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}
