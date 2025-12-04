// BottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import ReportsIcon from "../../assets/icons/ReportsIcon";
import AssetIcon from "../../assets/icons/AssetIcon";
import UserIcon from "../../assets/icons/UserIcon";

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
            }}
            elevation={5}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={handleChange}
            >
                <BottomNavigationAction label="Dashboard"
                    icon={<DashboardIcon size={18} stroke={isSelected(0) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
                <BottomNavigationAction label="Checklist"
                    icon={<ReportsIcon size={20} stroke={isSelected(1) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
                <BottomNavigationAction label="Asset"
                    icon={<AssetIcon size={18} stroke={isSelected(2) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
                <BottomNavigationAction label="Ticket"
                    icon={<ChatIcon size={18} stroke={isSelected(3) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
                <BottomNavigationAction label="Profile"
                    icon={<UserIcon size={18} stroke={isSelected(4) ? theme.palette.primary[600] : theme.palette.grey[600]} />}
                />
            </BottomNavigation>
        </Paper>
    );
}
