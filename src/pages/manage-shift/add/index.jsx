import { Divider, Drawer, IconButton, Stack, useTheme } from "@mui/material";
import FormHeader from "../../../components/form-header";
import UserIcon from "../../../assets/icons/UserIcon";
import CloseIcon from "../../../assets/icons/CloseIcon";

export default function AddManageGroups({ open, handleClose }) {
    const theme = useTheme()
    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: '86%' } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<UserIcon stroke={theme.palette.primary[600]} size={18} />}
                    title="Create New Shift"
                    subtitle="Fill below form to add new asset"

                    actions={[
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                />
                <Divider sx={{ m: 2 }} />
            </Stack>
        </Drawer>
    )
}