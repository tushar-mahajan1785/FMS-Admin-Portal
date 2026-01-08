import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function VendorGuidelinePopup({ open, handleClose }) {
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
                    Vendor – Step by Step Guide
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
                Step 1: Select Vendor Menu
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Add New Vendor Button</Typography>
                <Typography>• Enter Vendor ID</Typography>
                <Typography>• Enter Vendor Name</Typography>
                <Typography>• Enter Employee Contact (optional)</Typography>
                <Typography>• Enter Address</Typography>
                <Typography>• Enter Website URL (optional)</Typography>
                <Typography>• Enter Primary Contact Name</Typography>
                <Typography>• Enter Primary Designation</Typography>
                <Typography>• Enter Primary Email</Typography>
                <Typography>• Enter Primary Contact</Typography>
                <Typography>• Fill up Escalation Matrix level contact information (optional)</Typography>
                <Typography>• After filling in all the details, click on Confirm button.</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Vendor Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• View Total Vendor count</Typography>
                <Typography>• Vendor List filter as per vendor ID, Name, Email, Contact, Status and Search</Typography>
                <Typography>• Vendor List Export Excel</Typography>
                <Typography>• Vendor List View Details</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Vendor Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Vendor Details</Typography>
                <Typography>• If edit Vendor, click on Edit icon button</Typography>
                <Typography>• If delete Vendor, click on delete icon button</Typography>
                <Typography>• Then in delete confirmation popup, click on delete button</Typography>
            </Stack>
            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Edit Vendor
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Vendor Details</Typography>
                <Typography>• Click on Edit icon button</Typography>
                <Typography>• Update Vendor Identification, If any changes</Typography>
                <Typography>• Update Vendor Details, If any changes</Typography>
                <Typography>• Update Primary Contact Information, If any changes</Typography>
                <Typography>• Update Escalation Matrix, If any changes</Typography>
                <Typography>• After filling in all the details, click on Confirm button.</Typography>
            </Stack>
            {/* STEP 5 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 5: Vendor Bulk Upload
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on Vendor Bulk Upload button</Typography>
                <Typography>• Export Sample Vendor excel</Typography>
                <Typography>• fill up all Vendor information as per excel format</Typography>
                <Typography>• upload Vendor excel which is fill up all Vendor details</Typography>
                <Typography>• After upload excel, click on + upload button</Typography>
                <Typography>• If any change in Vendor, then in sync list click on Sync Manually button and update Vendor details</Typography>
                <Typography>• After that click on sync button, to sync all Vendor onboarding in system</Typography>
            </Stack>
        </Drawer>
    )
}
