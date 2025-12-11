import { Grid } from "@mui/material";
import TypographyComponent from "../../../../../components/custom-typography";

export default function HeaderDays({ daysToDisplay, leftHeader, isMDDown, theme, activePage, rosterData }) {
    return (
        <Grid
            container
            sx={{
                px: 2,
                py: 1,
                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                minWidth: isMDDown ? "1600px" : "",
            }}
        >
            {/* Left side */}
            <Grid
                size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
                display="flex"
                alignItems="center"
            >
                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[600] }}>
                    {leftHeader}
                </TypographyComponent>
            </Grid>

            {/* Dynamic Days */}
            <Grid 
            size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} 
            container
            sx={{ flexWrap: "nowrap" }}
            >
                {daysToDisplay.map((day, index) => {
                    const dayFormat = day.format("ddd").toUpperCase()
                    const dateFormat = day.format("D MMM")
                    const gridItemSize = activePage === 'Preview' || rosterData?.schedule_type === 'WEEKLY' ? { xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 } : { xs: 0.4, sm: 0.4, md: 0.4, lg: 0.4, xl: 0.4 }
                    return (
                        <Grid key={index} size={gridItemSize} textAlign="center">
                            <TypographyComponent fontSize={16} fontWeight={600}>{activePage === 'Preview' || rosterData?.schedule_type === 'WEEKLY' ? dayFormat : ''}</TypographyComponent>
                            <TypographyComponent fontSize={18} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                {dateFormat}
                            </TypographyComponent>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
};
