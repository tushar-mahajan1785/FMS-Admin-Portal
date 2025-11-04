/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Box, Stack, Divider, MenuItem, useTheme } from "@mui/material";
import CustomTextField from "../../../../../components/text-field";
import TypographyComponent from "../../../../../components/custom-typography";
import { useDispatch, useSelector } from "react-redux";
import { actionGetTicketsByAssetTypes, resetGetTicketsByAssetTypesResponse } from "../../../../../store/tickets";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../../../constants";
import { useAuth } from "../../../../../hooks/useAuth";
import { useSnackbar } from "../../../../../hooks/useSnackbar";

export const TicketsByAssetTypesChart = () => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    //Stores
    const { getTicketsByAssetTypes } = useSelector(state => state.ticketsStore)

    //States
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

    const [arrTicketsByAssetTypes, setArrTicketsByAssetTypes] = useState([
        { month: "Electrical", tickets: 1090 },
        { month: "Cooling", tickets: 1735 },
        { month: "BMS", tickets: 2287 },
        { month: "IBMS", tickets: 827 },
        { month: "Other", tickets: 1142 }
    ]);

    const options = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            animations: { enabled: true },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: "9px",
                dataLabels: {
                    position: "right",
                },
            },
        },
        dataLabels: {
            enabled: true,
            textAnchor: "start",
            offsetX: 10,
            style: {
                colors: [theme.palette.text.secondary],
                fontSize: "13px",
            },
            formatter: (val) => val.toLocaleString(),
        },
        xaxis: {
            categories: arrTicketsByAssetTypes?.map((d) => d.month),
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: "13px",
                },
                formatter: (val) =>
                    val >= 1000 ? `${(val / 1000).toFixed(0).padStart(2, "0")}K` : val,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: "13px",
                },
            },
        },
        grid: {
            show: true,
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: {
                lines: {
                    show: true, // ✅ vertical lines visible
                },
            },
            yaxis: {
                lines: {
                    show: false, // ✅ hide horizontal lines
                },
            },
            padding: {
                left: 10,
                right: 20,
            },
        },
        colors: ["#7E57C2"],
        tooltip: {
            theme: theme.palette.mode,
            y: {
                formatter: (val) => `${val.toLocaleString()} tickets`,
            },
        },
    };

    const series = [
        {
            name: "Total Tickets",
            data: arrTicketsByAssetTypes && arrTicketsByAssetTypes !== null && arrTicketsByAssetTypes.length > 0 ? arrTicketsByAssetTypes?.map((d) => d?.tickets) : [],
        },
    ];

    /**
     * Initial Render
     * Get Tickets By Asset Types API Call
     */
    useEffect(() => {
        if (filterValue && filterValue !== null) {
            dispatch(actionGetTicketsByAssetTypes({ type: filterValue }))
        }
    }, [filterValue])

    /**
   * useEffect
   * @dependency : getTicketsByAssetTypes
   * @type : HANDLE API RESULT
   * @description : Handle the result of tickets by asset types API
   */
    useEffect(() => {
        if (getTicketsByAssetTypes && getTicketsByAssetTypes !== null) {
            dispatch(resetGetTicketsByAssetTypesResponse())
            if (getTicketsByAssetTypes?.result === true) {
                setArrTicketsByAssetTypes(getTicketsByAssetTypes?.response)
            } else {
                // setArrTicketsByAssetTypes([])
                switch (getTicketsByAssetTypes?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetTicketsByAssetTypesResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getTicketsByAssetTypes?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getTicketsByAssetTypes])

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
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
            >
                <TypographyComponent
                    fontSize={16}
                    fontWeight={600}
                    sx={{ color: theme.palette.common.black }}
                >
                    Tickets By Asset Types
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
                                    maxHeight: 220,
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

            <Divider sx={{ mb: 2 }} />
            {
                series && series !== null && series.length > 0 ?
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        height={280}
                    />
                    :
                    <></>
            }

        </Box>
    );
};

