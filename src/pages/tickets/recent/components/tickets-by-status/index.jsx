import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Divider, MenuItem, Stack, useTheme } from '@mui/material';
import TypographyComponent from '../../../../../components/custom-typography';
import { valueFormatter } from '../../../../../utils';
import { useState } from 'react';
import CustomTextField from '../../../../../components/text-field';
import FormLabel from '../../../../../components/form-label';

export const TicketsByStatusChart = () => {
    const theme = useTheme();

    const [filterValue, setFilterValue] = useState('This Week')
    const [filterOptions] = useState([{
        label: 'This Week',
        value: 'This Week'
    },
    {
        label: 'This Month',
        value: 'This Month'
    },
    {
        label: 'Last 6 Months',
        value: 'Last 6 Months'
    }])
    const [ticketsByStatusData] = useState([
        { label: 'Active', value: 16, color: theme.palette.primary[600] },
        { label: 'In Progress', value: 7, color: theme.palette.info.main },
        { label: 'Closed', value: 4, color: theme.palette.error[600] },
    ])

    return (
        <Box
            sx={{
                background: theme.palette.common.white,
                border: `1px solid ${theme.palette.grey[200]}`,
                padding: '24px',
                borderRadius: '8px',
            }}
        >
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyComponent
                    fontSize={16}
                    fontWeight={600}
                    sx={{ color: theme.palette.common.black }}
                >
                    Tickets By Status
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
                                    whiteSpace: 'normal',        // allow wrapping
                                    wordBreak: 'break-word',     // break long words if needed
                                    maxWidth: 300,               // control dropdown width
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,          // limit to 2 lines
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
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                {/* Chart container */}
                <Box sx={{ position: 'relative', width: 250, height: 250 }}>
                    <PieChart
                        height={250}
                        width={250}
                        series={[
                            {
                                data: ticketsByStatusData,
                                innerRadius: 90,
                                outerRadius: 120,
                                arcLabelMinAngle: 20,
                                valueFormatter,
                            },
                        ]}
                        sx={{
                            '& .MuiChartsLegend-root': {
                                display: 'none',
                            },
                        }}
                        // hide internal legend; we'll make custom one on the right
                        slotProps={{ legend: { hidden: true } }}
                    />

                    {/* Center overlay text */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <TypographyComponent
                            fontSize={26}
                            fontWeight={700}
                            sx={{ color: theme.palette.text.primary, lineHeight: 1 }}
                        >
                            27
                        </TypographyComponent>
                        <TypographyComponent
                            fontSize={14}
                            fontWeight={500}
                            sx={{ color: theme.palette.text.secondary }}
                        >
                            Total Tickets
                        </TypographyComponent>
                    </Box>
                </Box>

                {/* Custom legends on right side */}
                <Box>
                    <Stack spacing={1.5}>
                        {ticketsByStatusData.map((item) => (
                            <Stack key={item.label} alignItems="center" spacing={1.2}>
                                <TypographyComponent fontSize={14} fontWeight={500}>
                                    {item.label}
                                </TypographyComponent>
                                <Stack sx={{ flexDirection: 'row', alignItems: 'center', columnGap: 1 }}>

                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: item.color,
                                        }}
                                    />
                                    <TypographyComponent
                                        fontSize={14}
                                        fontWeight={600}
                                        sx={{ color: theme.palette.text.primary }}
                                    >
                                        {item.value}
                                    </TypographyComponent>
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};
