import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function InventoryGuidelinePopup({ open, handleClose }) {
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
                    Inventory – Step by Step Guide
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
                Step 1: Select Inventory Management sub menu Inventory
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Select the + Add New Item Button</Typography>
                <Typography>• Enter Item Name</Typography>
                <Typography>• Select Category</Typography>
                <Typography>• Enter Description</Typography>
                <Typography>• Enter Initial Quantity</Typography>
                <Typography>• Select Unit</Typography>
                <Typography>• Enter Minimum Quantity</Typography>
                <Typography>• Enter Critical Quantity</Typography>
                <Typography>• Enter Store Location</Typography>
                <Typography>• Select Supplier Name</Typography>
                <Typography>• Select Upload file</Typography>
                <Typography>• After filling in all the details, click on Add Item.</Typography>
            </Stack>

            {/* STEP 2 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 2: Inventory Dashboard
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• View Total Items count, Items In Stock count, Items Out Of Stock count, Critical Items count</Typography>
                <Typography>• Inventory List filter as per status and search</Typography>
                <Typography>• Inventory List export excel</Typography>
                <Typography>• Inventory List view item details</Typography>
                <Typography>• Recently Added Items list</Typography>
                <Typography>• Recently Used Items list</Typography>
            </Stack>

            {/* STEP 3 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 3: Inventory Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Inventory Details</Typography>
                <Typography>• Overview inventory item details</Typography>
                <Typography>• Complete History inventory item details list</Typography>
                <Typography>• Complete History inventory item details list filter as per start date and end date</Typography>
                <Typography>• Consumption History inventory item details list</Typography>
                <Typography>• Consumption History inventory item details list filter as per start date and end date</Typography>
                <Typography>• Restock History inventory item details list</Typography>
                <Typography>• Restock History inventory item details list filter as per start date and end date</Typography>
                <Typography>• If item out of stock then restock, click on Restock button</Typography>
                <Typography>• If edit item, click on Edit Item button</Typography>
                <Typography>• If item usage, click on Record Usage button</Typography>
                <Typography>• If item delete, click on delete icon button</Typography>
                <Typography>• Then in delete confirmation popup, click on delete button</Typography>
            </Stack>
            {/* STEP 4 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 4: Edit Inventory Item
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Go to eye icon for view Inventory Details</Typography>
                <Typography>• Click on Edit Item button</Typography>
                <Typography>• Update Basic Information, If any changes</Typography>
                <Typography>• Update Stock Information, If any changes</Typography>
                <Typography>• Update Supplier Information, If any changes</Typography>
                <Typography>• Upload Files, If any new file upload</Typography>
                <Typography>• After filling in all the details, click on Save Changes.</Typography>
            </Stack>
            {/* STEP 5 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 5: Usage Inventory Item
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on Record Usage button</Typography>
                <Typography>• Fill up all Stock Information</Typography>
                <Typography>• After filling in all the details, click on Confirm Restock.</Typography>
            </Stack>
            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>✅ Note: Same Usage Inventory Item action available in Inventory Details</Typography>
                <Typography>• Go to eye icon for view Inventory Details</Typography>
                <Typography>• Click on Record Usage button</Typography>
                <Typography>• Fill up all Stock Information</Typography>
                <Typography>• After filling in all the details, click on Confirm Restock.</Typography>
            </Stack>
            {/* STEP 6 */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Step 6: Restock Inventory Item
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>• Click on Restock button</Typography>
                <Typography>• Fill up all Stock Information</Typography>
                <Typography>• Upload Stock Document file</Typography>
                <Typography>• After filling in all the details, click on Confirm Restock.</Typography>
            </Stack>
            <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography>✅ Note: Same Restock Inventory Item action available in Inventory Details</Typography>
                <Typography>• Go to eye icon for view Inventory Details</Typography>
                <Typography>• Click on Restock button</Typography>
                <Typography>• Fill up all Stock Information</Typography>
                <Typography>• Upload Stock Document file</Typography>
                <Typography>• After filling in all the details, click on Confirm Restock.</Typography>
            </Stack>
        </Drawer>
    )
}
