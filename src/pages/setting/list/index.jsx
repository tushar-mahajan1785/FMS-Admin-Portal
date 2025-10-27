/* eslint-disable react-hooks/exhaustive-deps */
import {
    Stack,
    Box,
    Button, Tooltip,
    IconButton,
    CircularProgress,
    useTheme,
    InputAdornment
} from "@mui/material";
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
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import EditIcon from "../../../assets/icons/EditIcon";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import GetCountComponent from "../../../components/get-count-component";
import { ListHeaderContainer, ListHeaderRightSection, SearchInput } from "../../../components/common";
import CustomChip from "../../../components/custom-chip";
import FormHeader from "../../../components/form-header";
import { actionSettingList, actionDeleteSetting, resetSettingListResponse, resetDeleteSettingResponse } from "../../../store/setting";
import AddSetting from "../add";
import SettingsIcon from "../../../assets/icons/SettingsIcon";

export default function SettingList() {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()

    // store
    const { settingList, deleteSetting } = useSelector(state => state.settingStore)
    const { clientBranchDetails } = useSelector(state => state.branchStore)

    // state
    const [settingOptions, setSettingOptions] = useState([])
    const [settingOriginalData, setSettingOriginalData] = useState([])
    const [openAddSettingPopup, setOpenAddSettingPopup] = useState(false)
    const [settingData, setSettingData] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [openDeleteSettingPopup, setOpenDeleteSettingPopup] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')


    const columns = [
        { field: "setting_key", headerName: "Setting Key", flex: 0.1 },
        {
            flex: 0.1,
            field: "status",
            headerName: "Status",
            renderCell: (params) => {
                let color = params?.row?.status === 'Active' ? 'success' : 'error'
                return (
                    <React.Fragment><CustomChip text={params?.row?.status} colorName={color} /></React.Fragment>
                )
            }
        },
        {
            flex: 0.02,
            sortable: false,
            field: "",
            headerName: 'Action',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {
                                hasPermission('SETTING_DELETE') ?
                                    <Tooltip title="Delete" followCursor placement="top">
                                        {/* open setting delete popup */}
                                        <IconButton
                                            onClick={() => {
                                                let objData = {
                                                    id: params?.row?.id,
                                                    title: `Delete Setting`,
                                                    text: `Are you sure you want to delete this setting? This action cannot be undone.`
                                                }
                                                setSettingData(objData)
                                                setOpenDeleteSettingPopup(true)
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <></>
                            }
                            {
                                hasPermission('SETTING_EDIT') ?
                                    <Tooltip title="Edit" followCursor placement="top">
                                        {/* open edit setting */}
                                        <IconButton
                                            onClick={() => {
                                                let objData = Object.assign({}, params.row)
                                                objData.formType = 'edit'
                                                objData.entity_type = 'branch'
                                                setSettingData(objData)
                                                setOpenAddSettingPopup(true)
                                            }}
                                        >
                                            <EditIcon />
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
     * initial render
     */
    useEffect(() => {
        if (clientBranchDetails?.response?.uuid && clientBranchDetails?.response?.uuid !== null) {
            setLoadingList(true)
            dispatch(actionSettingList({
                branch_uuid: clientBranchDetails?.response?.uuid,
                entity_type: 'branch'
            }))
        }
    }, [clientBranchDetails?.response?.uuid])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the setting list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (settingOriginalData && settingOriginalData !== null && settingOriginalData.length > 0) {
                var filteredData = settingOriginalData.filter(
                    item =>
                        (item?.entity_type && item?.entity_type.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.setting_key && item?.setting_key.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.status && item?.status.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setSettingOptions(filteredData)
                } else {
                    setSettingOptions([])
                }
            }
        } else {
            setSettingOptions(settingOriginalData)
        }
    }, [searchQuery])

    /**
      * useEffect
      * @dependency : settingList
      * @type : HANDLE API RESULT
      * @description : Handle the result of setting List API
      */
    useEffect(() => {
        if (settingList && settingList !== null) {
            dispatch(resetSettingListResponse())
            if (settingList?.result === true) {
                setSettingOptions(settingList?.response)
                setSettingOriginalData(settingList?.response)
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setSettingOptions([])
                setSettingOriginalData[[]]
                switch (settingList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetSettingListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: settingList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [settingList])

    /**
      * useEffect
      * @dependency : deleteSetting
      * @type : HANDLE API RESULT
      * @description : Handle the result of delete setting API
      */
    useEffect(() => {
        if (deleteSetting && deleteSetting !== null) {
            dispatch(resetDeleteSettingResponse())
            if (deleteSetting?.result === true) {
                setOpenDeleteSettingPopup(false)
                setLoadingDelete(false)
                showSnackbar({ message: deleteSetting?.message, severity: "success" })
                dispatch(actionSettingList({
                    branch_uuid: clientBranchDetails?.response?.uuid
                }))
            } else {
                setLoadingDelete(false)
                switch (deleteSetting?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteSettingResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteSetting?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteSetting])

    return <React.Fragment>
        <Stack
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            mb={3}>
            <FormHeader
                color={theme.palette.primary[600]}
                size={48}
                icon={<SettingsIcon stroke={theme.palette.primary[600]} size={18} />}
                title="Settings"
                subtitle="Manage your settings for current branch"
            />
            <GetCountComponent
                countData={{ title1: "Total", title2: "Setting", value: settingOptions && settingOptions !== null && settingOptions.length > 0 ? String(settingOptions.length).padStart(2, '0') : 0 }}
                actionData={{
                    buttonLabel1: "Add New", buttonLabel2: "Setting", onClick: () => {
                        let objData = Object.assign({}, settingData)
                        objData.entity_type = 'branch'
                        setSettingData(objData)
                        // open add setting
                        setOpenAddSettingPopup(true)
                    }
                }}
                permissionKey={'SETTING_ADD'}
            />
        </Stack>

        <Box sx={{ height: '600px', background: theme.palette.common.white }}>
            <ListHeaderContainer>
                <ListHeaderRightSection>
                    <SearchInput
                        id="search-setting"
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
            ) : settingOptions && settingOptions !== null && settingOptions.length > 0 ? (
                <ListComponents
                    rows={settingOptions}
                    height={520}
                    columns={columns}
                    isCheckbox={false}
                    onChange={(selectedIds) => {
                        console.log("Selected row IDs in SettingList:", selectedIds);
                    }}
                />
            ) : (
                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Setting Found'} subTitle={''} />
            )}
        </Box>
        {
            openAddSettingPopup &&
            <AddSetting
                open={openAddSettingPopup}
                dataObj={settingData}
                handleClose={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionSettingList({
                            branch_uuid: clientBranchDetails?.response?.uuid
                        }))
                    }
                    setOpenAddSettingPopup(false)
                    setSettingData(null)
                }}
            />
        }
        {
            openDeleteSettingPopup &&
            <AlertPopup
                open={openDeleteSettingPopup}
                icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                color={theme.palette.error[600]}
                objData={settingData}
                actionButtons={[
                    <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                        setOpenDeleteSettingPopup(false)
                    }}>
                        Cancel
                    </Button>
                    ,
                    <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={loadingDelete} onClick={() => {
                        setLoadingDelete(true)
                        if (settingData?.id && settingData?.id !== null) {
                            dispatch(actionDeleteSetting({
                                id: settingData?.id
                            }))
                        }
                    }}>
                        {loadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                    </Button>
                ]
                }
            />
        }
    </React.Fragment>
}
