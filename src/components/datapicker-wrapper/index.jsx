// src/components/DatePickerWrapper.jsx
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Import default react-datepicker styles
import 'react-datepicker/dist/react-datepicker.css'

const DatePickerWrapper = styled(Box)(({ theme }) => ({
    '& .react-datepicker-popper': {
        zIndex: 20
    },
    '& .react-datepicker-wrapper': {
        width: '100%'
    },
    '& .react-datepicker': {
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadius,
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        border: `1px solid ${theme.palette.grey[200]}`,

        '& .react-datepicker__header': {
            marginTop: theme.spacing(1),
            padding: theme.spacing(1),
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
            backgroundColor: theme.palette.background.paper,
            // 🔹 Added flexbox for proper alignment
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        '& .react-datepicker__header__dropdown': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
        },
        '& .react-datepicker__current-month': {
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: theme.typography.h6.fontSize,
            // marginTop: theme.spacing(1)
        },
        '& .react-datepicker__day-name, & .react-datepicker__day, & .react-datepicker__time-name': {
            margin: 0,
            width: 36,
            lineHeight: '36px',
            textAlign: 'center',
            borderRadius: '50%',
            color: theme.palette.text.primary,
            fontSize: theme.typography.body2.fontSize,
            '&:hover': {
                backgroundColor: theme.palette.primary[50]
            }
        },
        '& .react-datepicker__day--selected, & .react-datepicker__day--keyboard-selected': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary[600],
            '&:hover': {
                backgroundColor: theme.palette.primary[900]
            }
        },
        '& .react-datepicker__day--today': {
            border: `1px solid ${theme.palette.primary[600]}`,
            fontWeight: 500
        },
        // 🔹 Scrollable Year Dropdown Styles
        '& .react-datepicker__year-dropdown': {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: theme.shape.borderRadius * 2,
            boxShadow: theme.shadows[4],
            maxHeight: 200,
            overflowY: 'auto',
            padding: theme.spacing(1, 0),
            // 🔹 Custom scrollbar styling
            '&::-webkit-scrollbar': {
                width: '6px'
            },
            '&::-webkit-scrollbar-track': {
                background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                borderRadius: '10px'
            }
        },
        '& .react-datepicker__year-option': {
            padding: theme.spacing(1),
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.text.primary,
            fontSize: theme.typography.body2.fontSize,
            transition: 'background-color 0.2s ease',
            '&:hover': {
                backgroundColor: theme.palette.primary[100]
            }
        },
        '& .react-datepicker__year-option--selected_year': {
            backgroundColor: theme.palette.primary[600],
            color: theme.palette.common.white,
            fontWeight: 600,
            '&::before': {
                display: 'none !important'
            }
        },
        // Make sure navigation arrows are visible and styled (they previously were hidden)
        '& .react-datepicker__navigation--years-previous, & .react-datepicker__navigation--years-upcoming': {
            border: 'none',
            cursor: 'pointer',
            // allow the element to be measured/clickable
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            background: 'transparent'
        },

        // draw the triangle arrows using pseudo-elements
        '& .react-datepicker__navigation--years-previous::before': {
            content: '""',
            display: 'block',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${theme.palette.text.primary}`
        },
        '& .react-datepicker__navigation--years-upcoming::before': {
            content: '""',
            display: 'block',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: `6px solid ${theme.palette.text.primary}`
        },
        // 🔹 Year and Month display styling
        '& .react-datepicker__year-read-view, & .react-datepicker__month-read-view': {
            padding: theme.spacing(0, 0.5),
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            fontSize: '16px',
            [theme.breakpoints.down('md')]: {
                fontSize: '18px'
            },
            color: theme.palette.text.primary
        },
        '& .react-datepicker__year-read-view--down-arrow, & .react-datepicker__month-read-view--down-arrow': {
            position: 'absolute',
            right: -10,                 // stick to the right side
            top: '50%',               // move to middle
            transform: 'translateY(-50%)', // perfect vertical centering
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `5px solid ${theme.palette.text.primary}`,

        },
        '& .react-datepicker__navigation--previous, & .react-datepicker__navigation--next': {
            top: theme.spacing(2), // move buttons down
        },
        // Grey out disabled days but keep the number visible
        '& .react-datepicker__day--disabled:not(.react-datepicker__day--selected), \
        & .react-datepicker__day--outside-month.react-datepicker__day--disabled': {
            color: theme.palette.text.primary, // keep the base text color so numbers render
            opacity: 0.4,                      // fade them (like MUI's disabled look)
            cursor: 'not-allowed',
            pointerEvents: 'none',             // stay unclickable
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },

        // Outside-month but not disabled (so they stay grey)
        '& .react-datepicker__day--outside-month:not(.react-datepicker__day--disabled)': {
            color: theme.palette.text.disabled,
            opacity: 1,
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
    }
}))

export default DatePickerWrapper