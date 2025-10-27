/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, Box, Tooltip, IconButton, useTheme, InputAdornment } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from "../../../assets/icons/SearchIcon";
import AddVendor from "../add";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED, LIST_LIMIT } from "../../../constants";
import toast from "react-hot-toast";
import FullscreenLoader from '../../../components/fullscreen-loader';
import EmptyContent from "../../../components/empty_content";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import EyeIcon from "../../../assets/icons/EyeIcon";
import VendorDetails from "../view";
import { actionMasterCountryCodeList, actionVendorList, resetVendorListResponse } from "../../../store/vendor";
import { FilterButton, ListHeaderContainer, ListHeaderRightSection, SearchInput } from "../../../components/common";
import GetCountComponent from "../../../components/get-count-component";
import { decrypt } from "../../../utils";
import FilterModal from "../../../components/filters";
import CloseIcon from "../../../assets/icons/CloseIcon";
import FormHeader from "../../../components/form-header";
import AdditionalFieldsPopup from "../../../components/additional-fields";
import { actionAdditionalFieldsDetails, resetAdditionalFieldsDetailsResponse } from "../../../store/common";
import TypographyComponent from "../../../components/custom-typography";
import VendorIcon from "../../../assets/icons/VendorIcon";
import ServerSideListComponents from "../../../components/server-side-list-component"
import MyBreadcrumbs from "../../../components/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../../hooks/useBranch";

export default function VendorList() {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const branch = useBranch()
    const { logout, hasPermission } = useAuth()

    // store
    const { vendorList } = useSelector(state => state.vendorStore)

    // state
    const [vendorOptions, setVendorOptions] = useState([])
    const [vendorOriginalData, setVendorOriginalData] = useState([])
    const [openAddVendorPopup, setOpenAddVendorPopup] = useState(false)
    const [vendorData, setVendorData] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [openVendorDetailsPopup, setOpenVendorDetailsPopup] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filtersPopup, setFiltersPopup] = useState(false)
    const [filteredData, setFilteredData] = useState(null)
    const [openVendorAdditionalFieldsPopup, setOpenVendorAdditionalFieldsPopup] = useState(false)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filterConfig] = useState([
        {
            "name": "vendor_id",
            "label": "Vendor Id",
            "type": "textfield",
            "value": ""
        },
        {
            "name": "name",
            "label": "Name",
            "type": "textfield",
            "value": ""
        },
        {
            "name": "email",
            "label": "Email",
            "type": "textfield",
            "value": ""
        },
        {
            "name": "contact",
            "label": "Contact",
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
        { field: "name", headerName: "Vendor Name", flex: 0.1 },
        { field: "vendor_id", headerName: "Vendor Id", flex: 0.1 },
        {
            flex: 0.1,
            field: "primary_contact_no",
            headerName: "Phone",
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                            {decrypt(params.row.primary_contact_no)}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: "primary_contact_email",
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
                            title={decrypt(params.row.primary_contact_email)}
                        >
                            {decrypt(params.row.primary_contact_email)}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.02,
            sortable: false,
            field: "",
            headerName: "Action",
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {
                                hasPermission('VENDOR_DETAILS') ?
                                    <Tooltip title="Details" followCursor placement="top">
                                        <IconButton
                                            onClick={() => {
                                                setVendorData(params.row)
                                                setOpenVendorDetailsPopup(true)
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
            dispatch(actionMasterCountryCodeList())
            dispatch(actionAdditionalFieldsDetails({
                type: 'Vendor',
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
            dispatch(actionVendorList({
                branch_uuid: branch?.currentBranch?.uuid,
                page: page,
                limit: LIST_LIMIT
            }))
        }
    }, [branch?.currentBranch?.uuid, page])

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
            if (vendorOriginalData && vendorOriginalData !== null && vendorOriginalData.length > 0) {
                var filteredData = vendorOriginalData.filter(
                    item =>
                        (item?.name && item?.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.vendor_id && item?.vendor_id.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.primary_contact_no && decrypt(item?.primary_contact_no).toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.primary_contact_email && decrypt(item?.primary_contact_email).toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setVendorOptions(filteredData)
                } else {
                    setVendorOptions([])
                }
            }
        } else {
            setVendorOptions(vendorOriginalData)
        }
    }, [searchQuery])

    /**
     * useEffect
     * @dependency : vendorList
     * @type : HANDLE API RESULT
     * @description : Handle the result of vendor List API
     */
    useEffect(() => {
        if (vendorList && vendorList !== null) {
            dispatch(resetVendorListResponse())
            if (vendorList?.result === true) {
                setVendorOptions(vendorList?.response?.vendors)
                setVendorOriginalData(vendorList?.response?.vendors)
                setLoadingList(false)
                setTotal(vendorList?.response?.total)
            } else {
                setLoadingList(false)
                setVendorOptions([])
                setVendorOriginalData[[]]
                switch (vendorList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: vendorList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorList])

    return <React.Fragment>
        <Stack
            flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
            justifyContent={'space-between'}
            mb={3}>
            <MyBreadcrumbs />
            <GetCountComponent
                countData={{ title1: "Total", title2: "Vendor", value: total && total !== null ? String(total).padStart(2, '0') : 0 }}
                actionData={{
                    buttonLabel1: "Add New", buttonLabel2: "Vendor", onClick: () => {
                        // open add vendor
                        setOpenAddVendorPopup(true)
                    }
                }}
                bulkAction={{
                    bulkButtonLabel1: "Vendor", bulkButtonLabel2: "Bulk Upload", onClick: () => {
                        // redirect bulk upload
                        navigate('bulk-upload')
                    }
                }}
                permissionKey={'VENDOR_ADD'}
                bulkPermission={'VENDOR_BULK_UPLOAD'}
                additionalPermission={'VENDOR_ADDITIONAL_FIELDS'}
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
                                    dispatch(actionVendorList({
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
            ) : vendorOptions && vendorOptions !== null && vendorOptions.length > 0 ? (
                <ServerSideListComponents
                    rows={vendorOptions}
                    height={520}
                    columns={columns}
                    isCheckbox={false}
                    total={total}
                    page={page}
                    onPageChange={setPage}
                    pageSize={LIST_LIMIT}
                    onChange={(selectedIds) => {
                        console.log("Selected row IDs in VendorList:", selectedIds);
                    }}
                />
            ) : (
                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Vendor Found'} subTitle={''} />
            )}

        </Box>
        {
            openAddVendorPopup &&
            <AddVendor
                open={openAddVendorPopup}
                toggle={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionVendorList({
                            branch_uuid: branch?.currentBranch?.uuid,
                            page: page,
                            limit: LIST_LIMIT
                        }))
                        setFilteredData(null)
                    }
                    setOpenAddVendorPopup(false)
                    setVendorData(null)
                }}
            />
        }
        {
            openVendorDetailsPopup &&
            <VendorDetails
                open={openVendorDetailsPopup}
                objData={vendorData}
                page={page}
                toggle={(data) => {
                    setOpenVendorDetailsPopup(false)
                    setVendorData(null)
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
                    dispatch(actionVendorList({
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

                dispatch(actionVendorList(objData))
                setFilteredData(data)
            }}
        />
        <AdditionalFieldsPopup
            open={openVendorAdditionalFieldsPopup}
            objDetail={{ type: "Vendor", branch_uuid: branch?.currentBranch?.uuid, client_uuid: branch?.currentBranch?.client_uuid }}
            onClose={() => {
                setOpenVendorAdditionalFieldsPopup(false)
            }}
        />
    </React.Fragment>
}
