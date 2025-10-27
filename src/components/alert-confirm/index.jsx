import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import parse from 'html-react-parser';
import { Stack, useTheme } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { BootstrapDialog } from '../common';
import TwoColorIconCircle from '../two-layer-icon';
import TypographyComponent from '../custom-typography';

export default function AlertPopup({ open, handleConfirmClose, actionButtons, objData, reason, requiredMessage, icon, color }) {
    const theme = useTheme()

    //States
    const [messageData, setMessageData] = useState(null)

    //Initial Render 
    useEffect(() => {
        if (open == true) {
            if (requiredMessage && requiredMessage !== null && requiredMessage !== undefined) {
                setMessageData(requiredMessage)
            }
            else {
                setMessageData(null)
            }
        }
    }, [open, requiredMessage])

    return (
        <BootstrapDialog
            fullWidth
            maxWidth={'xs'}
            onClose={() => handleConfirmClose()}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible', padding: 1 } }}
            scroll="paper"
            open={open}
        >
            <DialogContent>
                <Stack mb={1}>
                    {
                        icon ?
                            <TwoColorIconCircle
                                IconComponent={icon}
                                color={color}
                                size={40}
                            />
                            :
                            <></>
                    }

                    <TypographyComponent fontSize={18} fontWeight={600} sx={{ color: theme.palette.grey[900] }} mt={0.7}>{objData?.title}</TypographyComponent>
                </Stack>
                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                    {objData?.text ? parse(objData?.text) : 'Message'}
                </TypographyComponent>

                {
                    reason && reason !== null ?
                        reason
                        :
                        <></>
                }
                {
                    messageData && messageData !== undefined && messageData !== null && messageData?.status == true ?
                        <TypographyComponent fontSize={14} fontWeight={400} color="error">{messageData?.message}</TypographyComponent>
                        :
                        <></>
                }
            </DialogContent>
            <DialogActions >
                {
                    actionButtons && actionButtons !== null ?
                        actionButtons
                        :
                        <></>
                }
            </DialogActions>
        </BootstrapDialog >
    );
}
