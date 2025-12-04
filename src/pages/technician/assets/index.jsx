/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useTheme } from "@emotion/react";
import { Grid } from "@mui/material";

export default function TechnicianAsset() {
    const theme = useTheme()

    /**
     * Initial Render
     */
    useEffect(() => {
    }, [])

    return (
        <React.Fragment>
            <Grid container spacing={3} sx={{
                background: theme.palette.common.white, padding: 3, borderRadius: '12px', border: `1px solid ${theme.palette.grey[200]}`
            }} flexDirection={'row'} width={'100%'} mt={3}>
                Technician Asset
            </Grid>
        </React.Fragment>
    );
}
