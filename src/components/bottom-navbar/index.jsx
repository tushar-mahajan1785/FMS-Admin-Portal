// BottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper, useTheme, Badge, Fab, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Icons
import DashboardIcon from "../../assets/icons/DashboardIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import ClipboardIcon from "../../assets/icons/ClipboardIcon";
import BoxPackedIcon from "../../assets/icons/BoxPackedIcon";
import TechnicianTicketIcon from "../../assets/icons/TechnicianTicketIcon";
import FloatingAddIcon from "../../assets/icons/FloatingAddIcon";

export default function BottomNav({ value, onChange }) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    // Route mapping by tab index
    const routes = ["/", "/checklist", "/assets", "/tickets", "/profile"];

    // Update selected tab when URL changes
    // useEffect(() => {
    //     const currentIndex = routes.findIndex((path) =>
    //         location.pathname.startsWith(path)
    //     );

    //     if (currentIndex !== -1 && currentIndex !== value) {
    //         onChange(currentIndex);
    //     }
    // }, [location.pathname]);



    const isSelected = (index) => value === index;

    const handleChange = (event, newValue) => {
        if (value !== newValue) {
            onChange(newValue);
            navigate(routes[newValue]);
        }

    };

    return (
        <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}>

            {value === 3 ?

                <Fab
                    sx={{
                        position: "absolute",
                        right: 16,
                        top: -58,
                        width: 52,
                        height: 52,
                        boxShadow: 4,
                        background: theme.palette.primary[700],
                        '&:hover': {
                            background: theme.palette.primary[700]
                        }
                    }}
                    onClick={() => {
                        console.log("FAB Clicked");
                    }}
                >
                    <FloatingAddIcon />
                </Fab>
                :
                <></>
            }

            {/* 🔽 BOTTOM NAV BAR */}
            <Paper elevation={5} sx={{ pt: 1, pb: 1 }}>
                {/* <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                pt: 1,
                pb: 1,
            }}
            elevation={5}
        > */}
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleChange}
                    sx={{
                        "& .MuiBottomNavigationAction-root": {
                            minWidth: "auto",
                            paddingTop: "30px",
                            paddingBottom: "28px",
                        },
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: "12px",
                            lineHeight: "16px",
                            marginTop: "5px",
                            transition: "none",
                            color: theme.palette.grey[400],
                        },
                        "& .Mui-selected .MuiBottomNavigationAction-label": {
                            fontSize: "12px !important",
                            lineHeight: "16px !important",
                            marginTop: "5px",
                            color: theme.palette.primary[600],
                            fontWeight: 500,
                        },
                    }}
                >
                    <BottomNavigationAction
                        label="Dashboard"
                        icon={
                            <DashboardIcon
                                size={22}
                                strokeWidth={isSelected(0) ? 1.5 : 1.2}
                                stroke={
                                    isSelected(0)
                                        ? theme.palette.primary[600]
                                        : theme.palette.grey[400]
                                }
                            />
                        }
                    />

                    <BottomNavigationAction
                        label="Checklists"
                        icon={
                            <Badge
                                badgeContent={3}
                                color="error"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        top: -4,
                                        right: -6,
                                        fontSize: "10px",
                                        minWidth: 16,
                                        height: 16,
                                    },
                                }}
                            >
                                <ClipboardIcon
                                    size={22}
                                    strokeWidth={isSelected(1) ? 1.8 : 1.5}
                                    stroke={
                                        isSelected(1)
                                            ? theme.palette.primary[600]
                                            : theme.palette.grey[400]
                                    }
                                />
                            </Badge>
                        }
                    />

                    <BottomNavigationAction
                        label="Assets"
                        icon={
                            <BoxPackedIcon
                                size={22}
                                strokeWidth={isSelected(2) ? 1.8 : 1.5}
                                stroke={
                                    isSelected(2)
                                        ? theme.palette.primary[600]
                                        : theme.palette.grey[400]
                                }
                            />
                        }
                    />

                    <BottomNavigationAction
                        label="Tickets"
                        icon={
                            <Badge
                                badgeContent={3}
                                color="error"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        top: -4,
                                        right: -6,
                                        fontSize: "10px",
                                        minWidth: 16,
                                        height: 16,
                                    },
                                }}
                            >
                                <TechnicianTicketIcon
                                    size={22}
                                    strokeWidth={isSelected(3) ? 1.8 : 1.5}
                                    stroke={
                                        isSelected(3)
                                            ? theme.palette.primary[600]
                                            : theme.palette.grey[400]
                                    }
                                />
                            </Badge>
                        }
                    />

                    <BottomNavigationAction
                        label="Profile"
                        icon={
                            <ProfileIcon
                                size={22}
                                strokeWidth={isSelected(4) ? 1.8 : 1.5}
                                stroke={
                                    isSelected(4)
                                        ? theme.palette.primary[600]
                                        : theme.palette.grey[400]
                                }
                            />
                        }
                    />
                </BottomNavigation>
                {/* </Paper> */}
            </Paper >
        </Box >
    );
}