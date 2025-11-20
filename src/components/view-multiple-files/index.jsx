import { useTheme } from '@emotion/react'
import React from 'react'
import { BootstrapDialog } from '../common'
import { Button, DialogActions, DialogContent, Divider, Stack } from '@mui/material'
import TypographyComponent from '../custom-typography';

export const ViewMultipleFilesPopup = ({ open, label, files, handleClose }) => {
    const theme = useTheme();

    return (
        <BootstrapDialog open={open} onClose={() => handleClose()} fullWidth maxWidth="sm">
            <DialogContent>
                <TypographyComponent fontSize={18}>{label}</TypographyComponent>
                <Divider sx={{ my: 0.5 }} />

                {/* FILE LIST */}
                <Stack
                    sx={{
                        height: 170,
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: theme.palette.grey[400],
                            borderRadius: "3px",
                        }
                    }}
                    spacing={1}
                >
                    {files?.length > 0 ? (
                        files.map((file, index) => (
                            <TypographyComponent
                                key={file.id || index}
                                sx={{
                                    color: theme.palette.primary[600],
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    fontSize: 15,
                                    whiteSpace: "nowrap"
                                }}
                                onClick={() => {
                                    window.open(file?.image_url, "_blank");
                                }}
                            >
                                {file?.file_name}
                            </TypographyComponent>
                        ))
                    ) : (
                        <TypographyComponent fontSize={16} color={theme.palette.grey[700]}>
                            No files available
                        </TypographyComponent>
                    )}
                </Stack>
            </DialogContent>

            <Divider sx={{ my: 0.5 }} />

            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textAlign: "left",
                        textTransform: "capitalize",
                        background: theme.palette.primary[600],
                        color: theme.palette.common.white
                    }}
                    onClick={() => handleClose()}
                >
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};
