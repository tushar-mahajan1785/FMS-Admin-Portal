import { Box, Button, FormControlLabel, Grid, Stack } from "@mui/material";
import moment from "moment";
import { AntSwitch } from "../../../../../components/common";
import TypographyComponent from "../../../../../components/custom-typography";

export default function PreviewShiftTable({
    employeeList,
    daysToDisplay,
    theme,
    setEmployeeShiftScheduleMasterOption,
    getCurrentColor,
    rosterData
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
                        {/* Employee info + switch */}
                        <Grid size={{ xs: 2 }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <FormControlLabel
                                    sx={{ m: 0 }}
                                    control={
                                        <AntSwitch
                                            checked={emp.status === "Active"}
                                            onChange={() =>
                                                setEmployeeShiftScheduleMasterOption(prev =>
                                                    prev.map((item, i) =>
                                                        i === index
                                                            ? {
                                                                ...item,
                                                                status: item.status === "Active" ? "Inactive" : "Active",
                                                            }
                                                            : item
                                                    )
                                                )
                                            }
                                        />
                                    }
                                />

                                <TypographyComponent fontSize={16} fontWeight={500}>
                                    {emp.employee_name}
                                </TypographyComponent>
                            </Box>
                            {emp.role_type === "Manager" && (
                                <TypographyComponent
                                    fontSize={14}
                                    fontWeight={400}
                                    sx={{ color: theme.palette.grey[500], ml: 4.5 }}
                                >
                                    {`${emp.role_type} - ${rosterData?.roster_name}`}
                                </TypographyComponent>
                            )}
                        </Grid>

                        {/* Shifts */}
                        <Grid size={{ xs: 10 }} container>
                            {daysToDisplay.map((day, dayIndex) => {
                                const dateKey = moment(day).format("YYYY-MM-DD");
                                const selectedShortName = emp.shift_selection?.[dateKey];

                                return (
                                    <Grid
                                        key={dayIndex}
                                        size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }}
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        flexWrap="wrap"
                                    >
                                        {emp?.shifts?.map((s, shiftIndex) => {
                                            const isSelected = selectedShortName === s.short_name;
                                            const currentColor = getCurrentColor(s.short_name, isSelected);

                                            return (
                                                <Button
                                                    key={`${dateKey}-${shiftIndex}`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        minWidth: 32,
                                                        height: 32,
                                                        borderRadius: 1,
                                                        fontSize: 12,
                                                        textTransform: "none",
                                                        borderColor: isSelected
                                                            ? currentColor.dark
                                                            : theme.palette.grey[300],
                                                        color: isSelected
                                                            ? currentColor.text
                                                            : theme.palette.grey[700],
                                                        background: isSelected
                                                            ? `linear-gradient(180deg, ${currentColor.light} 0%, ${currentColor.dark} 100%)`
                                                            : "transparent",
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            background: isSelected
                                                                ? `linear-gradient(180deg, ${currentColor.dark} 0%, ${currentColor.dark} 100%)`
                                                                : theme.palette.action.hover,
                                                        },
                                                        marginRight: 0.2
                                                    }}
                                                    onClick={() =>
                                                        setEmployeeShiftScheduleMasterOption(prev =>
                                                            prev.map((item, i) => {
                                                                if (i !== index) return item;
                                                                const newSel = { ...item.shift_selection };
                                                                if (newSel[dateKey] === s.short_name) delete newSel[dateKey];
                                                                else newSel[dateKey] = s.short_name;
                                                                return { ...item, shift_selection: newSel };
                                                            })
                                                        )
                                                    }
                                                >
                                                    {s.short_name}
                                                </Button>
                                            );
                                        })}
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
