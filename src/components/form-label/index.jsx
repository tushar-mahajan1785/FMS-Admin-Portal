import Box from '@mui/material/Box'
import { useTheme } from '@mui/material';
import TypographyComponent from '../custom-typography'

export default function FormLabel({ label = '', required = false, labelProps, fontWeight = 500, fontSize = 14 }) {
    const theme = useTheme()
    return (

        <Box flexDirection={'row'} display='flex' alignItems='center'>
            <TypographyComponent {...labelProps} fontWeight={fontWeight} fontSize={fontSize} color={theme.palette.grey[700]}>
                {label}
            </TypographyComponent>
            {
                required ?
                    <TypographyComponent sx={{ color: 'red', marginLeft: '2px' }} variant='span'>*</TypographyComponent>
                    :
                    <></>
            }
        </Box>

    )
}