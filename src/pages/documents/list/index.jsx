/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Chip, InputAdornment, Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useBranch } from "../../../hooks/useBranch";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { actionDocumentList, resetDocumentListResponse } from "../../../store/documents";
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

export default function DocumentsList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()

    //Stores
    const { documentList } = useSelector(state => state.documentStore)

    // state
    const [openAddDocumentGroupPopup, setOpenAddDocumentGroupPopup] = useState(false)
    const [documentListOptions, setDocumentListOptions] = useState([])
    const [documentListOriginalData, setDocumentListOriginalData] = useState([])
    const [total, setTotal] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('')

    const columns = [
        {
            flex: 0.12,
            field: 'group_name',
            headerName: 'Group Name'
        },
        {
            flex: 0.1,
            field: 'asset_type',
            headerName: 'Type'
        },
        {
            flex: 0.12,
            field: 'asset_name',
            headerName: 'Assets'
        },
        {
            flex: 0.2,
            field: 'no_of_document',
            headerName: 'Documents'
        },
        {
            flex: 0.1,
            field: 'updated_at',
            headerName: 'Last Updated'
        },
        {
            flex: 0.04,
            sortable: false,
            field: "",
            headerName: 'Action',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        {
                            hasPermission('DOCUMENT_VIEW') ?
                                <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                                    <Tooltip title="Details" followCursor placement="top">
                                        {/* open ticket details */}
                                        <IconButton
                                            onClick={() => {
                                                navigate(`/documents/view/${params?.row?.uuid}`)
                                            }}
                                        >
                                            <EyeIcon stroke={'#6941C6'} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                :
                                <></>
                        }
                    </React.Fragment>
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
                setTotal(documentList?.response?.counts?.total)
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
      * Document list API Call on change of Page
      */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            if (page !== null) {
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
                        (item?.asset_name && item?.asset_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
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
                    <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Manage Shift Found'} subTitle={''} />
                )}

            </Box>
            <CreateNewDocumentGroup
                open={openAddDocumentGroupPopup}
                handleClose={() => {
                    setOpenAddDocumentGroupPopup(false)
                }}
            />
        </React.Fragment>
    )
}