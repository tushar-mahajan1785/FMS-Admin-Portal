import { AppBar, Toolbar, Typography, Box, Stack, useTheme, Avatar } from "@mui/material";
import TypographyComponent from "../../custom-typography";
import React from "react";
import { useAuth } from "../../../hooks/useAuth";

export const TechnicianNavbarHeader = ({ leftSection = null, rightSection = null }) => {
    const theme = useTheme()
    const { user } = useAuth()
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "transparent",
                color: "#000",
                py: 1,
                p: 0
            }}
        >
            <Stack sx={{}}>
                {
                    leftSection && leftSection !== null ?
                        leftSection
                        :
                        <Stack sx={{ flexDirection: 'row', gap: '12px', alignItems: 'center', minHeight: '100%', my: 1 }}>
                            <Stack sx={{ height: '42px', width: '42px', background: theme.palette.common.white, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderRadius: '4px' }}>
                                <Avatar
                                    alt={user?.name || 'Guest'}
                                    // src={user?.image_url || '/person.png'}
                                    src={"https://fms-super-admin.interdev.in/fms/admin/2/2_1765183597354.jpg"}
                                    sx={{ width: '42px', height: '42px', borderRadius: 0 }}
                                />
                            </Stack>
                            <Stack>
                                <TypographyComponent fontSize={18} fontWeight={500} >
                                    {user?.name && user?.name !== null ? user?.name : ''}
                                </TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                    {user?.role && user?.role !== null ? user?.role : ''}
                                </TypographyComponent>
                            </Stack>
                        </Stack>
                }
                <Box sx={{ flexGrow: 1 }} />
                <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {/* right side action */}
                    {
                        rightSection && rightSection !== null ? rightSection : <></>
                    }
                </Typography>
            </Stack>
        </AppBar >
    )
}
