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
import { actionGetTicketDetails, actionTicketDelete, resetGetTicketDetailsResponse, resetTicketDeleteResponse, actionTicketVendorContactsUpdate, resetTicketVendorContactsUpdateResponse, actionTicketUpdateDelete, resetTicketUpdateDeleteResponse } from "../../../store/tickets";
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
  const { logout, hasPermission } = useAuth()

  //Store 
  const { getTicketDetails, ticketDelete, ticketVendorContactsUpdate, ticketUpdateDelete } = useSelector(state => state.ticketsStore)

  //States
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
  const [openTicketUpdateDeletePopup, setOpenTicketUpdateDeletePopup] = useState(false)

  //Initial Render
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
   * @dependency : ticketUpdateDelete
   * @type : HANDLE API RESULT
   * @description : Handle the result of delete ticket update API
   */
  useEffect(() => {
    if (ticketUpdateDelete && ticketUpdateDelete !== null) {
      dispatch(resetTicketUpdateDeleteResponse())
      if (ticketUpdateDelete?.result === true) {
        setOpenTicketUpdateDeletePopup(false)
        setViewLoadingDelete(false)
        setViewTicketData(null)
        showSnackbar({ message: ticketUpdateDelete?.message, severity: "success" })
        dispatch(actionGetTicketDetails({
          uuid: detail?.uuid
        }))
      } else {
        setViewLoadingDelete(false)
        switch (ticketUpdateDelete?.status) {
          case UNAUTHORIZED:
            logout()
            break
          case ERROR:
            dispatch(resetTicketUpdateDeleteResponse())
            showSnackbar({ message: ticketUpdateDelete?.message, severity: "error" })
            break
          case SERVER_ERROR:
            showSnackbar({ message: ticketUpdateDelete?.message, severity: "error" })
            break
          default:
            break
        }
      }
    }
  }, [ticketUpdateDelete])

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

  /**
   * handle history Edit Click
   * @param {*} entry 
   */
  const handleEditClick = (entry) => {
    setAddUpdateType('Edit')
    setSelectedEntryUpdateDetails(entry);
    setOpenAddUpdateTicketPopup(true);
  };

  /**
  * handle history Delete Click
  * @param {*} entry 
  */
  const handleDeleteClick = (entry) => {
    let objData = {
      id: entry?.id,
      title: `Delete Ticket Update`,
      text: `Are you sure you want to delete this ticket update? This action cannot be undone.`
    }
    setViewTicketData(objData)
    setOpenTicketUpdateDeletePopup(true)
  };

  /**
   * html content to download pdf
   */
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ticket Details</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&display=swap"
      rel="stylesheet"
    />

    <style>
      @page {
        size: A4;
        margin: 10mm;
      }

      body {
        font-family: Arial, sans-serif;
        /* font-family: "Monsieur La Doulaise", cursive; */
        font-size: 14px;
        margin: 0;
        padding: 5mm;
        width: 210mm;
        height: 297mm;
        box-sizing: border-box;
      }
      /* body {
        font-family: "Poppins", sans-serif;
        font-family: "Monsieur La Doulaise", cursive;
        color: #222;
        margin: 0;
        padding: 50px;
      } */
      /* .main-container {
        
        margin: 0 auto;
        background: #fff;
        padding: 30px 40px;
        border-radius: 10px;
      } */
      .header {
        display: flex;
        align-items: center;
        gap: 30px;
        margin-bottom: 20px;
      }
      .main-heading {
        font-size: 24px;
        font-weight: 800;
      }

      .status {
        padding: 5px 15px;
        border-radius: 6px;
        font-size: 18px;
        color: #e00303;
        background: #ffe1e1c2;
        font-weight: 500;
        border-radius: 50px;
      }
      .main-heading {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #2b3a50;
      }
      .title {
        font-size: 18px;
        font-weight: 700;
        margin-top: 30px;
        margin-bottom: 20px;
        color: #151a23;
      }
      .ticket-info {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 15px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .label {
        font-size: 13px;
        color: #818997;
        font-weight: 500;
      }

      .value {
        font-size: 15px;
        color: #1d212b;
        font-weight: 600;
      }

      /* horizontal divider inside the grid */
      .divider {
        grid-column: 1 / -1;
        border-bottom: 1px solid #e5e7eb;
        margin: 4px 0;
      }
      .stakeholder-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .timeline-container {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 15px 20px;
      }
      .timeline-item {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        position: relative;
        padding-bottom: 50px;
      }
      .timeline-date {
        background: #d1fae5;
        padding: 10px 20px;
        border-radius: 6px;
        min-width: 100px;
      }
      .date {
        font-size: 12px;
        margin: 0 0 10px 0;
        color: #111827;
        font-weight: 800;
      }
      .time {
        font-size: 11px;
        margin: 0;
        color: #111827;
        font-weight: 400;
      }
      .timeline-title {
        font-size: 18px;
        margin: 0 0 8px 0;
        color: #2b3a50;
        font-weight: 700;
      }
      .timeline-content {
        position: relative;
        flex: 1;
        padding-left: 20px;
        border-left: 2px dashed #ccced3;
      }
      .timeline-user {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 10px;
      }
      .timeline-desc {
        font-size: 16px;
        color: #788599;
        margin-bottom: 10px;
        font-weight: 500;
      }
      .file-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        font-size: 14px;
      }
      .timeline-content::before {
        content: "";
        position: absolute;
        left: -5px;
        top: 0px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #000;
      }
      .timeline-content::after {
        content: "";
        position: absolute;
        left: -5px;
        bottom: 0px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #111827;
      }
      .last-timeline-item {
        padding-bottom: 0 !important;
      }
      .oranged-bg {
        background: #f8e2c5 !important;
      }
      .purpled-bg {
        background: #e6e0f8 !important;
      }
      .red-bg {
        background: #ffe1e1 !important;
      }
      .timeline-desc-margin {
        margin-bottom: 0 !important;
      }
        .fa-regular {
        color: #15181dff;
        font-size: 40px;
        }
      .upload {
        margin: 0;
      }
      @media print {
      i {
        -webkit-print-color-adjust: exact; /* for Chrome/Safari */
        color-adjust: exact; /* for Firefox */
      }
}
    </style>
  </head>
 <body>
    <div class="main-container">
      <div class="header">
        <h2 class="main-heading">Ticket #${ticketDetailsData?.ticket_no || '-'}</h2>
        <span class="status">${ticketDetailsData?.status || '-'}</span>
      </div>
      <hr />

      <div class="container">
        <h3 class="title">Ticket Information</h3>
        <div class="ticket-info">
          <div class="info-grid">
            ${[
      { label: 'Ticket No', value: ticketDetailsData?.ticket_no },
      { label: 'Asset Type', value: ticketDetailsData?.asset_type },
      { label: 'Asset Name', value: ticketDetailsData?.asset_name },
      { label: 'Location', value: ticketDetailsData?.location },
      { divider: true },
      { label: 'Priority', value: ticketDetailsData?.priority },
      { label: 'Category', value: ticketDetailsData?.category },
      { label: 'Created On', value: ticketDetailsData?.created_on && ticketDetailsData?.created_on !== null ? moment(ticketDetailsData?.created_on, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY HH:MM A') : '--' },
      { label: 'Last Updated', value: ticketDetailsData?.last_updated && ticketDetailsData?.last_updated !== null ? moment(ticketDetailsData?.last_updated, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY HH:MM A') : '--' },
    ]
      .map(item =>
        item.divider
          ? `<div class="divider"></div>`
          : `<div class="info-item"><span class="label">${item.label}</span><span class="value">${item.value || '-'}</span></div>`
      )
      .join('')}
          </div>
        </div>
      </div>

      <div class="container">
        <h3 class="title">Linked Asset</h3>
        <div class="ticket-info">
          <div class="info-grid">
            ${[
      { label: 'Asset ID', value: ticketDetailsData?.asset_id },
      { label: 'Make', value: ticketDetailsData?.make },
      { label: 'Model', value: ticketDetailsData?.model },
      { label: 'Serial No.', value: ticketDetailsData?.serial_no },
      { divider: true },
      { label: 'Rating', value: ticketDetailsData?.rating },
      { label: 'Customer', value: ticketDetailsData?.client_name },
      { label: 'Owner', value: ticketDetailsData?.owner },
      { label: 'Custodian', value: ticketDetailsData?.custodian },
    ]
      .map(item =>
        item.divider
          ? `<div class="divider"></div>`
          : `<div class="info-item"><span class="label">${item.label}</span><span class="value">${item.value || '-'}</span></div>`
      )
      .join('')}
          </div>
        </div>
      </div>

      <div class="container">
        <h3 class="title">Stakeholder Info</h3>
        <div class="ticket-info">
          <div class="stakeholder-grid">
            <div class="info-item">
              <span class="value">Supervisor</span>
            </div>
            <div class="info-item">
              <span class="value">${ticketDetailsData?.supervisor_name || '-'}</span>
              <span class="label">${ticketDetailsData?.supervisor_email || '-'}</span>
            </div>
            <div class="divider"></div>
            <div class="info-item"><span class="value">Owner</span></div>
            <div class="info-item"><span class="value">${ticketDetailsData?.owner || '-'}</span></div>
          </div>
        </div>
      </div>

      <div class="container">
        <h3 class="title">Vendor Contact</h3>
        <div class="ticket-info">
          <div class="info-grid">
            ${ticketDetailsData?.vendor_escalation_json?.length
      ? ticketDetailsData.vendor_escalation_json
        .map(
          v => `
              <div class="info-item">
                <span class="value">${v?.name || '-'}</span>
                <span class="label">${v?.email || '-'}</span>
              </div>`
        )
        .join('')
      : `<div class="info-item"><span class="value">-</span></div>`
    }
          </div>
        </div>
      </div>

      ${ticketDetailsData?.history_by_status
      ?.map(
        (section) => `
      <div class="container">
        <h3 class="title">${section?.status_type || '-'}</h3>
        <div class="timeline-container">
          ${section?.entries?.length
            ? section.entries
              .map(
                (entry, eidx) => `
          <div class="timeline-item ${eidx === section.entries.length - 1 ? 'last-timeline-item' : ''}">
            <div class="timeline-date ${entry?.status === 'Rejected' ? 'red-bg' : entry?.status === 'Closed' ? 'purpled-bg' : entry?.status === 'On Hold' ? 'oranged-bg' : ''}">
              <h5 class="date">${new Date(entry?.timestamp || '').toLocaleDateString('en-GB') || '-'}</h5>
              <h6 class="time">${new Date(entry?.timestamp || '').toLocaleTimeString('en-GB') || '-'}</h6>
            </div>
            <div class="timeline-content">
              <h4 class="timeline-title">${entry?.title || '-'}</h4>
              <div class="timeline-user">${entry?.user || '-'}</div>
              <div class="timeline-desc ${entry?.files?.length ? '' : 'timeline-desc-margin'}">${entry?.description || '-'}</div>
              ${entry?.files?.length
                    ? `<div class="file-list"><strong>File Uploaded:</strong>${entry.files
                      .map(
                        f => `
                        <p class="upload">
                        <span style="color: grey; margin-right: 3px;">●</span>
                        <a href="${f?.image_url || '#'}" style="color: blue;">
                          ${f?.file_name || ''}
                        </a>
                      </p>
                  `
                      )
                      .join('')}</div>`
                    : ''
                  }
            </div>
          </div>`
              )
              .join('')
            : `<div class="timeline-item last-timeline-item"><div class="timeline-content"><div class="timeline-desc">No records found</div></div></div>`
          }
        </div>
      </div>`
      )
      .join('')}
    </div>
  </body>
</html>`;

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
          currentStatus={ticketDetailsData?.status && ticketDetailsData?.status !== null ? ticketDetailsData?.status : ''}
          subtitle=""
          actions={[
            <IconButton
              onClick={handleClose}
            >
              <CloseIcon size={16} />
            </IconButton>
          ]}
          rightSection={<Stack flexDirection={'row'} gap={3} sx={{ mx: 3, alignItems: 'center' }}>
            {
              ticketDetailsData && ticketDetailsData !== null ?
                <Button
                  variant={'outlined'}
                  sx={{ textTransform: "capitalize", px: 2, borderRadius: '8px', py: 0.5, backgroundColor: theme.palette.common.white, color: theme.palette.primary[600], fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                  onClick={() => {
                    const newWindow = window.open("", "_blank");
                    newWindow.document.write(htmlContent);
                    newWindow.document.close();
                    newWindow.focus();
                    newWindow.print();
                    newWindow.close();
                  }}
                >
                  Download Report
                </Button>
                :
                <></>
            }
            {
              hasPermission('TICKET_DELETE') ?
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
                :
                <></>
            }
          </Stack>}
        />
        < Divider sx={{ mb: 2, mx: 2 }} />
        <Stack Stack
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
                        value={ticketDetailsData?.created_on && ticketDetailsData?.created_on !== null ? moment(ticketDetailsData?.created_on, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY HH:MM A') : '--'}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                      <FieldBox
                        textColor={theme.palette.grey[900]}
                        label="Last Updated"
                        value={ticketDetailsData?.last_updated && ticketDetailsData?.last_updated !== null ? moment(ticketDetailsData?.last_updated, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY HH:MM A') : '--'}
                      />
                    </Grid>
                  </Grid>
                </Stack>

                {/* Linked Asset Section */}
                <SectionHeader title="Linked Asset" show_progress={0} sx={{ marginTop: 2.5 }} />
                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, marginTop: '-4px' }}>
                  <Grid container>
                    {/* Row 1: Asset ID, Make, Model, Serial No. */}
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
                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                      <FieldBox
                        textColor={theme.palette.grey[900]}
                        label="Serial No."
                        value={ticketDetailsData?.serial_no && ticketDetailsData?.serial_no !== null ? ticketDetailsData?.serial_no : '--'}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                      <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }} />
                    </Grid>

                    {/* Row 2: Rating, Customer, Owner, Custodian */}
                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                      <FieldBox
                        textColor={theme.palette.grey[900]}
                        label="Rating"
                        value={ticketDetailsData?.rating && ticketDetailsData?.rating !== null ? ticketDetailsData?.rating : '--'}
                      />
                    </Grid>
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
                    permission={'TICKET_EDIT'}
                    can_show_action={!['Rejected', 'Closed'].includes(ticketDetailsData?.status)}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
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
                    vendorContactType !== 'edit' && hasPermission('TICKET_EDIT') && !['Rejected', 'Closed'].includes(ticketDetailsData?.status) ?
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
                                <TypographyComponent fontSize={16} fontWeight={500}>{ticketDetailsData?.vendor && ticketDetailsData?.vendor !== null ? ticketDetailsData?.vendor : 'Vendor 1'}</TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={400}>{ticketDetailsData?.vendor_id && ticketDetailsData?.vendor_id !== null ? ticketDetailsData?.vendor_id : 'VF-2025-0001672'}</TypographyComponent>
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
                                        key={index}
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

                                    let selectedVendors = vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
                                      vendorEscalationDetailsData?.filter(obj => obj?.is_selected === 1)
                                      : [];
                                    if (selectedVendors && selectedVendors !== null && selectedVendors?.length > 0) {
                                      setLoadingVendorUpdate(true)
                                      dispatch(actionTicketVendorContactsUpdate({
                                        uuid: ticketDetailsData?.ticket_uuid,
                                        vendor_escalation_json: selectedVendors
                                      }))
                                    } else {
                                      showSnackbar({ message: 'Atleast one vendor selection is required', severity: "error" })

                                      let vendors = Object.assign([], ticketDetailsData?.vendor_escalation)
                                      let arrSelected = ticketDetailsData?.vendor_escalation_json?.filter(obj => obj?.is_selected === 1)?.map(obj => obj?.id)?.join(',')

                                      // Update vendors where IDs match
                                      vendors = vendors.map(vendor => ({
                                        ...vendor,
                                        is_selected: arrSelected.includes(vendor.id) ? 1 : 0
                                      }));
                                      setVendorEscalationDetailsData(vendors)

                                    }
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
                                        key={index}
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

        </Stack >
        <Divider sx={{ mt: 2 }} />
        <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'space-between'} gap={2}>
          <Stack flexDirection={'row'} sx={{ columnGap: 1 }}>
            {
              hasPermission('TICKET_EDIT') ?
                <React.Fragment>
                  {
                    !['Rejected'].includes(ticketDetailsData?.status) ?
                      <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.primary[300]}`, color: `${theme.palette.primary[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                          setOpenChangeTicketStatusPopup(true)
                        }}
                        variant='outlined'
                      >
                        Change Status
                      </Button>
                      :
                      <></>
                  }
                  {
                    !['Rejected', 'Closed'].includes(ticketDetailsData?.status) ?
                      <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.primary[300]}`, color: `${theme.palette.primary[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                          setOpenAddUpdateTicketPopup(true)
                        }}
                        variant='outlined'
                      >
                        Add Updates
                      </Button>
                      :
                      <></>
                  }
                </React.Fragment>
                :
                <></>
            }
          </Stack>
          <Stack>
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
      </Stack >
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
      {
        openTicketUpdateDeletePopup &&
        <AlertPopup
          open={openTicketUpdateDeletePopup}
          icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
          color={theme.palette.error[600]}
          objData={viewTicketData}
          actionButtons={[
            <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
              setOpenTicketUpdateDeletePopup(false)
            }}>
              Cancel
            </Button >
            ,
            <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
              setViewLoadingDelete(true)
              if (viewTicketData?.id && viewTicketData?.id !== null) {
                dispatch(actionTicketUpdateDelete({
                  history_id: viewTicketData?.id
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
