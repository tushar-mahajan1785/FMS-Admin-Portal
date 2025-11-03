import { Box, Divider, Stack, useTheme } from '@mui/material';
import TypographyComponent from '../../../../../components/custom-typography';
import { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export const SixMonthsTotalTicketChart = () => {
    const theme = useTheme();

    const [sixMonthsTicketsData] = useState([
        { totalTickets: 2090, month: 'January' },
        { totalTickets: 2735, month: 'February' },
        { totalTickets: 2287, month: 'March' },
        { totalTickets: 827, month: 'April' },
        { totalTickets: 1142, month: 'May' },
        { totalTickets: 118, month: 'June' },
    ]);

    const chartHeight = 280;

    return (
        <Box
            sx={{
                background: theme.palette.common.white,
                border: `1px solid ${theme.palette.grey[200]}`,
                padding: '24px',
                borderRadius: '8px',
                height: '100%',
            }}
        >
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyComponent
                    fontSize={16}
                    fontWeight={600}
                    sx={{ color: theme.palette.common.black }}
                >
                    Last 6 Months Total Tickets
                </TypographyComponent>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            {/* Chart */}
            <BarChart
                dataset={sixMonthsTicketsData}
                yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                series={[
                    {
                        dataKey: 'totalTickets',
                        label: 'Total Tickets',
                        valueFormatter: (value) => value.toLocaleString(),
                    },
                ]}
                layout="horizontal"
                height={chartHeight}
                // margin={{ right: 40 }}
                grid={{ vertical: true }}
                xAxis={[
                    {
                        tickNumber: 5,
                        valueFormatter: (value) =>
                            value === 0 ? '0' : `${Math.round(value / 1000)}K`,
                    },
                ]}
                slotProps={{
                    barLabel: ({ value, x, y, width, height }) => {
                        // if width is small, place label outside and dark
                        const inside = width > 60;
                        const textColor = inside ? '#fff' : theme.palette.text.primary;
                        const textX = inside ? x + width - 8 : x + width + 8;
                        const textY = y + height / 2 + 4;

                        return (
                            <text
                                x={textX}
                                y={textY}
                                fill={textColor}
                                textAnchor={inside ? 'end' : 'start'}
                                fontSize={12}
                                fontWeight={600}
                            >
                                {value.toLocaleString()}
                            </text>
                        );
                    },
                }}
                sx={{
                    '& .MuiChartsLegend-root': { display: 'none' },
                    '& .MuiBarElement-root': {
                        fill: theme.palette.primary.main,
                        rx: 6,
                    },
                }}
            />
        </Box>
    );
};
