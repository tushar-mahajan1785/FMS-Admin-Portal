// components/Sidebar.jsx
import React, { useState } from "react";
import {
    Box,
    Collapse,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Toolbar,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { sideMenuItems } from "../../layout/side-menu";
import Settings from "../../config/settings";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar({ open, onClose }) {
    const isDesktop = useMediaQuery("(min-width:900px)");
    const variant = isDesktop ? "persistent" : "temporary";
    const theme = useTheme()
    const { hasPermission } = useAuth()
    const drawerWidth = Settings.drawerWidth ?? 240;

    const [openGroups, setOpenGroups] = useState({});

    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    };

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            sx={{
                "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
            }}
        >

            <Toolbar sx={{ px: 2, backgroundColor: theme.palette.common.white }} >
                {Settings.logo && (
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <img src={Settings?.logo?.path} alt="App Logo" style={{ height: 32 }} />
                    </Box>
                )}
            </Toolbar>
            <Divider />

            <List>
                {sideMenuItems.map((menu, idx) => {
                    // --- Direct menu item ---
                    if (menu.path) {
                        const selected = location.pathname === menu.path;
                        if (menu?.permission && hasPermission(menu.permission)) {
                            return (
                                <ListItem key={idx} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={menu.path}
                                        selected={selected}
                                        onClick={() => !isDesktop && onClose()}
                                        sx={{
                                            backgroundColor: selected ? theme.palette.primary[600] : theme.palette.common.white,
                                            "&.Mui-selected": {
                                                backgroundColor: theme.palette.primary[600],
                                                "&:hover": {
                                                    backgroundColor: theme.palette.primary[600],
                                                }
                                            }
                                        }}
                                    >
                                        <Stack mr={1.5}>
                                            {<menu.icon stroke={selected ? theme.palette.common.white : theme.palette.grey.primary} />}
                                        </Stack>
                                        <ListItemText
                                            primary={menu.title}
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: 14,
                                                color: selected ? theme.palette.common.white : theme.palette.grey.primary,
                                                "&:hover": {
                                                    color: selected ? theme.palette.common.white : theme.palette.grey.primary
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        } else {
                            return <></>
                        }
                    }

                    // --- Group menu item ---
                    if (menu.group && menu.items) {
                        const visibleItems = menu.items.filter((item) =>
                            hasPermission(item.permission)
                        );
                        if (visibleItems.length === 0) return null; // hide whole group if no visible child

                        const isChildSelected = menu.items.some(
                            (item) => location.pathname.startsWith(item.path) // ✅ covers nested routes too
                        );
                        const isOpen = openGroups[menu.group] ?? isChildSelected;

                        return (
                            <React.Fragment key={idx}>
                                <ListItemButton onClick={() => toggleGroup(menu.group)}
                                    sx={{
                                        backgroundColor: isChildSelected ? theme.palette.primary[400] : theme.palette.common.white,
                                        "&:hover": {
                                            backgroundColor: isChildSelected ? theme.palette.primary[400] : theme.palette.common.white
                                        }
                                    }}
                                >
                                    <Stack mr={1.5}>
                                        {<menu.icon stroke={isChildSelected ? theme.palette.common.white : theme.palette.grey.primary} />}
                                    </Stack>
                                    <ListItemText primary={menu.group} sx={{
                                        fontWeight: 400,
                                        fontSize: 14,
                                        color: isChildSelected ? theme.palette.common.white : theme.palette.grey.primary,
                                        "&:hover": {
                                            color: isChildSelected ? theme.palette.common.white : theme.palette.grey.primary
                                        }
                                    }} />
                                    {isChildSelected ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {menu.items.map((data) => {
                                            const selected = location.pathname === data.path;
                                            if (data?.permission && hasPermission(data.permission)) {
                                                return (
                                                    <ListItem key={data?.title} disablePadding sx={{}}>
                                                        <ListItemButton
                                                            component={Link}
                                                            to={data?.path}
                                                            selected={selected}
                                                            onClick={() => !isDesktop && onClose()}
                                                            sx={{
                                                                pl: 6,
                                                                backgroundColor: selected ? theme.palette.primary[600] : theme.palette.common.white,
                                                                "&.Mui-selected": {
                                                                    backgroundColor: theme.palette.primary[600],
                                                                    "&:hover": {
                                                                        backgroundColor: theme.palette.primary[600],
                                                                    }
                                                                },
                                                            }}
                                                        >
                                                            <Stack mr={1.5}>
                                                                {<data.icon stroke={selected ? theme.palette.common.white : theme.palette.grey.primary} />}
                                                            </Stack>
                                                            <ListItemText primary={data?.title}
                                                                sx={{
                                                                    fontWeight: 400,
                                                                    fontSize: 14,
                                                                    color: selected ? theme.palette.common.white : theme.palette.grey.primary,
                                                                    "&:hover": {
                                                                        color: selected ? theme.palette.common.white : theme.palette.grey.primary
                                                                    }
                                                                }}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            } else {
                                                return <></>
                                            }
                                        })}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        );

                    }

                    return null; // fallback
                })}
            </List>
        </Drawer>
    );
}
