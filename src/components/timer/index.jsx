// Timer.jsx

import { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import TypographyComponent from '../custom-typography';

const Timer = ({ initialTimeInSeconds, resetTrigger, onTimerFinish }) => {
    const theme = useTheme()
    const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);

    useEffect(() => {
        if (resetTrigger) {
            setTimeLeft(initialTimeInSeconds);
        }
    }, [initialTimeInSeconds, resetTrigger]);

    useEffect(() => {
        if (timeLeft <= 0) {
            // Call the callback function from the parent
            if (onTimerFinish) {
                onTimerFinish();
            }
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimerFinish]); // Add onTimerFinish to the dependency array

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const isTimeUp = timeLeft <= 0;

    return (
        <Box sx={{ textAlign: 'center' }}>
            {isTimeUp ? (
                <TypographyComponent variant="body2" color={theme.palette.error.main}>
                    Time's up!
                </TypographyComponent>
            ) : (
                <TypographyComponent fontSize={14} color={theme.palette.grey[700]}>
                    Time Left: {formatTime(timeLeft)}
                </TypographyComponent>
            )}
        </Box>
    );
};

export default Timer;