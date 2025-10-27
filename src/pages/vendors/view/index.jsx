/* eslint-disable react-hooks/exhaustive-deps */
import {
    Drawer,
    Button,
    Stack,
    Divider,
    Grid,
    Box,
    IconButton,
    CircularProgress,
    useTheme,
    Tooltip,
} from "@mui/material";
import FormHeader from "../../../components/form-header";
import SectionHeader from "../../../components/section-header";
import IdBadgeIcon from "../../../assets/icons/IdBadgeIcon";
import CalenderTimeIcon from "../../../assets/icons/CalenderTimeIcon";
import PhoneCallIcon from "../../../assets/icons/PhoneCallIcon";
import AddressIcon from "../../../assets/icons/AddressIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../assets/icons/EditIcon";
import EditVendor from "../edit";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import MailIcon from "../../../assets/icons/MailIcon";
import UserCircleIcon from "../../../assets/icons/UserCircleIcon";
import DeviceDesktopIcon from "../../../assets/icons/DeviceDesktopIcon";
import { actionDeleteVendor, actionVendorDetails, actionVendorList, resetDeleteVendorResponse, resetVendorDetailsResponse } from "../../../store/vendor";
import FieldBox from "../../../components/field-box";
import { decrypt } from "../../../utils";
import EmptyContent from "../../../components/empty_content";
import TypographyComponent from "../../../components/custom-typography";
import VendorIcon from "../../../assets/icons/VendorIcon";

export default function VendorDetails({ open, objData, toggle, page }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()

    // store
    const { vendorDetails, deleteVendor } = useSelector(state => state.vendorStore)
    const { clientBranchDetails } = useSelector(state => state.branchStore)
    const { additionalFieldsDetails } = useSelector(state => state.CommonStore)

    // state
    const [openViewDeleteVendorPopup, setOpenViewDeleteVendorPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [openViewEditVendorPopup, setOpenViewEditVendorPopup] = useState(false)
    const [viewVendorData, setViewVendorData] = useState(null)
    const [vendorDetailData, setVendorDetailData] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {
            setViewLoadingDelete(false)
            if (objData?.uuid && objData?.uuid !== null) {
                setLoadingDetail(true)
                dispatch(actionVendorDetails({ uuid: objData?.uuid }))
            }
        }
    }, [open])

    /**
     * useEffect
     * @dependency : vendorDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of vendor Details API
     */
    useEffect(() => {
        if (vendorDetails && vendorDetails !== null) {
            dispatch(resetVendorDetailsResponse())
            if (vendorDetails?.result === true) {
                setLoadingDetail(false)
                setVendorDetailData(vendorDetails?.response)
            } else {
                setLoadingDetail(false)
                setVendorDetailData(null)
                switch (vendorDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorDetailsResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: vendorDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorDetails])

    /**
     * useEffect
     * @dependency : deleteVendor
     * @type : HANDLE API RESULT
     * @description : Handle the result of delete Vendor API
     */
    useEffect(() => {
        if (deleteVendor && deleteVendor !== null) {
            dispatch(resetDeleteVendorResponse())
            if (deleteVendor?.result === true) {
                setOpenViewDeleteVendorPopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: deleteVendor?.message, severity: "success" })

                handleClose('delete')
                dispatch(actionVendorList({
                    branch_uuid: clientBranchDetails?.response?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
            } else {
                setViewLoadingDelete(false)
                switch (deleteVendor?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteVendorResponse())
                        toast.dismiss()
                        showSnackbar({ message: deleteVendor?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteVendor?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteVendor])

    /**
     * 
     * @param {*} data handle close function
     */
    const handleClose = (data) => {
        toggle(data)
    }

    // Prepare merged additional fields
    const mergedAdditionalFields = useMemo(() => {
        const fields = additionalFieldsDetails?.response?.fields || []
        const values = vendorDetailData?.additional_fields || []

        // Merge by `key`
        const merged = fields.map(field => {
            const matchedValue = values.find(v => v.key === field.key)
            return {
                ...field,
                value: matchedValue?.value || "", // get value from vendor data
            }
        })

        // Also include any vendor fields not present in fields array
        values.forEach(v => {
            if (!merged.find(f => f.key === v.key)) {
                merged.push(v)
            }
        })

        // Filter out deleted
        return merged.filter(f => f.is_deleted !== 1)
    }, [additionalFieldsDetails, vendorDetailData])

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: 1100 } } }}
            >
                <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<VendorIcon stroke={theme.palette.primary[600]} size={18} />}
                        title="View Vendor Details"
                        subtitle="View and manage Vendor Information"
                        actions={[
                            hasPermission("VENDOR_DELETE") && (
                                // open delete vendor popup
                                <Tooltip title="Delete" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let details = {
                                                id: vendorDetailData.id,
                                                title: `Delete Vendor`,
                                                text: `Are you sure you want to delete this vendor? This action cannot be undone.`
                                            }
                                            setViewVendorData(details)
                                            setOpenViewDeleteVendorPopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                            hasPermission("VENDOR_EDIT") && (
                                // open edit vendor
                                <Tooltip title="Edit" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            setViewVendorData(vendorDetailData)
                                            setOpenViewEditVendorPopup(true)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                        ].filter(Boolean)}
                    />
                    <Divider sx={{ m: 2 }} />
                    {loadingDetail ? (
                        <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={30} />
                            <TypographyComponent fontSize={20} fontWeight={600}>Loading...</TypographyComponent>
                        </Stack>

                    ) : vendorDetailData && vendorDetailData !== null ? (
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
                            <SectionHeader title="Vendor Identification" progress={100} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* vendor id */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Vendor ID" value={vendorDetailData?.vendor_id} icon={<IdBadgeIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Vendor name */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Vendor Name" value={vendorDetailData?.name} icon={<UserCircleIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* status */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Status" value={vendorDetailData?.asset_status} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Vendor Details" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* employee contact */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox
                                        label="Employee Contact"
                                        value={
                                            vendorDetailData?.contact && vendorDetailData?.contact !== null ?
                                                `${vendorDetailData?.contact_country_code}${decrypt(vendorDetailData?.contact)}`
                                                : ''
                                        }
                                        icon={<PhoneCallIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Address */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Address" value={vendorDetailData?.address} icon={<AddressIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* Website URL */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Website URL" value={vendorDetailData?.website} icon={<DeviceDesktopIcon stroke={theme.palette.primary[600]} />} isLink />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Primary Contact Information" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* name */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Name" value={vendorDetailData?.primary_contact_name} icon={<UserCircleIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* designation */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox label="Designation" value={vendorDetailData?.primary_contact_designation} icon={<CalenderTimeIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* email */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox
                                        label="Email"
                                        value={vendorDetailData?.primary_contact_email && vendorDetailData?.primary_contact_email !== null ? decrypt(vendorDetailData?.primary_contact_email) : ''}
                                        icon={<MailIcon stroke={theme.palette.primary[600]} />}
                                        isLink
                                        linkType="email"
                                    />
                                </Grid>
                                {/* contact */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <FieldBox
                                        label="Contact"
                                        value={
                                            vendorDetailData?.primary_contact_country_code && vendorDetailData?.primary_contact_country_code !== null &&
                                                vendorDetailData?.primary_contact_no && vendorDetailData?.primary_contact_no !== null ?
                                                `${vendorDetailData?.primary_contact_country_code}${decrypt(vendorDetailData?.primary_contact_no)}` : ''
                                        }
                                        icon={<PhoneCallIcon stroke={theme.palette.primary[600]} />}
                                        isLink
                                        linkType="phone"
                                    />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Escalation Matrix" progress={100} sx={{ marginTop: 2 }} />
                            <Box sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {
                                    vendorDetailData?.vendor_escalation &&
                                        vendorDetailData?.vendor_escalation !== null &&
                                        vendorDetailData?.vendor_escalation.length > 0 ?
                                        vendorDetailData?.vendor_escalation?.map((item, idx) => (
                                            <React.Fragment key={item.id ?? idx}>
                                                <Grid container spacing={'2px'}>
                                                    {/* Contact Name */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                        <FieldBox
                                                            label={`Level ${item.level_id} Contact Name`}
                                                            value={item.name}
                                                            icon={<UserCircleIcon stroke={theme.palette.primary[600]} />}
                                                        />
                                                    </Grid>
                                                    {/* Designation */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                        <FieldBox
                                                            label="Designation"
                                                            value={item.designation}
                                                            icon={<CalenderTimeIcon stroke={theme.palette.primary[600]} />}
                                                        />
                                                    </Grid>
                                                    {/* Email */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                        <FieldBox
                                                            label="Email"
                                                            value={decrypt(item.email)}
                                                            icon={<MailIcon stroke={theme.palette.primary[600]} />}
                                                        />
                                                    </Grid>
                                                    {/* Contact */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                        <FieldBox
                                                            label="Contact"
                                                            value={item.contact_no && item.contact_no !== null ? `${item.country_code && item.country_code !== null ? item.country_code : ''}${decrypt(item.contact_no)}` : ''}
                                                            icon={<PhoneCallIcon stroke={theme.palette.primary[600]} />}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {idx < vendorDetailData.vendor_escalation.length - 1 && (
                                                    <Divider sx={{ my: 2 }} />
                                                )}
                                            </React.Fragment>
                                        ))
                                        :
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600], py: 2, textAlign: 'center' }}>No Escalations</TypographyComponent>
                                }
                            </Box>
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
                                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600], py: 2, textAlign: 'center' }}>
                                                No Additional Fields
                                            </TypographyComponent>
                                        </Stack>

                                    )
                                }
                            </Grid>
                        </Stack>
                    ) : (
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
            </Drawer >
            {
                openViewEditVendorPopup &&
                <EditVendor
                    open={openViewEditVendorPopup}
                    objData={viewVendorData}
                    toggle={(data) => {
                        if (data && data !== null && data === 'save') {
                            if (vendorDetailData?.uuid && vendorDetailData?.uuid !== null) {
                                dispatch(actionVendorDetails({ uuid: vendorDetailData?.uuid }))
                                dispatch(actionVendorList({
                                    branch_uuid: clientBranchDetails?.response?.uuid,
                                    page: page,
                                    limit: LIST_LIMIT
                                }))
                            }
                        }
                        setOpenViewEditVendorPopup(false)
                        setViewVendorData(null)
                    }}
                />
            }
            {
                openViewDeleteVendorPopup &&
                <AlertPopup
                    open={openViewDeleteVendorPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={viewVendorData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenViewDeleteVendorPopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                            setViewLoadingDelete(true)
                            if (vendorDetailData?.uuid && vendorDetailData?.uuid !== null) {
                                dispatch(actionDeleteVendor({
                                    uuid: vendorDetailData?.uuid
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress color="white" size={20} /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment>
    );
}
