/* eslint-disable react-hooks/exhaustive-deps */
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Divider, MenuItem, Stack, useTheme } from '@mui/material';
import TypographyComponent from '../../../../../components/custom-typography';
import { valueFormatter } from '../../../../../utils';
import { useEffect, useState } from 'react';
import CustomTextField from '../../../../../components/text-field';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetTicketsByStatus, resetGetTicketsByStatusResponse } from '../../../../../store/tickets';
import { useAuth } from '../../../../../hooks/useAuth';
import { useSnackbar } from '../../../../../hooks/useSnackbar';
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../../constants';
import { useBranch } from '../../../../../hooks/useBranch';
import EmptyContent from '../../../../../components/empty_content';

export const TicketsByStatusChart = () => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()

    let is_update = window.localStorage.getItem('ticket_update')

    //Stores
    const { getTicketsByStatus } = useSelector(state => state.ticketsStore)

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
    const [ticketsByStatusData, setTicketsByStatusData] = useState([])
    const [totalTicketsCount, setTotalTicketsCount] = useState(0)

    /**
     * Initial Render
     * Get Tickets By Status API Call
     */
    useEffect(() => {
        if ((filterValue && filterValue !== null && branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) || is_update == true) {
            dispatch(actionGetTicketsByStatus({ type: filterValue, branch_uuid: branch?.currentBranch?.uuid }))
        }
    }, [filterValue, branch?.currentBranch?.uuid, is_update])

    /**
   * useEffect
   * @dependency : getTicketsByStatus
   * @type : HANDLE API RESULT
   * @description : Handle the result of tickets by status API
   */
    useEffect(() => {
        if (getTicketsByStatus && getTicketsByStatus !== null) {
            dispatch(resetGetTicketsByStatusResponse())
            if (getTicketsByStatus?.result === true) {
                setTicketsByStatusData(getTicketsByStatus?.response?.data)
                setTotalTicketsCount(getTicketsByStatus?.response?.total)
            } else {
                setTicketsByStatusData([])
                setTotalTicketsCount(0)
                switch (getTicketsByStatus?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetTicketsByStatusResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getTicketsByStatus?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getTicketsByStatus])

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
            {
                ticketsByStatusData && ticketsByStatusData !== null && ticketsByStatusData.length > 0 ?
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
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
                                    {totalTicketsCount && totalTicketsCount !== null ? totalTicketsCount : '0'}
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
                            <Stack spacing={2} sx={{ textAlign: 'left' }}>
                                {ticketsByStatusData.map((item) => (
                                    <Stack key={item.label} alignItems="flex-start" spacing={0.4}>
                                        <TypographyComponent fontSize={14} fontWeight={400}>
                                            {item.label}
                                        </TypographyComponent>
                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', columnGap: 1, marginTop: '-29px' }}>
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
                                                sx={{ color: theme.palette.text.primary, lineHeight: '20px', }}
                                            >
                                                {item.value}
                                            </TypographyComponent>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                    :
                    <EmptyContent imageSize={250} mt={0} imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Tickets Found'} subTitle={''} />

            }

        </Box >
    );
};
