import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function EmployeeGuidelinePopup({ open, handleClose }) {
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
                    Employee – Step by Step Guide
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
                Step 1: Select Employee Menu
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Add New Employee Button</Typography>
                <Typography>• Enter Employee ID</Typography>
                <Typography>• Enter Employee Name</Typography>
                <Typography>• Enter Employee Age (optional)</Typography>
                <Typography>• Select Employee Type</Typography>
                <Typography>• Select Employee Role</Typography>
                <Typography>• Enter Employee Company</Typography>
                <Typography>• Select Manager Name (optional)</Typography>
                <Typography>• Enter Employee Email</Typography>
                <Typography>• Enter Employee Contact</Typography>
                <Typography>• Enter Employee Alternate Contact (optional)</Typography>
                <Typography>• Enter Employee Address (optional)</Typography>
                <Typography>• After filling in all the details, click on Confirm button.</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Employee Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• View Total Employee count</Typography>
                <Typography>• Employee List filter as per search</Typography>
                <Typography>• Employee List Export Excel</Typography>
                <Typography>• Employee List View Details</Typography>
                <Typography>• Employee List Permission Details</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Employee Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Employee Details</Typography>
                <Typography>• If edit employee, click on Edit icon button</Typography>
                <Typography>• If delete employee, click on delete icon button</Typography>
                <Typography>• Then in delete confirmation popup, click on delete button</Typography>
            </Stack>
            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Edit Employee
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Employee Details</Typography>
                <Typography>• Click on Edit icon button</Typography>
                <Typography>• Update Personal Information, If any changes</Typography>
                <Typography>• Update Employment Details, If any changes</Typography>
                <Typography>• Update Personal Information, If any changes</Typography>
                <Typography>• Update Address & Status, If any changes</Typography>
                <Typography>• After filling in all the details, click on Confirm button.</Typography>
            </Stack>
            {/* STEP 5 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 5: Employee Permission
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to lock icon for view Employee Permission</Typography>
                <Typography>• Update Employee Permission as per module</Typography>
                <Typography>• After filling in all the permission, click on Save Changes button.</Typography>
            </Stack>
            {/* STEP 6 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 6: Employee Bulk Upload
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on Employee Bulk Upload button</Typography>
                <Typography>• Export Sample employee excel</Typography>
                <Typography>• fill up all employee information as per excel format</Typography>
                <Typography>• upload employee excel which is fill up all employee details</Typography>
                <Typography>• After upload excel, click on + upload button</Typography>
                <Typography>• If any change in employee, then in sync list click on Sync Manually button and update employee details</Typography>
                <Typography>• After that click on sync button, to sync all employee onboarding in system</Typography>
            </Stack>
        </Drawer>
    )
}
