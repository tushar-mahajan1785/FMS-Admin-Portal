import styled from "@emotion/styled";
import { Button, createTheme, TextField, Typography, Stack, Dialog, Switch, StepConnector } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import MuiStep from '@mui/material/Step'

export const ListHeaderContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 16px; // Equivalent to p: 2
  
  // Responsive behavior for smaller screens
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const ListHeaderLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ListHeaderRightSection = styled.div`
  display: flex;
  gap: 8px;

  // Responsive behavior for smaller screens
  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const ListHeaderCountBadge = styled.div`
  padding: 2px 8px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 9999px;
  color: ${({ theme }) => theme.palette.primary[600]};
  background-color: ${({ theme }) => theme.palette.primary[600] + '21'}; // Equivalent to alpha(..., 0.13)
`;

export const SearchInput = styled(TextField)`
  width: '100%';
  border: 1px solid ${({ theme }) => theme.palette.grey[300]};
  border-radius: 8px;
  
  // Override MUI's default styles
  & .MuiOutlinedInput-root {
    border-radius: 8px;
    & fieldset {
      border-color: transparent;
    }
    &:hover fieldset {
      border-color: transparent;
    }
    &.Mui-focused fieldset {
      border-color: transparent;
      box-shadow: 0 0 0 2px rgba(128, 90, 213, 0.5);
    }
  }

  & .MuiInputBase-input::placeholder {
    font-size: 16px;
    font-weight: 400;
  }

  // Responsive behavior for smaller screens
   @media (max-width: 800px) {
    width: 'auto';
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const FilterButton = styled(Button)`
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  border-color: ${({ theme }) => theme.palette.grey[300]};
  border-radius: 8px;
  color: ${({ color, theme }) => color || theme.palette.text.primary};

  display: flex;
  align-items: center;
  gap: 6px; // space between icon and text

  & svg {
    color: ${({ iconColor, theme }) => iconColor || theme.palette.text.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey[200]};
    border-color: ${({ theme }) => theme.palette.grey[300]};
  }
`;

export const TableTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-virtualScroller': {
            // Applying thin scrollbar to the virtual scroller
            '&::-webkit-scrollbar': {
              width: '3px',
              height: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
          },
        },
        columnHeaders: {
          backgroundColor: 'white',
          borderRadius: 0,
          borderBottom: 'none',
        },
        columnHeader: {
          backgroundColor: 'white',
          borderBottom: '1px solid black',
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#000000',
            fontWeight: '600',
          },
        },
        cell: {
          borderBottom: 'none',
          color: 'rgba(47, 43, 0, 0.78)',
          // height: 100,
        },
        row: {
          '&:last-child .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          alignItems: 'center',
          borderBottom: '1px solid lightgray',
        },
      },
    },
  },
})

// Styled Progress Bar
export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 8,
  flex: 1, // allows it to stretch in row
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 8,
    backgroundColor: theme.palette.primary[600], // purple from theme
  },
}));

// Styled Section Header Wrapper
export const SectionHeaderWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

// Styled Section Title
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 600,
  color: theme.palette.grey[700],
}));

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  maxWidth: 'md',
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary[600],
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], { duration: 200 }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 8,
    opacity: 1,
    backgroundColor: theme.palette.grey[100],
    boxSizing: 'border-box',
  },
}));

export const Step = styled(MuiStep)(({ theme }) => ({
  '& .MuiStepLabel-root': {
    paddingTop: 0
  },
  '&:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(5)
  },
  '&:last-of-type .MuiStepLabel-root': {
    paddingBottom: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  }
}))

export const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.grey[400],
    borderWidth: 1,
    borderStyle: 'dashed',
    transition: theme.transitions.create(['border-color', 'border-style'], {
      duration: theme.transitions.duration.short,
    }),
  },

  // ✅ Make connector solid green if the previous step is completed
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.success[600],
    borderStyle: 'solid',
  },

  // ✅ When the *next* step becomes active, also turn the connector solid green
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.success[600],
    borderStyle: 'solid',
  },
}));