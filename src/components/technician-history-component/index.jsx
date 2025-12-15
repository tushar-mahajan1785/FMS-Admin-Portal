import { useTheme } from '@emotion/react';
import { Box, Divider, Grid, Stack } from '@mui/material';
import SectionHeader from '../section-header';
import TypographyComponent from '../custom-typography';
import moment from 'moment';
import FileIcon from '../../assets/icons/FileIcon';
import OptionsMenu from "../option-menu";
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import { useAuth } from '../../hooks/useAuth';

export const TechnicianShowHistoryComponent = ({
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

    //get Status Color
    const getStatusColor = (statusType) => {
        switch (statusType) {
            case 'Closing Statement':
                return theme.palette.success[100];
            case 'Re Open Statement':
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
                    <TypographyComponent sx={{ marginTop: 2.5, marginBottom: 1 }} fontSize={18} fontWeight={500}>{statusGroup.status_type}</TypographyComponent>
                    {/* <SectionHeader title={statusGroup.status_type} show_progress={0} sx={{ marginTop: 2.5 }} /> */}
                    <Stack
                        paddingY={{ xs: '16px', sm: '24px', background: theme.palette.common.white }}

                        sx={{
                            border: `1px solid ${theme.palette.grey[300]}`,
                            borderRadius: '16px',
                            width: '100%',
                            marginTop: '-4px', px: '16px'
                        }}
                    >
                        {/* {statusGroup.entries.map((entry, entryIndex) => (
                            <Stack key={entryIndex} sx={{ width: '100%', }}>
                                <Stack spacing={1} alignItems={{ p: 1 }}>
                                    <Stack
                                        alignItems="flex-start"
                                        spacing={0.5}
                                        sx={{
                                            background: getStatusColor(statusGroup?.status_type),
                                            px: '8px',
                                            mx: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            py: '4px',
                                            borderRadius: '4px',
                                            width: '100%'
                                        }}
                                    >
                                        <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>
                                            {moment(entry.timestamp, 'YYYY-MM-DD').format('DD MMM YYYY')}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[900] }}>
                                            {moment(entry.timestamp, 'YYYY-MM-DD hh:mm:ss').format('HH:MM:SS')}
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>
                                <Stack gap={1.5} sx={{ mt: 1.5 }}>
                                    <Stack>
                                        <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900], lineHeight: '20px' }}>
                                            {entry[title]}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[900], lineHeight: '18px' }}>
                                            {entry[user]}
                                        </TypographyComponent>
                                    </Stack>
                                    <TypographyComponent
                                        fontSize={16}
                                        fontWeight={400}
                                        sx={{ whiteSpace: 'pre-wrap', lineHeight: '20px', color: theme.palette.grey[500] }}
                                    >
                                        {entry[description]}
                                    </TypographyComponent>
                                    <Stack sx={{ pt: 1 }}>

                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[900], lineHeight: '20px' }}>
                                            File Uploaded:
                                        </TypographyComponent>
                                        {entry[files] && entry[files] !== null && entry[files].length > 0 && (
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>

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
                                </Stack>

                            </Stack>
                        ))} */}
                        {statusGroup.entries.map((entry, entryIndex) => (
                            <Stack key={entryIndex} sx={{ width: '100%' }}>

                                {/* -------- ENTRY CONTENT -------- */}
                                <Stack spacing={1}>
                                    <Stack
                                        sx={{
                                            background: getStatusColor(statusGroup?.status_type),
                                            px: '8px',
                                            mx: 1,
                                            py: '4px',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <TypographyComponent fontSize={16} fontWeight={500}>
                                            {moment(entry.timestamp).format('DD MMM YYYY')}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16}>
                                            {moment(entry.timestamp).format('HH:mm:ss')}
                                        </TypographyComponent>
                                    </Stack>

                                    <Stack gap={1.5} sx={{ mt: 1.5 }}>
                                        <Stack>
                                            <TypographyComponent fontSize={18} fontWeight={500} >
                                                {entry[title]}
                                            </TypographyComponent>
                                            <TypographyComponent fontSize={16} sx={{ color: theme.palette.grey[500] }}>
                                                {entry[user]}
                                            </TypographyComponent>
                                        </Stack>

                                        <TypographyComponent sx={{ whiteSpace: 'pre-wrap', color: theme.palette.grey[500] }}>
                                            {entry[description]}
                                        </TypographyComponent>

                                        {entry[files]?.length > 0 && (
                                            <Stack gap={1}>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.common.black }}>
                                                    File Uploaded:
                                                </TypographyComponent>

                                                <Stack direction="row" gap={1} flexWrap="wrap">
                                                    {entry[files].map((file, fileIndex) => (
                                                        <Stack
                                                            key={fileIndex}
                                                            direction="row"
                                                            spacing={0.5}
                                                            sx={{ cursor: 'pointer', alignItems: 'center' }}
                                                            onClick={() => window.open(file.image_url, '_blank')}
                                                        >
                                                            <FileIcon size={15} stroke={theme.palette.common.black} />
                                                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ textDecoration: 'underline', color: theme.palette.common.black }}>
                                                                {file.file_name}
                                                            </TypographyComponent>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>

                                {/* -------- DIVIDER BETWEEN UPDATES -------- */}
                                {entryIndex !== statusGroup.entries.length - 1 && (
                                    <Stack sx={{ my: 2, border: `1px solid ${theme.palette.grey[300]}` }} />
                                )}

                            </Stack>
                        ))}

                    </Stack>
                </Box>
            ))}
        </Stack>
    );
};

