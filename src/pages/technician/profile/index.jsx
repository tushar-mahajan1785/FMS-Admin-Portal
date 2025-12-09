import { TechnicianNavbarHeader } from '../../../components/technician/navbar-header'
import { Stack, useTheme } from '@mui/material'
import ChevronLeftIcon from '../../../assets/icons/ChevronLeft'
import TypographyComponent from '../../../components/custom-typography'

export const TechnicianProfile = () => {
    const theme = useTheme()
    return (
        <Stack>
            <TechnicianNavbarHeader
                leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                        // navigate('/checklist')
                    }}>
                        <ChevronLeftIcon size={24} />
                    </Stack>
                    <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>Profile</TypographyComponent>
                </Stack>}
            />
        </Stack>
    )
}
