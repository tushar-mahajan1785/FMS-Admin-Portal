/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItem,
    MenuItem,
    Stack,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "../../../../../assets/icons/SearchIcon";
import TypographyComponent from "../../../../../components/custom-typography";
import { AntSwitch, SearchInput } from "../../../../../components/common";
import { actionMasterAssetType, resetMasterAssetTypeResponse } from "../../../../../store/asset";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../../hooks/useAuth";
import { useBranch } from "../../../../../hooks/useBranch";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../../../constants";
import toast from "react-hot-toast";
import { useSnackbar } from "../../../../../hooks/useSnackbar";
import { actionRosterData, actionAssetTypeWiseList, resetAssetTypeWiseListResponse } from "../../../../../store/roster";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "../../../../../components/text-field";
import FormLabel from "../../../../../components/form-label";
import EmptyContent from "../../../../../components/empty_content";
import ChevronDownIcon from "../../../../../assets/icons/ChevronDown";
import { getObjectById } from "../../../../../utils";

export default function SelectAssetStep() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    const {
        control,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            roster_group_name: ''
        }
    });

    // state
    const [searchQuery, setSearchQuery] = useState('')
    const [assetTypeMasterOption, setAssetTypeMasterOption] = useState([])
    const [assetTypeWiseListOptions, setAssetTypeWiseListOptions] = useState([])
    const [assetTypeWiseListOriginalData, setAssetTypeWiseListOriginalData] = useState([])

    // store
    const { masterAssetType } = useSelector(state => state.AssetStore)
    const { rosterData, assetTypeWiseList } = useSelector(state => state.rosterStore)

    /**
    * initial render
    */
    useEffect(() => {
        if (branch?.currentBranch?.client_uuid && branch?.currentBranch?.client_uuid !== null) {
            dispatch(actionMasterAssetType({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
        }
    }, [branch?.currentBranch])

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
                setValue('asset_type', masterAssetType?.response[0]?.id)
                let objData = Object.assign({}, rosterData)
                objData.asset_type = masterAssetType?.response[0]?.name
                dispatch(actionRosterData(objData))
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
                        toast.dismiss()
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

    return (
        <Grid container spacing={4} sx={{ mt: 1 }}>
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
                                        label={<FormLabel label='Asset Type' required={false} />}
                                        onChange={(event) => {
                                            field.onChange(event)
                                            let objData = Object.assign({}, rosterData)
                                            let objCurrent = getObjectById(assetTypeMasterOption, event.target.value)
                                            objData.asset_type = objCurrent.name
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
                                                    key={option?.id}
                                                    value={option?.id}
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
                        <List dense sx={{
                            p: 0,
                            height: 420,
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
                                        item => item.asset_id === asset.id && item.asset_type === asset.type
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
                                            }}
                                        >
                                            <Box>
                                                <TypographyComponent
                                                    fontSize={16}
                                                    fontWeight={400}
                                                    sx={{ color: theme.palette.grey[900] }}
                                                >
                                                    {asset.asset_description}
                                                </TypographyComponent>
                                                <TypographyComponent
                                                    fontSize={14}
                                                    fontWeight={400}
                                                    sx={{ color: theme.palette.grey[600] }}
                                                >
                                                    {asset.type}
                                                </TypographyComponent>
                                            </Box>

                                            <AntSwitch
                                                checked={isChecked}
                                                onChange={(event) => {
                                                    let objData = Object.assign({}, rosterData);
                                                    let updatedAssets = Object.assign([], objData?.assets);
                                                    if (event.target.checked) {
                                                        if (
                                                            !updatedAssets.some(
                                                                item =>
                                                                    item.asset_id === asset.id &&
                                                                    item.asset_type === asset.type
                                                            )
                                                        ) {
                                                            updatedAssets.push({
                                                                asset_id: asset.id,
                                                                asset_type: asset.type,
                                                                asset_description: asset.asset_description
                                                            });
                                                        }
                                                    } else {
                                                        updatedAssets = updatedAssets.filter(
                                                            item =>
                                                                !(
                                                                    item.asset_id === asset.id &&
                                                                    item.asset_type === asset.type
                                                                )
                                                        );
                                                    }
                                                    objData.assets = updatedAssets;
                                                    dispatch(actionRosterData(objData));
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
                            minHeight: 100,
                            maxHeight: 430,
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
                                                size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}
                                                sx={{ borderRight: `1px solid ${theme.palette.grey[300]}`, px: 2 }}
                                            >
                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                    Asset Name
                                                </TypographyComponent>
                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                    {asset?.asset_description ?? 'N/A'}
                                                </TypographyComponent>
                                            </Grid>

                                            <Grid size={{ xs: 9, sm: 9, md: 9, lg: 9, xl: 9 }}>
                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                    Asset Type
                                                </TypographyComponent>
                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                    {asset?.asset_type ?? 'N/A'}
                                                </TypographyComponent>
                                            </Grid>
                                        </Grid>

                                        {/* Divider only between items */}
                                        {index < rosterData.assets.length - 1 && (
                                            <Divider sx={{ my: 1.5, borderColor: theme.palette.grey[300] }} />
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <TypographyComponent
                                    fontSize={16}
                                    fontWeight={400}
                                    sx={{ textAlign: 'center', py: 2 }}
                                >
                                    No Assets Selected
                                </TypographyComponent>
                            )}
                        </CardContent>
                    </Card>

                    <TypographyComponent fontSize={16} fontWeight={600} sx={{ mb: 2 }}>
                        Group Details
                    </TypographyComponent>
                    <Card sx={{ borderRadius: '16px', padding: '12px', gap: '16px', border: `1px solid ${theme.palette.grey[300]}` }}>
                        <CardContent>
                            <Grid container>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Controller
                                        name='roster_group_name'
                                        control={control}
                                        rules={{
                                            required: 'Group Name is required',
                                            maxLength: {
                                                value: 255,
                                                message: 'Maximum length is 255 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                value={field?.value}
                                                label={<FormLabel label='Group Name' required={true} />}
                                                onChange={(e) => {
                                                    field.onChange(e); // ✅ update form state
                                                    const newValue = e.target.value;

                                                    // ✅ clone the entire object
                                                    const updatedData = Object.assign({}, rosterData);

                                                    // ✅ set root-level group name
                                                    updatedData.roster_group_name = newValue;

                                                    // ✅ clone assets and add roster_group_name to each
                                                    const updatedAssets = [];
                                                    (rosterData?.assets || []).forEach((asset) => {
                                                        const newAsset = Object.assign({}, asset, { roster_group_name: newValue });
                                                        updatedAssets.push(newAsset);
                                                    });

                                                    updatedData.assets = updatedAssets;

                                                    // ✅ dispatch final data
                                                    dispatch(actionRosterData(updatedData));
                                                }}
                                                placeholder="Write group name"
                                                inputProps={{ maxLength: 255 }}
                                                error={Boolean(errors.roster_group_name)}
                                                {...(errors.roster_group_name && { helperText: errors.roster_group_name.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );
}