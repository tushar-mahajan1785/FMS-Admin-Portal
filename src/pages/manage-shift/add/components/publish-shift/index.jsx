import { Box, Button, Grid, Stack } from "@mui/material";
import moment from "moment";
import TypographyComponent from "../../../../../components/custom-typography";

export default function PublishShiftTable({
    employeeList,
    daysToDisplay,
    rosterData,
    theme,
    getDisplayCurrentColor
}) {
    return (
        <Stack sx={{ gap: 2, mt: 2 }}>
            {employeeList?.map((emp, index) => (
                <Box
                    key={index}
                    sx={{
                        overflowX: "auto",
                        border: `1px solid ${theme.palette.grey[300]}`,
                        borderRadius: "8px",
                        bgcolor: theme.palette.common.white,
                    }}
                >
                    <Grid container alignItems="center" sx={{ p: 2 }}>
                        <Grid size={{ xs: 2 }}>
                            <TypographyComponent fontSize={16} fontWeight={500}>
                                {emp.employee_name}
                            </TypographyComponent>
                            {emp.role_type === "Manager" && (
                                <TypographyComponent
                                    fontSize={14}
                                    fontWeight={400}
                                    sx={{ color: theme.palette.grey[500] }}
                                >
                                    {`${emp.role_type} - ${rosterData?.roster_name}`}
                                </TypographyComponent>
                            )}
                        </Grid>

                        <Grid
                            size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }}
                            container
                            sx={{ flexWrap: "nowrap" }}
                        >
                            {daysToDisplay.map((day, dayIndex) => {
                                const dateKey = moment(day).format("YYYY-MM-DD");
                                const selectedShortName = emp.shift_selection?.[dateKey];
                                const color = getDisplayCurrentColor(selectedShortName);
                                const gridItemSize = rosterData?.schedule_type === "WEEKLY" ? { xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 } : { xs: 0.4, sm: 0.4, md: 0.4, lg: 0.4, xl: 0.4 };

                                return (
                                    <Grid key={dayIndex} size={gridItemSize} display="flex" justifyContent="center">
                                        {selectedShortName && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    minWidth: rosterData?.schedule_type === "WEEKLY" ? 168 : "clamp(24px, 2vw, 32px)",
                                                    px: 1.5,
                                                    height: 32,
                                                    borderRadius: 1,
                                                    fontSize: 12,
                                                    textTransform: "none",
                                                    borderColor: color.dark,
                                                    color: color.text,
                                                    background: `linear-gradient(180deg, ${color.light} 0%, ${color.dark} 100%)`,
                                                    "&:hover": { background: `linear-gradient(180deg, ${color.dark} 0%, ${color.dark} 100%)` }
                                                }} >
                                                {selectedShortName}
                                            </Button>
                                        )}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Stack>
    );
};
