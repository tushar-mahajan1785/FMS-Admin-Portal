import { useState, useEffect, useRef } from 'react';
import { TextField, Box, useTheme } from '@mui/material';
import TypographyComponent from '../custom-typography';

export default function OTPInput({ length, onOtpChange, error, disabled }) {
    const theme = useTheme()
    const [otp, setOtp] = useState(Array(length).fill(''))
    const inputRefs = useRef([])

    const handleChange = (e, index) => {
        const { value } = e.target
        const numericValue = value.replace(/\D/g, '')
        const newOtp = [...otp]
        newOtp[index] = numericValue
        setOtp(newOtp)

        if (numericValue.length === 1 && index < length - 1) {
            inputRefs.current[index + 1].focus()
        }

        onOtpChange(newOtp.join(''))
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const isError = Boolean(error)

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" justifyContent="center" alignItems="center">
                {otp.map((_, index) => (
                    <TextField
                        key={index}
                        disabled={disabled}
                        value={otp[index]}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        margin="normal"
                        error={isError}
                        slotProps={{
                            htmlInput: { maxLength: 1 },
                            input: {
                                style: {
                                    width: '3rem',
                                    height: '3rem',
                                    marginRight: index < length - 1 ? '0.5rem' : 0,
                                    textAlign: 'center',
                                    fontSize: "1.5rem",
                                    fontWeight: 600,
                                    padding: 0,
                                    color: theme.palette.primary[600]
                                },
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                width: '3rem',
                                height: '3rem',
                                marginRight: index < length - 1 ? '0.5rem' : 0,
                                '& input': {
                                    textAlign: 'center',
                                    lineHeight: '3rem',   // vertical center
                                },
                                '& fieldset': {
                                    borderColor: isError
                                        ? theme.palette.error[600]
                                        : theme.palette.primary[600],
                                },
                                '&:hover fieldset': {
                                    borderColor: isError
                                        ? theme.palette.error[600]
                                        : theme.palette.primary[600],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: isError
                                        ? theme.palette.error[600]
                                        : theme.palette.primary[600],
                                },
                                '&.Mui-disabled fieldset': {
                                    borderColor: '#808080',
                                },
                            },
                        }}
                    />
                ))}

            </Box>
            {isError && <TypographyComponent variant="body2" color="error">{error}</TypographyComponent>}
        </Box>
    );
};