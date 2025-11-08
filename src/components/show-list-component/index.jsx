import { useTheme } from '@emotion/react';
import { Box, Grid, Stack } from '@mui/material';
import SectionHeader from '../section-header';
import TypographyComponent from '../custom-typography';
import moment from 'moment';
import FileIcon from '../../assets/icons/FileIcon';
import OptionsMenu from "../option-menu";
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import { useAuth } from '../../hooks/useAuth';

export const ShowHistoryComponent = ({
    historyArray,
    title = 'title',
    description = 'description',
    files = 'files',
    user = 'user',
    onEditClick,
    onDeleteClick,
    permission,
    can_show_action
}) => {
    const theme = useTheme();
    const { hasPermission } = useAuth()

    const getStatusColor = (statusType) => {
        switch (statusType) {
            case 'Closing Statement':
                return theme.palette.success[100];
            case 'Reopen Statement':
            case 'Open Statement':
                return theme.palette.success[100];
            case 'Rejected Statement':
                return theme.palette.error[100];
            case 'On Hold Statement':
                return theme.palette.warning[100];
            case 'Ticket Updates':
            default:
                return theme.palette.primary[100];
        }
    };

    return (
        <Stack sx={{ width: '100%' }}>
            {historyArray && historyArray !== null && historyArray.length > 0 && historyArray?.map((statusGroup, index) => (
                <Box key={index}>
                    <SectionHeader title={statusGroup.status_type} show_progress={0} sx={{ marginTop: 2.5 }} />
                    <Stack
                        paddingY={{ xs: '10px', sm: '24px' }}
                        spacing={4}
                        sx={{
                            border: `1px solid ${theme.palette.grey[300]}`,
                            borderRadius: '16px',
                            width: '100%',
                            marginTop: '-4px'
                        }}
                    >
                        {statusGroup.entries.map((entry, entryIndex) => (
                            <Stack key={entryIndex} sx={{ mb: 20, width: '100%' }}>
                                <Grid container>
                                    <Grid size={{ xs: 3, sm: 2, md: 1.5 }}>
                                        <Stack spacing={1} alignItems={{ xs: 'center', sm: 'center', md: 'flex-end' }}>
                                            <Stack
                                                alignItems="flex-start"
                                                spacing={0.5}
                                                sx={{
                                                    background: getStatusColor(statusGroup?.status_type),
                                                    px: '8px',
                                                    py: '4px',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>
                                                    {moment(entry.timestamp, 'YYYY-MM-DD').format('DD MMM YYYY')}
                                                </TypographyComponent>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[900] }}>
                                                    {moment(entry.timestamp, 'YYYY-MM-DD hh:mm:ss').format('HH:MM:SS')}
                                                </TypographyComponent>
                                            </Stack>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 1, sm: 1, md: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                height: '100%'
                                            }}
                                        >
                                            <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'black' }} />
                                            <Box sx={{ width: '0.7px', flexGrow: 1, backgroundColor: 'black', marginY: 0.5 }} />
                                            <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'black' }} />
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 8, sm: 9, md: 9.5 }}>
                                        <Stack spacing={1.5}>
                                            <Stack sx={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Stack>
                                                    <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900], lineHeight: '24px' }}>
                                                        {entry[title]}
                                                    </TypographyComponent>
                                                </Stack>
                                                {
                                                    (index === historyArray.length - 1) && (entryIndex === statusGroup.entries.length - 1) && hasPermission(permission) && can_show_action ?
                                                        <Stack>
                                                            <Box
                                                                onClick={(event) => event.stopPropagation()}
                                                                sx={{ ml: 'auto', mr: 0.5, display: 'flex', alignItems: 'center' }}
                                                            >
                                                                <OptionsMenu
                                                                    id={`role-${entry?.title}-${entry?.id}`}
                                                                    menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
                                                                    iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                                                                    options={[
                                                                        {
                                                                            text: 'Edit',
                                                                            subject: 'DASHBOARD',
                                                                            icon: <EditIcon stroke={theme.palette.common.black} />,
                                                                            sx: { justifyContent: 'space-between', marginLeft: 'auto' },
                                                                            onClick: () => onEditClick(entry)
                                                                        },
                                                                        {
                                                                            text: 'Delete',
                                                                            subject: 'DASHBOARD',
                                                                            icon: <DeleteIcon stroke={theme.palette.common.black} />,
                                                                            sx: { justifyContent: 'space-between', marginLeft: 'auto' },

                                                                            onClick: () => onDeleteClick(entry)
                                                                        }
                                                                    ]}
                                                                />
                                                            </Box>
                                                        </Stack>
                                                        :
                                                        <></>
                                                }
                                            </Stack>

                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[900], lineHeight: '20px' }}>
                                                {entry[user]}
                                            </TypographyComponent>
                                            <TypographyComponent
                                                fontSize={16}
                                                fontWeight={400}
                                                sx={{ whiteSpace: 'pre-wrap', lineHeight: '20px', color: theme.palette.grey[500] }}
                                            >
                                                {entry[description]}
                                            </TypographyComponent>

                                            {entry[files] && entry[files] !== null && entry[files].length > 0 && (
                                                <Stack direction="row" spacing={1} sx={{ pt: 1, flexWrap: 'wrap' }}>
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900], lineHeight: '20px' }}>
                                                        File Uploaded:
                                                    </TypographyComponent>
                                                    {entry[files]?.map((file, fileIndex) => (
                                                        <Stack key={fileIndex} sx={{ cursor: 'pointer', textDecoration: 'underline', mr: 1, flexDirection: 'row' }} onClick={() => {
                                                            window.open(file?.image_url, '_blank')
                                                        }}>
                                                            <FileIcon sx={{ mr: 0.2 }} />
                                                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900], lineHeight: '20px' }}>
                                                                {file?.file_name}
                                                            </TypographyComponent>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
};

