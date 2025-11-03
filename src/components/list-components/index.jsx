// src/App.tsx
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, useTheme } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function ListComponents({ columns, rows, isCheckbox, onChange, height = 580, hasPagination = true }) {
    const theme = useTheme()
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const totalPages = Math.ceil(rows.length / pageSize);

    // Paginated rows
    const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    // Create pagination range with ellipsis
    const getPaginationRange = () => {
        const delta = 2; // how many pages to show around current
        const range = [];
        const left = Math.max(2, page - delta);
        const right = Math.min(totalPages - 1, page + delta);

        range.push(1);
        if (left > 2) range.push("…");

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < totalPages - 1) range.push("…");
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ height: height, width: '100%', overflowX: 'auto' }}>
                <DataGrid
                    sx={{
                        backgroundColor: "white",
                        overflowX: 'auto',
                        border: 'none',
                        borderBottom: ` 1px solid ${theme.palette.grey[300]}`,
                        borderRadius: '1px',
                        minWidth: 'max-content',
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "auto !important", // enable horizontal scroll
                        },
                        // header container
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.grey[50],
                        },

                        // every header cell
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: theme.palette.grey[50],
                            fontWeight: "bold",
                        },

                        // header text
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "bold",
                        },
                    }}
                    rows={paginatedRows}
                    columns={columns}
                    disableExtendedRowFullWidth={false}
                    checkboxSelection={isCheckbox === true ? true : false}
                    disableRowSelectionOnClick
                    hideFooter
                    disableColumnMenu
                    onRowSelectionModelChange={(newSelection) => {
                        if (onChange) {
                            if (newSelection?.type === "exclude") {
                                // Header checkbox selected → return ALL rows
                                onChange(rows.map((row) => row.id));
                            } else {
                                // Normal row selection
                                onChange(Array.from(newSelection.ids));
                            }
                        }
                    }}
                />
            </Box>
            {/* Custom Pagination */}
            {
                hasPagination === true ?
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
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
                    :
                    <></>
            }
        </Box>
    );
}
