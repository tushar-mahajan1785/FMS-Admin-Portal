/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  CssBaseline,
  useMediaQuery,
  Divider,
  Menu,
  MenuItem,
  Stack,
  useTheme,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Settings from "../../config/settings";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/layout/sidebar";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from "../../assets/icons/SearchIcon";
import FullScreenLoader from "../../components/fullscreen-loader";
import AlertPopup from "../../components/alert-confirm";
import ChangePasswordIcon from "../../assets/icons/ChangePasswordIcon";
import ChangePassword from "../../pages/change-password";
import { useSnackbar } from "../../hooks/useSnackbar";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import { actionUserLogout, resetUserLogoutResponse } from "../../store/login";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../constants";
import TypographyComponent from "../../components/custom-typography";
import { BranchDropdown } from "../../components/branch-dropdown";

export default function ProtectedLayout() {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [open, setOpen] = useState(Settings?.sidebar?.defaultOpen ?? false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { logout, user, loading, hasPermission } = useAuth()
  const theme = useTheme()
  const { showSnackbar } = useSnackbar()

  const { userLogout } = useSelector(state => state.loginStore)

  const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))

  const drawerWidth = Settings.drawerWidth ?? 240;
  const shift = open && isDesktop && user?.type !== 'Technician';
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openChangePasswordPopup, setOpenChangePasswordPopup] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  /**
   * useEffect
   * @dependency : userLogout
   * @type : HANDLE API RESULT
   * @description : Handle the result of logout API
   */
  useEffect(() => {
    if (userLogout && userLogout !== null) {
      dispatch(resetUserLogoutResponse())
      if (userLogout?.result === true) {
        setLoadingLogout(false)
        logout('logout')
      } else {
        setLoadingLogout(false)
        switch (userLogout?.status) {
          case UNAUTHORIZED:
            logout()
            break
          case ERROR:
            dispatch(resetUserLogoutResponse())
            showSnackbar({ message: userLogout?.message, severity: "error" })
            break
          case SERVER_ERROR:
            showSnackbar({ message: userLogout?.message, severity: "error" })
            break
          default:
            break
        }
      }
    }
  }, [userLogout])

  // If still checking token, show a loader
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <FullScreenLoader open={true} />
      </Box>
    );
  }

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    setLoadingLogout(true)
    dispatch(actionUserLogout())
  };

  const toggleDrawer = () => setOpen(v => !v);

  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* AppBar (slides when drawer open) */}
        <AppBar
          position={Settings.appBarPosition || "fixed"}
          sx={(theme) => ({
            // zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: theme.palette.common.white,
            ...(shift && {
              width: `calc(100% - ${drawerWidth}px)`,
              ml: `${drawerWidth}px`,
            }),
          })}
        >
          <Toolbar sx={{ alignItems: 'center' }}>
            {
              user?.type !== 'Technician' ?
                <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
                  <MenuIcon color="primary" />
                </IconButton>
                :
                <></>
            }

            {/* Show logo in AppBar only when drawer is CLOSED (for desktop) */}
            {!shift && Settings?.logo && (
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <img src={Settings?.logo?.path} alt="App Logo" style={{ height: 28 }} />
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }}>
              {/* Any other content required to add in AppBar will go here center part between menu button and left icons */}
            </Box>
            <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} columnGap={2}>
              <Stack>
                <NotificationIcon />
              </Stack>
              <Stack>
                <BranchDropdown />
              </Stack>
              <Box onClick={handleMenu} sx={{ cursor: 'pointer' }}>
                {
                  isSMDown ?
                    <IconButton sx={{ p: 0, border: `1px solid ${theme.palette.grey[100]}` }}>
                      <Avatar alt={user && user?.name ? user?.name : 'Guest'} src={user && user?.image_url && user?.image_url !== null ? user?.image_url : '/person.png'} sx={{ width: '2.2rem', height: '2.2rem' }} />
                    </IconButton>
                    :
                    <Stack flexDirection="row" alignItems="center" justifyContent={"center"} columnGap={1} sx={{ border: `0.5px solid ${theme.palette.grey[650]}`, padding: '6px 10px 6px 6px', borderRadius: '8px', margin: 1 }}>
                      <Stack>
                        <Avatar alt="profile" src={user && user?.image_url && user?.image_url !== null ? user?.image_url : '/person.png'} sx={{ width: '32.49px', height: '32px', borderRadius: '4px', border: `1px solid ${theme.palette.grey[100]}` }} />
                      </Stack>
                      <Stack gap={0} lineHeight={0.2}>
                        <TypographyComponent fontSize={12} fontWeight={530} sx={{ color: theme.palette.grey.primary }}>{user && user?.name ? user?.name : 'Guest'}</TypographyComponent>
                        <TypographyComponent fontSize={10} fontWeight={400} sx={{ color: theme.palette.grey[650] }}>{user && user?.role ? user?.role : 'Admin'}</TypographyComponent>
                      </Stack>
                      <Stack>
                        <ArrowDropDownIcon sx={{ color: theme.palette.common.black }} fontSize="medium" />
                      </Stack>
                    </Stack>
                }
              </Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      minWidth: 160,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: isSMDown ? 1.5 : -0.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {
                  hasPermission('PROFILE') ? [
                    <MenuItem key="profile" onClick={() => { navigate("/profile"); handleClose(); }}>
                      {isSMDown ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            alt={user?.name || 'Guest'}
                            src={user?.image_url || '/person.png'}
                            sx={{ width: '2.5rem', height: '2.5rem', border: `1px solid ${theme.palette.grey[100]}` }}
                          />
                          <Box sx={{ display: 'flex', ml: 1, alignItems: 'flex-start', flexDirection: 'column' }}>
                            <TypographyComponent fontWeight={500}>{user?.name || 'Yogesh P'}</TypographyComponent>
                            <TypographyComponent variant='body2' sx={{ color: theme.palette.grey[600] }}>
                              {user?.role || 'Facility Admin'}
                            </TypographyComponent>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <PersonIcon sx={{ color: theme.palette.grey[800] }} fontSize="inherit" />
                          <TypographyComponent fontSize={16} sx={{ ml: 0.5, color: theme.palette.grey[800] }}>Profile</TypographyComponent>
                        </>
                      )}
                    </MenuItem>,
                    <Divider key="divider-profile" />
                  ] : null
                }
                <MenuItem color="warning" onClick={() => {
                  setOpenChangePasswordPopup(true);
                  handleClose();
                }}>
                  <ChangePasswordIcon size={16} stroke={theme.palette.grey[800]} />
                  <TypographyComponent fontSize={16} sx={{ ml: 0.5, color: theme.palette.grey[800] }}>Change Password</TypographyComponent>
                </MenuItem>
                <Divider />
                <MenuItem color="warning" onClick={() => {
                  setOpenLogoutConfirm(true);
                  handleClose();
                }}>
                  <LogoutIcon sx={{ color: theme.palette.grey[800] }} fontSize="inherit" />
                  <TypographyComponent fontSize={16} sx={{ ml: 0.5, color: theme.palette.grey[800] }}>Logout</TypographyComponent>
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>

        {
          user?.type !== 'Technician' ?
            <>{/* Sidebar Drawer */}
              <Sidebar open={open} onClose={() => setOpen(false)} /></>
            :
            <></>
        }


        {/* Main (slides with AppBar) */}
        <Box
          component={'main'}
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            p: 3,
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(shift && { ml: `${drawerWidth}px` }),
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          })}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box >

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
      < ChangePassword
        open={openChangePasswordPopup}
        handleClose={() => setOpenChangePasswordPopup(false)}
      />
    </React.Fragment>
  );
}
