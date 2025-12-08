// BottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import ClipboardIcon from "../../assets/icons/ClipboardIcon";
import BoxPackedIcon from "../../assets/icons/BoxPackedIcon";
import { Badge } from "@mui/material";
import TechnicianTicketIcon from "../../assets/icons/TechnicianTicketIcon";

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
                        paddingTop: "30px",
                        paddingBottom: "28px",
                    },

                    // label default
                    "& .MuiBottomNavigationAction-label": {
                        fontSize: "12px",
                        lineHeight: "16px",
                        marginTop: "5px",
                        transition: "none",
                        color: theme.palette.grey[400],
                    },

                    // label when selected → keep same size
                    "& .Mui-selected .MuiBottomNavigationAction-label": {
                        fontSize: "12px !important",
                        lineHeight: "16px !important",
                        marginTop: "5px",
                        color: theme.palette.primary[600],
                        fontWeight: 500
                    },
                }}

            >
                <BottomNavigationAction label="Dashboard"
                    icon={<DashboardIcon size={22} strokeWidth={isSelected(0) ? 1.5 : 1.2} stroke={isSelected(0) ? theme.palette.primary[600] : theme.palette.grey[400]} />}
                />
                <BottomNavigationAction label="Checklists"
                    icon={
                        <Badge badgeContent={3} color="error" sx={{
                            "& .MuiBadge-badge": {
                                top: -4,
                                right: -6,
                                fontSize: "10px",
                                minWidth: 16,
                                height: 16,
                            }
                        }}>
                            <ClipboardIcon size={22} strokeWidth={isSelected(1) ? 1.8 : 1.5} stroke={isSelected(1) ? theme.palette.primary[600] : theme.palette.grey[400]} />
                        </Badge>
                    }
                />
                <BottomNavigationAction label="Assets"
                    icon={<BoxPackedIcon size={22} strokeWidth={isSelected(2) ? 1.8 : 1.5} stroke={isSelected(2) ? theme.palette.primary[600] : theme.palette.grey[400]} />}
                />
                <BottomNavigationAction label="Tickets"
                    icon={
                        <Badge badgeContent={3} color="error" sx={{
                            "& .MuiBadge-badge": {
                                top: -4,
                                right: -6,
                                fontSize: "10px",
                                minWidth: 16,
                                height: 16,
                            }
                        }}>
                            <TechnicianTicketIcon strokeWidth={isSelected(3) ? 1.8 : 1.5} size={22} stroke={isSelected(3) ? theme.palette.primary[600] : theme.palette.grey[400]} />
                        </Badge>
                    }
                />
                <BottomNavigationAction label="Profile"
                    icon={<ProfileIcon size={22} strokeWidth={isSelected(4) ? 1.8 : 1.5} stroke={isSelected(4) ? theme.palette.primary[600] : theme.palette.grey[400]} />}
                />
            </BottomNavigation>
        </Paper>
    );
}
