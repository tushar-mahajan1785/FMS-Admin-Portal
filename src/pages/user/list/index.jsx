/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, Box, Tooltip, IconButton, useTheme, InputAdornment } from "@mui/material";
import MyBreadcrumbs from "../../../components/breadcrumb";
import ListComponents from "../../../components/list-components";
import SearchIcon from "../../../assets/icons/SearchIcon";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import toast from "react-hot-toast";
import FullscreenLoader from '../../../components/fullscreen-loader';
import EmptyContent from "../../../components/empty_content";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import EyeIcon from "../../../assets/icons/EyeIcon";
import GetCountComponent from "../../../components/get-count-component";
import { ListHeaderContainer, ListHeaderRightSection, SearchInput } from "../../../components/common";
import AddUser from "../add";
import { actionUsersList, resetUsersListResponse } from "../../../store/users";
import { decrypt } from "../../../utils";
import UserDetails from "../details";
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import UserwisePermissions from "../user-permission";
import { actionMasterCountryCodeList } from "../../../store/vendor";
import TypographyComponent from "../../../components/custom-typography";

export default function UserList() {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission, user } = useAuth()

    //Stores
    const { usersList } = useSelector(state => state.UsersStore)

    //States
    const [usersData, setUsersData] = useState([])
    const [usersOriginalData, setUsersOriginalData] = useState([])
    const [openAddUserPopup, setOpenAddUserPopup] = useState(false)
    const [userDetailData, setUserDetailData] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [openUserViewPopup, setOpenUserViewPopup] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [openUserPermissionPopup, setOpenUserPermissionPopup] = useState(false)

    const columns = [
        {
            flex: 0.1,
            field: 'full_name',
            headerName: 'Full Name'
        },
        {
            flex: 0.1,
            field: "mobile_number",
            headerName: "Mobile Number",
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params.row.mobile_number && params.row.mobile_number !== null ?
                                <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                                    {`${params.row.country_code && params.row.country_code !== null ? params.row.country_code : ''}${decrypt(params.row.mobile_number)}`}
                                </TypographyComponent>
                                :
                                <></>
                        }

                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: "email",
            headerName: "Email",
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        <TypographyComponent
                            color={theme.palette.grey.primary}
                            fontSize={14}
                            fontWeight={400}
                            sx={{
                                py: '10px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 220,
                            }}
                            title={decrypt(params.row.email)}
                        >
                            {decrypt(params.row.email)}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: 'role_name',
            headerName: 'Role',
        },
        {
            flex: 0.1,
            field: 'reporting_to_name',
            headerName: 'Reporting to',
        },
        {
            flex: 0.04,
            sortable: false,
            field: "",
            headerName: 'Action',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {
                                hasPermission('USERS_DETAILS') ?
                                    <Tooltip title="Details" followCursor placement="top">
                                        <IconButton
                                            onClick={() => {

                                                //Open User Details Popup
                                                setUserDetailData(params.row)
                                                setOpenUserViewPopup(true)
                                            }}
                                        >
                                            <EyeIcon />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <></>
                            }
                            {
                                hasPermission('USERS_PERMISSIONS_UPDATE') && params?.row?.uuid !== user?.user_uuid ?
                                    <Tooltip title="Userwise Permission" followCursor placement="top">
                                        <IconButton
                                            onClick={() => {

                                                //Open manual permission popup
                                                setUserDetailData(params.row)
                                                setOpenUserPermissionPopup(true)
                                            }}
                                        >
                                            <HttpsOutlinedIcon fontSize={'small'} sx={{ color: '#535862' }} />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <></>
                            }

                        </Box>
                    </React.Fragment>
                );
            },
        },
    ];

    /**
     * Initial Render
     * @action : actionUsersList
     * @description : Call user list api at Initial
     */
    useEffect(() => {
        setLoadingList(true)
        dispatch(actionUsersList())
        dispatch(actionMasterCountryCodeList())
    }, [])

    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the User list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (usersOriginalData && usersOriginalData !== null && usersOriginalData.length > 0) {
                var filteredData = usersOriginalData.filter(
                    item =>
                        (item?.full_name && item?.full_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.email && decrypt(item?.email).toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.role_name && item?.role_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.reporting_to_name && item?.reporting_to_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.mobile_number && decrypt(item?.mobile_number).toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setUsersData(filteredData)
                } else {
                    setUsersData([])
                }
            }
        } else {
            setUsersData(usersOriginalData)
        }
    }, [searchQuery])

    /**
     * useEffect
     * @dependency : usersList
     * @type : HANDLE API RESULT
     * @description : Handle the result of users list API
    */
    useEffect(() => {
        if (usersList && usersList !== null) {
            dispatch(resetUsersListResponse())
            if (usersList?.result === true) {
                setUsersData(usersList?.response)
                setUsersOriginalData(usersList?.response)
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setUsersData([])
                setUsersOriginalData[[]]
                switch (usersList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetUsersListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: usersList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [usersList])

    return <React.Fragment>
        <Stack
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            mb={3}>
            <MyBreadcrumbs />
            <GetCountComponent
                countData={{ title1: "Total", title2: "Users", value: usersData && usersData !== null && usersData.length > 0 ? String(usersData.length).padStart(2, '0') : 0 }}
                actionData={{ buttonLabel1: "Add New", buttonLabel2: "User", onClick: () => { setOpenAddUserPopup(true) } }}
                permissionKey={'USERS_ADD'}
            />
        </Stack>

        <Box sx={{ borderRadius: '12px', border: `1px solid ${theme.palette.grey[200]}`, height: '720px', background: theme.palette.common.white }}>
            <ListHeaderContainer>
                <ListHeaderRightSection>
                    <SearchInput
                        id="search-users"
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        onChange={handleSearchQueryChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 1 }}>
                                    <SearchIcon stroke={theme.palette.grey[500]} />
                                </InputAdornment>
                            ),
                        }}
                    />

                </ListHeaderRightSection>
            </ListHeaderContainer>
            {loadingList ? (
                <FullscreenLoader open={true} />
            ) : usersData && usersData !== null && usersData.length > 0 ? (
                <ListComponents
                    rows={usersData}
                    columns={columns}
                    isCheckbox={false}
                    onChange={(selectedIds) => {
                        console.log("Selected row IDs in UsersList:", selectedIds);
                    }}
                />
            ) : (
                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No User Found'} subTitle={''} />
            )}

        </Box>
        {
            openAddUserPopup &&
            <AddUser
                open={openAddUserPopup}
                toggle={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionUsersList())
                    }
                    setOpenAddUserPopup(false)
                    setUserDetailData(null)
                }}
            />
        }
        {
            openUserViewPopup &&
            <UserDetails
                open={openUserViewPopup}
                objData={userDetailData}
                toggle={() => {
                    setOpenUserViewPopup(false)
                    setUserDetailData(null)

                }}
            />
        }
        {
            openUserPermissionPopup &&
            <UserwisePermissions
                detail={userDetailData}
                open={openUserPermissionPopup}
                handleClose={() => {
                    setOpenUserPermissionPopup(false)
                    setUserDetailData(null)
                }}
            />
        }

    </React.Fragment>
}
