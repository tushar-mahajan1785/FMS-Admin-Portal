import { useTheme } from "@emotion/react";
import { Box, Stack, Tooltip, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from "../../hooks/useAuth";
import UploadIcon from "../../assets/icons/UploadIcon";
import React from "react";
import { convertCount } from "../../utils";
import SquareBoxButton from "../square-box";
import TypographyComponent from "../custom-typography";

export default function GetCountComponent({
    hideCountDisplay = 0,
    countData = { title1: "", title2: "", value: 0 },
    actionData = { buttonLabel1: "", buttonLabel2: "", onClick: () => { } },
    bulkAction = { bulkButtonLabel1: "", bulkButtonLabel2: "", onClick: () => { } },
    permissionKey = {},
    bulkPermission = {},
    additionalPermission = {},
    additionalFields = 0,
    additionalAction = {}
}) {
    const { hasPermission } = useAuth();
    const theme = useTheme();

    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))

    // Component for the vertical divider managed as per devices
    const Divider = () => (
        <Stack sx={{
            borderLeft: '1px solid',
            borderColor: theme.palette.grey[650],
            height: { xs: 60, sm: 70 },
            display: { xs: 'none', sm: 'block' },
            mx: { xs: 0, sm: 3 }
        }}></Stack>
    );

    // Component for the label + button group (e.g., Add New Employee)
    const ActionGroup = ({ buttonLabel1, buttonLabel2, onClick, isUpload = false }) => (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            flexShrink: 0, // Prevent shrinking on wrap
        }}>
            <Box sx={{
                justifyContent: 'center',
                alignItems: 'center',
                p: { xs: 0.5, sm: '8px 16px 8px 0px' }
            }}>
                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.text.primary }}>
                    {buttonLabel1}
                </TypographyComponent>
                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.text.primary }}>
                    {buttonLabel2}
                </TypographyComponent>
            </Box>
            <SquareBoxButton
                bgColor={theme.palette.primary[600]}
                IconComponent={
                    isUpload
                        ? <UploadIcon stroke={theme.palette.common.white} size={isSMDown ? 20 : 24} width={32} />
                        : <AddIcon sx={{ color: 'white', fontSize: { xs: '25px', sm: '30px', md: '40px' } }} />
                }
                isButton={true}
                size={60}
                onClick={onClick}
            />
        </Box>
    );

    return (
        <React.Fragment>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                rowGap: { xs: 3, sm: 1 },
                justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                p: { xs: 1, sm: 0 }
            }}>

                {/* --- 1. Additional Fields --- */}
                {additionalFields === 1 && hasPermission(additionalPermission) && (
                    <React.Fragment>
                        <ActionGroup
                            buttonLabel1="Additional"
                            buttonLabel2="Fields"
                            IconComponent={<AddIcon />}
                            onClick={additionalAction}
                        />
                        <Divider />
                    </React.Fragment>
                )}

                {/* --- 2. Total Count Display --- */}
                {hideCountDisplay === 0 && (
                    <React.Fragment>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0,
                        }}>
                            <Box sx={{
                                flexDirection: 'column',
                                justifyContent: 'start',
                                alignItems: 'start',
                                p: { xs: 1, sm: '16px 16px 16px 0px' },
                                display: 'flex'
                            }}>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.text.primary, mb: 0.1 }}>
                                    {countData?.title1 || 'Total'}
                                </TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.text.primary }}>
                                    {countData?.title2 || 'Employee'}
                                </TypographyComponent>
                            </Box>
                            <Tooltip title={countData.value}>
                                <SquareBoxButton
                                    shadedBgColor={theme.palette.primary[100]}
                                    bgColor={theme.palette.primary[600]}
                                    displayText={countData?.value && countData?.value !== null ? convertCount(countData?.value) : 0}
                                    size={90}
                                />
                            </Tooltip>
                        </Box>
                        <Divider />
                    </React.Fragment>
                )}

                {/* --- 3. Employee Bulk Upload --- */}
                {hasPermission(bulkPermission) &&
                    bulkAction?.bulkButtonLabel1 && bulkAction?.bulkButtonLabel2 && (
                        <React.Fragment>
                            <ActionGroup
                                buttonLabel1={bulkAction.bulkButtonLabel1}
                                buttonLabel2={bulkAction.bulkButtonLabel2}
                                IconComponent={<UploadIcon />}
                                onClick={bulkAction.onClick}
                                isUpload={true}
                            />
                            <Divider />
                        </React.Fragment>
                    )}

                {/* --- 4. Add New Employee --- */}
                {hasPermission(permissionKey) &&
                    actionData?.buttonLabel1 && actionData?.buttonLabel2 && (
                        <React.Fragment>
                            <ActionGroup
                                buttonLabel1={actionData.buttonLabel1}
                                buttonLabel2={actionData.buttonLabel2}
                                IconComponent={<AddIcon />}
                                onClick={actionData.onClick}
                            />
                        </React.Fragment>
                    )}
            </Box>
        </React.Fragment>
    );
}