import { Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import TypographyComponent from "../../../components/custom-typography";
import CheckboxIcon from "../../../assets/icons/CheckboxIcon";
import AlertTriangleIcon from "../../../assets/icons/AlertTriangleIcon";
import ClockIcon from "../../../assets/icons/ClockIcon";
import FileXIcon from "../../../assets/icons/FileXIcon";
import { useNavigate, useParams } from "react-router-dom";
import ChevronLeftIcon from "../../../assets/icons/ChevronLeft";

export default function ChecklistView() {
    const theme = useTheme()
    const navigate = useNavigate()
    const { assetId } = useParams()

    //Default Checklists Counts Array
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)


    console.log('------assetId-------', assetId)

    useEffect(() => {

        setGetCurrentAssetGroup({
            "id": 1,
            "asset_type_id": "1",
            "title": "DG Checklist & Reading Report",
            "location": 'Vodafone India Pvt Ltd',
            "total_groups": "2",
            "total_assets": "15",
            "total_checklists": "36",
            "total_completed": "12",
            "total_overdue": "2",
            "total_abnormal": "4",
            "total_pending": "24",
            "total_not_approved": "2",
            "times": [
                {
                    uuid: 'ghghj-huyghhgh',
                    frm: '12:00',
                    to: '02:00'
                },
                {
                    uuid: 'ghsdddj-huyghhgh',
                    frm: '02:00',
                    to: '04:00'
                },
                {
                    uuid: 'ghghj-huyg678hhyhhgh',
                    frm: '04:00',
                    to: '06:00'
                },
                {
                    uuid: 'ghffffghj-444dfff',
                    frm: '06:00',
                    to: '08:00'
                },
                {
                    uuid: 'ghgddfr887hj-huyg555hhgh',
                    frm: '08:00',
                    to: '10:00'
                },
            ]
        })

    }, [])

    return (<>
        <React.Fragment>
            <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1, mb: 3 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate('/checklist')
                }}>
                    <ChevronLeftIcon size={26} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={18} fontWeight={400}>Back to Asset Types</TypographyComponent>
            </Stack>
            <Stack sx={{
                p: '12px',
                height: "100%",
                width: '100%',
                borderRadius: "16px",
                border: `1px solid ${theme.palette.primary[600]}`,
                backgroundColor: theme.palette.common.white,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center'
            }}>
                <Stack sx={{ rowGap: 0.5 }}>
                    <Stack direction="row" gap={2} alignItems="center">
                        <TypographyComponent fontSize={16} fontWeight={500}>
                            {getCurrentAssetGroup?.title}
                        </TypographyComponent>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                            {/* <Stack flexDirection={'row'} sx={{ gap: '16px' }}> */}
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_groups} Groups</TypographyComponent>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_assets} Assets</TypographyComponent>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_checklists} Checklists</TypographyComponent>
                            {/* </Stack> */}
                        </Stack>
                    </Stack>
                    <Stack flexDirection={'row'} columnGap={0.5} sx={{ mb: 1.5 }}>
                        <TypographyComponent fontSize={14} fontWeight={400} color={theme.palette.grey[600]}>
                            Location:
                        </TypographyComponent>
                        <TypographyComponent fontSize={14} fontWeight={500}>
                            {getCurrentAssetGroup?.location}
                        </TypographyComponent>
                    </Stack>
                </Stack>
            </Stack>
        </React.Fragment>
    </>)

}