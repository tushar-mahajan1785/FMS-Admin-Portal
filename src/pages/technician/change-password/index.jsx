/* eslint-disable react-hooks/exhaustive-deps */
import { BootstrapDialog } from '../../../components/common';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@emotion/react";
import TwoColorIconCircle from '../../../components/two-layer-icon';
import ChangePasswordIcon from '../../../assets/icons/ChangePasswordIcon';
import { Box, InputAdornment, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CustomTextField from "../../../components/text-field"
import FormLabel from "../../../components/form-label"
import EyeIcon from "../../../assets/icons/EyeIcon"
import EyeOffIcon from "../../../assets/icons/EyeOffIcon";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { actionTechnicianEmployeeChangePassword,resetTechnicianEmployeeChangePasswordResponse } from '../../../store/technician/profile';
import { useSnackbar } from "../../../hooks/useSnackbar";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { useAuth } from "../../../hooks/useAuth";
import { encrypt } from "../../../utils";
import TypographyComponent from "../../../components/custom-typography";

export default function ChangePassword({ open, handleClose }) {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { showSnackbar } = useSnackbar()
    const { user, logout } = useAuth()

    //States
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    //Stores
    const { technicianEmployeeChangePassword } = useSelector(state => state.technicianProfileStore)

    const { control,
        reset,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            password: '',
            new_password: ''
        },
        mode: 'all'
    })

    //Initial Render
    useEffect(() => {
        if (open === true) {
            reset()
        }
    }, [open])

    /**
    * useEffect
    * @dependency : technicianEmployeeChangePassword
    * @type : HANDLE API RESULT
    * @description : Handle the result of change password API
    */
    useEffect(() => {
        if (technicianEmployeeChangePassword && technicianEmployeeChangePassword !== null) {
            dispatch(resetTechnicianEmployeeChangePasswordResponse())
            if (technicianEmployeeChangePassword?.result === true) {
                setLoadingSubmit(false)
                reset()
                showSnackbar({ message: technicianEmployeeChangePassword.message, severity: "success" })
                handleClose()
            } else {
                setLoadingSubmit(false)
                switch (technicianEmployeeChangePassword?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        showSnackbar({ message: technicianEmployeeChangePassword.message, severity: "error" })
                        dispatch(resetTechnicianEmployeeChangePasswordResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianEmployeeChangePassword.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianEmployeeChangePassword])

    //handle onsubmit function
    const onSubmit = (data) => {
        setLoadingSubmit(true)
        let objData = {
            employee_id: user?.employee_id ? user?.employee_id : null,
            new_password: encrypt(data.new_password)
        }
        dispatch(actionTechnicianEmployeeChangePassword(objData))
    }

    return (
        <BootstrapDialog
            fullWidth
            maxWidth={'sm'}
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
                            IconComponent={<ChangePasswordIcon stroke={theme.palette.primary[600]} size={14} />}
                            color={theme.palette.primary[600]}
                            size={40}
                        />
                        <TypographyComponent fontSize={20} fontWeight={500}>
                            Change Password
                        </TypographyComponent>
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

            <DialogContent dividers>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ mb: 2 }}>
                        <Controller
                            name='password'
                            control={control}
                            rules={{
                                required: 'Password is required',
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%~`'*#?&])[A-Za-z\d@$!%*?~`'#&]{5,20}$/,
                                    message: 'Passwords must contain at least five characters, including uppercase,lowercase letters, special characters and numbers'
                                },
                                validate: (value) => {
                                    return String(value).trim().length === 0 ? 'Please enter your Password' : true
                                }
                            }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomTextField
                                    fullWidth
                                    value={value}
                                    placeholder='Your password'
                                    onBlur={onBlur}
                                    label={<FormLabel label='Password' required={true} />}
                                    onChange={onChange}
                                    id='auth-login-v2-password'
                                    error={Boolean(errors.password)}
                                    {...(errors.password && { helperText: errors.password.message })}
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    onMouseDown={e => e.preventDefault()}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {
                                                        showPassword ? <EyeIcon stroke="#7f838aff" /> : <EyeOffIcon stroke="#7f838aff" />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Controller
                            name='new_password'
                            control={control}
                            rules={{
                                required: 'Confirm Password is required',
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%~`'*#?&])[A-Za-z\d@$!%*?~`'#&]{5,20}$/,
                                    message: 'Password does not match'
                                },
                                validate: (value) => {
                                    return getValues("password") === value ? true : "Password does not match"
                                }
                            }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomTextField
                                    fullWidth
                                    value={value}
                                    placeholder='Confirm password'
                                    onBlur={onBlur}
                                    label={<FormLabel label='Confirm Password' required={true} />}
                                    onChange={onChange}
                                    id='auth-login-v2-password'
                                    error={Boolean(errors.new_password)}
                                    {...(errors.new_password && { helperText: errors.new_password.message })}
                                    type={showNewPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    onMouseDown={e => e.preventDefault()}
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {
                                                        showNewPassword ? <EyeIcon stroke="#7f838aff" /> : <EyeOffIcon stroke="#7f838aff" />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Box>
                </form>
            </DialogContent>
            <DialogActions sx={{ m: 0.5 }}>
                <Button color="secondary" variant="outlined" sx={{ color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" sx={{ textTransform: 'capitalize', background: theme.palette.primary[600], color: theme.palette.common.white }} disabled={loadingSubmit} onClick={() => {
                    handleSubmit(onSubmit)()
                }}>
                    {loadingSubmit ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Save Changes'}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
