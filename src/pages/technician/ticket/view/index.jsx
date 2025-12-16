import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft';
import { Stack, Divider, Grid, Avatar } from '@mui/material';
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header';
import TypographyComponent from '../../../../components/custom-typography';
import moment from 'moment';
import { TechnicianShowHistoryComponent } from '../../../../components/technician-history-component';
import { useDispatch, useSelector } from 'react-redux';
import { actionTechnicianTicketDetails, resetTechnicianTicketDetailsResponse } from '../../../../store/technician/tickets';
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { useBranch } from '../../../../hooks/useBranch';
import { useAuth } from '../../../../hooks/useAuth';
import FullScreenLoader from '../../../../components/fullscreen-loader';

export default function TicketView() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const { logout } = useAuth()

    const { ticketUuid } = useParams()

    // store
    const { technicianTicketDetails } = useSelector(state => state.technicianTicketsStore)

    const [ticketDetails, setTicketDetails] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    /**
     * Ticket detail API Call
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && ticketUuid && ticketUuid !== null) {
            setLoadingDetail(true)
            dispatch(actionTechnicianTicketDetails({
                branch_uuid: branch?.currentBranch?.uuid,
                ticket_uuid: ticketUuid
            }))
        }
    }, [branch?.currentBranch?.uuid, ticketUuid])

    /**
     * useEffect
     * @dependency : technicianTicketDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of technician asset details API
     */
    useEffect(() => {
        if (technicianTicketDetails && technicianTicketDetails !== null) {
            dispatch(resetTechnicianTicketDetailsResponse())
            if (technicianTicketDetails?.result === true) {
                setLoadingDetail(false)
                setTicketDetails(technicianTicketDetails?.response)
            } else {
                setLoadingDetail(false)
                setTicketDetails(null)
                switch (technicianTicketDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianTicketDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianTicketDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianTicketDetails])

    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate('/tickets')
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>Ticket {ticketDetails?.ticket_no && ticketDetails?.ticket_no !== null ? `#${ticketDetails?.ticket_no}` : ''}</TypographyComponent>
            </Stack>} />

            {loadingDetail ?
                <FullScreenLoader open={true} />
                :
                <></>
            }
            <Stack>
                <TypographyComponent fontSize={18} fontWeight={500}>Ticket Information</TypographyComponent>
                <Stack sx={{ background: theme.palette.common.white, p: '16px', borderRadius: '8px', mt: 1 }}>
                    <Grid container spacing={2.2}>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Ticket No
                                </TypographyComponent>
                                <TypographyComponent fontSize={18} fontWeight={500}>
                                    {ticketDetails?.ticket_no && ticketDetails?.ticket_no !== null ? ticketDetails?.ticket_no : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Created On
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.created_on && ticketDetails?.created_on !== null ? moment(ticketDetails?.created_on, 'YYYY-MM-DD hh:mm').format('DD MMM YYYY, hh:mm') : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}><Divider sx={{ color: theme.palette.grey[300] }} /></Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Asset Name
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.asset_name && ticketDetails?.asset_name !== null ? ticketDetails?.asset_name : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Asset Type
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.asset_type && ticketDetails?.asset_type !== null ? ticketDetails?.asset_type : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}><Divider sx={{ color: theme.palette.grey[300] }} /></Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Created By
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.created_by && ticketDetails?.created_by !== null ? ticketDetails?.created_by : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Updated On
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.last_updated && ticketDetails?.last_updated !== null ? moment(ticketDetails?.last_updated, 'YYYY-MM-DD hh:mm').format('DD MMM YYYY, hh:mm') : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}><Divider sx={{ color: theme.palette.grey[300] }} /></Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Stack>
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>
                                    Location
                                </TypographyComponent>
                                <TypographyComponent fontSize={20} fontWeight={500}>
                                    {ticketDetails?.location && ticketDetails?.location !== null ? ticketDetails?.location : '--'}
                                </TypographyComponent>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
            <Stack>
                <TypographyComponent fontSize={18} fontWeight={500}>Ticket Updates</TypographyComponent>
                {
                    ticketDetails?.history_by_status && ticketDetails?.history_by_status !== null && ticketDetails?.history_by_status.length > 0 ?
                        <Stack>
                            {/* Show Tickets History */}
                            <TechnicianShowHistoryComponent
                                historyArray={ticketDetails?.history_by_status}
                                title="title"
                                description="description"
                                files="files"
                                user="user"
                            />
                        </Stack>
                        :
                        <Stack sx={{ background: theme.palette.common.white, py: 6, mt: 1, borderRadius: '8px', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                            <TypographyComponent fontSize={16} fontWeight={400}>No Ticket Updates Found</TypographyComponent>
                        </Stack>
                }

            </Stack>



        </Stack >
    )
}
