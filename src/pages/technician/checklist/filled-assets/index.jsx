import { useTheme } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { Box, Button, Chip, CircularProgress, DialogActions, DialogContent, Divider, InputAdornment, Stack } from '@mui/material'

import { BootstrapDialog, SearchInput } from '../../../../components/common';
import TypographyComponent from '../../../../components/custom-typography';
import { useDispatch, useSelector } from 'react-redux';
import { actionTechnicianGetCurrentFilledAssets, resetTechnicianGetCurrentFilledAssetsResponse } from '../../../../store/technician/checklist';
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { useAuth } from '../../../../hooks/useAuth';
import SearchIcon from '../../../../assets/icons/SearchIcon';
import { getPercentage } from '../../../../utils';

export default function FilledAssetsList({ open, label, details, handleClose }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    //Stores
    const { technicianGetCurrentFilledAssets } = useSelector(state => state.technicianChecklistStore)

    const [assetListData, setAssetListData] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [assetListOriginalData, setAssetListOriginalData] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    /**
        * useEffect
        * @dependency : technicianGetCurrentFilledAssets
        * @type : HANDLE API RESULT
        * @description : Handle the result of checklist group List API
       */
    useEffect(() => {
        if (technicianGetCurrentFilledAssets && technicianGetCurrentFilledAssets !== null) {
            dispatch(resetTechnicianGetCurrentFilledAssetsResponse())
            if (technicianGetCurrentFilledAssets?.result === true) {
                setAssetListData(technicianGetCurrentFilledAssets?.response || [])
                setAssetListOriginalData(technicianGetCurrentFilledAssets?.response || [])
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setAssetListData([])
                setAssetListOriginalData([])
                switch (technicianGetCurrentFilledAssets?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianGetCurrentFilledAssetsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianGetCurrentFilledAssets?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianGetCurrentFilledAssets])

    useEffect(() => {
        if (open == true && details && details !== null) {
            // Fetch or process details if needed
            console.log('Details:', details);
            setLoadingList(true)
            dispatch(actionTechnicianGetCurrentFilledAssets({
                checklist_group_uuid: details.group_uuid
            }))
        }
    }, [details, open])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
      * Filter the asset list
      */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (assetListOriginalData && assetListOriginalData !== null && assetListOriginalData.length > 0) {
                var filteredData = assetListOriginalData.filter(
                    item =>
                        (item?.asset_name && item?.asset_name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setAssetListData(filteredData)
                } else {
                    setAssetListData([])
                }
            }
        } else {
            setAssetListData(assetListOriginalData)
        }
    }, [searchQuery])

    /**
     * Get Pending,Filled & TotalCounts for Current Asset
     * @param {*} values 
     * @returns 
     */
    const getPendingAndFilledCount = (values = []) => {
        let filledCount = 0
        let pendingCount = 0
        let totalCount = 0

        values.forEach(item => {
            const hasValue =
                item.value !== undefined &&
                item.value !== null &&
                String(item.value).trim() !== ''

            if (hasValue) {
                filledCount++
            } else {
                pendingCount++
            }

            if (item && item !== null && item?.parameter_type !== "Grouping") {
                totalCount++
            }
        })

        return {
            filledCount,
            pendingCount,
            totalCount
        }
    }

    return (
        <BootstrapDialog open={open} onClose={() => handleClose()} fullWidth maxWidth="sm">
            <DialogContent>
                <TypographyComponent fontSize={18}>{label}</TypographyComponent>
                <Stack sx={{ my: 1.5 }}>
                    <SearchInput
                        id="search-users"
                        placeholder="Search asset here..."
                        variant="outlined"
                        size="small"
                        sx={{ background: theme.palette.common.white }}
                        onChange={handleSearchQueryChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon stroke={theme.palette.grey[500]} size={18} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Stack
                    sx={{
                        height: 370,
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: theme.palette.grey[400],
                            borderRadius: "3px",
                        }
                    }}
                    spacing={1}
                >
                    {loadingList ?
                        <Stack sx={{ height: '600px', alignItems: 'center', rowGap: 1, justifyContent: 'center' }}>
                            <CircularProgress sx={{ color: theme.palette.grey[900] }} />
                            <TypographyComponent
                                fontSize={22}
                                fontWeight={500}
                                sx={{ mt: 2, color: theme.palette.grey[900] }}
                            >
                                Loading....
                            </TypographyComponent>
                        </Stack>
                        :
                        assetListData && assetListData !== null && assetListData?.length > 0 ? (
                            assetListData.map((asset, index) => (
                                <React.Fragment>
                                    <Stack
                                        key={index}
                                        sx={{
                                            p: '1px 8px',
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                            <TypographyComponent fontSize={14} fontWeight={400}>
                                                {asset?.asset_name}
                                            </TypographyComponent>
                                            <Stack direction="row" spacing={1.2}>
                                                <TypographyComponent
                                                    fontSize={14}
                                                    fontWeight={400}
                                                    sx={{ color: theme.palette.success[700] }}
                                                >
                                                    ({String(getPendingAndFilledCount(asset?.values)?.filledCount || 0).padStart(2, "0")}/
                                                    {String(getPendingAndFilledCount(asset?.values).totalCount || 0).padStart(2, "0")})
                                                </TypographyComponent>

                                                <TypographyComponent
                                                    fontSize={14}
                                                    fontWeight={400}
                                                    sx={{ color: theme.palette.success[700] }}
                                                >
                                                    {getPendingAndFilledCount(asset?.values)?.totalCount > 0
                                                        ? getPercentage(getPendingAndFilledCount(asset?.values)?.filledCount, getPendingAndFilledCount(asset?.values)?.totalCount)
                                                        : 0}% Completed
                                                </TypographyComponent>
                                            </Stack>
                                        </Stack>
                                    </Stack >
                                    <Divider sx={{ my: -0.2 }} />
                                </React.Fragment>
                            ))
                        ) : (
                            <Stack sx={{ width: '100%', alignItems: 'center', mt: 10, height: '100%', justifyContent: 'center' }}>
                                <TypographyComponent fontSize={16} color={theme.palette.grey[900]}>
                                    No Assets Found
                                </TypographyComponent>
                            </Stack>
                        )}
                </Stack>
            </DialogContent>

            <Divider sx={{ my: 0.5 }} />

            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textAlign: "left",
                        textTransform: "capitalize",
                        background: theme.palette.primary[600],
                        color: theme.palette.common.white
                    }}
                    onClick={() => handleClose()}
                >
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};
