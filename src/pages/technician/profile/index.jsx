import { Stack, Box, useTheme, Paper, Divider } from "@mui/material";
import TypographyComponent from "../../../components/custom-typography";
import CheckboxIcon from "../../../assets/icons/CheckboxIcon";
import SquareCrossIcon from "../../../assets/icons/SquareCrossIcon";
import MailIcon from "../../../assets/icons/MailIcon";
import PhoneCallIcon from "../../../assets/icons/PhoneCallIcon";
import AddressIcon from "../../../assets/icons/AddressIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import ChangePasswordIcon from "../../../assets/icons/ChangePasswordIcon";
import LogoutIcon from '@mui/icons-material/Logout';

export default function TechnicianProfile() {
    const theme = useTheme();

    return (
        <Stack sx={{ pb: 10 }}>
            <Box
                sx={{
                    height: 320,
                    background: "linear-gradient(180deg, #6941C6 0%, #6E30FF 100%)",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    color: "white",
                    mx: -10,
                    mt: -2,
                }}
            >
                <Stack alignItems="center" mt={6}>
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background: "white",
                        }}
                    />

                    <TypographyComponent fontSize={24} fontWeight={600} sx={{ mt: 2, }}>
                        Rahul Patil
                    </TypographyComponent>

                    <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.8 }}>Technician</TypographyComponent>

                    <Box
                        sx={{
                            mt: 1,
                            px: 2,
                            py: "4px",
                            borderRadius: '8px',
                            border: `1px solid ${theme.palette.common.white}`,
                            background: "rgba(255,255,255,0.25)",
                        }}
                    >
                        <TypographyComponent fontSize={16} fontWeight={400} >EMP ID: EM0019</TypographyComponent>
                    </Box>
                </Stack>
            </Box>

            {/* ---------------- CHECKLIST OVERVIEW ---------------- */}
            <Box sx={{ mt: 2 }}>
                <TypographyComponent fontSize={20} fontWeight={600} sx={{ mb: 1 }}>
                    Checklist Overview
                </TypographyComponent>

                <Stack direction="row" spacing={2}>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            borderRadius: 3,
                            p: '16px',
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: theme.palette.common.white,
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: theme.palette.success[50],
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CheckboxIcon size={'24'} stroke={theme.palette.success[600]} />
                        </Box>

                        <Stack>
                            <TypographyComponent fontSize={26} fontWeight={500} sx={{ color: theme.palette.common.black }}>
                                233
                            </TypographyComponent>
                            <TypographyComponent fontSize={16} sx={{ color: theme.palette.grey[600] }}>Completed</TypographyComponent>
                        </Stack>
                    </Paper>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            borderRadius: 3,
                            p: '16px',
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: theme.palette.common.white,
                        }}
                    >
                        {/* Icon Box */}
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: theme.palette.error[50],
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SquareCrossIcon size={'26'} stroke={theme.palette.error[600]} />
                        </Box>

                        <Stack>
                            <TypographyComponent fontSize={26} fontWeight={500} sx={{ color: theme.palette.common.black }}>
                                03
                            </TypographyComponent>
                            <TypographyComponent fontSize={16} sx={{ color: theme.palette.grey[600] }}>Missed</TypographyComponent>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
            <Box sx={{ mt: 3 }}>
                <TypographyComponent fontSize={20} fontWeight={600} sx={{ mb: 1 }}>
                    Contact Information
                </TypographyComponent>

                <Stack sx={{ p: 2, background: theme.palette.common.white, borderRadius: '8px', rowGap: 2 }}>
                    {/* Email */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <MailIcon stroke={theme.palette.success[800]} />
                        <Stack>
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>Email</TypographyComponent>
                            <TypographyComponent fontSize={20} fontWeight={400}>
                                rahul.patil@example.com
                            </TypographyComponent>
                        </Stack>
                    </Stack>

                    {/* Phone */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <PhoneCallIcon stroke1={theme.palette.success[400]} stroke2={theme.palette.success[400]} />
                        <Stack>
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>Phone</TypographyComponent>
                            <TypographyComponent fontSize={20} fontWeight={400}>+91 8149004622</TypographyComponent>
                        </Stack>
                    </Stack>

                    {/* Address */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <AddressIcon stroke={theme.palette.primary[600]} />
                        <Stack>
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>
                                Address
                            </TypographyComponent>
                            <TypographyComponent fontSize={20} fontWeight={400}>
                                Bhosari, Pune - 411039
                            </TypographyComponent>
                        </Stack>
                    </Stack>

                    {/* Date of Joining */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <CalendarIcon stroke={theme.palette.warning[800]} />
                        <Stack>
                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ opacity: 0.6 }}>
                                Date of Joining
                            </TypographyComponent>
                            <TypographyComponent fontSize={20} fontWeight={400}>Jan 15, 2022</TypographyComponent>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>

            <Box sx={{ mt: 3 }}>
                <TypographyComponent fontSize={20} fontWeight={600} sx={{ mb: 1 }}>Settings</TypographyComponent>
                <Stack elevation={0} sx={{ p: '16px', background: theme.palette.common.white, borderRadius: '8px' }}>
                    {/* Change Password */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <ChangePasswordIcon size={16} stroke={theme.palette.grey[800]} />
                        <TypographyComponent fontSize={20} fontWeight={400}>Change Password</TypographyComponent>
                    </Stack>
                    <Divider sx={{ my: 0.5 }} />
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mt: 2, color: theme.palette.error[700], cursor: "pointer" }}
                    >
                        <LogoutIcon sx={{ color: theme.palette.error[700] }} fontSize="small" />
                        <TypographyComponent fontSize={20} fontWeight={400}>Logout</TypographyComponent>
                    </Stack>
                </Stack>
            </Box>
        </Stack >
    );
}
