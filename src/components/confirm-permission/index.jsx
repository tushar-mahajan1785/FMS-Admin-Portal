import React, { useState, useEffect } from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import parse from 'html-react-parser';
import { Stack, useTheme } from '@mui/material';
import { BootstrapDialog } from '../common';
import TwoColorIconCircle from '../two-layer-icon';
import TypographyComponent from '../custom-typography';

export default function ConfirmPermissionPopup({
    open,
    handleConfirmClose,
    actionButtons,
    objData,
    reason,
    requiredMessage,
    icon,
    color,
    dynamicSelectLabels
}) {
    const theme = useTheme();

    //States
    const [messageData, setMessageData] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState('newUsers'); // Default to 'newUsers'

    //Initial Render
    useEffect(() => {
        if (open) {
            if (requiredMessage && requiredMessage !== null && requiredMessage !== undefined) {
                setMessageData(requiredMessage);
            } else {
                setMessageData(null);
            }
        }
    }, [open, requiredMessage]);

    /**
     * function to handle Radio change
     * @param {*} event 
     */
    const handleRadioChange = (event) => {
        setSelectedPermission(event.target.value);
    };

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
                    {icon ? (
                        <TwoColorIconCircle
                            IconComponent={icon}
                            color={color}
                            size={40}
                        />
                    ) : (
                        <></>
                    )}

                    <TypographyComponent fontSize={18} fontWeight={600} sx={{ color: theme.palette.grey[900] }} mt={0.7}>
                        {objData?.title}
                    </TypographyComponent>
                </Stack>
                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                    {objData?.text ? parse(objData?.text) : 'Message'}
                </TypographyComponent>

                {/* Radio buttons for permission options */}
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <RadioGroup
                        row
                        name="permission-options"
                        value={selectedPermission}
                        onChange={handleRadioChange}
                    >
                        <Stack direction="column" spacing={0}>
                            <FormControlLabel
                                sx={{ mb: -1.3 }}
                                value="newUsers"
                                control={<Radio color="error" />}
                                label={<TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[700] }}>{dynamicSelectLabels[0]}</TypographyComponent>}
                            />
                            <FormControlLabel
                                value="existingUsers"
                                control={<Radio color="error" />}
                                label={<TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[700] }}>{dynamicSelectLabels[1]}</TypographyComponent>}
                            />
                        </Stack>
                    </RadioGroup>
                </FormControl>

                {reason && reason !== null ? (
                    reason
                ) : (
                    <></>
                )}
                {messageData && messageData !== undefined && messageData !== null && messageData?.status === true ? (
                    <TypographyComponent fontWeight={400} fontSize={14} color="error">
                        {messageData?.message}
                    </TypographyComponent>
                ) : (
                    <></>
                )}
            </DialogContent>
            <DialogActions>
                {actionButtons && actionButtons !== null ? (
                    actionButtons.map((button, index) => {
                        // Clone the button and override the onClick handler to pass the selected value
                        return React.cloneElement(button, {
                            onClick: () => {
                                // This is the only part that needs to change
                                const permissionValue = selectedPermission === 'existingUsers' ? 1 : 0;
                                button.props.onClick(permissionValue); // Pass 1 or 0 to the parent handler
                            },
                            key: index,
                        });
                    })
                ) : (
                    <></>
                )}
            </DialogActions>
        </BootstrapDialog>
    );
}