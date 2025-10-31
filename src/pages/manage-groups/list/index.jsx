/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, CardContent, Chip, Divider, FormLabel, Grid, InputAdornment, MenuItem, Pagination, Stack, useTheme } from '@mui/material'
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

export default function ManageGroupsList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()

    // state
    const [searchQuery, setSearchQuery] = useState('')
    const [manageGroupsOriginalData, setManageGroupsOriginalData] = useState([
        {
            name: "HVAC - Technicians Floor 1",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 1",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 1",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 2",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 2",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 2",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 3",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 3",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 4",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 4",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 4",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 5",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 5",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 5",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 3",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 4",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 4",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 4",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 5",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 5",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 5",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
    ])
    const [manageGroupsOptions, setManageGroupsOptions] = useState([
        {
            name: "HVAC - Technicians Floor 1",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 1",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 1",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 2",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 2",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 2",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 3",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 3",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 4",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 4",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 4",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 5",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 5",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 5",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 3",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 4",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 4",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 4",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
        {
            name: "HVAC - Technicians Floor 5",
            type: "HVAC",
            manager: 1,
            technicians: 6,
        },
        {
            name: "DG - Technicians Floor 5",
            type: "DG SET",
            manager: 1,
            technicians: 6,
        },
        {
            name: "UPS - Technicians Floor 5",
            type: "UPS",
            manager: 1,
            technicians: 6,
        },
    ])
    const [loadingList, setLoadingList] = useState(false)
    const [total, setTotal] = useState(0)
    const [assetType, setAssetType] = useState(null)
    const assetTypeMaster = []

    // store
    const { manageGroupsList } = useSelector(state => state.rosterStore)

    /**
       * initial render
       */
    useEffect(() => {
        // setLoadingList(true)
        // dispatch(actionManageGroupsList())
    }, [])

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

    const [page, setPage] = useState(1);

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
                            color: "#fff",
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
                    backgroundColor: '#ccc',
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
                            sx={{ bgcolor: "#ede7f6", color: theme.palette.primary[600], fontWeight: 500 }}
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
                            <MenuItem value='' disabled>
                                <em>Select Asset Types</em>
                            </MenuItem>
                            {assetTypeMaster &&
                                assetTypeMaster.map(option => (
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
                        <Button
                            variant="outlined"
                            color={theme.palette.common.white}  // text color
                            sx={{
                                border: `1px solid ${theme.palette.grey[300]}`,
                                paddingX: 4,
                            }}
                            startIcon={<DownloadIcon />}
                            onClick={() => {
                            }}
                        >
                            Export
                        </Button>
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
                            }}
                        >
                            {manageGroupsOptions.map((group, idx) => (
                                <Card
                                    key={idx}
                                    sx={{
                                        borderRadius: "10px",
                                        border: "1px solid #e0e0e0",
                                        boxShadow: "none",
                                        transition: "0.3s",
                                        height: "160px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        "&:hover": {
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            transform: "translateY(-3px)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                                        <TypographyComponent
                                            variant="subtitle1"
                                            fontWeight={600}
                                            sx={{ mb: 1, color: "#333" }}
                                        >
                                            {group.name}
                                        </TypographyComponent>
                                        <Chip
                                            label={group.type}
                                            size="small"
                                            sx={{
                                                bgcolor: "#f3e8ff",
                                                color: "#7e57c2",
                                                fontWeight: 500,
                                                mb: 1.5,
                                            }}
                                        />
                                        <TypographyComponent variant="body2" sx={{ color: "#666" }}>
                                            {`${group.manager} Manager`}
                                        </TypographyComponent>
                                        <TypographyComponent variant="body2" sx={{ color: "#666" }}>
                                            {`${group.technicians} Technicians`}
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
        </React.Fragment>
    )
}
