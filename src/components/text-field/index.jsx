// ** React Import
import { forwardRef } from 'react'

// ** MUI Imports
import { alpha, styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  // Label styling
  '& .MuiInputLabel-root': {
    transform: 'none',
    lineHeight: 1.154,
    position: 'relative',
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
    color: `${theme.palette.text.primary} !important`,
    '&.Mui-focused': {
      color: `${theme.palette.primary[600]} !important`,
      backgroundColor: 'transparent'
    },
  },

  // Input container
  '& .MuiInputBase-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${alpha(theme.palette.customColors.main, 0.2)}`,
    transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),

    // ✅ Hover (keep background white/transparent)
    '&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover': {
      backgroundColor: theme.palette.common.white,
      borderColor: alpha(theme.palette.customColors.main, 0.35),
    },

    '&:before, &:after': {
      display: 'none',
    },

    '&.MuiInputBase-sizeSmall': {
      borderRadius: 6,
    },

    '&.Mui-error': {
      borderColor: theme.palette.error.main,
    },

    // ✅ Focused state (keep background white/transparent)
    '&.Mui-focused': {
      backgroundColor: theme.palette.common.white,
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      '& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
        transform: 'translateX(4px)',
      },
      '&.MuiInputBase-colorPrimary': {
        borderColor: theme.palette.primary[600],
      },
      '&.MuiInputBase-colorSecondary': {
        borderColor: theme.palette.secondary[600],
      },
      '&.MuiInputBase-colorInfo': {
        borderColor: theme.palette.info[600],
      },
      '&.MuiInputBase-colorSuccess': {
        borderColor: theme.palette.success[600],
      },
      '&.MuiInputBase-colorWarning': {
        borderColor: theme.palette.warning[600],
      },
      '&.MuiInputBase-colorError': {
        borderColor: theme.palette.error[600],
      },
      '&.Mui-error': {
        borderColor: theme.palette.error[600],
      },
    },

    // ✅ Proper disabled styling
    '&.Mui-disabled, &.MuiInputBase-disabled': {
      backgroundColor: `${theme.palette.grey[100]} !important`,
      color: `${theme.palette.grey[900]} !important`,
      borderColor: `${alpha(theme.palette.customColors.main, 0.12)} !important`,
      opacity: 1,
      cursor: 'not-allowed',

      '& .MuiInputBase-input': {
        color: `${theme.palette.grey[900]} !important`,
        WebkitTextFillColor: `${theme.palette.grey[400]} !important`,
        opacity: 1,
      },

      '& .MuiInputAdornment-root': {
        opacity: 0.5,
      },

      '& fieldset': {
        borderColor: `${alpha(theme.palette.customColors.main, 0.12)} !important`,
      },
    },

    '& .MuiInputAdornment-root': {
      backgroundColor: 'transparent !important',
      marginTop: '0 !important',
    },
  },

  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent !important',
    borderRadius: 5,
    '&:not(textarea)': {
      padding: '15.5px 13px',
    },
    '&:not(textarea).MuiInputBase-inputSizeSmall': {
      padding: '7.5px 13px',
    },
    '&:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
      transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.shorter,
      }),
    },
    '&.MuiInputBase-inputAdornedStart:not(.MuiAutocomplete-input)': {
      paddingLeft: 0,
    },
    '&.MuiInputBase-inputAdornedEnd:not(.MuiAutocomplete-input)': {
      paddingRight: 0,
    },
  },

  '& .MuiFormHelperText-root': {
    lineHeight: 1.154,
    margin: theme.spacing(1, 0, 0),
    color: theme.palette.text.secondary,
    fontSize: theme.typography.body2.fontSize,
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },

  // ** For Select
  '& .MuiSelect-select:focus, & .MuiNativeSelect-select:focus': {
    backgroundColor: 'transparent',
  },
  '& .MuiSelect-filled .MuiChip-root': {
    height: 22,
  },

  // ** For Autocomplete
  '& .MuiAutocomplete-input': {
    paddingLeft: '6px !important',
    paddingTop: '7.5px !important',
    paddingBottom: '7.5px !important',
    '&.MuiInputBase-inputSizeSmall': {
      paddingLeft: '6px !important',
      paddingTop: '2.5px !important',
      paddingBottom: '2.5px !important',
    },
  },

  '& .MuiAutocomplete-inputRoot': {
    paddingTop: '8px !important',
    paddingLeft: '8px !important',
    paddingBottom: '8px !important',
    '&:not(.MuiInputBase-sizeSmall).MuiInputBase-adornedStart': {
      paddingLeft: '13px !important',
    },
    '&.MuiInputBase-sizeSmall': {
      paddingTop: '5px !important',
      paddingLeft: '5px !important',
      paddingBottom: '5px !important',
      '& .MuiAutocomplete-tag': {
        margin: 2,
        height: 22,
      },
    },
  },

  // ** For Textarea
  '& .MuiInputBase-multiline': {
    padding: '15.25px 13px',
    '&.MuiInputBase-sizeSmall': {
      padding: '7.25px 13px',
    },
    '& textarea.MuiInputBase-inputSizeSmall:placeholder-shown': {
      overflowX: 'hidden',
    },
  },

  // ** For Date Picker
  '& + .react-datepicker__close-icon': {
    top: 11,
    '&:after': {
      fontSize: '1.6rem !important',
    },
  },
}))

const CustomTextField = forwardRef((props, ref) => {
  const { size = 'small', InputLabelProps, label, ...rest } = props

  return (
    <TextFieldStyled
      size={size}
      inputRef={ref}
      {...rest}
      variant="filled"
      label={label}
      InputLabelProps={{ ...InputLabelProps, shrink: true }}
    />
  )
})

export default CustomTextField
