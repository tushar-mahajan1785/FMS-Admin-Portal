import { Box, Divider, MenuItem, Stack, useTheme } from '@mui/material';
import TypographyComponent from '../../../../../components/custom-typography';
import { useState } from 'react';
import CustomTextField from '../../../../../components/text-field';
import { BarChart } from '@mui/x-charts';

export const SixMonthsTotalTicketChart = () => {
    const theme = useTheme();

    const [filterValue, setFilterValue] = useState('6 Months')
    const [filterOptions] = useState([{
        label: '6 Months',
        value: '6 Months'
    }])

    const [sixMonthsTicketsData] = useState([
        { totalTickets: 2090, month: 'January' },
        { totalTickets: 2735, month: 'February' },
        { totalTickets: 2287, month: 'March' },
        { totalTickets: 827, month: 'April' },
        { totalTickets: 1142, month: 'May' },
        { totalTickets: 118, month: 'June' }
    ]);

    const chartSetting = {
        series: [{ dataKey: 'totalTickets', label: 'Total Tickets', valueFormatter: (value) => value.toLocaleString() }], // Use the new dataKey and ensure labels are shown

        // xAxis: [{ label: 'rainfall (mm)' }],
        height: 220,
        margin: { left: 0 },

        // --- MODIFICATION 4: Configure X-Axis to match the second image's scale (0K, 1K, 2K, etc.) ---
        xAxis: [
            {
                tickNumber: 5, // Approximate number of ticks
                valueFormatter: (value) => {
                    if (value === 0) return '0';
                    return (value / 500) + 'K';
                }
            }
        ]
    };

    return (
        <Box
            sx={{
                background: theme.palette.common.white,
                border: `1px solid ${theme.palette.grey[200]}`,
                padding: '24px',
                borderRadius: '8px',
                height: '100%'
            }}
        >
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyComponent
                    fontSize={16}
                    fontWeight={600}
                    sx={{ color: theme.palette.common.black }}
                >
                    6 Months Total Tickets
                </TypographyComponent>
                <CustomTextField
                    select
                    fullWidth
                    sx={{ width: 170 }}
                    value={filterValue}
                    onChange={(event) => {
                        setFilterValue(event.target.value)
                    }}
                    SelectProps={{
                        displayEmpty: true,
                        MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 220, // Set your desired max height
                                    scrollbarWidth: 'thin'
                                }
                            }
                        }
                    }}
                >
                    <MenuItem value=''>
                        <em>Select Filter</em>
                    </MenuItem>
                    {filterOptions &&
                        filterOptions.map(option => (
                            <MenuItem
                                key={option?.value}
                                value={option?.value}
                                sx={{
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    maxWidth: 300,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {option?.label}
                            </MenuItem>
                        ))}
                </CustomTextField>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            {/* Donut + Legends container */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ height: '100%' }}>
                {/* Chart container */}
                <BarChart
                    dataset={sixMonthsTicketsData}
                    yAxis={[
                        { scaleType: 'band', dataKey: 'month' }
                    ]}
                    // --- Use series from chartSetting to ensure valueFormatter is applied for labels ---
                    // The series is now configured in chartSetting to ensure labels are displayed.
                    // This is necessary because data labels are often tied to the series configuration.
                    // series={[{ dataKey: 'totalTickets', label: 'Total Tickets', valueFormatter }]} 

                    layout="horizontal"
                    grid={{ vertical: true }}
                    barCategoryGap={0}
                    {...chartSetting}
                    sx={{
                        '& .MuiChartsLegend-root': {
                            display: 'none',
                        },
                        // --- MODIFICATION 2: Change bar color to purple ---
                        '& .MuiBarElement-root': {
                            fill: theme.palette.primary.main, // Assuming your primary color is purple or a suitable alternative. Use a specific color if needed, e.g., '#8A2BE2' for BlueViolet.
                            // If primary is not purple, use a hex code like the one below:
                            // fill: '#9C27B0', // A shade of purple
                        },
                        // --- MODIFICATION 3: Add the data labels ---
                        '& .MuiMarkElement-root': {
                            display: 'none', // Hide default marks if any
                        },
                        // This part is crucial for showing the labels on the horizontal bar chart
                        // MUI X Charts automatically positions the label based on the valueFormatter in the series config
                        '& .MuiChartsText-root:last-child': {
                            fontWeight: 600,
                        },
                    }}
                />

            </Stack>
        </Box>
    );
};