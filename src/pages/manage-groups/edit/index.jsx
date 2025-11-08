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
import { actionEditManageGroups, resetEditManageGroupsResponse } from '../../../store/roster';
import toast from 'react-hot-toast';
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useBranch } from '../../../hooks/useBranch';

export default function EditManageGroups({ open, objData, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false)
    const steps = ['Select Asset', 'Select Employees & Confirm'];

    // store
    const { rosterData, editManageGroups } = useSelector(state => state.rosterStore)

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <SelectAssetStep assetData={objData} />;
            case 1:
                return <SelectEmployeesStep employeeData={objData} />;
            default:
                return <Typography>Unknown step</Typography>;
        }
    }

    const handleNext = () => {
        if (!isLastStep) {
            if (!rosterData?.roster_group_name) {
                showSnackbar({
                    message: "Please enter group name",
                    severity: "error",
                });
                return;
            }
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            dispatch(actionEditManageGroups({
                branch_uuid: branch?.currentBranch?.uuid,
                assets: rosterData?.assets,
                employees: rosterData?.employees,
                roster_group_name: rosterData?.roster_group_name,
                roster_group_uuid: objData?.uuid,

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
          * @dependency : edit Manage Groups
          * @type : HANDLE API RESULT
          * @description : Handle the result of add Manage Groups API
          */
    useEffect(() => {
        if (editManageGroups && editManageGroups !== null) {
            dispatch(resetEditManageGroupsResponse())
            if (editManageGroups?.result === true) {
                handleClose('save')
                setActiveStep(0);
                toast.dismiss()
                showSnackbar({ message: editManageGroups?.message, severity: "success" })
                setLoading(false)
            } else {
                handleClose()
                setActiveStep(0);
                setLoading(false)
                switch (editManageGroups?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEditManageGroupsResponse())
                        toast.dismiss()
                        showSnackbar({ message: editManageGroups?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: editManageGroups?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [editManageGroups])

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '86%' } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<UserIcon stroke={theme.palette.primary[600]} size={18} />}
                    title="Edit Group Details"
                    subtitle="Fill below form to edit group details"
                    centerSection={
                        <Box sx={{ p: 2, flexGrow: 1 }}>
                            <Stepper
                                activeStep={activeStep}
                                connector={<CustomStepConnector />}
                                sx={{
                                    "& .MuiStepLabel-root": {
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 1,
                                    },
                                    "& .MuiStepLabel-labelContainer": {
                                        // prevent default styles from overriding
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                }}
                            >
                                {steps.map((label, index) => {
                                    // 🔹 Determine color based on active step
                                    let labelColor = theme.palette.grey[600];

                                    if (activeStep === 0) {
                                        if (index === 0) labelColor = theme.palette.primary[600];
                                        if (index === 1) labelColor = theme.palette.grey[600];
                                    } else if (activeStep === 1) {
                                        if (index === 0) labelColor = theme.palette.success[600];
                                        if (index === 1) labelColor = theme.palette.primary[600];
                                    }

                                    return (
                                        <Step key={label} completed={index < activeStep}>
                                            <StepLabel
                                                StepIconComponent={CustomStepIcon}
                                                sx={{
                                                    "& .MuiStepLabel-label": {
                                                        fontWeight: 600,
                                                        color: `${labelColor} !important`, // ✅ force override
                                                        transition: "color 0.3s ease",
                                                    },
                                                }}
                                            >
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    );
                                })}
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
                        overflowY: 'auto'
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
                    sx={{ px: 2, pb: 2 }}
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
                        {isLastStep ? 'Save Changes' : loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Next'}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    );
}