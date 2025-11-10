/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Box, Stack, Divider, useTheme } from "@mui/material";
import TypographyComponent from "../../../../../components/custom-typography";
import { useDispatch, useSelector } from "react-redux";
import { actionGetLastSixMonthsTickets, resetGetLastSixMonthsTicketsResponse } from "../../../../../store/tickets";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../../../constants";
import { useAuth } from "../../../../../hooks/useAuth";
import { useSnackbar } from "../../../../../hooks/useSnackbar";
import { useBranch } from "../../../../../hooks/useBranch";
import EmptyContent from "../../../../../components/empty_content";

export const SixMonthsTotalTicketChart = () => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()

    let is_update = window.localStorage.getItem('ticket_update')

    //Stores
    const { getLastSixMonthsTickets } = useSelector(state => state.ticketsStore)

    //States
    const [sixMonthsTotalTicketData, setSixMonthsTotalTicketData] = useState([]);

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
            categories: sixMonthsTotalTicketData?.map((d) => d.month),
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
            name: "Last 6 Months Tickets",
            data: sixMonthsTotalTicketData && sixMonthsTotalTicketData !== null && sixMonthsTotalTicketData.length > 0 ? sixMonthsTotalTicketData?.map((d) => d?.tickets) : [],
        },
    ];

    /**
     * Initial Render
     * Get last 6 month tickets API Call
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionGetLastSixMonthsTickets({
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }

    }, [branch?.currentBranch?.uuid, is_update])

    /**
   * useEffect
   * @dependency : getLastSixMonthsTickets
   * @type : HANDLE API RESULT
   * @description : Handle the result of last 6 months tickets API
   */
    useEffect(() => {
        if (getLastSixMonthsTickets && getLastSixMonthsTickets !== null) {
            dispatch(resetGetLastSixMonthsTicketsResponse())
            if (getLastSixMonthsTickets?.result === true) {
                setSixMonthsTotalTicketData(getLastSixMonthsTickets?.response)
            } else {
                setSixMonthsTotalTicketData([])
                switch (getLastSixMonthsTickets?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetLastSixMonthsTicketsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getLastSixMonthsTickets?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getLastSixMonthsTickets])

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
                pt={1}
                mb={2}
            >
                <TypographyComponent
                    fontSize={16}
                    fontWeight={600}
                    sx={{ color: theme.palette.common.black }}
                >
                    Last 6 Months Total Tickets
                </TypographyComponent>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            {
                sixMonthsTotalTicketData && sixMonthsTotalTicketData !== null && sixMonthsTotalTicketData.length > 0 ?
                    <>
                        {
                            series && series !== null && series.length > 0 ?
                                <Chart
                                    options={options}
                                    series={series}
                                    type="bar"
                                    height={280}
                                />
                                :
                                <EmptyContent imageSize={250} mt={0} imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Tickets Found'} subTitle={''} />
                        }
                    </>
                    :
                    <EmptyContent imageSize={250} mt={0} imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Tickets Found'} subTitle={''} />
            }
        </Box>
    );
};

