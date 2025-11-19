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
    MenuItem,
    InputAdornment, useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    isAlphaNumeric,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../constants';
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormHeader from "../../../components/form-header";
import ChevronDownIcon from "../../../assets/icons/ChevronDown";
import AddressIcon from "../../../assets/icons/AddressIcon";
import SectionHeader from "../../../components/section-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import StatusSwitch from "../../../components/status-switch";
import CloseIcon from "../../../assets/icons/CloseIcon";
import { actionAddAsset, actionAssetCustodianList, resetAddAssetResponse, resetAssetCustodianListResponse, actionMasterAssetType, resetMasterAssetTypeResponse } from "../../../store/asset";
import DatePicker from 'react-datepicker';
import moment from "moment/moment";
import DatePickerWrapper from "../../../components/datapicker-wrapper";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import { actionVendorMasterList, resetVendorMasterListResponse } from "../../../store/vendor";
import { CommonDynamicFields } from "../../../components/common-dynamic-fields";
import AssetIcon from "../../../assets/icons/AssetIcon";
import { useBranch } from "../../../hooks/useBranch";
import CustomAutocomplete from "../../../components/custom-autocomplete";

export default function AddAsset({ open, toggle, syncData }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    // store
    const { addAsset, assetCustodianList, masterAssetType } = useSelector(state => state.AssetStore)
    const { vendorMasterList } = useSelector(state => state.vendorStore)
    const { additionalFieldsDetails } = useSelector(state => state.CommonStore)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            asset_id: "",
            asset_description: "",
            type: '',
            sub_type: "",
            make: "",
            model: "",
            rating_capacity: '',
            serial_no: "",
            vendor_id: null,
            manufacturing_date: '',
            installation_date: '',
            commissioning_date: '',
            warranty_start_date: '',
            warranty_expiry_date: '',
            amc_start_date: '',
            amc_expiry_date: '',
            asset_owner: '',
            asset_custodian: '',
            asset_end_life_selection: '',
            asset_end_life_period: '',
            location: '',
            status: 'Active'
        }
    });

    //Watchers
    const watchManufacturingDate = watch('manufacturing_date')
    const watchInstallationDate = watch('installation_date')
    const watchWarrantyStartDate = watch('warranty_start_date')
    const watchAMCStartDate = watch('amc_start_date')

    // state
    const [loading, setLoading] = useState(false)
    const [assetStatus, setAssetStatus] = useState("Active");
    const [vendorMaster, setVendorMaster] = useState([]);
    const [assetCustodianMaster, setAssetCustodianMaster] = useState([]);
    const [additionalFieldsArray, setAdditionalFieldsArray] = useState([])
    const [masterAssetTypeOptions, setMasterAssetTypeOptions] = useState([])

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
    const basicAssetInfoProgress = useSectionProgress(watch, errors, ["asset_id", "asset_description", "type", "sub_type"]);
    const technicalProgress = useSectionProgress(watch, errors, ["make", "model", "serial_no", "rating_capacity"]);
    const vendorCommissionProgress = useSectionProgress(watch, errors, ["vendor_id", "manufacturing_date", "installation_date", "commissioning_date"]);
    const warrantyAMCProgress = useSectionProgress(watch, errors, ["warranty_start_date", "warranty_expiry_date", "amc_start_date", "amc_expiry_date"]);
    const ownershipProgress = useSectionProgress(watch, errors, ["asset_owner", "asset_custodian"]);
    const lifeCycleProgress = useSectionProgress(watch, errors, ["asset_end_life_selection", "asset_end_life_period"]);
    const locationProgress = useSectionProgress(watch, errors, ["location", "status"]);

    // handle close function
    const handleClose = () => {
        toggle()
        reset()
    }

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {

            if (syncData && syncData !== null) {
                setValue('asset_id', syncData?.asset_id && syncData?.asset_id !== null ? syncData?.asset_id : '')
                setValue('asset_description', syncData?.asset_description && syncData?.asset_description !== null ? syncData?.asset_description : '')
                setValue('type', syncData?.type && syncData?.type !== null ? syncData?.type : '')
                setValue('sub_type', syncData?.sub_type && syncData?.sub_type !== null ? syncData?.sub_type : '')
                setValue('make', syncData?.make && syncData?.make !== null ? syncData?.make : '')
                setValue('model', syncData?.model && syncData?.model !== null ? syncData?.model : '')
                setValue('rating_capacity', syncData?.rating_capacity && syncData?.rating_capacity !== null ? syncData?.rating_capacity : '')
                setValue('vendor_id', syncData?.vendor_id && syncData?.vendor_id !== null ? syncData?.vendor_id : '')
                setValue('serial_no', syncData?.serial_no && syncData?.serial_no !== null ? syncData?.serial_no : '')
                setValue('manufacturing_date', syncData?.manufacturing_date && syncData?.manufacturing_date !== null ? moment(syncData?.manufacturing_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('installation_date', syncData?.installation_date && syncData?.installation_date !== null ? moment(syncData?.installation_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('commissioning_date', syncData?.commissioning_date && syncData?.commissioning_date !== null ? moment(syncData?.commissioning_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('warranty_start_date', syncData?.warranty_start_date && syncData?.warranty_start_date !== null ? moment(syncData?.warranty_start_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('warranty_expiry_date', syncData?.warranty_expiry_date && syncData?.warranty_expiry_date !== null ? moment(syncData?.warranty_expiry_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('amc_start_date', syncData?.amc_start_date && syncData?.amc_start_date !== null ? moment(syncData?.amc_start_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('amc_expiry_date', syncData?.amc_expiry_date && syncData?.amc_expiry_date !== null ? moment(syncData?.amc_expiry_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('asset_end_life_selection', syncData?.asset_end_life_selection && syncData?.asset_end_life_selection !== null ? moment(syncData?.asset_end_life_selection, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('asset_end_life_period', syncData?.asset_end_life_period && syncData?.asset_end_life_period !== null ? moment(syncData?.asset_end_life_period, 'YYYY-MM-DD').format('DD/MM/YYYY') : '')
                setValue('asset_owner', syncData?.asset_owner && syncData?.asset_owner !== null ? syncData?.asset_owner : '')
                setValue('asset_custodian', syncData?.asset_custodian && syncData?.asset_custodian !== null ? syncData?.asset_custodian : '')
                setValue('location', syncData?.location && syncData?.location !== null ? syncData?.location : '')
                setAssetStatus(syncData?.status && syncData?.status !== null ? syncData?.status : 'Active')

            }
        }
    }, [open, syncData])

    /**
       * Function to render Additional fields as per Configured Additional Fields for Asset
       */
    useEffect(() => {
        if (additionalFieldsDetails && additionalFieldsDetails !== null && additionalFieldsDetails?.response?.fields && additionalFieldsDetails?.response?.fields !== null && additionalFieldsDetails?.response?.fields.length > 0) {
            // 1. Create a copy of the array (using spread syntax is cleaner than Object.assign)
            const arrFields = [...additionalFieldsDetails.response.fields];

            // 2. Use .map() to transform the array elements into the desired format
            const updatedArray = arrFields.filter(element => element.is_deleted !== 1).map(element => {
                return {
                    key: element?.key,
                    type: element?.type,
                    label: element?.label,
                    value: ''
                }
            });

            // 3. Set the state with the newly created array
            setAdditionalFieldsArray(updatedArray)
        }
    }, [additionalFieldsDetails?.response?.fields])

    // vendor master and asset custodian master API call as per client id and branch uuid
    useEffect(() => {
        if (branch?.currentBranch?.client_id && branch?.currentBranch?.client_id !== null && branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionVendorMasterList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
            dispatch(actionAssetCustodianList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
            dispatch(actionMasterAssetType({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
        }
    }, [branch?.currentBranch])

    /**
       * useEffect
       * @dependency : vendorMasterList
       * @type : HANDLE API RESULT
       * @description : Handle the result of vendor Master List API
       */
    useEffect(() => {
        if (vendorMasterList && vendorMasterList !== null) {
            dispatch(resetVendorMasterListResponse())
            if (vendorMasterList?.result === true) {
                setVendorMaster(vendorMasterList?.response)
            } else {
                setVendorMaster([])
                switch (vendorMasterList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorMasterListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: vendorMasterList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorMasterList])

    /**
       * useEffect
       * @dependency : masterAssetType
       * @type : HANDLE API RESULT
       * @description : Handle the result of master Asset Type List API
       */
    useEffect(() => {
        if (masterAssetType && masterAssetType !== null) {
            dispatch(resetMasterAssetTypeResponse())
            if (masterAssetType?.result === true) {
                setMasterAssetTypeOptions(masterAssetType?.response)
            } else {
                setMasterAssetTypeOptions([])
                switch (masterAssetType?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetMasterAssetTypeResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: masterAssetType?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [masterAssetType])

    /**
      * useEffect
      * @dependency : assetCustodianList
      * @type : HANDLE API RESULT
      * @description : Handle the result of asset Custodian List API
      */
    useEffect(() => {
        if (assetCustodianList && assetCustodianList !== null) {
            dispatch(resetAssetCustodianListResponse())
            if (assetCustodianList?.result === true) {
                setAssetCustodianMaster(assetCustodianList?.response)
            } else {
                setAssetCustodianMaster([])
                switch (assetCustodianList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetCustodianListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: assetCustodianList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetCustodianList])

    /**
       * useEffect
       * @dependency : addAsset
       * @type : HANDLE API RESULT
       * @description : Handle the result of add Asset API
       */
    useEffect(() => {
        if (addAsset && addAsset !== null) {
            dispatch(resetAddAssetResponse())
            if (addAsset?.result === true) {
                toggle('save')
                reset()
                setLoading(false)
                showSnackbar({ message: addAsset?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (addAsset?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddAssetResponse())
                        toast.dismiss()
                        showSnackbar({ message: addAsset?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: addAsset?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addAsset])

    // handle submit function
    const onSubmit = data => {
        setLoading(true)
        if (syncData && syncData !== null) {
            data.processing_id = syncData?.id
        }
        if (branch?.currentBranch && branch?.currentBranch !== null) {
            data.branch_uuid = branch?.currentBranch?.uuid
            data.client_id = branch?.currentBranch?.client_id
        }
        data.status = assetStatus
        data.manufacturing_date = data.manufacturing_date && data.manufacturing_date !== null ? moment(data.manufacturing_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.installation_date = data.installation_date && data.installation_date !== null ? moment(data.installation_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.commissioning_date = data.commissioning_date && data.commissioning_date !== null ? moment(data.commissioning_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.warranty_start_date = data.warranty_start_date && data.warranty_start_date !== null ? moment(data.warranty_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.warranty_expiry_date = data.warranty_expiry_date && data.warranty_expiry_date !== null ? moment(data.warranty_expiry_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.amc_start_date = data.amc_start_date && data.amc_start_date !== null ? moment(data.amc_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.amc_expiry_date = data.amc_expiry_date && data.amc_expiry_date !== null ? moment(data.amc_expiry_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.asset_end_life_selection = data.asset_end_life_selection && data.asset_end_life_selection !== null ? moment(data.asset_end_life_selection, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.asset_end_life_period = data.asset_end_life_period && data.asset_end_life_period !== null ? moment(data.asset_end_life_period, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        data.additional_fields = additionalFieldsArray && additionalFieldsArray !== null && additionalFieldsArray.length > 0 ? additionalFieldsArray : []

        const additionalKeys = additionalFieldsArray.map(f => f.key);

        // remove them from data
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([key]) => !additionalKeys.includes(key))
        );

        dispatch(actionAddAsset(cleanedData))
    };

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: 1100 } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<AssetIcon stroke={theme.palette.primary[600]} size={20} />}
                    title="Add New Asset"
                    subtitle="Fill below form to add new asset"
                    message="Please setup the employee, vendor and asset type before adding a new asset."
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
                        <DatePickerWrapper>
                            <SectionHeader title="Basic Asset Information" progress={basicAssetInfoProgress} />
                            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                {/* asset id */}
                                <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='asset_id'
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 100,
                                                message: 'Maximum length is 100 characters'
                                            },
                                            validate: {
                                                isAlphaNumeric: value => !value || isAlphaNumeric(value) || 'Invalid Asset ID'
                                            },
                                            required: "Asset ID is required"
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset ID'}
                                                value={field?.value}
                                                inputProps={{ maxLength: 100 }}
                                                label={<FormLabel label='Asset ID' required={true} />}
                                                onChange={field.onChange}
                                                error={Boolean(errors.asset_id)}
                                                {...(errors.asset_id && { helperText: errors.asset_id.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* asset description */}
                                <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='asset_description'
                                        control={control}
                                        rules={{
                                            required: 'Asset Description is required',
                                            maxLength: {
                                                value: 500,
                                                message: 'Maximum length is 500 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset Description'}
                                                value={field?.value}
                                                inputProps={{ maxLength: 500 }}
                                                label={<FormLabel label='Asset Description' required={true} />}
                                                onChange={field.onChange}
                                                error={Boolean(errors.asset_description)}
                                                {...(errors.asset_description && { helperText: errors.asset_description.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* asset type */}
                                <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='type'
                                        control={control}
                                        rules={{
                                            required: 'Please select Asset Type'
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                select
                                                fullWidth
                                                value={field?.value ?? ''}
                                                label={<FormLabel label='Asset Type' required={true} />}
                                                onChange={field?.onChange}
                                                SelectProps={{
                                                    displayEmpty: true,
                                                    IconComponent: ChevronDownIcon,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 220, // Set your desired max height
                                                                scrollbarWidth: 'thin'
                                                            }
                                                        }
                                                    }
                                                }}

                                                error={Boolean(errors.type)}
                                                {...(errors.type && { helperText: errors.type.message })}
                                            >
                                                <MenuItem value='' disabled>
                                                    <em>Select Asset Type</em>
                                                </MenuItem>
                                                {masterAssetTypeOptions &&
                                                    masterAssetTypeOptions.map(option => (
                                                        <MenuItem
                                                            key={option?.id}
                                                            value={option?.name}
                                                            sx={{
                                                                whiteSpace: 'normal',        // allow wrapping
                                                                wordBreak: 'break-word',     // break long words if needed
                                                                maxWidth: 250,               // control dropdown width
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,          // limit to 2 lines
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {option?.name}
                                                        </MenuItem>
                                                    ))}
                                            </CustomTextField>
                                        )}
                                    />
                                </Grid>
                                {/* asset sub type */}
                                <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='sub_type'
                                        control={control}
                                        rules={{
                                            required: 'Asset Sub Type is required',
                                            maxLength: {
                                                value: 100,
                                                message: 'Maximum length is 100 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset Sub Type'}
                                                value={field?.value}
                                                label={<FormLabel label='Asset Sub-Type' required={true} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 100 }}
                                                error={Boolean(errors.sub_type)}
                                                {...(errors.sub_type && { helperText: errors.sub_type.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Technical Specifications" progress={technicalProgress} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                {/* asset make */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='make'
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 100,
                                                message: 'Maximum length is 100 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset Make'}
                                                value={field?.value}
                                                label={<FormLabel label='Asset Make' required={false} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 100 }}
                                                error={Boolean(errors.make)}
                                                {...(errors.make && { helperText: errors.make.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* asset model */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='model'
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 100,
                                                message: 'Maximum length is 100 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset Model'}
                                                value={field?.value}
                                                label={<FormLabel label='Asset Model' required={false} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 100 }}
                                                error={Boolean(errors.model)}
                                                {...(errors.model && { helperText: errors.model.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* serial no */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='serial_no'
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 100,
                                                message: 'Maximum length is 100 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset Sr. Number'}
                                                value={field?.value}
                                                label={<FormLabel label='Asset Sr. Number' required={false} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 100 }}
                                                error={Boolean(errors.serial_no)}
                                                {...(errors.serial_no && { helperText: errors.serial_no.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* asset model */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='rating_capacity'
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 100,
                                                message: 'Maximum length is 100 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset Rating/Capacity'}
                                                value={field?.value}
                                                label={<FormLabel label='Asset Rating/Capacity' required={false} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 100 }}
                                                error={Boolean(errors.rating_capacity)}
                                                {...(errors.rating_capacity && { helperText: errors.rating_capacity.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Vendor & Commissioning Details" progress={vendorCommissionProgress} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                {/* vendor */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='vendor_id'
                                        control={control}
                                        rules={{
                                            required: 'Please select Vendor'
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                select
                                                fullWidth
                                                value={field?.value ?? ''}
                                                label={<FormLabel label='Vendor' required={true} />}
                                                onChange={field?.onChange}
                                                SelectProps={{
                                                    displayEmpty: true,
                                                    IconComponent: ChevronDownIcon,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 220, // Set your desired max height
                                                                scrollbarWidth: 'thin'
                                                            }
                                                        }
                                                    }
                                                }}

                                                error={Boolean(errors.vendor_id)}
                                                {...(errors.vendor_id && { helperText: errors.vendor_id.message })}
                                            >
                                                <MenuItem value='' disabled>
                                                    <em>Select Vendor</em>
                                                </MenuItem>
                                                {vendorMaster &&
                                                    vendorMaster.map(option => (
                                                        <MenuItem
                                                            key={option?.id}
                                                            value={option?.id}
                                                            sx={{
                                                                whiteSpace: 'normal',        // allow wrapping
                                                                wordBreak: 'break-word',     // break long words if needed
                                                                maxWidth: 250,               // control dropdown width
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,          // limit to 2 lines
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {option?.name}
                                                        </MenuItem>
                                                    ))}
                                            </CustomTextField>
                                        )}
                                    />
                                </Grid>
                                {/* manufacturing date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='manufacturing_date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='manufacturing_date'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        label={<FormLabel label='Manufacturing Date' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.manufacturing_date)}
                                                        {...(errors.manufacturing_date && { helperText: errors.manufacturing_date.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                showYearDropdown
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* installation date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='installation_date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='installation_date'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        label={<FormLabel label='Installation Date' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.installation_date)}
                                                        {...(errors.installation_date && { helperText: errors.installation_date.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                minDate={watchManufacturingDate ? moment(watchManufacturingDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* commission date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='commissioning_date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='commissioning_date'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        label={<FormLabel label='Commission Date' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.commissioning_date)}
                                                        {...(errors.commissioning_date && { helperText: errors.commissioning_date.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                minDate={watchInstallationDate ? moment(watchInstallationDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Warranty & AMC Coverage" progress={warrantyAMCProgress} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                {/* warranty start date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='warranty_start_date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='warranty_start_date'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        label={<FormLabel label='Warranty Start Date' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.warranty_start_date)}
                                                        {...(errors.warranty_start_date && { helperText: errors.warranty_start_date.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                minDate={watchInstallationDate ? moment(watchInstallationDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* warranty expiry date  */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='warranty_expiry_date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='warranty_expiry_date'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        label={<FormLabel label='Warranty Expiry Date' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.warranty_expiry_date)}
                                                        {...(errors.warranty_expiry_date && { helperText: errors.warranty_expiry_date.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                minDate={watchWarrantyStartDate ? moment(watchWarrantyStartDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* amx start date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='amc_start_date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='amc_start_date'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        label={<FormLabel label='AMC Start Date' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.amc_start_date)}
                                                        {...(errors.amc_start_date && { helperText: errors.amc_start_date.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                minDate={watchInstallationDate ? moment(watchInstallationDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* amc expiry date */}
                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                    <Controller
                                        name='amc_expiry_date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='amc_expiry_date'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        label={<FormLabel label='AMC Expiry Date' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.amc_expiry_date)}
                                                        {...(errors.amc_expiry_date && { helperText: errors.amc_expiry_date.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                minDate={watchAMCStartDate ? moment(watchAMCStartDate, 'DD/MM/YYYY').add(1, 'days').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Ownership & Responsibility" progress={ownershipProgress} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                {/* asset owner */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <Controller
                                        name='asset_owner'
                                        control={control}
                                        rules={{
                                            required: 'Asset Owner is required',
                                            maxLength: {
                                                value: 255,
                                                message: 'Maximum length is 255 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={'Asset Owner'}
                                                value={field?.value}
                                                label={<FormLabel label='Asset Owner' required={true} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 255 }}
                                                error={Boolean(errors.asset_owner)}
                                                {...(errors.asset_owner && { helperText: errors.asset_owner.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* asset custodian */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <Controller
                                        name='asset_custodian'
                                        control={control}
                                        rules={{
                                            required: 'Please select Asset Custodian'
                                        }}
                                        render={({ field }) => (
                                            <CustomAutocomplete
                                                {...field}
                                                label="Asset Custodian"
                                                is_required={true}
                                                displayName1="name"
                                                displayName2="role"
                                                options={assetCustodianMaster}
                                                error={Boolean(errors.asset_custodian)}
                                                helperText={errors.asset_custodian?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Lifecycle & End-of-Life" progress={lifeCycleProgress} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                {/* Asset End Life Selection */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <Controller
                                        name='asset_end_life_selection'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='asset_end_life_selection'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        required
                                                        label={<FormLabel label='Asset End Life Selection' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.asset_end_life_selection)}
                                                        {...(errors.asset_end_life_selection && { helperText: errors.asset_end_life_selection.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* Asset End Life Period */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <Controller
                                        name='asset_end_life_period'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                id='asset_end_life_period'
                                                customInput={
                                                    <CustomTextField
                                                        size='small'
                                                        required
                                                        label={<FormLabel label='Asset End Life Period' required={false} />}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        edge='start'
                                                                        onMouseDown={e => e.preventDefault()}
                                                                    >
                                                                        <CalendarIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={Boolean(errors.asset_end_life_period)}
                                                        {...(errors.asset_end_life_period && { helperText: errors.asset_end_life_period.message })}
                                                    />
                                                }
                                                value={field.value}
                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                showYearDropdown={true}
                                                onChange={date => {
                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                    field.onChange(formattedDate)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Location & Status" progress={locationProgress} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                {/* asset owner */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <Controller
                                        name='location'
                                        control={control}
                                        rules={{
                                            required: 'Location is required',
                                            maxLength: {
                                                value: 255,
                                                message: 'Maximum length is 255 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position='start'>
                                                            <IconButton
                                                                edge='start'
                                                                onMouseDown={e => e.preventDefault()}
                                                            >
                                                                <AddressIcon stroke={"#2F2B3D"} />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                placeholder={'Location'}
                                                value={field?.value}
                                                label={<FormLabel label='Location' required={true} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 255 }}
                                                error={Boolean(errors.location)}
                                                {...(errors.location && { helperText: errors.location.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                {/* asset status */}
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <StatusSwitch value={assetStatus} onChange={setAssetStatus} label="Status" />
                                </Grid>
                            </Grid>
                            {
                                additionalFieldsArray && additionalFieldsArray !== null && additionalFieldsArray.length > 0 ?
                                    <React.Fragment>
                                        <SectionHeader title="Additional Fields" sx={{ marginTop: 2 }} show_progress={0} />
                                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                            <CommonDynamicFields
                                                control={control}
                                                errors={errors}
                                                xs={12}
                                                sm={6}
                                                md={6}
                                                lg={6}
                                                xl={6}
                                                additionalFields={additionalFieldsArray}
                                                setAdditionalFields={setAdditionalFieldsArray}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                    :
                                    <></>
                            }
                        </DatePickerWrapper>
                    </form>
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            toggle()
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
