import { IconButton, Stack } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
import TypographyComponent from "../../../components/custom-typography";

export default function ViewDocument() {
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <Stack sx={{ flexDirection: 'row', alignItems:'center' }}>
                <Stack>
                    <IconButton
                        onClick={() => {
                            navigate('/documents')
                        }}
                    >
                        <ArrowBackIosIcon fontSize={'small'} />
                    </IconButton>
                </Stack>
                <Stack>
                    <TypographyComponent fontSize={16} fontWeight={400}>Back to Documents</TypographyComponent>
                </Stack>
            </Stack>
        </React.Fragment>
    )
}