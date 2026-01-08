import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ManageShiftGuidelinePopup({ open, handleClose }) {
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
                    Manage Shift – Step by Step Guide
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
                Step 1: Select Roster sub menu Manage Shift
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Create New Roster Button</Typography>
                <Typography>• Select Group</Typography>
                <Typography>• Select Roster Duration</Typography>
                <Typography>• If Roster Duration is Monthly selected then select all days shift in month</Typography>
                <Typography>• As per select Roster Duration select week days using week days previous arrow for previous week and next arrow for next week</Typography>
                <Typography>• If New member add in group then click on + Add New Member To This Group.</Typography>
                <Typography>• Select Employee Type</Typography>
                <Typography>• Select Employee as per Employee Type</Typography>
                <Typography>• If you want delete employee, then select delete icon in Selected Employees list</Typography>
                <Typography>• After filling in all the details, click on Add Members Button.</Typography>
                <Typography>• Select employee wise shift as per day</Typography>
                <Typography>• Select Weekdays Employee toggle button if employee do not want in this shift</Typography>
                <Typography>• If Any employee search then use search filter, enter employee name or role in search box</Typography>
                <Typography>• After filling in all the details, click on Preview Button.</Typography>
                <Typography>• If selected shift want to download then click on download icon button</Typography>
                <Typography>• If all details okay, click on Publish button</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Manage Shift Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Manage Shift List filter as per Asset Type and search</Typography>
                <Typography>• Manage Shift List export excel</Typography>
                <Typography>• Manage Shift List view shift details, click on eye icon</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Manage Shift Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on eye icon for view Manage Shift Details</Typography>
                <Typography>• If edit Shift, click on Edit Icon button</Typography>
                <Typography>• If delete Shift, click on delete icon button</Typography>
                <Typography>• Then in delete confirmation popup, click on delete button</Typography>
                <Typography>• If selected shift want to download then click on download icon button</Typography>
            </Stack>
            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Edit Manage Shift
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on eye icon for view Manage Shift Details</Typography>
                <Typography>• Click on Edit Icon button</Typography>
                <Typography>• Update shift, if any changes</Typography>
                <Typography>• Add member, if any member missing in existing shift</Typography>
                <Typography>• After filling in all the details, click on Preview Button.</Typography>
                <Typography>• If selected shift want to download then click on download icon button</Typography>
                <Typography>• If all details okay, click on Publish button</Typography>
            </Stack>
        </Drawer>
    )
}
