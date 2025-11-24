/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Button, Divider, Grid, Stack, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TicketIcon from '../../../assets/icons/TicketIcon';
import SectionHeader from '../../../components/section-header';
import FieldBox from '../../../components/field-box';
import moment from 'moment';
import { ShowHistoryComponent } from '../../../components/show-list-component';
import TypographyComponent from '../../../components/custom-typography';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetTicketDetails, resetGetTicketDetailsResponse } from '../../../store/tickets';
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import FormHeader from '../../../components/form-header';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export default function TicketDownloadReport() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { showSnackbar } = useSnackbar()
    const { logout } = useAuth()
    const { uuid } = useParams()
    const navigate = useNavigate()

    //Stores
    const { getTicketDetails } = useSelector(state => state.ticketsStore)

    //States
    const [ticketDetailsData, setTicketDetailsData] = useState(null)
    const [previousRouteDetailsData, setPreviousRouteDetailsData] = useState(null)

    /**
     * Initial Render
     * scrollToTop , get previous_route_details from local storage & get ticket details api call
     */
    useEffect(() => {
        if (uuid && uuid !== null) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            dispatch(actionGetTicketDetails({
                uuid: uuid
            }))
            let data = window.localStorage.getItem('previous_route_details');
            setPreviousRouteDetailsData(JSON.parse(data))
        }

    }, [uuid])

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
            } else {
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

    return (
        <React.Fragment>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center', height: '100%', justifyContent: 'center', cursor: 'pointer' }} onClick={() => {
                    navigate(previousRouteDetailsData?.from, { state: { uuid: uuid, redirect_from: 'download' } })

                    let currentData = Object.assign({}, previousRouteDetailsData)
                    currentData.redirect_from = 'download'
                    window.localStorage.setItem('previous_route_details', JSON.stringify(currentData))
                }}>
                    <Stack>
                        <KeyboardBackspaceIcon fontSize={"medium"} />
                    </Stack>
                    <Stack>
                        <TypographyComponent color={theme.palette.grey.primary} fontSize={22} fontWeight={500}>
                            Back
                        </TypographyComponent>
                    </Stack>
                </Stack>
                <Stack>
                    <Button
                        size={'small'}
                        sx={{ textTransform: "capitalize", px: 4, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            const printDiv = document.getElementById("ticketPrintSection");
                            if (printDiv) {
                                const originalContents = document.body.innerHTML;
                                const printContents = printDiv.innerHTML;

                                // Save original title
                                const originalTitle = document.title;
                                document.title = "Ticket-Report";

                                document.body.innerHTML = printContents;
                                window.print();
                                document.body.innerHTML = originalContents;
                                document.title = originalTitle;
                            }
                        }}
                        variant='contained'
                    >
                        Print/Save Report
                    </Button>
                </Stack>
            </Stack>
            <div id="ticketPrintSection">
                <Stack sx={{ height: '100%', background: 'white' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<TicketIcon stroke={theme.palette.primary[600]} size={20} />}
                        title={`Ticket ${ticketDetailsData?.ticket_no && ticketDetailsData?.ticket_no !== null ? `#${ticketDetailsData?.ticket_no}` : ''}`}
                        subtitle=""
                    />
                    <Divider sx={{ mb: 2, mx: 2, background: 'white' }} />
                    <Stack
                        sx={{
                            px: 2
                        }}
                    >
                        <Stack>
                            {/* --- Ticket Information Section --- */}
                            <SectionHeader title="Ticket Information" show_progress={0} sx={{ marginTop: 2.5 }} />
                            <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, marginTop: '-4px' }}>
                                <Grid container>
                                    {/* Row 1 */}
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Ticket No" value={ticketDetailsData?.ticket_no || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Asset Type" value={ticketDetailsData?.asset_type || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Asset Name" value={ticketDetailsData?.asset_name || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Location" value={ticketDetailsData?.location || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }} />
                                    </Grid>

                                    {/* Row 2 */}
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Priority" value={ticketDetailsData?.priority || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Category" value={ticketDetailsData?.category || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Created On" value={ticketDetailsData?.created_on ? moment(ticketDetailsData?.created_on, 'YYYY-MM-DD').format('DD MMM YYYY hh:mm A') : '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Last Updated" value={ticketDetailsData?.last_updated ? moment(ticketDetailsData?.last_updated, 'YYYY-MM-DD').format('DD MMM YYYY hh:mm A') : '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                </Grid>
                            </Stack>

                            {/* Linked Asset Section */}
                            <SectionHeader title="Linked Asset" show_progress={0} sx={{ marginTop: 2.5 }} />
                            <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, marginTop: '-4px' }}>
                                <Grid container>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Asset ID" value={ticketDetailsData?.asset_id || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Make" value={ticketDetailsData?.make || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Model" value={ticketDetailsData?.model || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FieldBox label="Serial No." value={ticketDetailsData?.serial_no || '--'} textColor={theme.palette.grey[900]} />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Stack>

                        {/* Stakeholder & Vendor Sections (kept unchanged) */}
                        <Stack sx={{ width: '100%', height: '100%', marginTop: 2.5 }}>
                            <SectionHeader title="Stakeholder Info" show_progress={0} />
                            <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, px: 1, py: 1, marginTop: '-4px', width: '100%' }}>
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
                            </Stack>
                            <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 1, marginTop: '-4px' }}>
                                <React.Fragment>
                                    {
                                        ticketDetailsData?.vendor_escalation_json && ticketDetailsData?.vendor_escalation_json !== null && ticketDetailsData?.vendor_escalation_json.length > 0 ?
                                            <>
                                                <Stack>
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
                            </Stack>
                            {
                                ticketDetailsData?.history_by_status && ticketDetailsData?.history_by_status !== null && ticketDetailsData?.history_by_status?.length > 0 &&
                                <ShowHistoryComponent
                                    historyArray={ticketDetailsData?.history_by_status}
                                    title="title"
                                    description="description"
                                    files="files"
                                    user="user"
                                />
                            }
                        </Stack>
                    </Stack>
                </Stack>
            </div>
        </React.Fragment>
    )
}
