/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    FormLabel,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import MyBreadcrumbs from '../../../components/breadcrumb'
import AddIcon from '@mui/icons-material/Add';
import TypographyComponent from '../../../components/custom-typography';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import { actionManageGroupsList, resetManageGroupsListResponse } from '../../../store/roster';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import { useSnackbar } from '../../../hooks/useSnackbar';
import FullScreenLoader from '../../../components/fullscreen-loader';
import EmptyContent from '../../../components/empty_content';
import { SearchInput } from '../../../components/common';
import SearchIcon from '../../../assets/icons/SearchIcon';
import ChevronDownIcon from "../../../assets/icons/ChevronDown"
import CustomTextField from "../../../components/text-field"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { actionMasterAssetType, resetMasterAssetTypeResponse } from '../../../store/asset';
import { useBranch } from '../../../hooks/useBranch';
import * as XLSX from "xlsx";
import AddManageGroups from '../add';

export default function ManageGroupsList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    // state
    const [searchQuery, setSearchQuery] = useState('')
    const [manageGroupsOriginalData, setManageGroupsOriginalData] = useState([])
    const [manageGroupsOptions, setManageGroupsOptions] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [total, setTotal] = useState(0)
    const [assetType, setAssetType] = useState('')
    const [page, setPage] = useState(1);
    const [assetTypeMasterOption, setAssetMasterOption] = useState([])
    const [openAddManageGroupsPopup, setOpenAddManageGroupsPopup] = useState(false)

    // store
    const { manageGroupsList } = useSelector(state => state.rosterStore)
    const { masterAssetType } = useSelector(state => state.AssetStore)

    /**
       * initial render
       */
    useEffect(() => {
        setLoadingList(true)
        if (branch?.currentBranch?.client_uuid && branch?.currentBranch?.client_uuid !== null) {
            dispatch(actionMasterAssetType({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
            dispatch(actionManageGroupsList({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
        }
    }, [branch?.currentBranch])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
         * Filter the vendor
         */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (manageGroupsOriginalData && manageGroupsOriginalData !== null && manageGroupsOriginalData.length > 0) {
                var filteredData = manageGroupsOriginalData.filter(
                    item =>
                        (item?.manager_group_name && item?.manager_group_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.asset_name && item?.asset_name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setManageGroupsOptions(filteredData)
                } else {
                    setManageGroupsOptions([])
                }
            }
        } else {
            setManageGroupsOptions(manageGroupsOriginalData)
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
                setAssetMasterOption(masterAssetType?.response)
            } else {
                setAssetMasterOption([])
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
     * @dependency : manageGroupsList
     * @type : HANDLE API RESULT
     * @description : Handle the result of manage Groups List API
     */
    useEffect(() => {
        if (manageGroupsList && manageGroupsList !== null) {
            dispatch(resetManageGroupsListResponse())
            if (manageGroupsList?.result === true) {
                setManageGroupsOptions(manageGroupsList?.response?.group)
                setManageGroupsOriginalData(manageGroupsList?.response?.group)
                setLoadingList(false)
                setTotal(manageGroupsList?.response?.total)
            } else {
                setLoadingList(false)
                setManageGroupsOptions([])
                setManageGroupsOriginalData([])
                switch (manageGroupsList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetManageGroupsListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: manageGroupsList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [manageGroupsList])

    const totalPages = Math.ceil(total / LIST_LIMIT);

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const getPaginationRange = () => {
        const delta = 2;
        const range = [];
        const left = Math.max(2, page - delta);
        const right = Math.min(totalPages - 1, page + delta);

        range.push(1);
        if (left > 2) range.push("…");

        for (let i = left; i <= right; i++) range.push(i);

        if (right < totalPages - 1) range.push("…");
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    return (
        <React.Fragment>
            <Stack
                flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                mb={3}>
                <MyBreadcrumbs />
                {
                    hasPermission('MANAGE_GROUPS_ADD') &&
                    <Button
                        size="small" sx={{
                            textTransform: 'capitalize',
                            color: theme.palette.common.white,
                            px: 1.5,
                            py: 1,
                            alignItems: 'center',
                            backgroundColor: theme.palette.primary[600],
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: theme.palette.primary[600],
                            },
                            boxShadow: 'none'
                        }}
                        variant='contained'
                        onClick={() => {
                            setOpenAddManageGroupsPopup(true)
                        }}
                    >
                        <AddIcon sx={{ color: 'white', fontSize: { xs: '16x', sm: '16px' } }} />
                        <TypographyComponent fontSize={14} fontWeight={600} sx={{ ml: 0.3 }}>
                            Create New Group
                        </TypographyComponent>
                    </Button>
                }

            </Stack>
            <Box sx={{
                height: '720px',
                background: theme.palette.common.white,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.grey[300]}`,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '2px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: '2px'
                }
            }}>
                <Stack
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    m={2}>
                    <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                        <Stack>
                            <TypographyComponent fontSize={18} fontWeight={500}>Group List</TypographyComponent>
                        </Stack>
                        <Chip
                            label={`${total} Groups`}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontWeight: 500 }}
                        />
                    </Stack>
                    <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center' }}>
                        <SearchInput
                            id="search-assets"
                            placeholder="Search"
                            variant="outlined"
                            size="small"
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
                        <CustomTextField
                            select
                            fullWidth
                            sx={{ marginBottom: 1 }}
                            value={assetType}
                            label={<FormLabel label='All Asset Types' required={false} />}
                            onChange={(event) => {
                                setAssetType(event.target.value)
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
                        >
                            <MenuItem value=''>
                                <em>All Asset Types</em>
                            </MenuItem>
                            {assetTypeMasterOption &&
                                assetTypeMasterOption.map(option => (
                                    <MenuItem
                                        key={option?.id}
                                        value={option?.id}
                                        sx={{
                                            whiteSpace: 'normal',        // allow wrapping
                                            wordBreak: 'break-word',     // break long words if needed
                                            maxWidth: 500,               // control dropdown width
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
                        {
                            manageGroupsOptions && manageGroupsOptions !== null && manageGroupsOptions.length > 0 &&
                            <Button
                                variant="outlined"
                                color={theme.palette.common.white}  // text color
                                sx={{
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                    paddingX: 4,
                                }}
                                startIcon={<DownloadIcon />}
                                onClick={() => {
                                    const worksheet = XLSX.utils.json_to_sheet(manageGroupsOptions, {
                                        header: ["Name", "Type", "Manager", "Technicians"]
                                    });

                                    const workbook = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(workbook, worksheet, "Manage Groups");

                                    XLSX.writeFile(workbook, "Manage Groups.xlsx");
                                }}
                            >
                                Export
                            </Button>
                        }
                    </Stack>
                </Stack>
                {loadingList ? (
                    <FullScreenLoader open={true} />
                ) : manageGroupsOptions && manageGroupsOptions !== null && manageGroupsOptions.length > 0 ? (
                    <Box sx={{ flex: 1, overflowY: "auto", margin: 2 }}>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: 2,
                                marginTop: 1
                            }}
                        >
                            {manageGroupsOptions.map((group, idx) => (
                                <Card
                                    key={idx}
                                    sx={{
                                        borderRadius: "10px",
                                        border: `1px solid ${theme.palette.grey[300]}`,
                                        boxShadow: "none",
                                        transition: "0.3s",
                                        height: "160px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: 'pointer'
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                                        <TypographyComponent
                                            fontSize={'18px'}
                                            fontWeight={500}
                                            sx={{ mb: 1, color: theme.palette.grey.primary }}
                                        >
                                            {group.name}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={'16px'} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                            {group.manager && group.manager !== null ? `${String(group.manager).padStart(2, '0')} Manager` : ''}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={'16px'} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                            {group.technicians && group.technicians !== null ? `${String(group.technicians).padStart(2, '0')} Technicians` : ''}
                                        </TypographyComponent>
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Manage Groups Found'} subTitle={''} />
                )}
                {/* Pagination */}
                <Divider sx={{ my: 2 }} />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    my={2}
                    px={2}
                >
                    <Button
                        sx={{ borderColor: theme.palette.grey[300], color: theme.palette.grey[700], fontWeight: 600, fontSize: '14px', textTransform: "capitalize" }}
                        variant="outlined"
                        startIcon={<ArrowBackIcon fontSize="small" />}
                        onClick={handlePrevious}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>

                    {/* Page numbers with ellipsis */}
                    <Box>
                        {getPaginationRange().map((p, index) =>
                            p === "…" ? (
                                <Button key={`ellipsis-${index}`} disabled sx={{ mx: 0.5 }}>
                                    …
                                </Button>
                            ) : (
                                <Button
                                    key={p}

                                    variant={"text"}
                                    // size="small"
                                    onClick={() => setPage(Number(p))}
                                    // sx={{ mx: 0.5 }}

                                    sx={(theme) => ({
                                        height: 40,
                                        minWidth: 40,
                                        aspectRatio: 1,
                                        color: theme.palette.grey[600],
                                        mx: 0.5,
                                        backgroundColor: p === page ? theme.palette.primary[100] : "transparent",
                                    })}
                                >
                                    {p}
                                </Button>
                            )
                        )}
                    </Box>

                    <Button
                        sx={{ borderColor: theme.palette.grey[300], color: theme.palette.grey[700], fontWeight: 600, fontSize: '14px', textTransform: "capitalize" }}
                        variant="outlined"
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                        onClick={handleNext}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
            <AddManageGroups
                open={openAddManageGroupsPopup}
                handleClose={() => {
                    setOpenAddManageGroupsPopup(false)
                }}
            />
        </React.Fragment>
    )
}
