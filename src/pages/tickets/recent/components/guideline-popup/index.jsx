import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../../../assets/icons/CloseIcon'

export default function TicketGuidelinePopup({ open, handleClose }) {
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
                    Tickets – Step by Step Guide
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
                Step 1: Select Tickets Menu
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Add New Ticket Button</Typography>
                <Typography>• Select Asset Type</Typography>
                <Typography>• Select Asset Name (Asset Type wise Assets)</Typography>
                <Typography>• Enter Issue Details Title</Typography>
                <Typography>• Select Priority</Typography>
                <Typography>• Enter Issue Details Description</Typography>
                <Typography>• Select Vendor Details Escalation member toggle button</Typography>
                <Typography>• If Vendor Details Escalation member not available then Add Escalation member first then select</Typography>
                <Typography>• Upload Files</Typography>
                <Typography>• Create Ticket</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Ticket Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• View Total Tickets count, Open Tickets count, On-hold Tickets count, Reopen Tickets count, Overdue Tickets count, Closed Tickets count, Reject Tickets count</Typography>
                <Typography>• Tickets By Status as per the This Week, This Month and Last Months Pie chart</Typography>
                <Typography>• Last 6 Months Total Tickets bar chart month wise ticket count</Typography>
                <Typography>• Tickets By Asset Types as per the This Week, This Month and Last Months bar chart</Typography>
                <Typography>• Recent Tickets today and yesturday list</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Tickets List
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• View Total Tickets count, Open Tickets count, On-hold Tickets count, Reopen Tickets count, Overdue Tickets count, Closed Tickets count, Reject Tickets count</Typography>
                <Typography>• View All Ticket show overall ticket list</Typography>
                <Typography>• Ticket list filter as per status, priority and asset type</Typography>
                <Typography>• Ticket list export excel</Typography>
            </Stack>

            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Ticket Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to the Ticket No or action eye icon button to view ticket details</Typography>
                <Typography>• Change status like On Hold, Re Open, Closed and Rejected</Typography>
                <Typography>• Add Updates as per status</Typography>
                <Typography>• Download Report</Typography>
                <Typography>• Delete Ticket</Typography>
            </Stack>
        </Drawer>
    )
}
