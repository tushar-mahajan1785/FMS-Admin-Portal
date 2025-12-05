// BottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import TicketIcon from "../../assets/icons/TicketIcon";
import BoxIcon from "../../assets/icons/BoxIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import ClipboardIcon from "../../assets/icons/ClipboardIcon";
import BoxPackedIcon from "../../assets/icons/BoxPackedIcon";
import { Badge } from "@mui/material";


export default function BottomNav({ value, onChange }) {
    const navigate = useNavigate()
    const theme = useTheme()

    const isSelected = (index) => value === index;

    const handleChange = (event, newValue) => {
        onChange(newValue);

        // Route mapping by tab index
        const routes = ["/", "/checklist", "/assets", "/tickets", "/profile"];

        navigate(routes[newValue]);
    };

    return (
        <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                pt: 1,
                pb: 1,
                // pb: "env(safe-area-inset-bottom)", // iPhone bottom padding safety
            }}
            elevation={5}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={handleChange}
                sx={{
                    "& .MuiBottomNavigationAction-root": {
                        minWidth: "auto",
                        paddingTop: "28px",
                        paddingBottom: "18px",
                    },

                    // label default
                    "& .MuiBottomNavigationAction-label": {
                        fontSize: "12px",
                        lineHeight: "16px",   // prevent jumping
                        marginTop: "4px",     // spacing between icon & text
                        transition: "none",   // stop animation
                    },

                    // label when selected → keep same size
                    "& .Mui-selected .MuiBottomNavigationAction-label": {
                        fontSize: "12px !important",
                        lineHeight: "16px !important",
                        marginTop: "4px",
                    },

                    // prevent icon from jumping
                    "& .MuiBottomNavigationAction-root.Mui-selected": {
                        // paddingTop: "6px",
                    }
                }}

            >
                <BottomNavigationAction label="Dashboard"
                    icon={<DashboardIcon size={24} stroke={isSelected(0) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
                <BottomNavigationAction label="Checklists"
                    icon={
                        <Badge badgeContent={3} color="error" sx={{
                            "& .MuiBadge-badge": {
                                top: -4,        // move badge down (increase value for more space)
                                right: -6,      // move badge left (increase value for more space)
                                fontSize: "10px",
                                minWidth: 16,
                                height: 16,
                            }
                        }}>
                            <ClipboardIcon size={24} stroke={isSelected(1) ? theme.palette.primary[600] : theme.palette.grey[600]} />
                        </Badge>
                    }
                />
                <BottomNavigationAction label="Assets"
                    icon={<BoxPackedIcon size={24} stroke={isSelected(2) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
                <BottomNavigationAction label="Tickets"
                    icon={
                        <Badge badgeContent={3} color="error" sx={{
                            "& .MuiBadge-badge": {
                                top: -4,        // move badge down (increase value for more space)
                                right: -6,      // move badge left (increase value for more space)
                                fontSize: "10px",
                                minWidth: 16,
                                height: 16,
                            }
                        }}>
                            <TicketIcon size={24} stroke={isSelected(3) ? theme.palette.primary[600] : theme.palette.grey[600]} />
                        </Badge>
                    }
                />
                <BottomNavigationAction label="Profile"
                    icon={<ProfileIcon size={24} stroke={isSelected(4) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
            </BottomNavigation>
        </Paper>
    );
}
