/* eslint-disable react-hooks/exhaustive-deps */
import {
    Drawer,
    Button,
    Stack,
    Divider,
    Grid,
    IconButton,
    CircularProgress,
    useTheme,
    Tooltip,
} from "@mui/material";
import FormHeader from "../../../components/form-header";
import SectionHeader from "../../../components/section-header";
import IdBadgeIcon from "../../../assets/icons/IdBadgeIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../assets/icons/EditIcon";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import EditAsset from "../edit";
import { actionAssetDetails, actionAssetList, actionDeleteAsset, resetAssetDetailsResponse, resetDeleteAssetResponse } from "../../../store/asset";
import moment from "moment";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import UserCircleIcon from "../../../assets/icons/UserCircleIcon";
import AddressIcon from "../../../assets/icons/AddressIcon";
import FieldBox from "../../../components/field-box";
import EmptyContent from "../../../components/empty_content";
import TypographyComponent from "../../../components/custom-typography";
import AssetIcon from "../../../assets/icons/AssetIcon";

export default function AssetDetails({ open, objData, toggle, page }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()

    // store
    const { assetDetails, deleteAsset } = useSelector(state => state.AssetStore)
    const { clientBranchDetails } = useSelector(state => state.branchStore)
    const { additionalFieldsDetails } = useSelector(state => state.CommonStore)

    // state
    const [openViewDeleteAssetPopup, setOpenViewDeleteAssetPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [openViewEditAssetPopup, setOpenViewEditAssetPopup] = useState(false)
    const [viewAssetData, setViewAssetData] = useState(null)
    const [assetDetailData, setAssetDetailData] = useState(null)
    const [loadingAssetDetail, setLoadingAssetDetail] = useState(false)

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {
            setViewLoadingDelete(false)
            if (objData && objData !== null) {
                setLoadingAssetDetail(true)
                dispatch(actionAssetDetails({ uuid: objData?.uuid }))
            }
        }
    }, [open])

    /**
      * useEffect
      * @dependency : assetDetails
      * @type : HANDLE API RESULT
      * @description : Handle the result of asset Details API
      */
    useEffect(() => {
        if (assetDetails && assetDetails !== null) {
            dispatch(resetAssetDetailsResponse())
            if (assetDetails?.result === true) {
                setLoadingAssetDetail(false)
                setAssetDetailData(assetDetails?.response)
            } else {
                setLoadingAssetDetail(false)
                setAssetDetailData(null)
                switch (assetDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetDetailsResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: assetDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetDetails])

    /**
      * useEffect
      * @dependency : deleteAsset
      * @type : HANDLE API RESULT
      * @description : Handle the result of delete Asset API
      */
    useEffect(() => {
        if (deleteAsset && deleteAsset !== null) {
            dispatch(resetDeleteAssetResponse())
            if (deleteAsset?.result === true) {
                setOpenViewDeleteAssetPopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: deleteAsset?.message, severity: "success" })

                handleClose('delete')
                dispatch(actionAssetList({
                    branch_uuid: clientBranchDetails?.response?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
            } else {
                setViewLoadingDelete(false)
                switch (deleteAsset?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteAssetResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteAsset?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteAsset])

    // handle close function
    const handleClose = (data) => {
        toggle(data)
    }

    // Prepare merged additional fields
    const mergedAdditionalFields = useMemo(() => {
        const fields = additionalFieldsDetails?.response?.fields || []
        const values = assetDetailData?.additional_fields || []

        // Merge by `key`
        const merged = fields.map(field => {
            const matchedValue = values.find(v => v.key === field.key)
            return {
                ...field,
                value: matchedValue?.value || "", // get value from asset data
            }
        })

        // Also include any asset fields not present in fields array
        values.forEach(v => {
            if (!merged.find(f => f.key === v.key)) {
                merged.push(v)
            }
        })

        // Filter out deleted
        return merged.filter(f => f.is_deleted !== 1)
    }, [additionalFieldsDetails, assetDetailData])

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: 1100 } } }}
            >

                <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<AssetIcon stroke={theme.palette.primary[600]} size={20} />}
                        title="View Asset Details"
                        subtitle="View and manage asset information"
                        actions={[
                            hasPermission("ASSET_DELETE") && (
                                // open delete asset popup
                                <Tooltip title="Delete" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let details = {
                                                uuid: assetDetailData.uuid,
                                                title: `Delete Asset`,
                                                text: `Are you sure you want to delete this asset? This action cannot be undone.`
                                            }
                                            setViewAssetData(details)
                                            setOpenViewDeleteAssetPopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                            hasPermission("ASSET_EDIT") && (
                                // open edit asset
                                <Tooltip title="Edit" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            setViewAssetData(assetDetailData)
                                            setOpenViewEditAssetPopup(true)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                        ].filter(Boolean)}
                    />
                    <Divider sx={{ m: 2 }} />
                    {loadingAssetDetail ? (
                        <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={30} />
                            <TypographyComponent fontSize={20} fontWeight={600}>Loading...</TypographyComponent>
                        </Stack>

                    ) : assetDetailData && assetDetailData !== null ? (
                        <Stack
                            sx={{
                                px: 2,
                                flexGrow: 1,
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '2px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#ccc',
                                    borderRadius: '2px'
                                }
                            }}
                        >
                            <SectionHeader title="Basic Asset Information" progress={100} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Asset ID */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Asset ID" value={assetDetailData?.asset_id && assetDetailData?.asset_id !== null ? assetDetailData?.asset_id : ''} icon={<IdBadgeIcon stroke1={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Asset Description */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox type="description" length={15} label="Asset Description" value={assetDetailData?.asset_description && assetDetailData?.asset_description !== null ? assetDetailData?.asset_description : ''} />
                                </Grid>
                                {/* Asset type */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Asset Type" value={assetDetailData?.type && assetDetailData?.type !== null ? assetDetailData?.type : ''} />
                                </Grid>
                                {/* Asset Sub Type */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Asset Sub Type" value={assetDetailData?.sub_type && assetDetailData?.sub_type !== null ? assetDetailData?.sub_type : ''} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Technical Specifications" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Asset Make */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Asset Make" value={assetDetailData?.make && assetDetailData?.make !== null ? assetDetailData?.make : ''} />
                                </Grid>
                                {/* Asset Model */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Asset Model" value={assetDetailData?.model && assetDetailData?.model !== null ? assetDetailData?.model : ''} />
                                </Grid>
                                {/* Asset sr. Number */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Asset Sr. Number" value={assetDetailData?.serial_no && assetDetailData?.serial_no !== null ? assetDetailData?.serial_no : ''} />
                                </Grid>
                                {/* Asset Rating */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Asset Rating/Capacity" value={assetDetailData?.rating_capacity && assetDetailData?.rating_capacity !== null ? assetDetailData?.rating_capacity : ''} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Vendor & Commissioning Details" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* vendor */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Vendor" value={assetDetailData?.vendor && assetDetailData?.vendor !== null ? assetDetailData?.vendor : ''} icon={<IdBadgeIcon stroke1={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Manufacturing Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Manufacturing Date" value={assetDetailData?.manufacturing_date && assetDetailData?.manufacturing_date !== null ? moment(assetDetailData?.manufacturing_date).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Installation Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Installation Date" value={assetDetailData?.installation_date && assetDetailData?.installation_date !== null ? moment(assetDetailData?.installation_date).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Commissioning Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Commissioning Date" value={assetDetailData?.commissioning_date && assetDetailData?.commissioning_date !== null ? moment(assetDetailData?.commissioning_date).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Warranty & AMC Coverage" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Warranty Start Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Warranty Start Date" value={assetDetailData?.warranty_start_date && assetDetailData?.warranty_start_date !== null ? moment(assetDetailData?.warranty_start_date).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Warranty Expiry Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Warranty Expiry Date" value={assetDetailData?.warranty_expiry_date && assetDetailData?.warranty_expiry_date !== null ? moment(assetDetailData?.warranty_expiry_date).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* AMC Start Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="AMC Start Date" value={assetDetailData?.amc_start_date && assetDetailData?.amc_start_date !== null ? moment(assetDetailData?.amc_start_date).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* AMC Expiry Date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="AMC Expiry Date" value={assetDetailData?.amc_expiry_date && assetDetailData?.amc_expiry_date !== null ? moment(assetDetailData?.amc_expiry_date).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Ownership & Responsibility" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Asset Owner */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Asset Owner" value={assetDetailData?.asset_owner && assetDetailData?.asset_owner !== null ? assetDetailData?.asset_owner : ''} icon={<UserCircleIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Asset Custodian */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Asset Custodian" value={assetDetailData?.asset_custodian && assetDetailData?.asset_custodian !== null ? assetDetailData?.asset_custodian : ''} icon={<UserCircleIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Lifecycle & End-of-Life" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Asset End Life Selection */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Asset End Life Selection" value={assetDetailData?.asset_end_life_selection && assetDetailData?.asset_end_life_selection !== null ? moment(assetDetailData?.asset_end_life_selection).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Asset End Life Period */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Asset End Life Period" value={assetDetailData?.asset_end_life_period && assetDetailData?.asset_end_life_period !== null ? moment(assetDetailData?.asset_end_life_period).format('DD/MM/YYYY') : ''} icon={<CalendarIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Location & Status" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Location */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Location" value={assetDetailData?.location && assetDetailData?.location !== null ? assetDetailData?.location : ''} icon={<AddressIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Status */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <FieldBox label="Status" value={assetDetailData?.status && assetDetailData?.status !== null ? assetDetailData?.status : ''} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Additional Fields" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {
                                    mergedAdditionalFields && mergedAdditionalFields.length > 0 ? (
                                        mergedAdditionalFields.map((obj, idx) => (
                                            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                                <FieldBox label={obj?.label} value={obj?.value} />
                                            </Grid>
                                        ))
                                    ) : (
                                        <Stack sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <TypographyComponent sx={{ fontSize: 16, fontWeight: 400, color: theme.palette.grey[600], py: 2, textAlign: 'center' }}>
                                                No Additional Fields
                                            </TypographyComponent>
                                        </Stack>
                                    )
                                }
                            </Grid>
                        </Stack>)
                        : (
                            <Stack sx={{ height: '100%' }}>
                                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Details Found'} subTitle={''} />
                            </Stack>
                        )}
                    <Divider sx={{ m: 2 }} />
                    <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                        <Button
                            sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                            onClick={handleClose}
                            variant='contained'
                        >
                            Close
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
            {
                openViewEditAssetPopup &&
                <EditAsset
                    open={openViewEditAssetPopup}
                    objData={viewAssetData}
                    toggle={(data) => {
                        if (data && data !== null && data === 'save') {
                            dispatch(actionAssetDetails({ uuid: objData?.uuid }))
                            dispatch(actionAssetList({
                                branch_uuid: clientBranchDetails?.response?.uuid,
                                page: page,
                                limit: LIST_LIMIT
                            }))
                        }
                        setOpenViewEditAssetPopup(false)
                        setViewAssetData(null)
                    }}
                />
            }
            {
                openViewDeleteAssetPopup &&
                <AlertPopup
                    open={openViewDeleteAssetPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                    color={theme.palette.error[600]}
                    objData={viewAssetData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenViewDeleteAssetPopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                            setViewLoadingDelete(true)
                            if (assetDetailData?.uuid && assetDetailData?.uuid !== null) {
                                dispatch(actionDeleteAsset({
                                    uuid: assetDetailData?.uuid
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment>
    );
}
