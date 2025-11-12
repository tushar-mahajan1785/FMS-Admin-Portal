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
import { ListHeaderContainer, ListHeaderRightSection, SearchInput } from "../../../components/common";
import AddDocumentCategories from "../add";
import { useBranch } from "../../../hooks/useBranch";
import { actionDocumentCategoriesList, actionDeleteDocumentCategories, resetDocumentCategoriesListResponse, resetDeleteDocumentCategoriesResponse } from "../../../store/document-categories";
import MyBreadcrumbs from "../../../components/breadcrumb";
import AddIcon from '@mui/icons-material/Add';

export default function DocumentCategoriesList() {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const branch = useBranch()

    // store
    const { documentCategoriesList, deleteDocumentCategories } = useSelector(state => state.documentCategoriesStore)

    // state
    const [documentCategoriesOptions, setDocumentCategoriesOptions] = useState([])
    const [documentCategoriesOriginalData, setDocumentCategoriesOriginalData] = useState([])
    const [openAddDocumentCategoriesPopup, setOpenAddDocumentCategoriesPopup] = useState(false)
    const [documentCategoriesData, setDocumentCategoriesData] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [openDeleteDocumentCategoriesPopup, setOpenDeleteDocumentCategoriesPopup] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')


    const columns = [
        { field: "category_name", headerName: "Category Name", flex: 0.1 },
        { field: "category_short_name", headerName: "Category Short Name", flex: 0.1 },
        { field: "description", headerName: "Description", flex: 0.1 },
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
                                hasPermission('DOCUMENT_CATEGORIES_DELETE') ?
                                    <Tooltip title="Delete" followCursor placement="top">
                                        {/* open Document Categories delete popup */}
                                        <IconButton
                                            onClick={() => {
                                                let objData = {
                                                    uuid: params?.row?.uuid,
                                                    title: `Delete Document Categories`,
                                                    text: `Are you sure you want to delete this document categories? This action cannot be undone.`
                                                }
                                                setDocumentCategoriesData(objData)
                                                setOpenDeleteDocumentCategoriesPopup(true)
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <></>
                            }
                            {
                                hasPermission('DOCUMENT_CATEGORIES_EDIT') ?
                                    <Tooltip title="Edit" followCursor placement="top">
                                        {/* open edit document categories */}
                                        <IconButton
                                            onClick={() => {
                                                let objData = Object.assign({}, params.row)
                                                objData.formType = 'edit'
                                                setDocumentCategoriesData(objData)
                                                setOpenAddDocumentCategoriesPopup(true)
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
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            setLoadingList(true)
            dispatch(actionDocumentCategoriesList({
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
    }, [branch?.currentBranch?.uuid])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the document categories list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (documentCategoriesOriginalData && documentCategoriesOriginalData !== null && documentCategoriesOriginalData.length > 0) {
                var filteredData = documentCategoriesOriginalData.filter(
                    item =>
                        (item?.category_name && item?.category_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.category_short_name && item?.category_short_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.description && item?.description.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setDocumentCategoriesOptions(filteredData)
                } else {
                    setDocumentCategoriesOptions([])
                }
            }
        } else {
            setDocumentCategoriesOptions(documentCategoriesOriginalData)
        }
    }, [searchQuery])

    /**
      * useEffect
      * @dependency : documentCategoriesList
      * @type : HANDLE API RESULT
      * @description : Handle the result of document categories List API
      */
    useEffect(() => {
        if (documentCategoriesList && documentCategoriesList !== null) {
            dispatch(resetDocumentCategoriesListResponse())
            if (documentCategoriesList?.result === true) {
                setDocumentCategoriesOptions(documentCategoriesList?.response)
                setDocumentCategoriesOriginalData(documentCategoriesList?.response)
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setDocumentCategoriesOptions([])
                setDocumentCategoriesOriginalData[[]]
                switch (documentCategoriesList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDocumentCategoriesListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: documentCategoriesList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [documentCategoriesList])

    /**
      * useEffect
      * @dependency : deleteDocumentCategories
      * @type : HANDLE API RESULT
      * @description : Handle the result of delete document categories API
      */
    useEffect(() => {
        if (deleteDocumentCategories && deleteDocumentCategories !== null) {
            dispatch(resetDeleteDocumentCategoriesResponse())
            if (deleteDocumentCategories?.result === true) {
                setOpenDeleteDocumentCategoriesPopup(false)
                setLoadingDelete(false)
                showSnackbar({ message: deleteDocumentCategories?.message, severity: "success" })
                dispatch(actionDocumentCategoriesList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            } else {
                setLoadingDelete(false)
                switch (deleteDocumentCategories?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteDocumentCategoriesResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteDocumentCategories?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteDocumentCategories])

    return <React.Fragment>

        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MyBreadcrumbs />
            {
                hasPermission('DOCUMENT_CATEGORIES_ADD') ?
                    <Stack>
                        <Button
                            size={'small'}
                            sx={{ textTransform: "capitalize", px: 4, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                            onClick={() => {
                                setOpenAddDocumentCategoriesPopup(true)
                            }}
                            variant='contained'
                        >
                            <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} />
                            Create New Categories
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
            <ListHeaderContainer>
                <ListHeaderRightSection>
                    <SearchInput
                        id="search-document-categories"
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
            ) : documentCategoriesOptions && documentCategoriesOptions !== null && documentCategoriesOptions.length > 0 ? (
                <ListComponents
                    rows={documentCategoriesOptions}
                    height={600}
                    columns={columns}
                    isCheckbox={false}
                    onChange={(selectedIds) => {
                        console.log("Selected row IDs in documentCategoriesList:", selectedIds);
                    }}
                />
            ) : (
                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Document Categories Found'} subTitle={''} />
            )}
        </Box>
        {
            openAddDocumentCategoriesPopup &&
            <AddDocumentCategories
                open={openAddDocumentCategoriesPopup}
                dataObj={documentCategoriesData}
                handleClose={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionDocumentCategoriesList({
                            branch_uuid: branch?.currentBranch?.uuid
                        }))
                    }
                    setOpenAddDocumentCategoriesPopup(false)
                    setDocumentCategoriesData(null)
                }}
            />
        }
        {
            openDeleteDocumentCategoriesPopup &&
            <AlertPopup
                open={openDeleteDocumentCategoriesPopup}
                icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                color={theme.palette.error[600]}
                objData={documentCategoriesData}
                actionButtons={[
                    <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                        setOpenDeleteDocumentCategoriesPopup(false)
                    }}>
                        Cancel
                    </Button>
                    ,
                    <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={loadingDelete} onClick={() => {
                        setLoadingDelete(true)
                        if (documentCategoriesData?.uuid && documentCategoriesData?.uuid !== null) {
                            dispatch(actionDeleteDocumentCategories({
                                uuid: documentCategoriesData?.uuid
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
