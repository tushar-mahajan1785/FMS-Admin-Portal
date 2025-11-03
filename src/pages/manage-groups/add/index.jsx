/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
    Divider,
    Drawer,
    IconButton,
    Stack,
    useTheme,
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    Typography,
} from "@mui/material";
import FormHeader from '../../../components/form-header';
import CloseIcon from '../../../assets/icons/CloseIcon';
import UserIcon from "../../../assets/icons/UserIcon"
import CustomStepIcon from '../../../components/custom-step-icon';
import { CustomStepConnector } from '../../../components/common';
import SelectAssetStep from './components/asset-step';
import SelectEmployeesStep from './components/employee-step';
import { actionAddManageGroups, resetAddManageGroupsResponse } from '../../../store/roster';
import toast from 'react-hot-toast';
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useBranch } from '../../../hooks/useBranch';

export default function AddManageGroups({ open, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false)
    const steps = ['Select Asset', 'Select Employees & Confirm'];

    // store
    const { rosterData, addManageGroups } = useSelector(state => state.rosterStore)

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <SelectAssetStep />;
            case 1:
                return <SelectEmployeesStep />;
            default:
                return <Typography>Unknown step</Typography>;
        }
    }

    const handleNext = () => {
        if (!isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            dispatch(actionAddManageGroups({
                branch_uuid: branch?.currentBranch?.uuid,
                assets: rosterData?.assets,
                employees: rosterData?.employees,
                roster_group_name: rosterData?.roster_group_name
            }))
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

    /**
          * useEffect
          * @dependency : addEmployee
          * @type : HANDLE API RESULT
          * @description : Handle the result of add Manage Groups API
          */
    useEffect(() => {
        if (addManageGroups && addManageGroups !== null) {
            dispatch(resetAddManageGroupsResponse())
            if (addManageGroups?.result === true) {
                handleClose('save')
                setActiveStep(0);
                toast.dismiss()
                showSnackbar({ message: addManageGroups?.message, severity: "success" })
                setLoading(false)
            } else {
                handleClose()
                setActiveStep(0);
                setLoading(false)
                switch (addManageGroups?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddManageGroupsResponse())
                        toast.dismiss()
                        showSnackbar({ message: addManageGroups?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: addManageGroups?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addManageGroups])

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: '86%' } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<UserIcon stroke={theme.palette.primary[600]} size={18} />}
                    title="Create New Group"
                    subtitle="Fill below form to create new group"
                    centerSection={
                        <Box sx={{ p: 2, flexGrow: 1 }}>
                            <Stepper
                                activeStep={activeStep}
                                connector={<CustomStepConnector />}
                                alternativeLabel
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontWeight: 500,
                                        color: theme.palette.grey[600], // default
                                        transition: 'color 0.3s ease',
                                    },
                                    // ✅ Active step (current page)
                                    '& .MuiStepLabel-root.Mui-active .MuiStepLabel-label': {
                                        color: theme.palette.primary[600],
                                        fontWeight: 600,
                                    },
                                    // ✅ Completed step (previous page)
                                    '& .MuiStepLabel-root.Mui-completed .MuiStepLabel-label': {
                                        color: theme.palette.success[600],
                                        fontWeight: 600,
                                    },
                                }}
                            >
                                {steps.map((label, index) => (
                                    <Step
                                        key={label}
                                        completed={index < activeStep}
                                    >
                                        <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    }
                    actions={[
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                />
                <Divider sx={{ m: 2 }} />
                <Stack
                    sx={{
                        px: 4,
                        pb: 4,
                        flexGrow: 1,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { width: '2px' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '2px' }
                    }}
                >
                    {activeStep !== steps.length && (
                        getStepContent(activeStep)
                    )}
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 4 }}
                >
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        variant="outlined"
                    >
                        {isLastStep ? 'Previous' : 'Reset'}
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={handleNext}
                        variant="contained"
                        disabled={loading}
                    >
                        {isLastStep ? 'Create Group' : loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Next'}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    );
}