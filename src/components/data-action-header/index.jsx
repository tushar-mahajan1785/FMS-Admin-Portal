import { Stack, Button, Box, Tooltip, useTheme } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import TypographyComponent from '../custom-typography';

export default function DataActionHeader({
    count,
    countTitle = 'Records',
    loadingRefresh = false,
    onActionClick,
    onSyncClick,
    onRefreshClick,
    syncLabel = 'Sync',
    refreshLabel = 'Refresh',
}) {
    const theme = useTheme();

    const finalSyncClick = onSyncClick || onActionClick;
    const finalRefreshClick = onRefreshClick || onActionClick;

    const safeActionClick = finalSyncClick || finalRefreshClick || (() => console.warn('Action handler not provided.'));

    return (
        <Stack
            sx={{
                mb: 2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                columnGap: 2,
                width: '100%'
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ height:'fit-content'}}>
                <TypographyComponent fontSize={16} color="text.secondary" fontWeight={500}>
                    {countTitle}
                </TypographyComponent>
                <Box sx={{
                    backgroundColor: theme.palette.primary[50],
                    color: theme.palette.primary[600],
                    borderRadius: 1,
                    px: 2,
                    py: 0.5,
                    minWidth: 50,
                    textAlign: 'center',
                }}>
                    <TypographyComponent fontSize={20} fontWeight={700}>
                        {count}
                    </TypographyComponent>
                </Box>
            </Stack>

            {/* 2. Action Buttons Group */}
            <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>

                {/* Sync Button */}
                <Tooltip title={`${syncLabel} Records`} arrow>
                    <Button
                        size="small"
                        onClick={finalSyncClick || safeActionClick}
                        variant='contained'
                        disabled={loadingRefresh}
                        sx={{
                            textTransform: 'capitalize',
                            color: "#fff",
                            px: 1.5,
                            py: 1,
                            backgroundColor: theme.palette.primary[600],
                            boxShadow: 'none',
                            borderRadius: 1,
                            '&:hover': { backgroundColor: theme.palette.primary[700] },
                        }}
                    >
                        <SyncIcon sx={{ color: 'white', fontSize: '16px' }} />
                        <TypographyComponent fontSize={14} fontWeight={600} sx={{ ml: 0.3 }}>
                            {syncLabel}
                        </TypographyComponent>
                    </Button>
                </Tooltip>

                {/* Refresh Button */}
                <Tooltip title={`Check data is Synced`} arrow>
                    <Button
                        size="small"
                        onClick={finalRefreshClick || safeActionClick}
                        variant='contained'
                        disabled={loadingRefresh}
                        sx={{
                            textTransform: 'capitalize',
                            color: "#fff",
                            px: 1.5,
                            py: 1,
                            backgroundColor: theme.palette.primary[600],
                            boxShadow: 'none',
                            borderRadius: 1,
                            '&:hover': { backgroundColor: theme.palette.primary[700] },
                        }}
                    >
                        <SyncIcon sx={{ color: 'white', fontSize: '16px' }} />
                        <TypographyComponent fontSize={14} fontWeight={600} sx={{ ml: 0.3 }}>
                            {refreshLabel}
                        </TypographyComponent>
                    </Button>
                </Tooltip>
            </Stack>
        </Stack>
    );
}