import { useState } from 'react';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
// 🚨 NEW ICON IMPORTS
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import UserDetails from '../../pages/user/details';
import EyeIcon from '../../assets/icons/EyeIcon';

// --- CONFIGURATION ---
const INDENT_SPACE = 4;

// Helper function to get initials from a full name
const getInitials = (fullName, length = 2) => {
    if (!fullName) return '';
    const parts = fullName.split(' ').filter(p => p.length > 0);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts.map(part => part.charAt(0)).join('').toUpperCase().substring(0, length);
};


// --- Inner Component Logic (Rendering a Single Team Member Item) ---
// Added new props: hasChildren and isExpanded
const TreeItemContent = ({ data, onClick, theme, hasChildren, isExpanded }) => {

    const initials = getInitials(data?.full_name);

    const [openUserViewPopup, setOpenUserViewPopup] = useState(false)
    const [userDetailData, setUserDetailData] = useState(null)


    return (
        <>
            <Stack
                sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    cursor: hasChildren ? 'pointer' : 'default', // Cursor change based on expandability
                    justifyContent: 'space-between',
                    padding: '12px 8px',
                    width: '100%',
                    backgroundColor: 'transparent',
                    borderRadius: 0,
                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    marginBottom: 0,
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: hasChildren ? theme.palette.action.hover : 'transparent',
                    },
                }}
                onClick={onClick}
            >
                <Stack flexDirection={'row'} columnGap={1} alignItems={'center'}>
                    {/* 🚨 EXPANSION ICON 🚨 */}
                    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>

                        {hasChildren ? (
                            isExpanded ?
                                <KeyboardArrowDown sx={{ color: theme.palette.common.black, fontSize: 24 }} /> :
                                <KeyboardArrowRight sx={{ color: theme.palette.common.black, fontSize: 24 }} />
                        ) : (
                            // Optional: Render a small dot or empty space for alignment if no team
                            <Box sx={{ width: 20 }} />
                        )}
                    </Box>

                    {/* Profile Circle with Initials/Avatar Logic */}
                    <Box
                        sx={{
                            height: 37,
                            width: 37,
                            borderRadius: '50%',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 400,
                            backgroundColor: theme.palette.primary[600], // Updated to use main primary color as in the screenshot
                            color: theme.palette.common.white, // White text for initials
                        }}
                    >
                        {data?.image_url ?
                            <img
                                src={data.image_url}
                                alt={data.full_name}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            :
                            initials
                        }
                    </Box>

                    {/* Name and Role Group */}
                    <Stack>
                        <Typography fontWeight={500} fontSize={15} sx={{ color: theme.palette.common.black }}>
                            {data?.full_name}
                        </Typography>
                        <Typography fontWeight={400} fontSize={12} sx={{ color: theme.palette.grey[600] }}>
                            {data?.role_name}
                        </Typography>
                    </Stack>

                </Stack>
                <Stack>
                    <Tooltip title="View" followCursor placement="top">
                        <IconButton
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation();
                                //Open User Details Popup
                                setUserDetailData(data)
                                setOpenUserViewPopup(true)
                            }}
                        >
                            <EyeIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
            {
                openUserViewPopup &&
                <UserDetails
                    screen="my-profile"
                    open={openUserViewPopup}
                    objData={userDetailData}
                    toggle={() => {
                        setOpenUserViewPopup(false)
                        setUserDetailData(null)

                    }}
                />
            }
        </>
    );
};

// --- Outer Component Logic (Handles Recursion and State) ---

/**
 * Renders a complete team hierarchy list.
 * @param {Array} dataArray - The array of team member objects, including nested 'team'.
 * @param {number} depth - Internal parameter to track the level of recursion (default 0).
 */
export default function TeamHierarchyList({ dataArray, depth = 0 }) {

    const theme = useTheme();

    // --- INITIAL STATE UTILITY FUNCTION ---
    /**
     * Generates the initial expanded state object for all top-level nodes that have team.
     * @param {Array} dataArray - The array of top-level team member objects.
     * @returns {Object} An object where keys are node IDs and values are 'true'.
     */
    const getInitialExpandedState = (dataArray) => {
        return dataArray.reduce((acc, node) => {
            // Only expand a node if it has team
            if (node.team && node.team.length > 0) {
                acc[node.id] = true;
            }
            return acc;
        }, {});
    };


    const [expandedIds, setExpandedIds] = useState(() => {
        if (depth === 0) {
            // Only calculate and apply default expansion for the top-most level
            return getInitialExpandedState(dataArray);
        }
        return {}; // Lower levels start collapsed by default
    });

    const handleToggle = (id) => {
        setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!dataArray || dataArray.length === 0) {
        return null;
    }

    return (
        <>
            <Stack sx={{
                paddingLeft: INDENT_SPACE,
                overflowX: 'auto',
                width: '100%'
            }}>
                {dataArray?.map((node) => {
                    const hasChildren = node.team && node.team.length > 0;
                    const isExpanded = expandedIds[node.id];
                    console.log('------node-----', node)
                    return (
                        <Box key={node.id}>
                            {/* 1. Render the item's content, passing the state props */}
                            <TreeItemContent
                                data={node}
                                theme={theme}
                                hasChildren={hasChildren} // New prop
                                isExpanded={isExpanded}   // New prop
                                // The onClick handler is now only active if team exist
                                onClick={() => hasChildren && handleToggle(node.id)}
                            />

                            {/* 2. Recursive Rendering of Children */}
                            {hasChildren && isExpanded && (
                                <TeamHierarchyList
                                    dataArray={node.team}
                                    depth={depth + 1}
                                />
                            )}
                        </Box>
                    );
                })}
            </Stack>
        </>
    );
}