/* eslint-disable react-hooks/exhaustive-deps */
import {
    Drawer,
    Button,
    Stack,
    Divider,
    CircularProgress,
    IconButton, useTheme,
    Grid,
    Box,
    Paper,
    Link
} from "@mui/material";
import FormHeader from "../../../components/form-header";
import CloseIcon from "../../../assets/icons/CloseIcon";
import TicketIcon from "../../../assets/icons/TicketIcon";
import TypographyComponent from "../../../components/custom-typography";
import { useState } from "react";
import SectionHeader from "../../../components/section-header";
import FieldBox from "../../../components/field-box";

export const ViewTicket = ({ open, handleClose }) => {
    const theme = useTheme()

    const [ticketDetailsData, setTicketDetailsData] = useState({
        "ticket_no": "VF-2025-0001677",
        "asset_type": "SERVICE-LIFT",
        "asset_name": "Centre Core Lift",
        "location": "T2-L2, Technical room 2A-02",
        "priority": "Medium",
        "category": "BMS",
        "created_on": "06 Oct 2025, 14:51:51",
        "last_updated": "06 Oct 2025, 16:06:45",
        "asset_id": "904",
        "make": "STULZ",
        "model": "DOME",
        "serial_no": "00-DO-89-0E-15-BF",
        "rating": "35 TR",
        "customer": "Vodafone",
        "owner": "NA",
        "custodian": "NA",
        "supervisor_name": "Ramesh S. Patil",
        "supervisor_email": "delhisupport@stulzservice.in",
        "owner_name": "Mr. Pravin Bhamre",
        "owner_email": "delhisupport@stulzservice.in",
        "assigned_vendors": [
            {
                id: 1,
                name: 'Level - 1 - Sunil Shah',
                email: 'mumbaiservice@stulzservice.in',
                is_selected: 1
            },
            {
                id: 2,
                name: 'Level - 2 - Sunil Shah',
                email: 'mumbaiservice@stulzservice.in',
                is_selected: 0
            },
            {
                id: 3,
                name: 'Level - 3 - Sunil Shah',
                email: 'mumbaiservice@stulzservice.in',
                is_selected: 0
            }
        ]
    })
    // const [ticketsHistory, setTicketsHistory] = useState([
    //     {
    //         type: "Ticket Updates", // Can be "Ticket Updates", "Closing Statement", "Reopen Statement", "Rejected Statement"
    //         entries: [
    //             {
    //                 timestamp: "06 Oct 2025 16:06:45",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5008.jpg", "img-5009.jpg", "img-5010.jpg"],
    //             },
    //             {
    //                 timestamp: "06 Oct 2025 14:51:51",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5005.jpg", "img-5006.jpg", "img-5007.jpg"],
    //             },
    //         ],
    //     },
    //     {
    //         type: "Closing Statement",
    //         entries: [
    //             {
    //                 timestamp: "06 Oct 2025 16:06:45",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5011.jpg", "img-5012.jpg"],
    //             },
    //             {
    //                 timestamp: "06 Oct 2025 16:06:45",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5011.jpg", "img-5012.jpg"],
    //             },
    //             {
    //                 timestamp: "06 Oct 2025 16:06:45",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5011.jpg", "img-5012.jpg"],
    //             }
    //         ],
    //     },
    //     {
    //         type: "Reopen Statement",
    //         entries: [
    //             {
    //                 timestamp: "06 Oct 2025 16:06:45",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5011.jpg", "img-5012.jpg"]
    //             },
    //             {
    //                 timestamp: "06 Oct 2025 16:06:45",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5011.jpg", "img-5012.jpg"]
    //             },
    //             {
    //                 timestamp: "06 Oct 2025 16:06:45",
    //                 title: "TR-10 VCB Not operate through TNC switch",
    //                 user: "Ramesh S. Patil",
    //                 description: "We observed that closing coil 11Vdc faulty. Now replaced new one 110Vdc closing coil.checked ON/OFF operation of vcb in manually and remotely found ok.",
    //                 files: ["img-5011.jpg", "img-5012.jpg"]
    //             }
    //         ],
    //     },
    // ])
    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: '86%' } } }}
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
                        <Stack>
                            <TypographyComponent fontSize={14} fontWeight={400}>Date</TypographyComponent>
                            <TypographyComponent fontSize={18} fontWeight={600}>10 Oct 2025</TypographyComponent>
                        </Stack>
                        <Stack sx={{ borderRight: `1px solid ${theme.palette.common.black}` }} />
                        <Stack>
                            <TypographyComponent fontSize={14} fontWeight={400}>Time</TypographyComponent>
                            <TypographyComponent fontSize={18} fontWeight={600}>11:35 AM</TypographyComponent>
                        </Stack>
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
                                            value={ticketDetailsData?.created_on && ticketDetailsData?.created_on !== null ? ticketDetailsData?.created_on : '--'}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                        <FieldBox
                                            textColor={theme.palette.grey[900]}
                                            label="Last Updated"
                                            value={ticketDetailsData?.last_updated && ticketDetailsData?.last_updated !== null ? ticketDetailsData?.last_updated : '--'}
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
                                            value={ticketDetailsData?.customer && ticketDetailsData?.customer !== null ? ticketDetailsData?.customer : '--'}
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
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{ticketDetailsData.supervisor_name}</TypographyComponent>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{ticketDetailsData.supervisor_email}</TypographyComponent>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Grid container>
                                            <Grid size={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>Owner</TypographyComponent>
                                            </Grid>
                                            <Grid size={{ xs: 7, sm: 7, md: 7, lg: 7, xl: 7 }}>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{ticketDetailsData.owner_name}</TypographyComponent>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{ticketDetailsData.owner_email}</TypographyComponent>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Stack>
                                <SectionHeader title="Vendor Contact" show_progress={0} sx={{ marginTop: 2.5 }} />
                                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px' }}>
                                    {
                                        ticketDetailsData?.assigned_vendors && ticketDetailsData?.assigned_vendors !== null && ticketDetailsData?.assigned_vendors.length > 0 ?
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
                                                        ticketDetailsData?.assigned_vendors && ticketDetailsData?.assigned_vendors !== null && ticketDetailsData?.assigned_vendors.length > 0 ?
                                                            ticketDetailsData?.assigned_vendors.map((objDetail, index) => {
                                                                return (<Stack
                                                                    disablePadding
                                                                    sx={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        py: 1.5,
                                                                        px: 1,
                                                                        borderBottom: index + 1 < ticketDetailsData?.assigned_vendors.length ? '1px solid #eee' : 'none',
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
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>

                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            handleClose()
                            // reset()
                        }}
                        variant='outlined'
                    >
                        Close
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            // handleSubmit(onSubmit)()
                        }}
                        name='submit'
                        variant='contained'
                    // disabled={loading}
                    >
                        Edit
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    )
}
