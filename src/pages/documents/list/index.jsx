/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Chip, CircularProgress, IconButton, InputAdornment, Stack, Tooltip, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useBranch } from "../../../hooks/useBranch";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { actionDocumentList, resetDocumentListResponse, actionDeleteDocumentGroup, resetDeleteDocumentGroupResponse } from "../../../store/documents";
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import FullScreenLoader from "../../../components/fullscreen-loader";
import ServerSideListComponents from "../../../components/server-side-list-component";
import EmptyContent from "../../../components/empty_content";
import { useNavigate } from "react-router-dom";
import CreateNewDocumentGroup from "../add";
import MyBreadcrumbs from "../../../components/breadcrumb";
import TypographyComponent from "../../../components/custom-typography";
import { SearchInput } from "../../../components/common";
import SearchIcon from "../../../assets/icons/SearchIcon";
import AddIcon from '@mui/icons-material/Add';
import EyeIcon from "../../../assets/icons/EyeIcon"
import moment from "moment/moment";
import CalendarMinusIcon from "../../../assets/icons/CalendarMinusIcon";
import FileInvoiceIcon from "../../../assets/icons/FileInvoiceIcon";
import EditCircleIcon from "../../../assets/icons/EditCircleIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import { resetRosterDataResponse } from "../../../store/roster";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";

export default function DocumentsList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()

    //Stores
    const { documentList, deleteDocumentGroup } = useSelector(state => state.documentStore)

    // state
    const [openAddDocumentGroupPopup, setOpenAddDocumentGroupPopup] = useState(false)
    const [documentListOptions, setDocumentListOptions] = useState([])
    const [documentListOriginalData, setDocumentListOriginalData] = useState([])
    const [total, setTotal] = useState(0)
    const [loadingList, setLoadingList] = useState(false)
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('')
    const [currentGroupData, setCurrentGroupData] = useState(null)
    const [openDeleteDocumentGroupPopup, setOpenDeleteDocumentGroupPopup] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const columns = [
        {
            flex: 0.2,
            field: 'group_name',
            headerName: 'Group Name'
        },
        {
            flex: 0.2,
            field: 'asset_type',
            headerName: 'Type'
        },
        {
            flex: 0.1,
            field: 'no_of_assets',
            headerName: 'Assets',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                        <Chip
                            label={params?.row?.no_of_assets}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontWeight: 500, px: '4px', py: '8px', borderRadius: 0 }}
                        />
                        <Tooltip
                            followCursor
                            placement="top"
                            title={params?.row?.assets?.map(item => item).join(', ') || 'No assets'}
                        >
                            <IconButton>
                                <EyeIcon stroke="#717680" />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                )
            }
        },
        {
            flex: 0.1,
            field: 'no_of_document',
            headerName: 'Documents',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                        <IconButton>
                            <FileInvoiceIcon stroke="#717680" />
                        </IconButton>
                        <TypographyComponent fontSize={14} fontWeight={400}>{params?.row?.no_of_document}</TypographyComponent>
                    </Stack>

                )
            }
        },
        {
            flex: 0.2,
            field: 'updated_at',
            headerName: 'Last Updated',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                        <IconButton>
                            <CalendarMinusIcon stroke="#717680" />
                        </IconButton>
                        <TypographyComponent fontSize={14} fontWeight={400}>{params?.row?.updated_at && params?.row?.updated_at !== null ? moment(params?.row?.updated_at).format("DD MMM YYYY") : ''}</TypographyComponent>
                    </Stack>

                )
            }
        },
        {
            flex: 0.2,
            sortable: false,
            field: "",
            headerName: 'Action',
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: "center", height: '100%', columnGap: 2 }}>
                        {
                            hasPermission('DOCUMENT_VIEW') ?
                                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                                    <Tooltip title="Details" followCursor placement="top">
                                        {/* open ticket details */}
                                        <Button
                                            variant="outlined"
                                            startIcon={<EyeIcon stroke={theme.palette.primary[700]} />}
                                            sx={{ border: `1px solid ${theme.palette.primary[700]}`, borderRadius: '8px', color: theme.palette.primary[700] }}
                                            onClick={() => {
                                                navigate(`/documents/view/${params?.row?.uuid}`)
                                            }}
                                        >
                                            View Document
                                        </Button>
                                    </Tooltip>
                                </Box>
                                :
                                <></>
                        }
                        {
                            hasPermission('UPLOAD_DOCUMENT') ?
                                <Tooltip title="Edit" followCursor placement="top">
                                    {/* open ticket details */}
                                    <IconButton
                                        variant="outlined"
                                        sx={{ border: `1px solid ${theme.palette.primary[700]}`, borderRadius: '8px' }}
                                        onClick={() => {
                                            let objData = Object.assign({}, params.row)
                                            objData.formType = 'edit'
                                            setCurrentGroupData(objData)
                                            setOpenAddDocumentGroupPopup(true)
                                        }}
                                    >
                                        <EditCircleIcon stroke={theme.palette.primary[700]} />
                                    </IconButton>
                                </Tooltip>
                                :
                                <></>
                        }
                        {
                            hasPermission('DOCUMENT_DELETE') ?
                                <Tooltip title="Delete" followCursor placement="top">
                                    {/* open ticket details */}
                                    <IconButton
                                        variant="outlined"
                                        sx={{ border: `1px solid ${theme.palette.error[600]}`, borderRadius: '8px' }}
                                        onClick={() => {
                                            let objData = {
                                                uuid: params?.row?.uuid,
                                                title: `Delete Document Group`,
                                                text: `Are you sure you want to delete this document group? This action cannot be undone.`
                                            }
                                            setCurrentGroupData(objData)
                                            setOpenDeleteDocumentGroupPopup(true)
                                        }}
                                    >
                                        <DeleteIcon stroke={'#D92D20'} />
                                    </IconButton>
                                </Tooltip>
                                :
                                <></>
                        }
                    </Stack>
                );
            },
        },
    ];

    /**
      * useEffect
      * @dependency : documentList
      * @type : HANDLE API RESULT
      * @description : Handle the result of document List API
      */
    useEffect(() => {
        if (documentList && documentList !== null) {
            dispatch(resetDocumentListResponse())
            if (documentList?.result === true) {
                setDocumentListOptions(documentList?.response?.data)
                setDocumentListOriginalData(documentList?.response?.data)
                setLoadingList(false)
                setTotal(documentList?.response?.total)
            } else {
                setLoadingList(false)
                setTotal(0)
                setDocumentListOptions([])
                setDocumentListOriginalData([])
                switch (documentList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDocumentListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: documentList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [documentList])

    /**
      * useEffect
      * @dependency : deleteDocumentGroup
      * @type : HANDLE API RESULT
      * @description : Handle the result of delete Document Group API
      */
    useEffect(() => {
        if (deleteDocumentGroup && deleteDocumentGroup !== null) {
            dispatch(resetDeleteDocumentGroupResponse())
            if (deleteDocumentGroup?.result === true) {
                setOpenDeleteDocumentGroupPopup(false)
                setLoadingDelete(false)
                showSnackbar({ message: deleteDocumentGroup?.message, severity: "success" })
                dispatch(actionDocumentList({
                    branch_uuid: branch?.currentBranch?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
                setCurrentGroupData(null)
            } else {
                setLoadingDelete(false)
                setCurrentGroupData(null)
                switch (deleteDocumentGroup?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteDocumentGroupResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: deleteDocumentGroup?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteDocumentGroup])

    /**
      * Document list API Call on change of Page
      */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            if (page !== null) {
                setLoadingList(true)
                dispatch(actionDocumentList({
                    branch_uuid: branch?.currentBranch?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
            }
        }
    }, [branch?.currentBranch, page])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
         * Filter the vendor
         */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (documentListOriginalData && documentListOriginalData !== null && documentListOriginalData.length > 0) {
                var filteredData = documentListOriginalData.filter(
                    item =>
                        (item?.group_name && item?.group_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.asset_type && item?.asset_type.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.no_of_assets && item?.no_of_assets.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.no_of_document && item?.no_of_document.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setDocumentListOptions(filteredData)
                } else {
                    setDocumentListOptions([])
                }
            }
        } else {
            setDocumentListOptions(documentListOriginalData)
        }
    }, [searchQuery])

    return (
        <React.Fragment>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <MyBreadcrumbs />

                {
                    hasPermission('ADD_DOCUMENT_GROUP') ?
                        <Stack>
                            <Button
                                size={'small'}
                                sx={{ textTransform: "capitalize", px: 4, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                                onClick={() => {
                                    setOpenAddDocumentGroupPopup(true)
                                }}
                                variant='contained'
                            >
                                <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} />
                                Create New Group
                            </Button>
                        </Stack>
                        :
                        <></>
                }

            </Stack>
            <Box sx={{
                height: '740px',
                background: theme.palette.common.white,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.grey[300]}`,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '2px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: '2px'
                }
            }}>
                <Stack
                    flexDirection={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    m={2}
                    rowGap={{ xs: 2, sm: 2 }}
                >
                    <Stack
                        flexDirection="row"
                        alignItems="center"
                        columnGap={1}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        <Stack>
                            <TypographyComponent fontSize={18} fontWeight={500}>Group List</TypographyComponent>
                        </Stack>
                        <Chip
                            label={`${total} Groups`}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontWeight: 500 }}
                        />
                    </Stack>
                    <Stack>
                        <SearchInput
                            id="search-manage-shift"
                            placeholder="Search"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ mr: 1 }}>
                                        <SearchIcon stroke={theme.palette.grey[500]} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Stack>
                </Stack>
                {loadingList ? (
                    <FullScreenLoader open={true} />
                ) : documentListOptions && documentListOptions !== null && documentListOptions.length > 0 ? (
                    <ServerSideListComponents
                        rows={documentListOptions}
                        columns={columns}
                        isCheckbox={false}
                        total={total}
                        page={page}
                        onPageChange={setPage}
                        pageSize={LIST_LIMIT}
                        onChange={(selectedIds) => {
                            console.log("Selected row IDs in manageShift:", selectedIds);
                        }}
                    />
                ) : (
                    <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Document Found'} subTitle={''} />
                )}

            </Box>
            {
                openAddDocumentGroupPopup &&
                <CreateNewDocumentGroup
                    open={openAddDocumentGroupPopup}
                    objData={currentGroupData}
                    handleClose={(data) => {
                        dispatch(resetRosterDataResponse())
                        if (data && data !== null && data === 'save') {
                            dispatch(actionDocumentList({
                                branch_uuid: branch?.currentBranch?.uuid,
                                page: page,
                                limit: LIST_LIMIT
                            }))
                        }
                        setOpenAddDocumentGroupPopup(false)
                        setCurrentGroupData(null)
                    }}
                />
            }
            {
                openDeleteDocumentGroupPopup &&
                <AlertPopup
                    open={openDeleteDocumentGroupPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                    color={theme.palette.error[600]}
                    objData={currentGroupData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenDeleteDocumentGroupPopup(false)
                        }}>
                            Cancel
                        </Button>
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={loadingDelete} onClick={() => {
                            setLoadingDelete(true)
                            if (currentGroupData?.uuid && currentGroupData?.uuid !== null) {
                                dispatch(actionDeleteDocumentGroup({
                                    uuid: currentGroupData?.uuid
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
    )
}