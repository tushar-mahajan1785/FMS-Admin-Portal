import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ChecklistGuidelinePopup({ open, handleClose }) {
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
                    Checklist – Step by Step Guide
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
                Step 1: Select Checklist Menu
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Checklist Dashboard details</Typography>
                <Typography>• View Total Checklist Groups count, Total Assets count, Completed Today count, Pending Today count, Overdue Checklists count</Typography>
                <Typography>• Search Asset Types Groups as per Asset Type</Typography>
                <Typography>• If Asset Types not available then contact to Administrator</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Manage Asset Types Groups
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select Asset Types Groups {'->'} icon</Typography>
                <Typography>• Add new group in Asset Type Group, Click + Create New Group</Typography>
                <Typography>• Enter Group Name</Typography>
                <Typography>• Select Asset</Typography>
                <Typography>• After filling in all the details, click on Save Changes Button.</Typography>
                <Typography>• If Admin want export group parameter in excel format then click on export button</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Manage Asset Group Checklist
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on eye view icon in Assets Groups card</Typography>
                <Typography>• Per hours wise checklist parameter Asset value update using edit icon</Typography>
                <Typography>• Click on edit icon button</Typography>
                <Typography>• fill up all parameter asset value</Typography>
                <Typography>• After filling in all the details, click on Save Button.</Typography>
                <Typography>• If any abnormal value found then per asset wise Abnormal icon add beside asset and change background color red so admin can update correct value</Typography>
                <Typography>• If all value correct then admin approved per asset wise parameter status using approved button</Typography>
                <Typography>• Click on Approved button to approved per time, per asset parameter status</Typography>
                <Typography>• If Admin want export parameter in excel format then click on export button</Typography>
                <Typography>• filter parameter as per date</Typography>
                <Typography>• refresh checklist parameter, click on Load Checklist button</Typography>
            </Stack>
        </Drawer>
    )
}
