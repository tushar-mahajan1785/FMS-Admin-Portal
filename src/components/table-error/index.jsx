import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import TypographyComponent from '../custom-typography';

// --- Custom Styled Components for consistent styling ---

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(2, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRight: 'none',
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5, 2),
    borderRight: 'none',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:last-child td, &:last-child th': {
        borderBottom: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

// --- Reusable Table Component ---

/**
 * A reusable table component that supports horizontal and vertical scrolling,
 * and is styled to match the provided design.
 * @param {object[]} data - The array of data objects to display.
 * @param {string[]} headers - The array of header names to display in the table head.
 * @param {number} [maxHeight=400] - The maximum height of the table container for vertical scrolling.
 */
export default function TableError({ data, headers, maxHeight = 400 }) {
    const theme = useTheme()
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <TypographyComponent sx={{ p: 2, color: 'text.secondary' }}>No data to display.</TypographyComponent>;
    }

    // Get the keys from the first data object to use for mapping cell values
    const dataKeys = Object.keys(data[0]);

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: maxHeight,
                overflowY: 'auto',
                overflowX: 'auto',
                maxWidth: '100%',
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Table sx={{ minWidth: 450 }} aria-label="custom table" stickyHeader>
                <TableHead>
                    <TableRow>
                        {headers.map((header, index) => (
                            <StyledTableHeaderCell key={index}>{header}</StyledTableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <StyledTableRow key={rowIndex}>
                            {dataKeys.map((key, cellIndex) => (
                                <StyledTableBodyCell key={cellIndex}>
                                    {/* Special handling for 'issues' array to render as a list */}
                                    {Array.isArray(row[key]) ? (
                                        <Box component="ul" sx={{ margin: 0, paddingLeft: 2, listStyleType: 'disc' }}>
                                            {row[key].map((item, itemIndex) => (
                                                <li key={itemIndex}>
                                                    <TypographyComponent variant="caption" sx={{ color: theme.palette.error[500] }}>
                                                        {item}
                                                    </TypographyComponent>
                                                </li>
                                            ))}
                                        </Box>
                                    ) : (
                                        <TypographyComponent variant="body2">{row[key]}</TypographyComponent>
                                    )}
                                </StyledTableBodyCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}