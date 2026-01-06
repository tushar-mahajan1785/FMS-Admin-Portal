import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function PMActivityGuidelinePopup({ open, handleClose }) {
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
                    PM Activity – Step by Step Guide
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
                Step 1: Select PM Activity Menu
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Add New Schedule Button</Typography>
                <Typography>• Select Asset Type</Typography>
                <Typography>• Select Asset Name (Asset Type wise Assets)</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: PM Schedule Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• View Total PM Schedules count, Active PM Schedules count, Completed PM Schedules count, Overdue PM Schedules count, Upcoming PM Schedules count</Typography>
                <Typography>• PM Schedule List filter as per status, frequency and asset type</Typography>
                <Typography>• PM Schedule List export excel</Typography>
                <Typography>• Upcoming PM Schedules filter as per This Week, Next Week and This Month</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: PM Schedule Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to the Title view PM Schedule Details</Typography>
            </Stack>
        </Drawer>
    )
}
