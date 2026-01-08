import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function AssetGuidelinePopup({ open, handleClose }) {
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
                    Asset – Step by Step Guide
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
                Step 1: Select Asset Menu
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Add New Asset Button</Typography>
                <Typography>• Enter Asset ID</Typography>
                <Typography>• Enter Asset Description</Typography>
                <Typography>• Select Asset Type</Typography>
                <Typography>• Enter Asset Sub Type</Typography>
                <Typography>• Enter Asset Make (optional)</Typography>
                <Typography>• Enter Asset Model (optional)</Typography>
                <Typography>• Enter Asset Sr. Number (optional)</Typography>
                <Typography>• Enter Asset Rating/Capacity (optional)</Typography>
                <Typography>• Select Vendor</Typography>
                <Typography>• Select Manufacturing Date (optional)</Typography>
                <Typography>• Select Installation Date (optional)</Typography>
                <Typography>• Select Commission Date (optional)</Typography>
                <Typography>• Select Warranty Start Date (optional)</Typography>
                <Typography>• Select Warranty Expiry Date (optional)</Typography>
                <Typography>• Select AMC Start Date (optional)</Typography>
                <Typography>• Select AMC Expiry Date (optional)</Typography>
                <Typography>• Enter Asset Owner</Typography>
                <Typography>• Select Asset Custodian</Typography>
                <Typography>• Select Asset End Life Selection (optional)</Typography>
                <Typography>• Select Asset End Life Period (optional)</Typography>
                <Typography>• Enter Location</Typography>
                <Typography>• After filling in all the details, click on Confirm button.</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Asset Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• View Total Asset count</Typography>
                <Typography>• Asset List filter as per Asset ID, Vendor, Asset Make, Asset Model, Status and Search</Typography>
                <Typography>• Asset List Export Excel</Typography>
                <Typography>• Asset List View Details</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Asset Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Asset Details</Typography>
                <Typography>• If edit Asset, click on Edit icon button</Typography>
                <Typography>• If delete Asset, click on delete icon button</Typography>
                <Typography>• Then in delete confirmation popup, click on delete button</Typography>
            </Stack>
            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Edit Asset
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Asset Details</Typography>
                <Typography>• Click on Edit icon button</Typography>
                <Typography>• Update Basic Asset Information, If any changes</Typography>
                <Typography>• Update Technical Specifications, If any changes</Typography>
                <Typography>• Update Vendor & Commissioning Details, If any changes</Typography>
                <Typography>• Update Warranty & AMC Coverage, If any changes</Typography>
                <Typography>• Update Ownership & Responsibility, If any changes</Typography>
                <Typography>• Update Lifecycle & End-of-Life, If any changes</Typography>
                <Typography>• Update Location & Status, If any changes</Typography>
                <Typography>• After filling in all the details, click on Confirm button.</Typography>
            </Stack>
            {/* STEP 5 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 5: Asset Bulk Upload
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on Asset Bulk Upload button</Typography>
                <Typography>• Export Sample Asset excel</Typography>
                <Typography>• Fill up all Asset information as per excel format</Typography>
                <Typography>• Upload Asset excel which is fill up all Asset details</Typography>
                <Typography>• After upload excel, click on + upload button</Typography>
                <Typography>• If any change in Asset, then in sync list click on Sync Manually button and update Asset details</Typography>
                <Typography>• After that click on sync button, to sync all Asset onboarding in system</Typography>
            </Stack>
        </Drawer>
    )
}
