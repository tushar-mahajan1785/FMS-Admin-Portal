import { Avatar, Button, IconButton, Stack, useTheme } from "@mui/material"
import TypographyComponent from "../../../../components/custom-typography"
import { IMAGES_SCREEN_NO_DATA } from "../../../../constants"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import AddTechnicianTicket from "../../ticket/add"

export default function TechnicianDashboardView() {
    const theme = useTheme()
    const navigate = useNavigate();

    // store
    const { technicianDashboardDetails } = useSelector(state => state.technicianDashboardStore)

    const [abnormalSuggestionData, setAbnormalSuggestionData] = useState([])
    const [openAddTicketPopup, setOpenAddTicketPopup] = useState(false)
    const [abnormalitiesDetails, setAbnormalitiesDetails] = useState(null)
    /**
     * useEffect
     * @dependency : technicianDashboardDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of technician Dashboard Details API
    */
    useEffect(() => {
        if (technicianDashboardDetails && technicianDashboardDetails !== null) {
            if (technicianDashboardDetails?.result === true) {
                setAbnormalSuggestionData(technicianDashboardDetails?.response?.abnormal_checklists)
            } else {
                setAbnormalSuggestionData([])
            }
        }
    }, [technicianDashboardDetails])

    return (
        <React.Fragment>
            <Stack sx={{ rowGap: 1 }}>
                <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                        onClick={() => {
                            navigate('/')
                        }}
                        sx={{ color: "back" }}
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <TypographyComponent fontSize={18} fontWeight={500}>Smart Suggestions</TypographyComponent>
                </Stack>
                {
                    abnormalSuggestionData && abnormalSuggestionData !== null && abnormalSuggestionData?.length > 0 ?
                        abnormalSuggestionData.map((obj, index) => {
                            return (
                                <Stack
                                    key={index}
                                    sx={{
                                        mb: 1,
                                        background: theme.palette.warning[50],
                                        padding: '16px',
                                        border: `1px solid ${theme.palette.warning[200]}`,
                                        borderRadius: '8px',
                                        lineHeight: '20px',
                                        gap: 0.8
                                    }}
                                >
                                    <TypographyComponent fontSize={16} fontWeight={500}>{obj?.asset_name}</TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={400}>{obj?.reason}</TypographyComponent>
                                    <Button sx={{ color: theme.palette.common.white, background: theme.palette.common.black, textTransform: 'capitalize' }}
                                        onClick={() => {
                                            setOpenAddTicketPopup(true)
                                            setAbnormalitiesDetails(obj)
                                        }}
                                    >Create Ticket</Button>
                                </Stack>
                            )
                        })
                        :
                        <Stack sx={{ background: theme.palette.common.white, py: 4, mt: 0, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                            <TypographyComponent fontSize={16} fontWeight={400}>No Smart Suggestions Found</TypographyComponent>
                        </Stack>
                }
            </Stack>
            <AddTechnicianTicket
                open={openAddTicketPopup}
                abnormality={abnormalitiesDetails}
                handleClose={() => {
                    setOpenAddTicketPopup(false)
                    setAbnormalitiesDetails(null)
                }}
            />
        </React.Fragment>

    )
}