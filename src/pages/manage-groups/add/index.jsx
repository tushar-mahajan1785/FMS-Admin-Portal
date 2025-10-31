import React, { useState } from 'react';
import {
    Divider, Drawer, IconButton, Stack, useTheme,
    Stepper, Step, StepLabel, Button, Box, Typography, Card,
    CardContent, Grid, TextField, Tabs, Tab, List, ListItem,
    Switch, InputAdornment, Paper
} from "@mui/material";
// Assuming these are custom components/icons, replacing with standard MUI for completeness
import FormHeader from '../../../components/form-header';
import SearchIcon from '../../../assets/icons/SearchIcon';
import CloseIcon from '../../../assets/icons/CloseIcon';
import UserIcon from "../../../assets/icons/UserIcon"
import CustomStepIcon from '../../../components/custom-step-icon';
import { CustomStepConnector } from '../../../components/common';

// --- Stepper Content Components ---

// Mock Asset data for the list
const mockAssets = [
    { id: 1, name: 'ISO-G-1 Panel', type: 'Electrical', selected: true },
    { id: 2, name: 'CTPT Check Meter', type: 'Electrical', selected: false },
    { id: 3, name: 'OLTC', type: 'Electrical', selected: false },
    { id: 4, name: 'Nitrogen Injection Fire Panel', type: 'Electrical', selected: false },
    { id: 5, name: 'Bus Coupler Panel', type: 'Electrical', selected: false },
    { id: 6, name: 'Power Transformer', type: 'Electrical', selected: false },
    { id: 7, name: 'Outgoing panel', type: 'Electrical', selected: false },
    { id: 8, name: 'Main Incomer panel', type: 'Electrical', selected: false },
];

const AssetListItem = ({ asset }) => (
    <ListItem
        disablePadding
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            px: 1,
            borderBottom: '1px solid #eee',
        }}
    >
        <Box>
            <Typography variant="body1">{asset.name}</Typography>
            <Typography variant="caption" color="text.secondary">{asset.type}</Typography>
        </Box>
        <Switch
            checked={asset.selected}
            size="small"
            inputProps={{ 'aria-label': `Select ${asset.name}` }}
        />
    </ListItem>
);


function SelectAssetStep() {
    const [assetTab, setAssetTab] = useState(0);
    const selectedAsset = mockAssets.find(a => a.selected);

    const handleTabChange = (event, newValue) => {
        setAssetTab(newValue);
    };

    return (
        <Grid container spacing={4} sx={{ mt: 1 }}>
            {/* Left Panel: Select Asset */}
            <Grid size={{ xs: 12, sm: 12, md: 5, lg: 5, xl: 5 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
                    Select Asset
                </Typography>
                <Card variant="outlined" sx={{ border: 'none' }}>
                    <CardContent sx={{ p: 0 }}>
                        {/* Search Bar */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* Tabs (Electrical, BMS, Cooling) */}
                        <Tabs
                            value={assetTab}
                            onChange={handleTabChange}
                            aria-label="asset categories"
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ mb: 2, minHeight: 'unset' }}
                        >
                            <Tab label="Electrical" sx={{ textTransform: 'none', p: 0, mr: 2, minHeight: 'unset' }} />
                            <Tab label="BMS" sx={{ textTransform: 'none', p: 0, mr: 2, minHeight: 'unset' }} />
                            <Tab label="Cooling" sx={{ textTransform: 'none', p: 0, mr: 2, minHeight: 'unset' }} />
                        </Tabs>

                        {/* Asset List with Toggles */}
                        <Paper variant="outlined" sx={{ maxHeight: 350, overflowY: 'auto', p: 0 }}>
                            <List dense sx={{ p: 0 }}>
                                {mockAssets.map((asset) => (
                                    <AssetListItem key={asset.id} asset={asset} />
                                ))}
                            </List>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>

            {/* Right Panel: Selected Asset Details & Group Details */}
            <Grid size={{ xs: 12, sm: 12, md: 7, lg: 7, xl: 7 }}>
                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Selected Asset Details
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <Typography variant="caption" display="block" color="text.secondary">Asset Name</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {selectedAsset ? selectedAsset.name : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                <Typography variant="caption" display="block" color="text.secondary">Asset Type</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {selectedAsset ? selectedAsset.type : 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Typography variant="subtitle1" gutterBottom>
                        Group Details
                    </Typography>
                    {/* Group Name Input */}
                    <TextField
                        fullWidth
                        label="Group Name"
                        placeholder="Write group name"
                        variant="outlined"
                        size="medium"
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

function SelectEmployeesStep() {
    return (
        <Typography sx={{ mt: 2, mb: 1 }}>
            Step 2: Select Employees and Review...
        </Typography>
    );
}

const steps = ['Select Asset', 'Select Employees & Confirm'];

function getStepContent(step) {
    switch (step) {
        case 0:
            return <SelectAssetStep />;
        case 1:
            return <SelectEmployeesStep />;
        default:
            return <Typography>Unknown step</Typography>;
    }
}

// --- Main Component ---
export default function AddManageGroups({ open, handleClose }) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (!isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            handleClose()
            setActiveStep(0);
        }
    };

    const handleBack = () => {
        if (isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        } else {
            setActiveStep(0);
        }
    };

    const isLastStep = activeStep === steps.length - 1;
    const completedStepIndex = activeStep > 0 ? activeStep - 1 : -1;

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            // Adjusted max width for better visibility in the image context
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: 1100 } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                {/* 1. Header (using the existing FormHeader prop structure) */}
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<UserIcon stroke={theme.palette.primary[600]} size={18} />}
                    title="Create New Group"
                    subtitle="Fill below form to create new group"
                    actions={[
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                />

                {/* 2. Stepper and Content Area (Scrollable) */}
                <Stack
                    sx={{
                        p: 4,
                        flexGrow: 1,
                        overflowY: 'auto',
                        // ... your custom scrollbar styles are kept here
                        '&::-webkit-scrollbar': { width: '2px' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '2px' }
                    }}
                >
                    {/* Stepper Component */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                        <Stepper
                            activeStep={activeStep}
                            connector={<CustomStepConnector />}
                            sx={{
                                '& .MuiStepLabel-label': {
                                    fontWeight: 500, // Make text bold for the current step
                                    color: theme.palette.primary[600] // Ensure text color is visible
                                },
                            }}
                        >
                            {steps.map((label, index) => (
                                <Step key={label} completed={index <= completedStepIndex}>
                                    <StepLabel
                                        StepIconComponent={CustomStepIcon}
                                        sx={{
                                            // Custom color for the pending label text to match the design (Step 2)
                                            '& .MuiStepLabel-label.Mui-disabled': {
                                                color: theme.palette.grey[600],
                                            },
                                            // Custom color for the completed label text (Step 1)
                                            '& .MuiStepLabel-label.Mui-completed': {
                                                color: theme.palette.success[600],
                                            },
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    {/* Step Content */}
                    {activeStep !== steps.length && (
                        getStepContent(activeStep)
                    )}

                    {/* Bottom Navigation (Reset & Next/Confirm) - Placed within the scrollable stack 
                        to follow the content, matching the image's layout */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            mt: 4,
                            pt: 3,
                            borderTop: '1px solid #eee'
                        }}
                    >
                        {/* Reset Button (Visible on Step 1) */}
                        <Button
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            variant="outlined"
                            color="inherit" // Use a subtle color
                        >
                            {isLastStep ? 'Previous' : 'Reset'}
                        </Button>

                        {/* Back and Next/Confirm Buttons */}
                        <Stack direction="row" spacing={2}>
                            <Button
                                onClick={handleNext}
                                variant="contained"
                                sx={{
                                    backgroundColor: theme.palette.primary[600],
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary[600],
                                    }
                                }}
                            >
                                {isLastStep ? 'Confirm' : 'Next'}
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>

            </Stack>
        </Drawer>
    );
}