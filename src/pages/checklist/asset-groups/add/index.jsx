/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@emotion/react";
import { Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../../constants";
import toast from "react-hot-toast";
import { useAuth } from "../../../../hooks/useAuth";
import TypographyComponent from "../../../../components/custom-typography";
import { BootstrapDialog } from '../../../../components/common';
import CustomTextField from '../../../../components/text-field';
import FormLabel from '../../../../components/form-label';
import { actionChecklistGroupAdd, actionChecklistGroupAssetList, resetChecklistGroupAddResponse, resetChecklistGroupAssetListResponse } from '../../../../store/checklist';
import { useBranch } from '../../../../hooks/useBranch';
import { useParams } from 'react-router-dom';
import TwoColorIconCircle from '../../../../components/two-layer-icon';
import AssetIcon from '../../../../assets/icons/AssetIcon';

export default function AddChecklistAssetGroup({ open, handleClose }) {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { showSnackbar } = useSnackbar()
    const auth = useAuth()
    const { logout } = useAuth()
    const branch = useBranch()
    const { assetId } = useParams()

    //States
    const [assetMasterData, setAssetMasterData] = useState([])
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [assetError, setAssetError] = useState(null)

    //Stores
    const { checklistGroupAssetList, checklistGroupAdd } = useSelector(state => state.checklistStore)

    const { control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            group_name: ''
        },
        mode: 'all'
    })

    //Initial Render
    useEffect(() => {
        if (open === true) {
            setAssetError(null)
            reset()
            dispatch(actionChecklistGroupAssetList({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type_id: assetId
            }))
            return () => {
                setLoadingSubmit(false)
            }
        }
    }, [open])

    /**
        * useEffect
        * @dependency : checklistGroupAssetList
        * @type : HANDLE API RESULT
        * @description : Handle the result of checklist group asset List API
       */
    useEffect(() => {
        if (checklistGroupAssetList && checklistGroupAssetList !== null) {
            dispatch(resetChecklistGroupAssetListResponse())
            if (checklistGroupAssetList?.result === true) {
                const initializedAssets = checklistGroupAssetList?.response?.map(asset => ({
                    ...asset,
                    is_selected: asset?.is_selected === 1 ? 1 : 0 // Preserve existing, default to 0
                }));
                setAssetMasterData(initializedAssets)
            } else {
                setAssetMasterData([])
                switch (checklistGroupAssetList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetChecklistGroupAssetListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: checklistGroupAssetList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupAssetList])

    /**
    * useEffect
    * @dependency : checklistGroupAdd
    * @type : HANDLE API RESULT
    * @description : Handle the result of checklist group add API
    */
    useEffect(() => {
        if (checklistGroupAdd && checklistGroupAdd !== null) {
            dispatch(resetChecklistGroupAddResponse())
            if (checklistGroupAdd?.result === true) {
                setLoadingSubmit(false)
                reset()
                showSnackbar({ message: checklistGroupAdd.message, severity: "success" })
                handleClose('save')
            } else {
                setLoadingSubmit(false)
                switch (checklistGroupAdd?.status) {
                    case UNAUTHORIZED:
                        auth.logout()
                        break
                    case ERROR:
                        showSnackbar({ message: checklistGroupAdd.message, severity: "error" })
                        dispatch(resetChecklistGroupAddResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: checklistGroupAdd.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupAdd])

    //handle onsubmit function
    const onSubmit = (data) => {
        setAssetError(null)

        // Filter the selected assets and prepare the final data for the API
        const selectedAssets = assetMasterData
            .filter(asset => asset.is_selected === 1)
            .map(asset => (asset.id)); // Only send id

        if (selectedAssets && selectedAssets.length > 0) {
            let objData = {
                group_name: data.group_name,
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type_id: assetId ? Number(assetId) : null,
                asset_ids: selectedAssets
            }
            setLoadingSubmit(true)
            dispatch(actionChecklistGroupAdd(objData))
        } else {
            setAssetError('Asset selection is required')
        }
    }

    return (
        <BootstrapDialog
            fullWidth
            maxWidth={'sm'}
            onClose={() => handleClose()}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            scroll="paper"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 1.5 }} id="customized-dialog-title">
                <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                >
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                        <TwoColorIconCircle
                            IconComponent={<AssetIcon stroke={theme.palette.primary[600]} size={14} />}
                            color={theme.palette.primary[600]}
                            size={40}
                        />
                        <TypographyComponent fontSize={20} fontWeight={500}>
                            Create New Group
                        </TypographyComponent>
                    </Stack>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            color: theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Grid container>
                        {/* group name */}
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Controller
                                name='group_name'
                                control={control}
                                rules={{
                                    required: "Group Name is required",
                                    maxLength: {
                                        value: 255,
                                        message: 'Maximum length is 255 characters'
                                    },
                                }}
                                render={({ field }) => (
                                    <CustomTextField
                                        fullWidth
                                        value={field?.value ?? ''}
                                        label={<FormLabel label='Group Name' required={true} />}
                                        onChange={field.onChange}
                                        inputProps={{ maxLength: 255 }}
                                        error={Boolean(errors.group_name)}
                                        {...(errors.group_name && { helperText: errors.group_name.message })}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Stack flexDirection={'column'} sx={{ mt: 2 }}>
                                {
                                    assetMasterData && assetMasterData.length > 0 ?
                                        assetMasterData.map((objData) => (
                                            <FormControlLabel
                                                key={objData.id} // Use a unique key like asset_uuid
                                                control={
                                                    <Checkbox
                                                        checked={objData.is_selected === 1}
                                                        onChange={() => {
                                                            setAssetError(null)
                                                            setAssetMasterData(prevData =>
                                                                prevData.map(asset => {
                                                                    if (asset.id === objData?.id) {
                                                                        // Toggle the value between 1 and 0
                                                                        return { ...asset, is_selected: asset.is_selected === 1 ? 0 : 1 };
                                                                    }
                                                                    return asset;
                                                                })
                                                            );
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <TypographyComponent>
                                                        {objData?.asset_description}
                                                    </TypographyComponent>
                                                }
                                            />
                                        ))
                                        :
                                        <TypographyComponent variant="body2" color="textSecondary">
                                            No assets available for this type.
                                        </TypographyComponent>
                                }
                            </Stack>
                            {
                                assetError && assetError !== null ?
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.error[600] }}>{assetError}</TypographyComponent>
                                    :
                                    <></>

                            }
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions sx={{ m: 0.5 }}>
                <Button color="secondary" variant="outlined" sx={{ color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" sx={{ textTransform: 'capitalize', background: theme.palette.primary[600], color: theme.palette.common.white }} disabled={loadingSubmit} onClick={() => {
                    handleSubmit(onSubmit)()
                }}>
                    {loadingSubmit ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Save Changes'}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
