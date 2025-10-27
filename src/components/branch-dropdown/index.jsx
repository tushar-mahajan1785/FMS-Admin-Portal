import React, { useEffect, useState } from 'react'
import { useBranch } from '../../hooks/useBranch'
import { Box, Button, IconButton, Menu, MenuItem, Select, Stack, useTheme } from '@mui/material'
import TypographyComponent from '../custom-typography'
import CustomChip from '../custom-chip'
import { useAuth } from '../../hooks/useAuth'
import styled from '@emotion/styled'
import _ from 'lodash'
import { useSnackbar } from '../../hooks/useSnackbar'

// ** Styled Menu component
const MuiMenu = styled(Menu)(({ theme }) => ({
    '& .MuiMenu-paper': {
        width: 250,
        overflow: 'hidden',
        marginTop: theme.spacing(0.1),
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    '& .MuiMenu-list': {
        padding: 0,
        '& .MuiMenuItem-root': {
            margin: 0,
            borderRadius: 0,
            padding: theme.spacing(2, 3),
            '&:hover': {
                backgroundColor: theme.palette.action.hover
            }
        }
    }
}))

// ** Styled MenuItem component
const MuiMenuItem = styled(MenuItem)(({ theme }) => ({
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
    },

}))


export const BranchDropdown = () => {
    const branchContext = useBranch()
    const { verifyToken } = useAuth()
    const theme = useTheme()
    const { showSnackbar } = useSnackbar()
    const [anchorElBranch, setAnchorElBranch] = useState(null)
    const [selectedBranch, setSelectedBranch] = useState(branchContext?.currentBranch)

    useEffect(() => {
        if (branchContext?.currentBranch && branchContext?.currentBranch !== null) {
            setSelectedBranch(branchContext?.currentBranch)
        }

    }, [branchContext?.currentBranch])


    const handleDropdownOpen = event => {
        setAnchorElBranch(event.currentTarget)
        setSelectedBranch(branchContext?.currentBranch)
    }

    const handleDropdownClose = () => {
        setAnchorElBranch(null)
        setSelectedBranch(null)
    }


    return (
        <React.Fragment>
            <IconButton
                disableRipple
                color='inherit'
                aria-haspopup='true'
                onClick={handleDropdownOpen}
                sx={{
                    '&:hover': {
                        backgroundColor: 'transparent' // Disable hover effect
                    }
                }}
                aria-controls='customized-menu'
            >
                {branchContext?.currentBranch ? (
                    <CustomChip
                        colorName='primary'
                        type="branch_dropdown"
                        text={`${branchContext?.currentBranch?.name}`}
                    />
                ) : (
                    <CustomChip colorName='primary' text={'Select Branch'} />
                )}
            </IconButton>
            <MuiMenu
                anchorEl={anchorElBranch}
                open={Boolean(anchorElBranch)}
                onClose={handleDropdownClose}
                anchorOrigin={{ vertical: 'bottom' }}
                transformOrigin={{ vertical: 'top' }}
            >
                <MuiMenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <TypographyComponent fontSize={18} fontWeight={500} sx={{ cursor: 'text' }}>
                            Select Branch
                        </TypographyComponent>
                    </Box>
                </MuiMenuItem>
                <MuiMenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{ cursor: 'default', userSelect: 'none', backgroundClip: 'transparent !important' }}
                >
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: 2 }}>
                        <Select
                            fullWidth
                            size='small'
                            value={selectedBranch !== null ? selectedBranch?.uuid : branchContext.currentBranch?.uuid}
                        >
                            {branchContext?.allBranches.map((branch, index) => (
                                <MuiMenuItem
                                    key={index}
                                    value={branch.uuid}
                                    onClick={() => {
                                        setSelectedBranch(branch)
                                    }}
                                >
                                    <TypographyComponent variant='p'>{_.truncate(branch?.name, { length: 30 })}</TypographyComponent>
                                </MuiMenuItem>
                            ))}
                        </Select>
                    </Box>
                </MuiMenuItem>
                <MuiMenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{
                        borderBottom: 0,
                        cursor: 'default',
                        columnGap: 2,
                        rowGap: 2,
                        userSelect: 'auto',
                        backgroundColor: theme.palette.common.white, color: theme.palette.primary[600],
                        borderTop: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Button size="small" fullWidth variant='outlined' onClick={handleDropdownClose}>
                        Close
                    </Button>
                    <Button
                        size="small"
                        fullWidth
                        variant='contained'
                        sx={{ backgroundColor: theme.palette.primary[600], color: theme.palette.common.white }}
                        onClick={() => {
                            if (selectedBranch !== null) {
                                branchContext.updateSelectedBranch(selectedBranch.id)
                                setTimeout(() => {
                                    verifyToken()
                                }, 1000)
                                setAnchorElBranch(null)
                            } else {
                                showSnackbar({ message: 'Please select Branch', severity: "error" })
                            }
                        }}
                    >
                        Apply
                    </Button>
                </MuiMenuItem>
            </MuiMenu>
        </React.Fragment>
    )
}
