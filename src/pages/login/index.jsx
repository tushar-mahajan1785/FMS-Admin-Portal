import { Box, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from '@emotion/react'
import { Stack, useMediaQuery } from '@mui/system'
import { useState } from 'react'
import { getMyConfig } from '../../common/api'
import CustomTextField from '../../components/text-field'
import FormLabel from '../../components/form-label'
import EyeIcon from '../../assets/icons/EyeIcon'
import EyeOffIcon from '../../assets/icons/EyeOffIcon'
import TypographyComponent from '../../components/custom-typography'
import { isEmail } from '../../constants'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from '../../hooks/useSnackbar'
import { encrypt } from '../../utils'

const LoginIllustration = styled('img')(() => ({
  zIndex: 2,
  height: '100%',
  width: '100%'
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
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

export default function LoginPage() {
  const { login } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  //media query
  const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))
  const isLGDown = useMediaQuery(theme.breakpoints.down('lg'))

  //States
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
    mode: 'all'
  })

  /**
   * handle submit function for login
   */
  const onSubmit = (data) => {
    setLoading(true)
    const { username, password } = data

    let header = getMyConfig(true)
    login(
      {
        email: encrypt(username.toLowerCase()),
        password: encrypt(password)
      },
      { ...header },
      (error) => {
        setLoading(false)
        showSnackbar({ message: error?.message ? error.message : 'Something Went Wrong. Please try again', severity: "error" })
      }
    )
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
        <Box
          sx={{
            px: isSMDown ? 3 : '',
            height: '100% !important',
            // background: 'red',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 405, justifyContent: 'center' }}>
            {/* <LogoImage alt='logo-image' src={`/images/icons/covergrow-logo.png`} /> */}
            <Box sx={{ mb: 6, mt: !isSMDown ? 6 : '' }}>
              <TypographyComponent fontSize={40} fontWeight={700} sx={{ mb: 0.3, color: theme.palette.common.black }}>
                WELCOME BACK !
              </TypographyComponent >
              <TypographyComponent fontSize={16} sx={{ color: 'text.secondary' }}>
                Access your smart energy dashboard securely.
              </TypographyComponent>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
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
                      label={<FormLabel label='Email Address' sx={{ color: theme.palette.common.black }} required={true} />}
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                      {...(errors.username && { helperText: errors.username.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: 'Password is required',
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
              <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                {/* <Stack>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Remember Me"
                  />
                </Stack> */}
                <Stack sx={{ ml: 'auto' }} onClick={() => {
                  navigate('/forgot-password', { state: { email_address: getValues('username') ? getValues('username') : '' } })
                }}>
                  <TypographyComponent fontSize={16} fontWeight={500} sx={{ cursor: 'pointer', color: theme.palette.primary[600] }}>
                    Forgot Password?
                  </TypographyComponent>
                </Stack>
              </Stack>
              <Button fullWidth type='submit' variant='contained' sx={{ mt: 2, background: theme.palette.primary[600], color: theme.palette.common.white }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" sx={{ color: 'white' }} /> : 'Log In'}
              </Button>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Stack>
  )
}

