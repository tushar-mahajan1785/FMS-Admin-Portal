/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from '@emotion/react'
import { Stack, useMediaQuery } from '@mui/system'
import { useEffect, useState } from 'react'
import CustomTextField from '../../components/text-field'
import FormLabel from '../../components/form-label'
import EyeIcon from '../../assets/icons/EyeIcon'
import EyeOffIcon from '../../assets/icons/EyeOffIcon'
import TypographyComponent from '../../components/custom-typography'
import { ERROR, isEmail, SERVER_ERROR, UNAUTHORIZED } from '../../constants'
import OTPInput from '../../components/otp-input'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { actionPasswordReset, actionVerifyEmail, resetPasswordResetResponse, resetVerifyEmailResponse } from '../../store/forget-password'
import toast from 'react-hot-toast'
import { useSnackbar } from '../../hooks/useSnackbar'
import Timer from '../../components/timer'
import { useAuth } from '../../hooks/useAuth'
import { encrypt } from '../../utils'

const LoginIllustration = styled('img')(() => ({
    zIndex: 2,
    height: '100%',
    width: '100%'
}))

const RightWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        maxWidth: '100%'
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: 600
    },
    [theme.breakpoints.up('xl')]: {
        maxWidth: 850
    }
}))

export default function ForgetPassword() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
    const { showSnackbar } = useSnackbar()
    const { logout } = useAuth()

    const { email_address } = location.state || {}

    //media query
    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))
    const isLGDown = useMediaQuery(theme.breakpoints.down('lg'))

    //Stores
    const { verifyEmail, passwordReset } = useSelector(state => state.forgetPasswordStore)

    //States
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [screenType, setScreenType] = useState('')
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [resetTimer, setResetTimer] = useState(false)
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [resendLoader, setResendLoader] = useState(false);

    //useForm for email verification screen
    const {
        control,
        reset,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: '',

        },
        mode: 'all'
    })

    //useForm for new password screen
    const { control: control1,
        handleSubmit: handleSubmit1,
        reset: reset1,
        getValues: getValues1,
        formState: { errors: errors1 }
    } = useForm({
        defaultValues: {
            password: '',
            new_password: ''
        },
        mode: 'all'
    })

    /**
     * On forget password click 
     * set entered username to email field in EMAIL VERIFICATION SCREEN
     */
    useEffect(() => {
        setScreenType('email-verify')
        setValue('username', email_address ? email_address : '')
        setEnteredUsername(email_address ? email_address : '')

    }, [email_address])

    /**
    * useEffect
    * @dependency : verifyEmail
    * @type : HANDLE API RESULT
    * @description : Handle the result of verify email API
    */
    useEffect(() => {
        if (verifyEmail && verifyEmail !== null) {
            dispatch(resetVerifyEmailResponse())
            if (verifyEmail?.result === true) {
                setLoading(false)
                setScreenType('reset')
                setResetTimer(true)
                setIsTimeUp(false);
                setResendLoader(false);
                showSnackbar({ message: verifyEmail.response.message, severity: "success" })
            } else {
                setLoading(false)
                setResendLoader(false);
                switch (verifyEmail?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        showSnackbar({ message: verifyEmail.message, severity: "error" })
                        dispatch(resetVerifyEmailResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: verifyEmail.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [verifyEmail])

    /**
    * useEffect
    * @dependency : passwordReset
    * @type : HANDLE API RESULT
    * @description : Handle the result of password reset API
    */
    useEffect(() => {
        if (passwordReset && passwordReset !== null) {
            dispatch(resetPasswordResetResponse())
            if (passwordReset?.result === true) {
                setLoadingSubmit(false)
                reset()
                reset1()
                showSnackbar({ message: passwordReset?.message, severity: "success" })
                navigate('/login')
            } else {
                setLoadingSubmit(false)
                switch (passwordReset?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetPasswordResetResponse())
                        showSnackbar({ message: passwordReset?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: passwordReset?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [passwordReset])

    /**
     * function to validate on handleOtpChange
     */
    const handleOtpChange = (newOtp) => {
        setOtpValue(newOtp)
        if (newOtp.length < 6) {
            setOtpError('Invalid OTP. Please try again.');
        } else {
            setOtpError('');
        }
    };

    /**
     * function to handle Resend Click
     */
    const handleResendClick = () => {
        dispatch(actionVerifyEmail({ email: encrypt(enteredUsername) }))
    };

    // Callback function to be called by the Timer component
    const handleTimerFinish = () => {
        setIsTimeUp(true)
        // You can also clear the OTP input here if needed
        setOtpValue('')
    };

    /**
    * @action : actionVerifyEmail
    * handle submit function for verify email
    */
    const onSubmit = (data) => {
        setLoading(true)
        setEnteredUsername(data?.username)
        dispatch(actionVerifyEmail({ email: encrypt(data?.username.toLowerCase()) }))
    }

    /** 
    * @action : actionPasswordReset
    * handle submit function for password reset
    */
    const onSubmit1 = (data) => {
        if (otpValue.length === 0) {
            setOtpError('OTP is Required')
        }

        let objData = {
            otp: otpValue,
            email: enteredUsername ? encrypt(enteredUsername.toLowerCase()) : null,
            new_password: encrypt(data?.new_password)
        }

        setLoadingSubmit(true)
        dispatch(actionPasswordReset(objData))
    }

    return (
        <Stack sx={{
            flexDirection: 'row',
            backgroundColor: 'background.paper',
            height: '100vh',
            overflowY: 'scroll',
            '&::-webkit-scrollbar': {
                width: '5px'
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
                borderRadius: '5px'
            }
        }}>
            <Stack>
                {!isLGDown ? (
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '1000px',
                            height: '100vh',
                            [theme.breakpoints.down(1540)]: {
                                width: '800px'
                            }
                        }}
                    >
                        <LoginIllustration alt="login-illustration"
                            src={`/assets/login.png`}
                        />
                    </Box>
                ) : null}
            </Stack>
            <RightWrapper>
                {
                    screenType == 'email-verify' ?
                        <Box
                            sx={{
                                px: isSMDown ? 3 : '',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Box sx={{ width: '100%', maxWidth: 405, justifyContent: 'center' }}>
                                {/* <LogoImage alt='logo-image' src={`/images/icons/covergrow-logo.png`} /> */}
                                <Box sx={{ mb: 6, mt: !isSMDown ? 6 : '' }}>
                                    <TypographyComponent fontSize={40} fontWeight={700} sx={{ mb: 0.3, color: theme.palette.common.black }}>
                                        OTP Verification
                                    </TypographyComponent >
                                    <TypographyComponent fontSize={16} sx={{ color: 'text.secondary' }}>
                                        You will receive an email with a one-time-password
                                    </TypographyComponent>
                                </Box>
                                <Stack sx={{ mb: 1 }}>
                                    <TypographyComponent fontSize={14} sx={{ color: theme.palette.common.black }}>
                                        Enter your email address
                                    </TypographyComponent>
                                </Stack>
                                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                                    {/* Username */}
                                    <Box sx={{ mb: 2 }}>
                                        <Controller
                                            name='username'
                                            control={control}
                                            rules={{
                                                required: 'Email Address is required',
                                                validate: {
                                                    isEmail: value => isEmail(value) || 'Invalid email address'
                                                }
                                            }}
                                            render={({ field: { value, onChange } }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    autoFocus
                                                    placeholder='Your work email'
                                                    value={value}
                                                    onChange={onChange}
                                                    error={Boolean(errors.username)}
                                                    {...(errors.username && { helperText: errors.username.message })}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Button fullWidth type='submit' variant='contained' sx={{ mt: 2, background: theme.palette.primary[600], color: theme.palette.common.white }} disabled={loading}>
                                        {loading ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Send OTP'}
                                    </Button>
                                </form>
                                <Stack justifyContent={'center'} my={8} alignItems={'center'} spacing={1}>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        Need to Login? <span style={{ color: theme.palette.primary[600], fontWeight: 600, cursor: 'pointer' }} onClick={() => {
                                            navigate('/login')
                                        }}> LOGIN NOW</span>
                                    </TypographyComponent>
                                </Stack>
                            </Box>
                        </Box>
                        :
                        <Box
                            sx={{
                                px: isSMDown ? 3 : '',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Box sx={{ width: '100%', maxWidth: 405, justifyContent: 'center' }}>
                                {/* <LogoImage alt='logo-image' src={`/images/icons/covergrow-logo.png`} /> */}
                                <Box sx={{ my: 6 }}>
                                    <TypographyComponent fontSize={40} fontWeight={700} sx={{ mb: 0.3 }}>
                                        RESET PASSWORD
                                    </TypographyComponent >
                                    <TypographyComponent fontSize={16} sx={{ color: 'text.secondary' }}>
                                        Enter the verification code you received on your email
                                    </TypographyComponent>
                                </Box>
                                <form noValidate autoComplete='off' onSubmit={handleSubmit1(onSubmit1)}>
                                    {/* OTP Input */}
                                    <Box sx={{ mb: 0 }}>
                                        <OTPInput length={6} onOtpChange={handleOtpChange} error={otpError} />
                                    </Box>

                                    {/* Timer section */}
                                    <Stack flexDirection={'row'} justifyContent={isTimeUp == true ? 'center' : 'space-between'} alignItems={'center'} mb={2} mt={0.5} mx={5}>
                                        {
                                            isTimeUp == false ?
                                                <Timer
                                                    initialTimeInSeconds={300}
                                                    resetTrigger={resetTimer}
                                                    onTimerFinish={handleTimerFinish}
                                                />
                                                :
                                                <></>
                                        }
                                        <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
                                            <TypographyComponent fontSize={12} fontWeight={500} sx={{ letterSpacing: 0.5, color: theme.palette.grey[800] }}>
                                                {isTimeUp == true ? `Didn't receive an OTP?` : ''}  <span style={{ color: isTimeUp === true ? theme.palette.primary[600] : theme.palette.grey[400], fontWeight: 600, letterSpacing: 0.1, cursor: isTimeUp === true ? 'pointer' : '' }}
                                                    onClick={() => {
                                                        if (isTimeUp === true) {
                                                            setResendLoader(true);
                                                            handleResendClick()
                                                        }
                                                    }}>
                                                    {resendLoader ? <CircularProgress size={10} sx={{ color: 'black', mx: 0.5 }} /> : ' RESEND '} {isTimeUp == false ? 'OTP' : ''}
                                                </span>
                                            </TypographyComponent>
                                        </Stack>
                                    </Stack>
                                    {/* password */}
                                    <Box sx={{ mb: 2 }}>
                                        <Controller
                                            name='password'
                                            control={control1}
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
                                                    label={<FormLabel label='Password' sx={{ color: theme.palette.common.black }} required={true} />}
                                                    onChange={onChange}
                                                    id='auth-login-v2-password'
                                                    error={Boolean(errors1.password)}
                                                    {...(errors1.password && { helperText: errors1.password.message })}
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
                                    {/* new password */}
                                    <Box sx={{ mb: 2 }}>
                                        <Controller
                                            name='new_password'
                                            control={control1}
                                            rules={{
                                                required: 'Confirm Password is required',
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%~`'*#?&])[A-Za-z\d@$!%*?~`'#&]{5,20}$/,
                                                    message: 'Password does not match'
                                                },
                                                validate: (value) => {
                                                    return getValues1("password") === value ? true : "Password does not match"
                                                }
                                            }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    value={value}
                                                    placeholder='Confirm password'
                                                    onBlur={onBlur}
                                                    label={<FormLabel label='Confirm Password' sx={{ color: theme.palette.common.black }} required={true} />}
                                                    onChange={onChange}
                                                    id='auth-login-v2-password'
                                                    error={Boolean(errors1.new_password)}
                                                    {...(errors1.new_password && { helperText: errors1.new_password.message })}
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
                                    <Button fullWidth type='submit' variant='contained' sx={{ mt: 2, background: theme.palette.primary[600], color: theme.palette.common.white }} disabled={loadingSubmit}>
                                        {loadingSubmit ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Submit'}
                                    </Button>
                                    <Stack justifyContent={'center'} my={8} alignItems={'center'} spacing={1}>
                                        <TypographyComponent fontSize={16} fontWeight={500}>
                                            Need to Login? <span style={{ color: theme.palette.primary[600], fontWeight: 600, cursor: 'pointer' }} onClick={() => {
                                                navigate('/login')
                                            }}> LOGIN NOW</span>
                                        </TypographyComponent>
                                    </Stack>
                                </form>
                            </Box>
                        </Box>
                }
            </RightWrapper>
        </Stack >
    );
}

