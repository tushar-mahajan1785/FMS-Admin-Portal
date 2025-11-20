/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import {
    Drawer,
    Button,
    Stack,
    Divider,
    CircularProgress,
    IconButton,
    Grid,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../constants';
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormHeader from "../../../components/form-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import StatusSwitch from "../../../components/status-switch";
import CloseIcon from "../../../assets/icons/CloseIcon";
import { actionAddInventoryCategory, resetAddInventoryCategoryResponse } from "../../../store/inventory";
import ClientsIcon from "../../../assets/icons/ClientsIcon";
import { useBranch } from "../../../hooks/useBranch";

export default function AddInventoryCategory({ open, handleClose, objData }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    //Stores
    const { addInventoryCategory } = useSelector(state => state.inventoryStore)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            status: 'Active'
        }
    });

    //States
    const [loading, setLoading] = useState(false)
    const [inventoryCategoryStatus, setInventoryCategoryStatus] = useState("Active");


    /**
    * Initial Render and Set previously filled values
    */
    useEffect(() => {
        if (open === true) {
            if (objData && objData !== null) {
                setValue('name', objData?.title && objData?.title !== null ? objData?.title : '')
                setValue('description', objData?.description && objData?.description !== null ? objData?.description : '')
                setInventoryCategoryStatus(objData?.status)
            }
        }
        return () => {
            reset()
        }
    }, [open])

    /**
     * useEffect
     * @dependency : addInventoryCategory
     * @type : HANDLE API RESULT
     * @description : Handle the result of add inventory category API
     */
    useEffect(() => {
        if (addInventoryCategory && addInventoryCategory !== null) {
            dispatch(resetAddInventoryCategoryResponse())
            if (addInventoryCategory?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                showSnackbar({ message: addInventoryCategory?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (addInventoryCategory?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddInventoryCategoryResponse())
                        toast.dismiss()
                        showSnackbar({ message: addInventoryCategory?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: addInventoryCategory?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addInventoryCategory])

    //handle submit function
    const onSubmit = data => {

        let finalData = {
            status: inventoryCategoryStatus,
            branch_uuid: branch?.currentBranch?.uuid,
            title: data.name && data.name !== null ? data.name : null,
            description: data.description && data.description !== null ? data.description : null
        }
        if (objData?.uuid && objData?.uuid !== null) {
            finalData.uuid = objData?.uuid
        }

        setLoading(true)
        dispatch(actionAddInventoryCategory(finalData))
    };

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: 750 } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<ClientsIcon stroke={theme.palette.primary[600]} size={18} />}
                    title="Add New Category"
                    subtitle="Fill below form to add new category"
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
                        px: 2,
                        flexGrow: 1,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '2px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '2px'
                        }
                    }}
                >
                    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>

                            {/* name */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{
                                        required: 'Name is required',
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum length is 255 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            placeholder={'Name'}
                                            inputProps={{ maxLength: 255 }}
                                            value={field?.value}
                                            label={<FormLabel label='Name' required={true} />}
                                            onChange={field.onChange}
                                            error={Boolean(errors.name)}
                                            {...(errors.name && { helperText: errors.name.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* description */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Controller
                                    name='description'
                                    control={control}
                                    rules={{
                                        required: 'Description is required',
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum length is 255 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            multiline
                                            inputProps={{ maxLength: 255 }}
                                            minRows={3}
                                            placeholder={'Description'}
                                            value={field?.value}
                                            label={<FormLabel label='Description' required={true} />}
                                            onChange={field.onChange}
                                            error={Boolean(errors.description)}
                                            {...(errors.description && { helperText: errors.description.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <StatusSwitch value={inventoryCategoryStatus} onChange={setInventoryCategoryStatus} label="Status" />
                            </Grid>
                        </Grid>
                    </form>
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            handleClose()
                            reset()
                        }}
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleSubmit(onSubmit)()
                        }}
                        name='submit'
                        variant='contained'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Confirm'}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    );
}
