/* eslint-disable react-hooks/exhaustive-deps */
import {
    Drawer,
    Button,
    Stack,
    Divider, IconButton, useTheme,
    Grid,
    Box, Avatar,
    Tooltip,
    CircularProgress
} from "@mui/material";
import FormHeader from "../../../components/form-header";
import CloseIcon from "../../../assets/icons/CloseIcon";
import TicketIcon from "../../../assets/icons/TicketIcon";
import TypographyComponent from "../../../components/custom-typography";
import React, { useEffect, useState } from "react";
import SectionHeader from "../../../components/section-header";
import FieldBox from "../../../components/field-box";
import { ShowHistoryComponent } from "../../../components/show-list-component";
import ChangeTicketStatus from "../change-status";
import { useDispatch, useSelector } from "react-redux";
import { actionGetTicketDetails, actionTicketDelete, resetGetTicketDetailsResponse, resetTicketDeleteResponse, actionTicketVendorContactsUpdate, resetTicketVendorContactsUpdateResponse } from "../../../store/tickets";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import { AntSwitch } from "../../../components/common";
import AddUpdateTicket from "../add-updates";
import moment from "moment";

export const ViewTicket = ({ open, handleClose, detail }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { showSnackbar } = useSnackbar()
    const { logout } = useAuth()

    const { getTicketDetails, ticketDelete, ticketVendorContactsUpdate } = useSelector(state => state.ticketsStore)
    const [ticketDetailsData, setTicketDetailsData] = useState(null)
    const [ticketsHistory, setTicketsHistory] = useState([])
    const [openChangeTicketStatusPopup, setOpenChangeTicketStatusPopup] = useState(false)
    const [openViewDeleteTicketPopup, setOpenViewDeleteTicketPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [viewTicketData, setViewTicketData] = useState(null)
    const [vendorContactType, setVendorContactType] = useState('view')
    const [vendorEscalationDetailsData, setVendorEscalationDetailsData] = useState([])
    const [loadingVendorUpdate, setLoadingVendorUpdate] = useState(false)
    const [openAddUpdateTicketPopup, setOpenAddUpdateTicketPopup] = useState(false)
    const [addUpdateType, setAddUpdateType] = useState(null)
    const [selectedEntryUpdateDetails, setSelectedEntryUpdateDetails] = useState(null)
    // const [openTicketUpdateDeletePopup, setOpenTicketUpdateDeletePopup] = useState(false)

    useEffect(() => {
        if (open === true) {
            setVendorContactType('view')
            dispatch(actionGetTicketDetails({
                uuid: detail?.uuid
            }))
        }

    }, [open, detail])

    /**
       * useEffect
       * @dependency : getTicketDetails
       * @type : HANDLE API RESULT
       * @description : Handle the result of ticket details API
       */
    useEffect(() => {
        if (getTicketDetails && getTicketDetails !== null) {
            dispatch(resetGetTicketDetailsResponse())
            if (getTicketDetails?.result === true) {
                setTicketDetailsData(getTicketDetails?.response)
                let vendors = Object.assign([], getTicketDetails?.response?.vendor_escalation)
                let arrSelected = getTicketDetails?.response?.vendor_escalation_json?.filter(obj => obj?.is_selected === 1)?.map(obj => obj?.id)?.join(',')

                // Update vendors where IDs match
                vendors = vendors.map(vendor => ({
                    ...vendor,
                    is_selected: arrSelected.includes(vendor.id) ? 1 : 0
                }));

                setVendorEscalationDetailsData(vendors)
                setTicketsHistory(getTicketDetails?.response?.history_by_status)
            } else {
                setTicketDetailsData(null)
                setTicketsHistory(null)
                setVendorEscalationDetailsData([])
                switch (getTicketDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetTicketDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getTicketDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getTicketDetails])

    /**
     * useEffect
     * @dependency : ticketDelete
     * @type : HANDLE API RESULT
     * @description : Handle the result of delete ticket API
     */
    useEffect(() => {
        if (ticketDelete && ticketDelete !== null) {
            dispatch(resetTicketDeleteResponse())
            if (ticketDelete?.result === true) {
                setOpenViewDeleteTicketPopup(false)
                setViewLoadingDelete(false)
                setViewTicketData(null)
                showSnackbar({ message: ticketDelete?.message, severity: "success" })
                handleClose('delete')
            } else {
                setViewLoadingDelete(false)
                switch (ticketDelete?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTicketDeleteResponse())
                        showSnackbar({ message: ticketDelete?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: ticketDelete?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [ticketDelete])

    /**
     * useEffect
     * @dependency : ticketVendorContactsUpdate
     * @type : HANDLE API RESULT
     * @description : Handle the result of ticket Vendor Contacts Update API
     */
    useEffect(() => {
        if (ticketVendorContactsUpdate && ticketVendorContactsUpdate !== null) {
            dispatch(resetTicketVendorContactsUpdateResponse())
            if (ticketVendorContactsUpdate?.result === true) {
                setLoadingVendorUpdate(false)
                setVendorContactType('view')
                dispatch(actionGetTicketDetails({
                    uuid: detail?.uuid
                }))
                showSnackbar({ message: ticketVendorContactsUpdate?.message, severity: "success" })
            } else {
                setLoadingVendorUpdate(false)
                switch (ticketVendorContactsUpdate?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTicketVendorContactsUpdateResponse())
                        showSnackbar({ message: ticketVendorContactsUpdate?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: ticketVendorContactsUpdate?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [ticketVendorContactsUpdate])

    const handleEditClick = (entry) => {
        setAddUpdateType('Edit')
        setSelectedEntryUpdateDetails(entry);     // store clicked item
        setOpenAddUpdateTicketPopup(true);      // open popup
    };

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: '100%', xl: '86%' } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<TicketIcon stroke={theme.palette.primary[600]} size={20} />}
                    title={`Ticket ${ticketDetailsData?.ticket_no && ticketDetailsData?.ticket_no !== null ? `#${ticketDetailsData?.ticket_no}` : ''}`}
                    subtitle=""
                    actions={[
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                    rightSection={<Stack flexDirection={'row'} gap={3} sx={{ mx: 3 }}>
                        <Tooltip title="Delete" followCursor placement="top">
                            {/* open setting delete popup */}
                            <IconButton
                                onClick={() => {
                                    let objData = {
                                        uuid: ticketDetailsData?.ticket_uuid,
                                        title: `Delete Ticket`,
                                        text: `Are you sure you want to delete this ticket? This action cannot be undone.`
                                    }
                                    setViewTicketData(objData)
                                    setOpenViewDeleteTicketPopup(true)
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>}
                />
                <Divider sx={{ m: 2 }} />
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
                    <Grid container spacing={'24px'}>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 9, xl: 9 }}>
                            <Stack sx={{
                                height: 720,
                                overflowY: "auto",
                                scrollbarWidth: "thin",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: theme.palette.grey[400],
                                    borderRadius: "3px",
                                },
                            }}>


                                {/* --- Ticket Information Section --- */}
                                <SectionHeader title="Ticket Information" show_progress={0} sx={{ marginTop: 2.5 }} />
                                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, marginTop: '-4px' }}>
                                    <Grid container>
                                        {/* Row 1: Ticket No, Asset Type, Asset Name, Location */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Ticket No"
                                                value={ticketDetailsData?.ticket_no && ticketDetailsData?.ticket_no !== null ? ticketDetailsData?.ticket_no : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Asset Type"
                                                value={ticketDetailsData?.asset_type && ticketDetailsData?.asset_type !== null ? ticketDetailsData?.asset_type : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Asset Name"
                                                value={ticketDetailsData?.asset_name && ticketDetailsData?.asset_name !== null ? ticketDetailsData?.asset_name : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Location"
                                                value={ticketDetailsData?.location && ticketDetailsData?.location !== null ? ticketDetailsData?.location : '--'}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                            <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }} />
                                        </Grid>

                                        {/* Row 2: Priority, Category, Created On, Last Updated */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Priority"
                                                value={ticketDetailsData?.priority && ticketDetailsData?.priority !== null ? ticketDetailsData?.priority : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Category"
                                                value={ticketDetailsData?.category && ticketDetailsData?.category !== null ? ticketDetailsData?.category : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Created On"
                                                value={ticketDetailsData?.created_on && ticketDetailsData?.created_on !== null ? moment(ticketDetailsData?.created_on, 'YYYY-MM-DD').format('DD MMM YYYY hh:mm A') : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Last Updated"
                                                value={ticketDetailsData?.last_updated && ticketDetailsData?.last_updated !== null ? moment(ticketDetailsData?.last_updated, 'YYYY-MM-DD').format('DD MMM YYYY hh:mm A') : '--'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>

                                {/* Linked Asset Section */}
                                <SectionHeader title="Linked Asset" show_progress={0} sx={{ marginTop: 2.5 }} />
                                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, marginTop: '-4px' }}>
                                    <Grid container>
                                        {/* Row 1: Asset ID, Make, Model, Rating. */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Asset ID"
                                                value={ticketDetailsData?.asset_id && ticketDetailsData?.asset_id !== null ? ticketDetailsData?.asset_id : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Make"
                                                value={ticketDetailsData?.make && ticketDetailsData?.make !== null ? ticketDetailsData?.make : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Model"
                                                value={ticketDetailsData?.model && ticketDetailsData?.model !== null ? ticketDetailsData?.model : '--'}
                                            />
                                        </Grid>
                                        {/* <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Serial No."
                                                value={ticketDetailsData?.serial_no && ticketDetailsData?.serial_no !== null ? ticketDetailsData?.serial_no : '--'}
                                            />
                                        </Grid> */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Rating"
                                                value={ticketDetailsData?.rating && ticketDetailsData?.rating !== null ? ticketDetailsData?.rating : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                            <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }} />
                                        </Grid>

                                        {/* Row 2: Customer, Owner, Custodian */}

                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Customer"
                                                value={ticketDetailsData?.client_name && ticketDetailsData?.client_name !== null ? ticketDetailsData?.client_name : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Owner"
                                                value={ticketDetailsData?.owner && ticketDetailsData?.owner !== null ? ticketDetailsData?.owner : '--'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox
                                                textColor={theme.palette.grey[900]}
                                                label="Custodian"
                                                value={ticketDetailsData?.custodian && ticketDetailsData?.custodian !== null ? ticketDetailsData?.custodian : '--'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>

                                <Stack>
                                    {/* Show Tickets History */}
                                    <ShowHistoryComponent
                                        historyArray={ticketsHistory}
                                        title="title"
                                        description="description"
                                        files="files"
                                        user="user"
                                        onEditClick={handleEditClick}
                                    />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3, xl: 3 }}>
                            <Stack>
                                <SectionHeader title="Stakeholder Info" show_progress={0} />
                                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, px: 2, py: 1, marginTop: '-4px' }}>
                                    <Stack
                                        disablePadding
                                        sx={{ py: 1.5, px: 1 }}
                                    >
                                        <Grid container>
                                            <Grid size={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>Supervisor</TypographyComponent>
                                            </Grid>
                                            <Grid size={{ xs: 7, sm: 7, md: 7, lg: 7, xl: 7 }}>
                                                <TypographyComponent fontSize={16} fontWeight={500}
                                                    sx={{
                                                        color: theme.palette.grey[900],
                                                        whiteSpace: 'normal',
                                                        overflowWrap: 'break-word'
                                                    }}>{ticketDetailsData?.supervisor_name}</TypographyComponent>
                                                <TypographyComponent fontSize={14} fontWeight={400}
                                                    sx={{
                                                        color: theme.palette.grey[600],
                                                        whiteSpace: 'normal',
                                                        overflowWrap: 'break-word'
                                                    }}>{ticketDetailsData?.supervisor_email}</TypographyComponent>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Grid container>
                                            <Grid size={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>Owner</TypographyComponent>
                                            </Grid>
                                            <Grid size={{ xs: 7, sm: 7, md: 7, lg: 7, xl: 7 }}>
                                                <TypographyComponent fontSize={16} fontWeight={500}
                                                    sx={{
                                                        color: theme.palette.grey[900],
                                                        whiteSpace: 'normal',
                                                        overflowWrap: 'break-word'
                                                    }}>{ticketDetailsData?.owner}</TypographyComponent>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2.5 }}>
                                    <SectionHeader title="Vendor Contact" show_progress={0} />
                                    {
                                        vendorContactType !== 'edit' ?
                                            <TypographyComponent fontSize={16} sx={{ cursor: 'pointer', textDecoration: 'underline', color: theme.palette.primary[600] }} onClick={() => {
                                                setVendorContactType('edit')
                                            }}>Edit</TypographyComponent>
                                            :
                                            <></>
                                    }

                                </Stack>
                                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px' }}>
                                    {
                                        vendorContactType === 'edit' ?
                                            <React.Fragment>
                                                {
                                                    vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
                                                        <>
                                                            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <TypographyComponent fontSize={16} fontWeight={500}>Vendor 1</TypographyComponent>
                                                                <TypographyComponent fontSize={14} fontWeight={400}>VF-2025-0001672</TypographyComponent>
                                                            </Stack>
                                                            <Stack sx={{
                                                                marginTop: 2,
                                                                height: 310,
                                                                overflowY: "auto",
                                                                scrollbarWidth: "thin",
                                                                "&::-webkit-scrollbar": {
                                                                    width: "6px",
                                                                },
                                                                "&::-webkit-scrollbar-thumb": {
                                                                    backgroundColor: theme.palette.grey[400],
                                                                    borderRadius: "3px",
                                                                },
                                                            }}>
                                                                {
                                                                    vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
                                                                        vendorEscalationDetailsData.map((objDetail, index) => {
                                                                            return (<Stack
                                                                                disablePadding
                                                                                sx={{
                                                                                    flexDirection: 'row',
                                                                                    justifyContent: 'space-between',
                                                                                    alignItems: 'center',
                                                                                    py: 1.5,
                                                                                    px: 1,
                                                                                    borderBottom: index + 1 < vendorEscalationDetailsData.length ? '1px solid #eee' : 'none',
                                                                                }}
                                                                            >
                                                                                <Box>
                                                                                    <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[900] }}>{objDetail.name}</TypographyComponent>
                                                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objDetail.email}</TypographyComponent>
                                                                                </Box>
                                                                                <AntSwitch
                                                                                    checked={objDetail.is_selected === 1 ? true : false}
                                                                                    onChange={() => {
                                                                                        let escalationsArray = Object.assign([], vendorEscalationDetailsData)
                                                                                        let currentIndex = vendorEscalationDetailsData?.findIndex(obj => obj?.name === objDetail?.name)
                                                                                        let currentObj = Object.assign({}, vendorEscalationDetailsData[currentIndex])
                                                                                        currentObj.is_selected = objDetail.is_selected === 1 ? 0 : 1
                                                                                        escalationsArray[currentIndex] = currentObj
                                                                                        setVendorEscalationDetailsData(escalationsArray)
                                                                                    }}
                                                                                />
                                                                            </Stack>)
                                                                        })
                                                                        :
                                                                        <></>
                                                                }
                                                            </Stack>
                                                            <Stack sx={{ flexDirection: 'row', justifyContent: 'end', gap: 1, pt: 1 }}>
                                                                <Button
                                                                    size="small"
                                                                    sx={{ textTransform: "capitalize", px: 2, borderColor: `${theme.palette.primary[300]}`, color: `${theme.palette.primary[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                                                                    onClick={() => {
                                                                        setVendorContactType('view')
                                                                    }}
                                                                    variant='outlined'
                                                                >
                                                                    Reset
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    disabled={loadingVendorUpdate}
                                                                    sx={{ textTransform: "capitalize", px: 2, background: `${theme.palette.primary[600]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                                                                    onClick={() => {
                                                                        setLoadingVendorUpdate(true)
                                                                        let selectedVendors = vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
                                                                            vendorEscalationDetailsData?.filter(obj => obj?.is_selected === 1)
                                                                            : [];

                                                                        dispatch(actionTicketVendorContactsUpdate({
                                                                            uuid: ticketDetailsData?.ticket_uuid,
                                                                            vendor_escalation_json: selectedVendors
                                                                        }))


                                                                    }}
                                                                    variant='contained'
                                                                >
                                                                    {loadingVendorUpdate ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Save'}
                                                                </Button>
                                                            </Stack>
                                                        </>
                                                        :
                                                        <Stack sx={{ px: 1, py: 5, justifyContent: 'center', width: '100%' }}>
                                                            <Stack sx={{ alignItems: 'center' }}>
                                                                <Avatar alt={""} src={'/assets/person-details.png'} sx={{ justifyContent: 'center', overFlow: 'hidden', borderRadius: 0, height: 232, width: 253 }} />
                                                            </Stack>
                                                            <TypographyComponent fontSize={16} fontWeight={500} sx={{ mt: 3, textAlign: 'center' }}>Select Asset to get vendor details</TypographyComponent>
                                                        </Stack>
                                                }
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                {
                                                    ticketDetailsData?.vendor_escalation_json && ticketDetailsData?.vendor_escalation_json !== null && ticketDetailsData?.vendor_escalation_json.length > 0 ?
                                                        <>
                                                            <Stack sx={{
                                                                minHeight: 200,
                                                                maxHeight: 430,
                                                                overflowY: "auto",
                                                                scrollbarWidth: "thin",
                                                                "&::-webkit-scrollbar": {
                                                                    width: "6px",
                                                                },
                                                                "&::-webkit-scrollbar-thumb": {
                                                                    backgroundColor: theme.palette.grey[400],
                                                                    borderRadius: "3px",
                                                                },
                                                            }}>
                                                                {
                                                                    ticketDetailsData?.vendor_escalation_json && ticketDetailsData?.vendor_escalation_json !== null && ticketDetailsData?.vendor_escalation_json.length > 0 ?
                                                                        ticketDetailsData?.vendor_escalation_json.map((objDetail, index) => {
                                                                            return (<Stack
                                                                                disablePadding
                                                                                sx={{
                                                                                    flexDirection: 'row',
                                                                                    justifyContent: 'space-between',
                                                                                    alignItems: 'center',
                                                                                    py: 1.5,
                                                                                    px: 1,
                                                                                    borderBottom: index + 1 < ticketDetailsData?.vendor_escalation_json.length ? '1px solid #eee' : 'none',
                                                                                }}
                                                                            >
                                                                                <Box>
                                                                                    <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{objDetail.name}</TypographyComponent>
                                                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objDetail.email}</TypographyComponent>
                                                                                </Box>
                                                                            </Stack>)
                                                                        })
                                                                        :
                                                                        <></>
                                                                }</Stack>
                                                        </>
                                                        :
                                                        <Stack sx={{ px: 1, py: 5, justifyContent: 'center', width: '100%' }}>
                                                            <Stack sx={{ alignItems: 'center' }}>
                                                                <Avatar alt={""} src={'/assets/person-details.png'} sx={{ justifyContent: 'center', overFlow: 'hidden', borderRadius: 0, height: 232, width: 253 }} />
                                                            </Stack>
                                                            <TypographyComponent fontSize={16} fontWeight={500} sx={{ mt: 3, textAlign: 'center' }}>Select Asset to get vendor details</TypographyComponent>
                                                        </Stack>
                                                }
                                            </React.Fragment>
                                    }

                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>

                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'space-between'} gap={2}>
                    {/* <Stack> */}
                    <Stack flexDirection={'row'} sx={{ columnGap: 1 }}>
                        <Button
                            sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.primary[300]}`, color: `${theme.palette.primary[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                            onClick={() => {
                                setOpenChangeTicketStatusPopup(true)
                            }}
                            variant='outlined'
                        >
                            Change Status
                        </Button>
                        <Button
                            sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.primary[300]}`, color: `${theme.palette.primary[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                            onClick={() => {
                                setOpenAddUpdateTicketPopup(true)
                            }}
                            variant='outlined'
                        >
                            Add Updates
                        </Button>
                    </Stack>
                    <Stack flexDirection={'row'} sx={{ columnGap: 1 }}>
                        <Button
                            sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                            onClick={() => {
                                handleClose()
                            }}
                            variant='contained'
                        >
                            Close
                        </Button>
                    </Stack>
                    {/* </Stack> */}

                </Stack>
            </Stack>
            <ChangeTicketStatus
                details={ticketDetailsData}
                open={openChangeTicketStatusPopup}
                handleClose={() => {
                    setOpenChangeTicketStatusPopup(false)
                }}
            />
            <AddUpdateTicket
                type={addUpdateType}
                entryDetails={selectedEntryUpdateDetails}
                ticketDetails={ticketDetailsData}
                open={openAddUpdateTicketPopup}
                handleClose={() => {
                    setAddUpdateType('Add')
                    setOpenAddUpdateTicketPopup(false)

                    setSelectedEntryUpdateDetails(null)
                }}
            />
            {
                openViewDeleteTicketPopup &&
                <AlertPopup
                    open={openViewDeleteTicketPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={viewTicketData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenViewDeleteTicketPopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                            setViewLoadingDelete(true)
                            if (viewTicketData?.uuid && viewTicketData?.uuid !== null) {
                                dispatch(actionTicketDelete({
                                    uuid: viewTicketData?.uuid
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </Drawer >
    )
}
