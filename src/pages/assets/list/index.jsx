/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, Box, Tooltip, IconButton, useTheme, InputAdornment } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from "../../../assets/icons/SearchIcon";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import toast from "react-hot-toast";
import FullscreenLoader from '../../../components/fullscreen-loader';
import EmptyContent from "../../../components/empty_content";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import EyeIcon from "../../../assets/icons/EyeIcon";
import GetCountComponent from "../../../components/get-count-component";
import { FilterButton, ListHeaderContainer, ListHeaderRightSection, SearchInput } from "../../../components/common";
import AddAsset from "../add";
import AssetDetails from "../view";
import { actionAssetList, resetAssetListResponse } from "../../../store/asset";
import FilterModal from "../../../components/filters";
import { actionVendorMasterList, resetVendorMasterListResponse } from "../../../store/vendor";
import CloseIcon from "../../../assets/icons/CloseIcon";
import AdditionalFieldsPopup from "../../../components/additional-fields";
import { actionAdditionalFieldsDetails, resetAdditionalFieldsDetailsResponse } from "../../../store/common";
import ServerSideListComponents from "../../../components/server-side-list-component";
import MyBreadcrumbs from "../../../components/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../../hooks/useBranch";

export default function AssetList() {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const branch = useBranch()
    const { logout, hasPermission } = useAuth()

    // store
    const { assetList } = useSelector(state => state.AssetStore)
    const { vendorMasterList } = useSelector(state => state.vendorStore)

    // asset
    const [assetOptions, setAssetOptions] = useState([])
    const [assetOriginalData, setAssetOriginalData] = useState([])
    const [openAddAssetPopup, setOpenAddAssetPopup] = useState(false)
    const [assetData, setAssetData] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [openAssetDetailsPopup, setOpenAssetDetailsPopup] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filtersPopup, setFiltersPopup] = useState(false)
    const [filteredData, setFilteredData] = useState(null)
    const [openAssetAdditionalFieldsPopup, setOpenAssetAdditionalFieldsPopup] = useState(false)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filterConfig, setFilterConfig] = useState([
        {
            "name": "asset_id",
            "label": "Asset Id",
            "type": "textfield",
            "value": ""
        },
        {
            "name": "vendor_id",
            "label": "Vendor",
            "type": "select",
            "data": [],
            "dataKey": "id",
            "labelKey": "name",
            "value": ""
        },
        {
            "name": "make",
            "label": "Asset Make",
            "type": "textfield",
            "value": ""
        },
        {
            "name": "model",
            "label": "Asset Model",
            "type": "textfield",
            "value": ""
        },
        {
            "name": "asset_status",
            "label": "Status",
            "type": "select",
            "data": [
                {
                    "id": "Active",
                    "name": "Active"
                },
                {
                    "id": "Inactive",
                    "name": "Inactive"
                }
            ],
            "dataKey": "id",
            "labelKey": "name",
            "value": ""
        },
    ])

    const columns = [
        { field: "asset_description", headerName: "Asset Description", flex: 0.1 },
        { field: "asset_id", headerName: "Asset Id", flex: 0.1 },
        { field: "type", headerName: "Type", flex: 0.1 },
        { field: "vendor", headerName: "Vendor/Supplier", flex: 0.1 },
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
                                hasPermission('ASSET_DETAILS') ?
                                    <Tooltip title="Details" followCursor placement="top">
                                        {/* open asset details */}
                                        <IconButton
                                            onClick={() => {
                                                setAssetData(params.row)
                                                setOpenAssetDetailsPopup(true)
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
     * initial render
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            setLoadingList(true)
            dispatch(actionAdditionalFieldsDetails({
                type: 'Asset',
                branch_uuid: branch?.currentBranch?.uuid,
                client_uuid: branch?.currentBranch?.client_uuid,
            }))
        }
        return () => {
            dispatch(resetAdditionalFieldsDetailsResponse())
        }
    }, [branch?.currentBranch?.uuid])

    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && page && page !== null) {
            dispatch(actionAssetList({
                branch_uuid: branch?.currentBranch?.uuid,
                page: page,
                limit: LIST_LIMIT
            }))
        }
    }, [branch?.currentBranch?.uuid, page])

    // vendor master list API call
    useEffect(() => {
        if (branch?.currentBranch?.client_id && branch?.currentBranch?.client_id !== null && branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionVendorMasterList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }

    }, [branch?.currentBranch?.client_id, branch?.currentBranch?.uuid])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the Assets list
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (assetOriginalData && assetOriginalData !== null && assetOriginalData.length > 0) {
                var filteredData = assetOriginalData.filter(
                    item =>
                        (item?.asset_description && item?.asset_description.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.asset_id && item?.asset_id.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.type && item?.type.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.vendor && item?.vendor.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setAssetOptions(filteredData)
                } else {
                    setAssetOptions([])
                }
            }
        } else {
            setAssetOptions(assetOriginalData)
        }
    }, [searchQuery])

    /**
      * useEffect
      * @dependency : assetList
      * @type : HANDLE API RESULT
      * @description : Handle the result of asset List API
      */
    useEffect(() => {
        if (assetList && assetList !== null) {
            dispatch(resetAssetListResponse())
            if (assetList?.result === true) {
                setAssetOptions(assetList?.response?.assets)
                setAssetOriginalData(assetList?.response?.assets)
                setLoadingList(false)
                setTotal(assetList?.response?.total)
            } else {
                setLoadingList(false)
                setAssetOptions([])
                setAssetOriginalData[[]]
                switch (assetList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: assetList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetList])

    /**
     * useEffect
     * @dependency : vendorMasterList
     * @type : HANDLE API RESULT
     * @description : Handle the result of vendor Master List API
     */
    useEffect(() => {
        if (vendorMasterList && vendorMasterList !== null) {
            dispatch(resetVendorMasterListResponse())
            if (vendorMasterList?.result === true) {
                let dataConfig = Object.assign(filterConfig, [])
                let currentIndex = dataConfig.findIndex(data => data?.name === 'vendor_id')
                let currentObj = Object.assign(dataConfig[currentIndex], {})
                currentObj.data = vendorMasterList?.response
                currentObj.dataKey = 'id'
                currentObj.labelKey = 'name'
                dataConfig[currentIndex] = currentObj
                setFilterConfig(dataConfig)

                // setVendorMaster(vendorMasterList?.response)
            } else {
                // setVendorMaster([])
                switch (vendorMasterList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorMasterListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: vendorMasterList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorMasterList])

    return <React.Fragment>
        <Stack
            flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            mb={3}>
            <MyBreadcrumbs />
            <GetCountComponent
                countData={{ title1: "Total", title2: "Asset", value: total && total !== null ? String(total).padStart(2, '0') : 0 }}
                actionData={{
                    buttonLabel1: "Add New", buttonLabel2: "Asset", onClick: () => {
                        // open add asset
                        setOpenAddAssetPopup(true)
                    }
                }}
                bulkAction={{
                    bulkButtonLabel1: "Asset", bulkButtonLabel2: "Bulk Upload", onClick: () => {
                        // redirect bulk upload
                        navigate('bulk-upload')
                    }
                }}
                permissionKey={'ASSET_ADD'}
                bulkPermission={'ASSET_BULK_UPLOAD'}
                additionalPermission={'ASSET_ADDITIONAL_FIELDS'}
            />
        </Stack>

        <Box sx={{ height: '720px', background: theme.palette.common.white }}>
            <ListHeaderContainer>
                <ListHeaderRightSection>
                    <SearchInput
                        id="search-assets"
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
                    <FilterButton
                        variant="outlined"
                        color={filteredData ? theme.palette.common.white : theme.palette.text.primary}  // text color
                        sx={{
                            background: filteredData && filteredData !== null ? theme.palette.primary[600] : '',
                            '& .MuiButton-startIcon svg': {
                                color: filteredData ? theme.palette.common.white : theme.palette.text.primary,
                            },
                        }}
                        startIcon={<FilterListIcon />}
                        onClick={() => {
                            setFiltersPopup(true)
                        }}
                    >
                        Filters
                    </FilterButton>
                    {
                        filteredData && filteredData !== null ?


                            <Tooltip title="Remove filter" arrow>
                                <IconButton aria-label="close" sx={{
                                    color: "#fff", // icon color
                                    px: 1.5,
                                    backgroundColor: theme.palette.primary[600],
                                    borderRadius: 1,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary[700],
                                    },
                                    boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                                }} onClick={() => {
                                    setFilteredData(null)
                                    setLoadingList(true)
                                    dispatch(actionAssetList({
                                        branch_uuid: branch?.currentBranch?.uuid,
                                        page: page,
                                        limit: LIST_LIMIT
                                    }))
                                }} >
                                    <CloseIcon size={14} stroke={'white'} />
                                </IconButton>
                            </Tooltip>
                            :
                            <></>
                    }

                </ListHeaderRightSection>
            </ListHeaderContainer>
            {loadingList ? (
                <FullscreenLoader open={true} />
            ) : assetOptions && assetOptions !== null && assetOptions.length > 0 ? (
                <ServerSideListComponents
                    rows={assetOptions}
                    columns={columns}
                    isCheckbox={false}
                    total={total}
                    page={page}
                    onPageChange={setPage}
                    pageSize={LIST_LIMIT}
                    onChange={(selectedIds) => {
                        console.log("Selected row IDs in AssetList:", selectedIds);
                    }}
                />
            ) : (
                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Asset Found'} subTitle={''} />
            )}

        </Box>
        {
            openAddAssetPopup &&
            <AddAsset
                open={openAddAssetPopup}
                toggle={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionAssetList({
                            branch_uuid: branch?.currentBranch?.uuid,
                            page: page,
                            limit: LIST_LIMIT
                        }))
                        setFilteredData(null)
                    }
                    setOpenAddAssetPopup(false)
                    setAssetData(null)
                }}
            />
        }
        {
            openAssetDetailsPopup &&
            <AssetDetails
                open={openAssetDetailsPopup}
                objData={assetData}
                page={page}
                toggle={(data) => {
                    setOpenAssetDetailsPopup(false)
                    setAssetData(null)
                    if (data == 'delete') {
                        setFilteredData(null)
                    }

                }}
            />
        }
        <FilterModal
            open={filtersPopup}
            onClose={(data) => {
                setFiltersPopup(false)
                if (data == 'reset') {
                    setFilteredData(null)
                    setLoadingList(true)
                    dispatch(actionAssetList({
                        branch_uuid: branch?.currentBranch?.uuid,
                        page: page,
                        limit: LIST_LIMIT
                    }))
                }
            }}
            filteredData={filteredData}
            fieldsArray={filterConfig}
            onApply={(data) => {
                let objData = Object.assign({}, data)
                objData.branch_uuid = branch?.currentBranch?.uuid
                objData.page = page
                objData.limit = LIST_LIMIT
                dispatch(actionAssetList(objData))
                setFilteredData(data)
            }}
        />
        <AdditionalFieldsPopup
            open={openAssetAdditionalFieldsPopup}
            objDetail={{ type: "Asset", branch_uuid: branch?.currentBranch?.uuid, client_uuid: branch?.currentBranch?.client_uuid }}
            onClose={() => {
                setOpenAssetAdditionalFieldsPopup(false)
            }}
        />
    </React.Fragment>
}
