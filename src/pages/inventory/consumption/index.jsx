/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from '@emotion/react'
import { useEffect, useState } from 'react'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { Box, Button, CircularProgress, Divider, Drawer, Grid, IconButton, InputAdornment, MenuItem, Stack, Tooltip } from '@mui/material'
import FormHeader from '../../../components/form-header'
import BoxPlusIcon from '../../../assets/icons/BoxPlusIcon'
import { Controller, useForm } from 'react-hook-form'
import SectionHeader from '../../../components/section-header'
import ChevronDownIcon from '../../../assets/icons/ChevronDown'
import CustomTextField from '../../../components/text-field'
import FormLabel from '../../../components/form-label'
import TypographyComponent from '../../../components/custom-typography'
import FieldBox from '../../../components/field-box'
import CustomAutocomplete from '../../../components/custom-autocomplete'
import { useDispatch, useSelector } from 'react-redux'
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../constants'
import { actionGetInventoryDetails, actionGetUnitMaster, actionInventoryConsumptionSave, resetGetInventoryDetailsResponse, resetGetUnitMasterResponse, resetInventoryConsumptionSaveResponse } from '../../../store/inventory'
import { useAuth } from '../../../hooks/useAuth'
import { useSnackbar } from '../../../hooks/useSnackbar'
import { useBranch } from '../../../hooks/useBranch'
import moment from 'moment'
import CalendarIcon from '../../../assets/icons/CalendarIcon'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from '../../../components/datapicker-wrapper'
import { compressFile, getCurrentStatusColor, getCurrentStockValue, getFormData, getObjectById } from '../../../utils'
import CustomChip from '../../../components/custom-chip'
import AlertTriangleIcon from '../../../assets/icons/AlertTriangleIcon'
import { actionAssetCustodianList, resetAssetCustodianListResponse } from '../../../store/asset'
import { actionGetTicketMaster, resetGetTicketMasterResponse } from '../../../store/tickets'
import { RestockInventory } from '../restock'

export const InventoryConsumption = ({ open, handleClose, consumeData, from = 'detail' }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    //Stores
    const { assetCustodianList } = useSelector(state => state.AssetStore)
    const { getTicketMaster } = useSelector(state => state.ticketsStore)
    const { getUnitMaster, inventoryConsumptionSave, getInventoryDetails } = useSelector(state => state.inventoryStore)

    //States
    const [loading, setLoading] = useState(false)
    const [inventoryRestockDetailsData, setInventoryRestockDetailsData] = useState(null)
    const [masterUnitOptions, setMasterUnitOptions] = useState([])
    const [usedByMasterOptions, setUsedByMasterOptions] = useState([])
    const [ticketNoMasterOptions, setTicketNoMasterOptions] = useState([])
    const [arrUploadedFiles, setArrUploadedFiles] = useState([])
    const [openRestockInventoryPopup, setOpenRestockInventoryPopup] = useState(false);
    const [showLowStockMessage, setShowLowStockMessage] = useState(1)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            used_quantity: '',
            minimum_quantity: '',
            critical_quantity: '',
            unit: '',
            used_by: '',
            ticket_no: '',
            consumption_date: '',
            additional_notes: ''
        }
    });

    //watcher
    // const watchSupplier = watch('used_by')
    const watchAddedQuantity = watch('used_quantity')
    const watchTicketNo = watch('ticket_no')

    useEffect(() => {
        if (open === true) {
            reset()
            console.log('-----consumeData----', consumeData)
            if (consumeData && consumeData !== null) {
                setInventoryRestockDetailsData(consumeData)
            } else {
                setInventoryRestockDetailsData(null)
            }
            // dispatch(actionGetInventoryDetails({
            //     uuid: detail?.uuid
            // }))
            dispatch(actionGetUnitMaster())
            dispatch(actionAssetCustodianList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
            dispatch(actionGetTicketMaster({
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
        return () => {
            reset()
            setInventoryRestockDetailsData(null)
            setArrUploadedFiles([])
            setShowLowStockMessage(1)
        }
    }, [open, consumeData])

    console.log('-------inventoryRestockDetailsData----', inventoryRestockDetailsData)

    useEffect(() => {
        if (inventoryRestockDetailsData && inventoryRestockDetailsData !== null) {
            setValue('minimum_quantity', inventoryRestockDetailsData?.minimum_quantity)
            setValue('unit', inventoryRestockDetailsData?.unit_id)
            setValue('critical_quantity', inventoryRestockDetailsData?.critical_quantity)
        }

    }, [inventoryRestockDetailsData])

    /**
       * useEffect
       * @dependency : getUnitMaster
       * @type : HANDLE API RESULT
       * @description : Handle the result of unit master API
       */
    useEffect(() => {
        if (getUnitMaster && getUnitMaster !== null) {
            dispatch(resetGetUnitMasterResponse())
            if (getUnitMaster?.result === true) {
                setMasterUnitOptions(getUnitMaster?.response)
            } else {
                setMasterUnitOptions([])
                switch (getUnitMaster?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetUnitMasterResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getUnitMaster?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getUnitMaster])

    /**
       * useEffect
       * @dependency : getTicketMaster
       * @type : HANDLE API RESULT
       * @description : Handle the result of ticket master API
       */
    useEffect(() => {
        if (getTicketMaster && getTicketMaster !== null) {
            dispatch(resetGetTicketMasterResponse())
            if (getTicketMaster?.result === true) {
                setTicketNoMasterOptions(getTicketMaster?.response)
            } else {
                setTicketNoMasterOptions([])
                switch (getTicketMaster?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetTicketMasterResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getTicketMaster?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getTicketMaster])

    /**
       * useEffect
       * @dependency : assetCustodianList
       * @type : HANDLE API RESULT
       * @description : Handle the result of custodian List API
       */
    useEffect(() => {
        if (assetCustodianList && assetCustodianList !== null) {
            dispatch(resetAssetCustodianListResponse())
            if (assetCustodianList?.result === true) {
                setUsedByMasterOptions(assetCustodianList?.response)
            } else {
                setUsedByMasterOptions([])
                switch (assetCustodianList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetCustodianListResponse())
                        break
                    case SERVER_ERROR:
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
     * @dependency : inventoryConsumptionSave
     * @type : HANDLE API RESULT
     * @description : Handle the result of inventory consumption save API
     */
    useEffect(() => {
        if (inventoryConsumptionSave && inventoryConsumptionSave !== null) {
            dispatch(resetInventoryConsumptionSaveResponse())
            if (inventoryConsumptionSave?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                showSnackbar({ message: inventoryConsumptionSave?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (inventoryConsumptionSave?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetInventoryConsumptionSaveResponse())
                        showSnackbar({ message: inventoryConsumptionSave?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: inventoryConsumptionSave?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [inventoryConsumptionSave])

    /**
        * useEffect
        * @dependency : getInventoryDetails
        * @type : HANDLE API RESULT
        * @description : Handle the result of inventory details API
        */
    useEffect(() => {
        if (getInventoryDetails && getInventoryDetails !== null) {
            dispatch(resetGetInventoryDetailsResponse())
            if (getInventoryDetails?.result === true) {
                setInventoryRestockDetailsData(getInventoryDetails?.response)
            } else {
                setInventoryRestockDetailsData(null)
                switch (getInventoryDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetInventoryDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getInventoryDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getInventoryDetails])


    const onSubmit = async (data) => {
        let currentTicket = getObjectById(ticketNoMasterOptions, watchTicketNo)
        let objData = {
            branch_uuid: branch?.currentBranch?.uuid,
            inventory_uuid: inventoryRestockDetailsData?.uuid && inventoryRestockDetailsData?.uuid !== null ? inventoryRestockDetailsData?.uuid : null,
            usage_quantity: data?.used_quantity && data?.used_quantity !== null ? data?.used_quantity : null,
            // minimum_quantity: data?.minimum_quantity && data?.minimum_quantity !== null ? data?.minimum_quantity : null,
            // critical_quantity: data?.critical_quantity && data?.critical_quantity !== null ? data?.critical_quantity : null,
            // unit_id: data?.unit && data?.unit !== null ? data?.unit : null,
            used_by: data?.used_by ? data?.used_by : null,
            ticket_no: data?.ticket_no && data?.ticket_no !== null ? currentTicket?.ticket_no : null,
            consumption_date: data?.consumption_date && data?.consumption_date !== null ? moment(data.consumption_date, 'DD MMM YYYY').format('YYYY-MM-DD') : null,
            additional_notes: data?.additional_notes && data?.additional_notes !== null ? data?.additional_notes : null,
            used_for: data?.used_for && data?.used_for !== null ? data?.used_for : null
        }
        const files = [];
        let hasNewFiles = arrUploadedFiles.filter(obj => obj?.is_new === 1)
        if (hasNewFiles && hasNewFiles.length > 0 && arrUploadedFiles && arrUploadedFiles.length > 0) {
            for (const objFile of arrUploadedFiles) {
                if (objFile?.is_new === 1) {

                    //Compress the files with type image
                    const compressedFile = await compressFile(objFile.file);

                    files.push({
                        title: `file_upload`,
                        data: compressedFile
                    });
                }
            }
        }
        const formData = getFormData(objData, files);

        setLoading(true)
        dispatch(actionInventoryConsumptionSave(formData))
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: '86%' } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    need_responsive={0}
                    icon={<BoxPlusIcon stroke={theme.palette.primary[600]} size={20} />}
                    title={`Record Consumption`}
                    subtitle={`Track inventory usage and update stock levels`}
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
                    {
                        showLowStockMessage == 1 && inventoryRestockDetailsData?.stock_status && inventoryRestockDetailsData?.stock_status !== null && ['Out Of Stock', 'Low Stock'].includes(inventoryRestockDetailsData?.stock_status) ?
                            <>
                                {
                                    Number(inventoryRestockDetailsData?.current_stock) > Number(inventoryRestockDetailsData?.minimum_quantity) && Number(inventoryRestockDetailsData?.current_stock) < Number(inventoryRestockDetailsData?.critical_quantity) ?
                                        <Stack sx={{ border: `1px solid ${theme.palette.warning[600]}`, alignItems: 'center', borderRadius: '8px', flexDirection: 'row', justifyContent: 'space-between', padding: '16px', background: theme.palette.warning[100] }}>
                                            <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        backgroundColor: theme.palette.warning[600],
                                                        borderRadius: '6px',
                                                        padding: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <AlertTriangleIcon stroke={theme.palette.common.white} size={22} />
                                                </Box>
                                                <Stack>
                                                    <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: theme.palette.warning[700] }}>
                                                        Low Stock Alert
                                                    </TypographyComponent>
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.warning[600] }}>
                                                        Current stock ({Number(inventoryRestockDetailsData?.current_stock)}{inventoryRestockDetailsData?.unit && inventoryRestockDetailsData?.unit !== null ? ` ${inventoryRestockDetailsData?.unit}` : ''})  is above the minimum level but below the critical level ({Number(inventoryRestockDetailsData?.critical_quantity)}{inventoryRestockDetailsData?.unit && inventoryRestockDetailsData?.unit !== null ? ` ${inventoryRestockDetailsData?.unit}` : ''}). Consider restocking soon to avoid stockouts.
                                                    </TypographyComponent>
                                                </Stack>
                                            </Stack>
                                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                <Stack
                                                    onClick={() => {
                                                        setOpenRestockInventoryPopup(true)
                                                    }}
                                                    sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', background: theme.palette.warning[600], borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                                                    <BoxPlusIcon stroke={theme.palette.common.white} size={22} />
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.common.white }}>
                                                        Restock
                                                    </TypographyComponent>
                                                </Stack>
                                                <Stack>
                                                    <Tooltip title="Hide Message" followCursor placement="top">
                                                        <IconButton
                                                            variant="outlined"
                                                            color='primary'
                                                            sx={{
                                                                background: theme.palette.warning[600], borderRadius: '6px', padding: '12px 12px',
                                                                '&:hover': { backgroundColor: theme.palette.warning[500] },
                                                            }}
                                                            onClick={() => {
                                                                setShowLowStockMessage(0)
                                                            }}
                                                        >
                                                            <CloseIcon size={16} stroke='white' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        :
                                        <Stack sx={{ border: `1px solid ${theme.palette.error[600]}`, alignItems: 'center', borderRadius: '8px', flexDirection: 'row', justifyContent: 'space-between', padding: '16px', background: theme.palette.error[100] }}>
                                            <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        backgroundColor: theme.palette.error[600],
                                                        borderRadius: '6px',
                                                        padding: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <AlertTriangleIcon stroke={theme.palette.common.white} size={22} />
                                                </Box>
                                                <Stack>
                                                    <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: theme.palette.error[700] }}>
                                                        Running Out Of Stock
                                                    </TypographyComponent>
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.error[600] }}>
                                                        Current stock ({Number(inventoryRestockDetailsData?.current_stock)}{inventoryRestockDetailsData?.unit && inventoryRestockDetailsData?.unit !== null ? ` ${inventoryRestockDetailsData?.unit}` : ''}) is below the minimum level ({Number(inventoryRestockDetailsData?.minimum_quantity)}{inventoryRestockDetailsData?.unit && inventoryRestockDetailsData?.unit !== null ? ` ${inventoryRestockDetailsData?.unit}` : ''}). Consider restocking soon to avoid stockouts.
                                                    </TypographyComponent>
                                                </Stack>
                                            </Stack>
                                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                <Stack
                                                    onClick={() => {
                                                        setOpenRestockInventoryPopup(true)
                                                    }}
                                                    sx={{ flexDirection: 'row', gap: 0.7, alignItems: 'center', background: theme.palette.error[600], borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                                                    <BoxPlusIcon stroke={theme.palette.common.white} size={22} />
                                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.common.white }}>
                                                        Restock
                                                    </TypographyComponent>
                                                </Stack>
                                                <Stack>
                                                    <Tooltip title="Hide Message" followCursor placement="top">
                                                        <IconButton
                                                            variant="outlined"
                                                            color='primary'
                                                            sx={{
                                                                background: theme.palette.error[600], borderRadius: '6px', padding: '12px 12px',
                                                                '&:hover': { backgroundColor: theme.palette.error[500] },
                                                            }}
                                                            onClick={() => {
                                                                setShowLowStockMessage(0)
                                                            }}
                                                        >
                                                            <CloseIcon size={16} stroke='white' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                }
                            </>
                            :
                            <></>
                    }
                    <form noValidate autoComplete='off'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <DatePickerWrapper>
                            <Grid container spacing={'24px'}>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8.5, xl: 8.5 }}>
                                    <Stack sx={{
                                        height: 720,
                                        overflowY: "auto",
                                        scrollbarWidth: "thin",
                                        "&::-webkit-scrollbar": {
                                            width: "6px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: theme.palette.grey[400],
                                            borderRadius: "3px",
                                        },
                                    }}>
                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', mt: 1, mb: 0, pt: 1 }}>
                                            <SectionHeader sx={{}} title={'Basic Information'} show_progress={false} />
                                            {
                                                inventoryRestockDetailsData?.stock_status && inventoryRestockDetailsData?.stock_status !== null ?
                                                    <Stack>
                                                        <CustomChip text={inventoryRestockDetailsData?.stock_status} colorName={getCurrentStatusColor(inventoryRestockDetailsData?.stock_status)} />
                                                    </Stack>
                                                    :
                                                    <></>
                                            }

                                        </Stack>
                                        <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px', pb: 1.5, marginTop: '-5px' }}>
                                            <Grid container>
                                                {/* Item ID */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Item ID" value={inventoryRestockDetailsData?.item_id && inventoryRestockDetailsData?.item_id !== null ? inventoryRestockDetailsData?.item_id : ''} />
                                                </Grid>
                                                {/* Item Name */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Item Name" value={inventoryRestockDetailsData?.item_name && inventoryRestockDetailsData?.item_name !== null ? inventoryRestockDetailsData?.item_name : ''} />
                                                </Grid>
                                                {/* Category */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Category" value={inventoryRestockDetailsData?.category && inventoryRestockDetailsData?.category !== null ? inventoryRestockDetailsData?.category : ''} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                    <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                                </Grid>
                                                {/* Item ID */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Current Stock" value={inventoryRestockDetailsData?.current_stock && inventoryRestockDetailsData?.current_stock !== null ? inventoryRestockDetailsData?.current_stock : ''} />
                                                </Grid>
                                                {/* Item Name */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Minimum Stock" value={inventoryRestockDetailsData?.minimum_quantity && inventoryRestockDetailsData?.minimum_quantity !== null ? inventoryRestockDetailsData?.minimum_quantity : ''} />
                                                </Grid>
                                                {/* Category */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Storage Location" value={inventoryRestockDetailsData?.storage_location && inventoryRestockDetailsData?.storage_location !== null ? inventoryRestockDetailsData?.storage_location : ''} />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                        <SectionHeader title="Stock Information" show_progress={0} sx={{ marginTop: 2.5 }} />
                                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: '20px', marginTop: '-4px', pb: 3.2 }}>
                                            <Grid container spacing={'24px'}>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='used_quantity'
                                                        control={control}
                                                        rules={{
                                                            required: 'Used Quantity is required',
                                                            validate: (value) => {
                                                                if (Number(value) > Number(inventoryRestockDetailsData?.current_stock)) {
                                                                    return 'Used Quantity should be less than or equal Current Stock'
                                                                } else if (Number(value) < 0 || Number(value) == 0) {
                                                                    return 'Used Quantity should be greater than 0'
                                                                }
                                                            },
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                placeholder={'Used Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Used Quantity' required={true} />}
                                                                onChange={(e) => {
                                                                    const numberOnly = e.target.value.replace(/[^0-9]/g, '')
                                                                    field.onChange(numberOnly)
                                                                }}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.used_quantity)}
                                                                {...(errors.used_quantity && { helperText: errors.used_quantity.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='unit'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                select
                                                                fullWidth
                                                                disabled
                                                                value={field?.value ?? ''}
                                                                label={<FormLabel label='Unit' required={false} />}
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

                                                                error={Boolean(errors.unit)}
                                                                {...(errors.unit && { helperText: errors.unit.message })}
                                                            >
                                                                <MenuItem value=''>
                                                                    <em>Select Unit</em>
                                                                </MenuItem>
                                                                {masterUnitOptions && masterUnitOptions !== null && masterUnitOptions.length > 0 &&
                                                                    masterUnitOptions.map(option => (
                                                                        <MenuItem
                                                                            key={option?.id}
                                                                            value={option?.id}
                                                                            sx={{
                                                                                whiteSpace: 'normal',        // allow wrapping
                                                                                wordBreak: 'break-word',     // break long words if needed
                                                                                maxWidth: 400,               // control dropdown width
                                                                                display: '-webkit-box',
                                                                                WebkitLineClamp: 2,          // limit to 2 lines
                                                                                WebkitBoxOrient: 'vertical',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis'
                                                                            }}
                                                                        >
                                                                            {option?.title}
                                                                        </MenuItem>
                                                                    ))}
                                                            </CustomTextField>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='minimum_quantity'
                                                        control={control}
                                                        rules={{
                                                            required: 'Minimum Quantity is required',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                disabled
                                                                placeholder={'Minimum Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Minimum Quantity' required={true} />}
                                                                onChange={(e) => {
                                                                    const numberOnly = e.target.value.replace(/[^0-9]/g, '')
                                                                    field.onChange(numberOnly)
                                                                }}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.minimum_quantity)}
                                                                {...(errors.minimum_quantity && { helperText: errors.minimum_quantity.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='critical_quantity'
                                                        control={control}
                                                        rules={{
                                                            required: 'Critical Quantity is required',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                disabled
                                                                placeholder={'Critical Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Critical Quantity' required={true} />}
                                                                onChange={(e) => {
                                                                    const numberOnly = e.target.value.replace(/[^0-9]/g, '')
                                                                    field.onChange(numberOnly)
                                                                }}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.critical_quantity)}
                                                                {...(errors.critical_quantity && { helperText: errors.critical_quantity.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                    <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}></Stack>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                    <Controller
                                                        name='used_by'
                                                        control={control}
                                                        rules={{
                                                            required: 'Please select Used By',
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomAutocomplete
                                                                {...field}
                                                                label="Used By"
                                                                is_required={true}
                                                                displayName1="name"
                                                                displayName2="role"
                                                                options={usedByMasterOptions}
                                                                error={Boolean(errors.used_by)}
                                                                helperText={errors.used_by?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                    <Controller
                                                        name='ticket_no'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <CustomAutocomplete
                                                                {...field}
                                                                label="Ticket No"
                                                                is_required={false}
                                                                displayName1="ticket_no"
                                                                options={ticketNoMasterOptions}
                                                                error={Boolean(errors.ticket_no)}
                                                                helperText={errors.ticket_no?.message}
                                                            />
                                                        )}
                                                    />
                                                    {/* <Controller
                                                        name='ticket_no'
                                                        control={control}
                                                        rules={{
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                placeholder={'Ticket Number'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Ticket Number' required={false} />}
                                                                onChange={field.onChange}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.ticket_no)}
                                                                {...(errors.ticket_no && { helperText: errors.ticket_no.message })}
                                                            />
                                                        )}
                                                    /> */}
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                    <Controller
                                                        name='consumption_date'
                                                        control={control}
                                                        rules={{
                                                            required: 'Consumption Date is required',
                                                        }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                id='consumption_date'
                                                                placeholderText='Consumption Date'
                                                                customInput={
                                                                    <CustomTextField
                                                                        size='small'
                                                                        label={<FormLabel label='Consumption Date' required={true} />}
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
                                                                        error={Boolean(errors.consumption_date)}
                                                                        {...(errors.consumption_date && { helperText: errors.consumption_date.message })}
                                                                    />
                                                                }
                                                                value={field.value}
                                                                selected={field?.value ? moment(field.value, 'DD MMM YYYY').toDate() : null}
                                                                showYearDropdown
                                                                onChange={date => {
                                                                    const formattedDate = moment(date).format('DD MMM YYYY')
                                                                    field.onChange(formattedDate)
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                    <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}></Stack>
                                                </Grid>
                                                {/* Used for (Purpose) */}
                                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                                    <Controller
                                                        name='used_for'
                                                        control={control}
                                                        rules={{
                                                            required: 'Used for is required',
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
                                                                placeholder={'Any purpose to use the stock'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Used for (Purpose)' required={true} />}
                                                                onChange={field.onChange}
                                                                error={Boolean(errors.used_for)}
                                                                {...(errors.used_for && { helperText: errors.used_for.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {/* Additional Notes */}
                                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                                    <Controller
                                                        name='additional_notes'
                                                        control={control}
                                                        rules={{
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
                                                                placeholder={'Any additional information about restock'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Additional Notes' required={false} />}
                                                                onChange={field.onChange}
                                                                error={Boolean(errors.additional_notes)}
                                                                {...(errors.additional_notes && { helperText: errors.additional_notes.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Stack>
                                </Grid >
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3.5, xl: 3.5 }}>
                                    <Stack>
                                        <SectionHeader title="Stock Summary" show_progress={0} sx={{ marginTop: 2 }} />
                                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: '20px', marginTop: '-4px', pb: 0 }}>
                                            <Stack
                                                sx={{
                                                    height: '395px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    border: `1px solid ${theme.palette.grey[300]}`,
                                                    padding: '16px',
                                                    backgroundImage: inventoryRestockDetailsData?.image_url ? `url(${inventoryRestockDetailsData.image_url})` : undefined,
                                                    backgroundColor: inventoryRestockDetailsData?.image_url ? "transparent" : theme.palette.primary[50],
                                                    borderRadius: '8px',
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            >
                                                {!inventoryRestockDetailsData?.image_url || inventoryRestockDetailsData?.image_url == '' || inventoryRestockDetailsData?.image_url == null ?
                                                    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.primary[900] }}>
                                                            No Image Available
                                                        </TypographyComponent>
                                                    </Stack>
                                                    :
                                                    <></>
                                                }
                                            </Stack>
                                            <Stack spacing={2.5} sx={{ width: '100%', my: 2.5 }}>
                                                <Stack sx={{ padding: '12px', borderRadius: '8px', border: getCurrentStockValue('Consumption', watchAddedQuantity, inventoryRestockDetailsData?.current_stock) < inventoryRestockDetailsData?.minimum_quantity ? `1px solid ${theme.palette.error[500]}` : `1px solid ${theme.palette.success[500]}`, background: getCurrentStockValue('Consumption', watchAddedQuantity, inventoryRestockDetailsData?.current_stock) < inventoryRestockDetailsData?.minimum_quantity ? theme.palette.error[50] : theme.palette.success[50] }}>
                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Current Stock</TypographyComponent>
                                                    {getCurrentStockValue('Consumption', watchAddedQuantity, inventoryRestockDetailsData?.current_stock) == 'Limit Exceed' ?
                                                        <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.error[600] }}>Limit Exceed</TypographyComponent>
                                                        :
                                                        <TypographyComponent fontSize={24} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{getCurrentStockValue('Consumption', watchAddedQuantity, inventoryRestockDetailsData?.current_stock)} {inventoryRestockDetailsData?.unit}</TypographyComponent>
                                                    }
                                                </Stack>
                                                <Stack sx={{ padding: '12px', borderRadius: '8px', border: `1px solid ${theme.palette.grey[500]}` }}>
                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Minimum Stock</TypographyComponent>
                                                    <TypographyComponent fontSize={24} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{inventoryRestockDetailsData?.minimum_quantity} {inventoryRestockDetailsData?.unit}</TypographyComponent>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DatePickerWrapper>
                    </form>
                    {/* low alert */}
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ px: 2, pb: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            handleClose()
                        }}
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: (loading ? theme.palette.grey[400] : theme.palette.primary[600]), color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleSubmit(onSubmit)()
                        }}
                        name='submit'
                        variant='contained'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Confirm Restock'}
                    </Button>
                </Stack>
            </Stack>
            <RestockInventory
                open={openRestockInventoryPopup}
                restockData={inventoryRestockDetailsData}
                handleClose={(data) => {
                    setOpenRestockInventoryPopup(false)
                    console.log('------data------', data)
                    console.log('------from------', from)
                    console.log('------inventoryRestockDetailsData------', inventoryRestockDetailsData)
                    if (data == 'save') {
                        if (from == 'list') {
                            console.log('------inventoryRestockDetailsData--aaaaaa-@@@@@@@@@@@---', inventoryRestockDetailsData)
                            if (inventoryRestockDetailsData?.uuid && inventoryRestockDetailsData?.uuid !== null) {
                                dispatch(actionGetInventoryDetails({
                                    uuid: inventoryRestockDetailsData?.uuid
                                }))
                            }
                        }

                    }
                }}
            />
        </Drawer >
    )
}
