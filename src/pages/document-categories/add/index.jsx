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
    validateFileSize,
} from '../../../constants';
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "../../../components/form-header";
import SectionHeader from "../../../components/section-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import CloseIcon from "../../../assets/icons/CloseIcon";
import SettingsIcon from "../../../assets/icons/SettingsIcon";
import { useBranch } from "../../../hooks/useBranch";
import { actionAddDocumentCategories, resetAddDocumentCategoriesResponse } from "../../../store/document-categories";
import { getFormData } from "../../../utils";

export default function AddDocumentCategories({ open, dataObj, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    // store
    const { addDocumentCategories } = useSelector(state => state.documentCategoriesStore)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            category_name: "",
            category_short_name: "",
            description: "",
        }
    });


    // state
    const [loading, setLoading] = useState(false)

    //Initial Render
    useEffect(() => {
        if (open === true) {
            reset()
            if (dataObj && dataObj !== null && dataObj.formType && dataObj.formType === 'edit') {
                setValue('category_name', dataObj.category_name && dataObj.category_name !== null ? dataObj.category_name : '')
                setValue('category_short_name', dataObj.category_short_name && dataObj.category_short_name !== null ? dataObj.category_short_name : '')
                setValue('description', dataObj.description && dataObj.description !== null ? dataObj.description : '')
                setValue('icon', dataObj.image_url && dataObj.image_url !== null ? dataObj.image_url : '')
            } else {
                reset()
            }

        }
    }, [open, dataObj])

    /**
     * 
     * @param {*} watch 
     * @param {*} errors 
     * @param {*} fields 
     * @returns 
     */
    const useSectionProgress = (watch, errors, fields) => {
        const values = watch(fields);

        const filled = fields.filter((f, i) => {
            const value = values[i];
            const hasError = !!errors[f];
            return value && value.toString().trim() !== "" && !hasError;
        }).length;

        return Math.round((filled / fields.length) * 100);
    };

    // section progress
    const documentCategoriesProgress = useSectionProgress(watch, errors, ["category_name", "category_short_name", "description", "icon"]);

    /**
     * useEffect
     * @dependency : addDocumentCategories
     * @type : HANDLE API RESULT
     * @description : Handle the result of add setting API
     */
    useEffect(() => {
        if (addDocumentCategories && addDocumentCategories !== null) {
            dispatch(resetAddDocumentCategoriesResponse())
            if (addDocumentCategories?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                showSnackbar({ message: addDocumentCategories?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (addDocumentCategories?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddDocumentCategoriesResponse())
                        showSnackbar({ message: addDocumentCategories?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: addDocumentCategories?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addDocumentCategories])

    const validateFileType = file => {
        if (!file) {
            return true // Return true if file is undefined or null
        }
        const fileName = file.name
        if (!fileName) {
            return true // Return true if file name is undefined or null
        }
        const fileExtension = fileName.split('.').pop().toLowerCase() // Extract file extension
        const allowedExtensions = ['svg'] // Allowed file extensions
        if (!allowedExtensions.includes(fileExtension)) {
            return 'Only SVG files are allowed'
        }

        return true // Check if file extension is allowed
    }

    // handle submit function
    const onSubmit = (data) => {
        let updated = Object.assign({}, data)
        if (dataObj && dataObj !== null && dataObj.formType && dataObj.formType === 'edit' && dataObj.uuid && dataObj.uuid !== null) {
            updated.category_uuid = dataObj.uuid
        }
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            updated.branch_uuid = branch?.currentBranch?.uuid
        }
        const files = [];
        if (updated.icon && updated.icon instanceof File) {
            files.push({
                title: 'icon',
                data: updated.icon
            });
        }
        setLoading(true)
        const formData = getFormData(updated, files);
        dispatch(actionAddDocumentCategories(formData))
    };


    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: 550 } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<SettingsIcon stroke={theme.palette.primary[600]} size={18} />}
                    title={`${dataObj && dataObj?.formType && dataObj.formType === 'edit' ? 'Edit' : 'Add New'} Document Categories`}
                    subtitle={`Fill below form to ${dataObj && dataObj?.formType && dataObj.formType === 'edit' ? 'update' : 'add new'} ${dataObj?.entity_type} document categories`}
                    actions={[
                        <IconButton
                            onClick={() => {
                                handleClose()
                                reset()
                            }}
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
                        <SectionHeader title="Document Categories Details" progress={documentCategoriesProgress} />
                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                            {/* Category Name */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Controller
                                    name='category_name'
                                    control={control}
                                    rules={{
                                        required: "Category Name is required",
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum length is 255 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            inputProps={{ maxLength: 255 }}
                                            label={<FormLabel label='Category Name' required={true} />}
                                            onChange={field.onChange}
                                            error={Boolean(errors.category_name)}
                                            {...(errors.category_name && { helperText: errors.category_name.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* Category Short Name */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Controller
                                    name='category_short_name'
                                    control={control}
                                    rules={{
                                        required: "Category Short Name is required",
                                        maxLength: {
                                            value: 100,
                                            message: 'Maximum length is 100 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            disabled={dataObj?.formType === 'edit'}
                                            inputProps={{ maxLength: 100 }}
                                            label={<FormLabel label='Category Short Name' required={true} />}
                                            onChange={field.onChange}
                                            error={Boolean(errors.category_short_name)}
                                            {...(errors.category_short_name && { helperText: errors.category_short_name.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* Description */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Controller
                                    name='description'
                                    control={control}
                                    rules={{
                                        required: "Description is required",
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum length is 255 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            value={field?.value}
                                            inputProps={{ maxLength: 255 }}
                                            label={<FormLabel label='Description' required={true} />}
                                            onChange={field.onChange}
                                            error={Boolean(errors.description)}
                                            {...(errors.description && { helperText: errors.description.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* document categories icon */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Stack flexDirection={'row'} alignItems={'center'} columnGap={2}>
                                    <Stack sx={{ width: '100%' }}>
                                        <Controller
                                            name='icon'
                                            control={control}
                                            rules={{
                                                required: 'Document Categories Icon is required',
                                                validate: {
                                                    fileSize: validateFileSize,
                                                    fileType: validateFileType
                                                }
                                            }}
                                            render={({ field: { value, onChange, ...field } }) =>
                                                <CustomTextField
                                                    fullWidth
                                                    name={'icon'}
                                                    id={'icon'}
                                                    label={<FormLabel label='Document Categories Icon' required={true} />}
                                                    value={value?.fileName}
                                                    {...field}
                                                    onChange={(event) => {
                                                        const file = event.target.files[0];
                                                        onChange(file);
                                                    }}
                                                    type='file'
                                                    error={Boolean(errors.icon)}
                                                    {...(errors.icon && { helperText: errors.icon.message })}
                                                />
                                            }
                                        />
                                    </Stack>
                                    {dataObj && dataObj !== null && dataObj?.image_url && dataObj?.image_url !== null ? (
                                        <Stack>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                fullWidth
                                                sx={{ mt: 4 }}
                                                onClick={() => {
                                                    const imageUrl = dataObj?.image_url
                                                    window.open(
                                                        imageUrl,
                                                        '_blank',
                                                        'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=400'
                                                    )
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <></>
                                    )}
                                </Stack>
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
                        type='submit'
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
