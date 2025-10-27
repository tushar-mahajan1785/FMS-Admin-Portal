// ** React Imports
import React, { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

// ** Hook Import
import ThreeDotsIcon from '../../assets/icons/ThreeDotsIcon'
import { useAuth } from '../../hooks/useAuth'

const MenuItemWrapper = ({ children, option }) => {
    if (option.href) {
        return (
            <Box
                href={option.href}
                {...option.linkProps}
                sx={{
                    mr: 0,
                    px: 4,
                    py: 1.5,
                    width: '100%',
                    display: 'flex',
                    color: 'inherit',
                    alignItems: 'center',
                    textDecoration: 'none'
                }}
            >
                {children}
            </Box>
        )
    } else {
        return <React.Fragment>{children}</React.Fragment>
    }
}

export default function OptionsMenu(props) {
    // ** Props
    const { icon, options, menuProps, iconProps, leftAlignMenu, iconButtonProps } = props
    const { hasPermission } = useAuth();

    // ** State
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleOptionClick = option => {
        handleClose() // Close the menu
        if (option.onClick) {
            option.onClick() // Call the onClick function of the option
        }
    }

    return (
        <React.Fragment>
            <IconButton aria-haspopup='true' onClick={handleClick} {...iconButtonProps}>
                {icon ? icon : <ThreeDotsIcon {...iconProps} />}
            </IconButton>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}
                {...(!leftAlignMenu && {
                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                    transformOrigin: { vertical: 'top', horizontal: 'left' }
                })}
                {...menuProps}
            >
                {options.map((option, index) => {
                    if (typeof option === 'string') {
                        return (
                            <MenuItem key={index} onClick={() => handleOptionClick(option)}>
                                {option}
                            </MenuItem>
                        )
                    } else if ('divider' in option) {
                        return option.divider && <Divider key={index} {...option.dividerProps} />
                    } else {
                        if (option?.subject && option?.subject !== null && option?.subject.length > 0 && hasPermission(option.subject)) {
                            return (
                                <MenuItem
                                    key={index}
                                    {...option.menuItemProps}
                                    {...(option.href && { sx: { p: 0 } })}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <MenuItemWrapper option={option}>
                                        {option.icon ? option.icon : null}
                                        {option.text}
                                    </MenuItemWrapper>
                                </MenuItem>
                            )
                        }
                    }
                })}
            </Menu>
        </React.Fragment>
    )
}
