import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function DocumentsGuidelinePopup({ open, handleClose }) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 550 },
                    p: 3
                }
            }}
        >
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight={600}>
                    Documents – Step by Step Guide
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
                Step 1: Select Document Management sub menu Documents
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Create New Group Button</Typography>
                <Typography>• Enter Asset Group Name</Typography>
                <Typography>• Select Asset Type</Typography>
                <Typography>• Select Asset as per Asset Type</Typography>
                <Typography>• If any asset delete, click on delete icon in Selected Asset Details list</Typography>
                <Typography>• After filling in all the details, click on Create Group.</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Documents Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Documents List filter as per search</Typography>
                <Typography>• Documents List export excel</Typography>
                <Typography>• Documents List view document details, click on View Document</Typography>
                <Typography>• If Documents delete, click on delete icon button</Typography>
                <Typography>• Then in delete confirmation popup, click on delete button</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Documents Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Documents List view document details, click on View Document</Typography>
                <Typography>• Document Categories wise card details</Typography>
                <Typography>• Document Categories file upload, click on upload file as per Document Categories</Typography>
                <Typography>• If new file upload then select New Tab</Typography>
                <Typography>• Enter file name</Typography>
                <Typography>• Enter Notes</Typography>
                <Typography>• Upload File</Typography>
                <Typography>• After filling in all the details, click on Add File.</Typography>
                <Typography>• If existing file upload then select Existing File Tab</Typography>
                <Typography>• Select Existing File Name</Typography>
                <Typography>• Enter Notes</Typography>
                <Typography>• Upload File</Typography>
                <Typography>• After filling in all the details, click on Add File.</Typography>
            </Stack>
            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Documents Categories Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click Document Categories View All button</Typography>
                <Typography>• Document Versions list details</Typography>
                <Typography>• Document Categories file upload, click on Upload New File button</Typography>
                <Typography>• If View Document, click on View Document icon button</Typography>
                <Typography>• If Download Document, click on Download Document icon button</Typography>
                <Typography>• If Archive file, click on Archive icon button</Typography>
                <Typography>• After confirm Archive popup, click Archive button to view in Archive Categories card menu</Typography>
                <Typography>• If Delete Document, click on Delete icon button</Typography>
                <Typography>• After confirm Delete popup, click Delete button</Typography>
            </Stack>
            {/* STEP 5 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 5: Archive Documents Categories Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click Archive Document Categories View All button</Typography>
                <Typography>• If View Document, click on View Document icon button</Typography>
                <Typography>• If Download Document, click on Download Document icon button</Typography>
                <Typography>• If Restore file, click on Restore icon button</Typography>
                <Typography>• After confirm Restore popup, click Restore button to view in Document Categories card menu which is previously Archive</Typography>
                <Typography>• If Delete Document, click on Delete icon button</Typography>
                <Typography>• After confirm Delete popup, click Delete button</Typography>
            </Stack>
        </Drawer>
    )
}
