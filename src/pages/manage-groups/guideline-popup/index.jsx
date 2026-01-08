import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ManageGroupGuidelinePopup({ open, handleClose }) {
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
                    Manage Groups – Step by Step Guide
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
                Step 1: Select Roster sub menu Manage Groups
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Create New Group Button</Typography>
                <Typography>• Select Asset Type</Typography>
                <Typography>• Select Asset as per Asset Type</Typography>
                <Typography>• Enter Group Name</Typography>
                <Typography>• After filling in all the details, click on Next Button.</Typography>
                <Typography>• Select Employee Type</Typography>
                <Typography>• Select Employee as per Employee Type</Typography>
                <Typography>• If you want delete employee, then select delete icon in Selected Employees list</Typography>
                <Typography>• After filling in all the details, click on Create Group Button.</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Manage Groups Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Manage Groups List filter as per Asset Type and search</Typography>
                <Typography>• Manage Groups List export excel</Typography>
                <Typography>• Manage Groups List view group details, click on group card</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Manage Groups Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on group card for view Manage Groups Details</Typography>
                <Typography>• If edit Groups, click on Edit Icon button</Typography>
                <Typography>• If delete Groups, click on delete icon button</Typography>
                <Typography>• Then in delete confirmation popup, click on delete button</Typography>
            </Stack>
            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Edit Manage Groups
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on group card for view Manage Groups Details</Typography>
                <Typography>• Click on Edit Icon button</Typography>
                <Typography>• Select Asset Type, If any changes</Typography>
                <Typography>• Select Asset, If any changes</Typography>
                <Typography>• Update Group Details, If any changes</Typography>
                <Typography>• After filling in all the details, click on Next Button.</Typography>
                <Typography>• Select Employee Type, If any changes</Typography>
                <Typography>• Select Employee, If any changes</Typography>
                <Typography>• After filling in all the details, click on Save Changes.</Typography>
            </Stack>
        </Drawer>
    )
}
