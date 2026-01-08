import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ConfigurationShiftGuidelinePopup({ open, handleClose }) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 520 },
                    p: 3
                }
            }}
        >
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight={600}>
                    Configuration Shift – Step by Step Guide
                </Typography>
                <IconButton
                    onClick={handleClose}
                >
                    <CloseIcon size={16} />
                </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* STEP 1 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 1: Select Roster sub menu Configuration Shift
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Configure the shift name and timings</Typography>
                <Typography>• Short Name should be G for General Shift, 1 for First Shift, 2 for Second Shift, 3 for Third Shift and W for Weekend Off</Typography>
                <Typography>• If any shift not allow to manage shift then select toggle icon swap for disable and save</Typography>
                <Typography>• If any shift delete, click on delete icon</Typography>
                <Typography>• After filling in all the details, click on Save Button.</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Add New Shift
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on + Add New Shift for new shift added in existing shift list</Typography>
            </Stack>
        </Drawer>
    )
}
