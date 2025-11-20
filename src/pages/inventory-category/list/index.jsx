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
import CustomChip from "../../../components/custom-chip";
import InventoryCategoryDetails from "../details";
import AddInventoryCategory from "../add";
import { actionInventoryCategoryList, resetInventoryCategoryListResponse } from "../../../store/inventory";
import { useBranch } from "../../../hooks/useBranch";

export default function CategoryList() {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const branch = useBranch()

    //Stores
    const { inventoryCategoryList } = useSelector(state => state.inventoryStore)

    //States
    const [inventoryCategoryData, setInventoryCategoryData] = useState([])
    const [inventoryCategoryOriginalData, setInventoryCategoryOriginalData] = useState([])
    const [openAddInventoryCategoryPopup, setOpenAddInventoryCategoryPopup] = useState(false)
    const [inventoryCategoryDetailData, setInventoryCategoryDetailData] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [openInventoryCategoryViewPopup, setOpenInventoryCategoryViewPopup] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const columns = [
        {
            flex: 0.1,
            field: 'title',
            headerName: 'Name'
        },
        {
            flex: 0.1,
            field: 'description',
            headerName: 'Description',
        },
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
                                hasPermission('CATEGORY_VIEW') ?
                                    <Tooltip title="Details" followCursor placement="top">
                                        <IconButton
                                            onClick={() => {

                                                //Open inventory category Details Popup
                                                setInventoryCategoryDetailData(params.row)
                                                setOpenInventoryCategoryViewPopup(true)
                                            }}
                                        >
                                            <EyeIcon />
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
     * @action : actionInventoryCategoryList
     * @description : Call inventory category list api at Initial
     */
    useEffect(() => {
        setLoadingList(true)
        dispatch(actionInventoryCategoryList({ branch_uuid: branch?.currentBranch?.uuid }))
    }, [])

    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the inventory category list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (inventoryCategoryOriginalData && inventoryCategoryOriginalData !== null && inventoryCategoryOriginalData.length > 0) {
                var filteredData = inventoryCategoryOriginalData.filter(
                    item =>
                        (item?.title && item?.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.description && item?.description.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.status && item?.status.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setInventoryCategoryData(filteredData)
                } else {
                    setInventoryCategoryData([])
                }
            }
        } else {
            setInventoryCategoryData(inventoryCategoryOriginalData)
        }
    }, [searchQuery])

    /**
     * useEffect
     * @dependency : inventoryCategoryList
     * @type : HANDLE API RESULT
     * @description : Handle the result of inventory category List API
    */
    useEffect(() => {
        if (inventoryCategoryList && inventoryCategoryList !== null) {
            dispatch(resetInventoryCategoryListResponse())
            if (inventoryCategoryList?.result === true) {
                setInventoryCategoryData(inventoryCategoryList?.response)
                setInventoryCategoryOriginalData(inventoryCategoryList?.response)
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setInventoryCategoryData([])
                setInventoryCategoryOriginalData[[]]
                switch (inventoryCategoryList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetInventoryCategoryListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: inventoryCategoryList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [inventoryCategoryList])

    return <React.Fragment>
        <Stack
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            mb={3}>
            <MyBreadcrumbs />
            <GetCountComponent
                countData={{ title1: "Total", title2: "Category", value: inventoryCategoryData && inventoryCategoryData !== null && inventoryCategoryData.length > 0 ? String(inventoryCategoryData.length).padStart(2, '0') : 0 }}
                actionData={{ buttonLabel1: "Add New", buttonLabel2: "Category", onClick: () => { setOpenAddInventoryCategoryPopup(true) } }}
                permissionKey={'CATEGORY_ADD'}
            />
        </Stack>

        <Box sx={{ borderRadius: '12px', border: `1px solid ${theme.palette.grey[200]}`, height: '720px', background: theme.palette.common.white }}>
            <ListHeaderContainer>
                <ListHeaderRightSection>
                    <SearchInput
                        id="search-client-group"
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
            ) : inventoryCategoryData && inventoryCategoryData !== null && inventoryCategoryData.length > 0 ? (
                <ListComponents
                    rows={inventoryCategoryData}
                    columns={columns}
                    isCheckbox={false}
                />
            ) : (
                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Inventory Category Found'} subTitle={''} />
            )}

        </Box>
        {
            openAddInventoryCategoryPopup &&
            <AddInventoryCategory
                open={openAddInventoryCategoryPopup}
                handleClose={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionInventoryCategoryList({ branch_uuid: branch?.currentBranch?.uuid }))
                    }
                    setOpenAddInventoryCategoryPopup(false)
                    setInventoryCategoryDetailData(null)
                }}
            />
        }
        {
            openInventoryCategoryViewPopup &&
            <InventoryCategoryDetails
                open={openInventoryCategoryViewPopup}
                objData={inventoryCategoryDetailData}
                handleClose={() => {
                    setOpenInventoryCategoryViewPopup(false)
                    setInventoryCategoryDetailData(null)

                }}
            />
        }
    </React.Fragment>
}
