import { useTheme } from '@emotion/react'
import React from 'react'
import { BootstrapDialog } from '../common'
import { Button, DialogActions, DialogContent, Divider, Stack } from '@mui/material'
import TypographyComponent from '../custom-typography'

export const ShowMorePopup = ({ open, label, value, handleClose }) => {
    const theme = useTheme()
    return (
        <BootstrapDialog open={open} onClose={() => handleClose()} fullWidth maxWidth="sm">
            <DialogContent>
                <TypographyComponent fontSize={18}>{label}</TypographyComponent>
                <Divider sx={{ my: 0.5 }} />
                <Stack sx={{
                    height: 170,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: theme.palette.grey[400],
                        borderRadius: "3px",
                    },
                }}>
                    <TypographyComponent
                        sx={{
                            whiteSpace: "pre-wrap",
                            color: theme.palette.grey[800],
                            fontSize: 16,
                            lineHeight: 1.6,
                        }}
                    >
                        {value}
                    </TypographyComponent>
                </Stack>
            </DialogContent>
            <Divider sx={{ my: 0.5 }} />
            <DialogActions>
                <Button variant="contained" color='primary' sx={{ textAlign: 'left', textTransform: 'capitalize', background: theme.palette.primary[600], color: theme.palette.common.white }} onClick={() => handleClose()}>
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}
