/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, Drawer, Grid, IconButton, InputAdornment, List, ListItem, MenuItem, Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormHeader from "../../../components/form-header";
import CloseIcon from "../../../assets/icons/CloseIcon";
import BrandSteamIcon from "../../../assets/icons/BrandSteamIcon";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useBranch } from "../../../hooks/useBranch";
import { Controller, useForm } from "react-hook-form";
import { actionMasterAssetType, resetMasterAssetTypeResponse } from "../../../store/asset";
import { actionAssetTypeWiseList, actionRosterData, resetAssetTypeWiseListResponse } from "../../../store/roster";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import ChevronDownIcon from "../../../assets/icons/ChevronDown";
import EmptyContent from "../../../components/empty_content";
import TypographyComponent from "../../../components/custom-typography";
import CustomTextField from "../../../components/text-field";
import FormLabel from "../../../components/form-label";
import { AntSwitch, SearchInput } from "../../../components/common";
import SearchIcon from "../../../assets/icons/SearchIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import { actionAddDocumentGroup, resetAddDocumentGroupResponse, actionDocumentGroupDetails, resetDocumentGroupDetailsResponse } from "../../../store/documents";

export default function CreateNewDocumentGroup({ open, objData, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            asset_group_name: '',
            asset_type: ''
        }
    });

    // state
    const [searchQuery, setSearchQuery] = useState('')
    const [assetTypeMasterOption, setAssetTypeMasterOption] = useState([])
    const [assetTypeWiseListOptions, setAssetTypeWiseListOptions] = useState([])
    const [assetTypeWiseListOriginalData, setAssetTypeWiseListOriginalData] = useState([])
    const [loading, setLoading] = useState(false)
    const [documentGroupDetailData, setDocumentGroupDetailData] = useState(null)

    // store
    const { masterAssetType } = useSelector(state => state.AssetStore)
    const { rosterData, assetTypeWiseList } = useSelector(state => state.rosterStore)
    const { addDocumentGroup, documentGroupDetails } = useSelector(state => state.documentStore)

    /**
    * initial render
    */
    useEffect(() => {
        if (open === true) {
            if (branch?.currentBranch?.client_uuid && branch?.currentBranch?.client_uuid !== null) {
                dispatch(actionMasterAssetType({
                    client_uuid: branch?.currentBranch?.client_uuid
                }))
            }
        }

    }, [branch?.currentBranch, open])

    useEffect(() => {
        if (open === true) {
            if (objData?.uuid && objData?.uuid !== null) {
                dispatch(actionDocumentGroupDetails({ uuid: objData?.uuid }))
            }
        }
    }, [objData, open])

    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && rosterData?.asset_type && rosterData?.asset_type !== null) {
            dispatch(actionAssetTypeWiseList({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type: rosterData?.asset_type
            }))
        }
    }, [branch?.currentBranch, rosterData?.asset_type])

    /**
    * Filter the asset type wise list
    */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (assetTypeWiseListOriginalData && assetTypeWiseListOriginalData !== null && assetTypeWiseListOriginalData.length > 0) {
                var filteredData = assetTypeWiseListOriginalData.filter(
                    item =>
                        (item?.asset_description && item?.asset_description.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.type && item?.type.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setAssetTypeWiseListOptions(filteredData)
                } else {
                    setAssetTypeWiseListOptions([])
                }
            }
        } else {
            setAssetTypeWiseListOptions(assetTypeWiseListOriginalData)
        }
    }, [searchQuery])

    /**
     * useEffect
     * @dependency : masterAssetType
     * @type : HANDLE API RESULT
     * @description : Handle the result of master Asset Type API
     */
    useEffect(() => {
        if (masterAssetType && masterAssetType !== null) {
            dispatch(resetMasterAssetTypeResponse())
            if (masterAssetType?.result === true) {
                setAssetTypeMasterOption(masterAssetType?.response)
            } else {
                setAssetTypeMasterOption([])
                switch (masterAssetType?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetMasterAssetTypeResponse())
                        break
                    case SERVER_ERROR:
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
     * @dependency : assetTypeWiseList
     * @type : HANDLE API RESULT
     * @description : Handle the result of asset Type Wise List API
     */
    useEffect(() => {
        if (assetTypeWiseList && assetTypeWiseList !== null) {
            dispatch(resetAssetTypeWiseListResponse())
            if (assetTypeWiseList?.result === true) {
                setAssetTypeWiseListOptions(assetTypeWiseList?.response)
                setAssetTypeWiseListOriginalData(assetTypeWiseList?.response)
            } else {
                setAssetTypeWiseListOptions([])
                setAssetTypeWiseListOriginalData([])
                switch (assetTypeWiseList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetTypeWiseListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: assetTypeWiseList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetTypeWiseList])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    const updateRosterAssets = (rosterData, assetsToUpdate = [], action = 'add') => {
        let updatedAssets = Array.isArray(rosterData?.assets) ? [...rosterData.assets] : [];

        if (action === 'add') {
            // Add only if not already present
            assetsToUpdate.forEach(asset => {
                if (!updatedAssets.some(item => item.asset_id === asset.asset_id)) {
                    updatedAssets.push(asset);
                }
            });
        } else if (action === 'remove') {
            // Remove matching asset_ids
            const assetIdsToRemove = assetsToUpdate.map(a => a.asset_id);
            updatedAssets = updatedAssets.filter(item => !assetIdsToRemove.includes(item.asset_id));
        }

        return { ...rosterData, assets: updatedAssets };
    }

    /**
     * useEffect
     * @dependency : addDocumentGroup
     * @type : HANDLE API RESULT
     * @description : Handle the result of add Document Group API
     */
    useEffect(() => {
        if (addDocumentGroup && addDocumentGroup !== null) {
            dispatch(resetAddDocumentGroupResponse())
            if (addDocumentGroup?.result === true) {
                handleClose('save')
                showSnackbar({ message: addDocumentGroup?.message, severity: "success" })
                setLoading(false)
            } else {
                handleClose()
                setLoading(false)
                switch (addDocumentGroup?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddDocumentGroupResponse())
                        showSnackbar({ message: addDocumentGroup?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: addDocumentGroup?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addDocumentGroup])

    /**
     * useEffect
     * @dependency : documentGroupDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of document Group Details API
     */
    useEffect(() => {
        if (documentGroupDetails && documentGroupDetails !== null) {
            dispatch(resetDocumentGroupDetailsResponse())
            if (documentGroupDetails?.result === true) {
                setDocumentGroupDetailData(documentGroupDetails?.response)
            } else {
                setDocumentGroupDetailData(null)
                switch (documentGroupDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDocumentGroupDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: documentGroupDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [documentGroupDetails])

    useEffect(() => {
        if (assetTypeMasterOption && assetTypeMasterOption?.length > 0) {
            if (objData && objData !== null && objData?.formType === 'edit') {
                setValue('asset_group_name', documentGroupDetailData?.asset_group_name)
                setValue('asset_type', documentGroupDetailData?.asset_type)
                let objData = Object.assign({}, rosterData)
                objData.assets = documentGroupDetailData?.assets
                objData.asset_group_name = documentGroupDetailData?.asset_group_name
                objData.asset_type = documentGroupDetailData?.asset_type
                dispatch(actionRosterData(objData))
                setAssetTypeWiseListOptions(documentGroupDetailData?.assets)
            }
            else {
                if (rosterData === null || rosterData?.asset_type === null || rosterData?.asset_type === '') {
                    setValue('asset_type', assetTypeMasterOption[0]?.name)
                    let objData = Object.assign({}, rosterData)
                    objData.asset_type = assetTypeMasterOption[0]?.name
                    dispatch(actionRosterData(objData))
                }
            }
        }
    }, [assetTypeMasterOption, documentGroupDetailData])

    // handle submit function
    const onSubmit = data => {
        setLoading(true)
        let input = {
            branch_uuid: branch?.currentBranch?.uuid,
            asset_group_name: data.asset_group_name,
            assets: rosterData?.assets,
            asset_type: data.asset_type
        }
        let updated = Object.assign({}, input)
        if (objData && objData !== null && objData.formType && objData.formType === 'edit' && objData.uuid && objData.uuid !== null) {
            updated.uuid = objData.uuid
        }
        dispatch(actionAddDocumentGroup(updated))
    }

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: '86%' } } }}
            >
                <Stack justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<BrandSteamIcon stroke={theme.palette.primary[600]} size={24} />}
                        title={`${objData && objData?.formType && objData.formType === 'edit' ? 'Edit' : 'Create New'} Group`}
                        subtitle={`Fill below form to ${objData && objData?.formType && objData.formType === 'edit' ? 'Edit' : 'create new'} group`}

                        actions={[
                            <IconButton
                                onClick={() => {
                                    reset()
                                    handleClose()
                                }}
                            >
                                <CloseIcon size={16} />
                            </IconButton>
                        ]}
                    />
                    <Divider sx={{ mx: 2 }} />
                </Stack>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4} sx={{ mx: 2, mt: 2 }}>
                        {/*  Asset Group Details */}
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <TypographyComponent fontSize={16} fontWeight={600} sx={{ mb: 2 }}>
                                Asset Group Details
                            </TypographyComponent>
                            <Card sx={{ borderRadius: '16px', padding: '12px', gap: '16px', border: `1px solid ${theme.palette.primary[400]}`, backgroundColor: theme.palette.primary[50] }}>
                                <CardContent>
                                    <Grid container>
                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                            <Controller
                                                name='asset_group_name'
                                                control={control}
                                                rules={{
                                                    required: 'Asset Group Name is required',
                                                    maxLength: {
                                                        value: 255,
                                                        message: 'Maximum length is 255 characters'
                                                    },
                                                }}
                                                render={({ field }) => (
                                                    <CustomTextField
                                                        fullWidth
                                                        value={field?.value}
                                                        disabled={objData?.formType === 'edit'}
                                                        label={<FormLabel label='Asset Group Name' required={true} />}
                                                        onChange={(e) => {
                                                            field.onChange(e); // ✅ update form state
                                                            const newValue = e.target.value;

                                                            // ✅ clone the entire object
                                                            const updatedData = Object.assign({}, rosterData);

                                                            // ✅ set root-level group name
                                                            updatedData.asset_group_name = newValue;

                                                            // ✅ clone assets and add asset_group_name to each
                                                            const updatedAssets = [];
                                                            rosterData?.assets.forEach((asset) => {
                                                                const newAsset = Object.assign({}, asset, { asset_group_name: newValue });
                                                                updatedAssets.push(newAsset);
                                                            });

                                                            updatedData.assets = updatedAssets;

                                                            // ✅ dispatch final data
                                                            dispatch(actionRosterData(updatedData));
                                                        }}
                                                        placeholder="Write asset group name"
                                                        helperText="This name will help identify which assets this document applies to"
                                                        inputProps={{ maxLength: 255 }}
                                                        error={Boolean(errors.asset_group_name)}
                                                        {...(errors.asset_group_name && { helperText: errors.asset_group_name.message })}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Left Panel: Select Asset */}
                        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                            <TypographyComponent fontSize={16} fontWeight={600}>
                                Select Asset
                            </TypographyComponent>
                            <Card
                                sx={{
                                    borderRadius: '16px',
                                    padding: '24px',
                                    gap: '32px',
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                    mt: 2
                                }}>
                                <CardContent sx={{ p: 0, }}>
                                    <Stack>
                                        <Controller
                                            name='asset_type'
                                            control={control}
                                            render={({ field }) => (
                                                <CustomTextField
                                                    select
                                                    fullWidth
                                                    value={field?.value ?? ''}
                                                    disabled={objData?.formType === 'edit'}
                                                    label={<FormLabel label='Asset Type' required={false} />}
                                                    onChange={(event) => {
                                                        field.onChange(event)
                                                        let objData = Object.assign({}, rosterData)
                                                        objData.asset_type = event.target.value
                                                        dispatch(actionRosterData(objData))
                                                    }}
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

                                                    error={Boolean(errors.asset_type)}
                                                    {...(errors.asset_type && { helperText: errors.asset_type.message })}
                                                >
                                                    <MenuItem value='' disabled>
                                                        <em>Select Asset Type</em>
                                                    </MenuItem>
                                                    {assetTypeMasterOption &&
                                                        assetTypeMasterOption.map(option => (
                                                            <MenuItem
                                                                key={option?.name}
                                                                value={option?.name}
                                                                sx={{
                                                                    whiteSpace: 'normal',        // allow wrapping
                                                                    wordBreak: 'break-word',     // break long words if needed
                                                                    maxWidth: 550,               // control dropdown width
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
                                    </Stack>
                                    <Stack sx={{ my: 2 }}>
                                        <SearchInput
                                            id="search-assets"
                                            placeholder="Search"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={searchQuery}
                                            onChange={handleSearchQueryChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ mr: 1 }}>
                                                        <SearchIcon stroke={theme.palette.grey[500]} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                    <List
                                        key={rosterData?.assets?.map(a => a.asset_id).join(',')}
                                        dense
                                        sx={{
                                            p: 0,
                                            height: 255,
                                            flexGrow: 1,
                                            overflowY: 'auto',
                                            '&::-webkit-scrollbar': {
                                                width: '2px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#ccc',
                                                borderRadius: '2px'
                                            }
                                        }}>
                                        {assetTypeWiseListOptions?.length > 0 ? (
                                            assetTypeWiseListOptions.map((asset) => {
                                                const isChecked = rosterData?.assets?.some(
                                                    item => item.asset_id === asset?.id
                                                );

                                                return (
                                                    <ListItem
                                                        key={asset.id}
                                                        disablePadding
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            py: 1.5,
                                                            px: 1,
                                                            borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                            background: isChecked ? theme.palette.primary[50] : ''
                                                        }}
                                                    >
                                                        <Box>
                                                            <TypographyComponent
                                                                fontSize={16}
                                                                fontWeight={400}
                                                                sx={{ color: theme.palette.grey[900] }}
                                                            >
                                                                {asset?.asset_description}
                                                            </TypographyComponent>
                                                            <TypographyComponent
                                                                fontSize={14}
                                                                fontWeight={400}
                                                                sx={{ color: theme.palette.grey[600] }}
                                                            >
                                                                {asset?.vendor_name}
                                                            </TypographyComponent>
                                                        </Box>

                                                        <AntSwitch
                                                            checked={isChecked}
                                                            onChange={(event) => {
                                                                let updatedData;
                                                                if (event.target.checked) {
                                                                    updatedData = updateRosterAssets(rosterData, [{
                                                                        asset_id: asset.id,
                                                                        asset_type: asset.type,
                                                                        asset_description: asset.asset_description,
                                                                        vendor_name: asset.vendor_name
                                                                    }], 'add');
                                                                } else {
                                                                    updatedData = updateRosterAssets(rosterData, [{
                                                                        asset_id: asset.id
                                                                    }], 'remove');
                                                                }
                                                                dispatch(actionRosterData(updatedData));
                                                            }}
                                                        />
                                                    </ListItem>
                                                );
                                            })
                                        ) : (
                                            <EmptyContent
                                                imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND}
                                                title="No Asset Found"
                                                subTitle=""
                                            />
                                        )}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Right Panel: Selected Asset Details & Group Details */}
                        <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}>
                            <Box>
                                <TypographyComponent fontSize={16} fontWeight={600} sx={{ mb: 2 }}>
                                    Selected Asset Details
                                </TypographyComponent>
                                <Card
                                    sx={{
                                        borderRadius: '16px',
                                        padding: '12px',
                                        gap: '16px',
                                        border: `1px solid ${theme.palette.grey[300]}`,
                                        height: 470,
                                        flexGrow: 1,
                                        mb: 4,
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
                                    <CardContent sx={{ p: 2 }}>
                                        {rosterData?.assets && rosterData.assets.length > 0 ? (
                                            rosterData.assets.map((asset, index) => (
                                                <React.Fragment key={asset.asset_id || index}>
                                                    <Grid container spacing={2} alignItems="center" sx={{ py: 1 }}>
                                                        <Grid
                                                            size={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}
                                                            sx={{ px: 2 }}
                                                        >
                                                            <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>
                                                                {asset?.asset_description ?? 'N/A'}
                                                            </TypographyComponent>
                                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[400] }}>
                                                                {asset?.asset_type ?? 'N/A'}
                                                            </TypographyComponent>
                                                        </Grid>
                                                        <Grid
                                                            size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
                                                        >
                                                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[900] }}>
                                                                {asset?.vendor_name ?? 'N/A'}
                                                            </TypographyComponent>
                                                        </Grid>
                                                        <Grid
                                                            size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                                                        >
                                                            <IconButton
                                                                onClick={() => {
                                                                    const updatedData = updateRosterAssets(rosterData, [{
                                                                        asset_id: asset.asset_id
                                                                    }], 'remove');
                                                                    dispatch(actionRosterData(updatedData));
                                                                }}
                                                            >
                                                                <DeleteIcon stroke={'#181D27'} />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Divider only between items */}
                                                    {index < rosterData.assets.length - 1 && (
                                                        <Divider sx={{ my: 1.5, borderColor: theme.palette.grey[300] }} />
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <Stack sx={{ px: 1, py: 5, justifyContent: 'center', width: '100%' }}>
                                                <Stack sx={{ alignItems: 'center' }}>
                                                    <Avatar alt={""} src={'/assets/person-details.png'} sx={{ justifyContent: 'center', overFlow: 'hidden', borderRadius: 0, height: 232, width: 253 }} />
                                                </Stack>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ mt: 3, textAlign: 'center' }}>Select Asset to get details</TypographyComponent>
                                            </Stack>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
                <Divider sx={{ mx: 2 }} />
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 2, my: 2 }}
                >
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            reset()
                            handleClose()
                        }}
                        variant="outlined"
                    >
                        Reset
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleSubmit(onSubmit)()
                        }}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Create Group'}
                    </Button>
                </Stack>
            </Drawer>
        </React.Fragment>
    )
}