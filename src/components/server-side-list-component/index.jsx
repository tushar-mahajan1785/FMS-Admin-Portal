// src/App.tsx
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ServerSideListComponents({
  columns,
  rows,
  total,
  page,
  onPageChange,
  pageSize,
  isCheckbox,
  onChange,
  height = 580,
  borderRadius = "1px",
  onRowClick,
}) {
  const theme = useTheme();
  const totalPages = Math.ceil(total / pageSize);

  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ height: height, width: "100%", overflowX: "auto" }}>
        <DataGrid
          sx={{
            backgroundColor: "white",
            overflowX: "auto",
            border: "none",
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: borderRadius,
            minWidth: "max-content",
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
          rows={rows}
          columns={columns}
          disableExtendedRowFullWidth={false}
          checkboxSelection={isCheckbox === true ? true : false}
          disableRowSelectionOnClick
          paginationMode="server"
          rowCount={total}
          onRowClick={onRowClick}
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        px={2}
      >
        <Button
          sx={{
            borderColor: theme.palette.grey[300],
            color: theme.palette.grey[700],
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "capitalize",
          }}
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
                onClick={() => onPageChange(Number(p))}
                // sx={{ mx: 0.5 }}

                sx={(theme) => ({
                  height: 40,
                  minWidth: 40,
                  aspectRatio: 1,
                  color: theme.palette.grey[600],
                  mx: 0.5,
                  backgroundColor:
                    p === page ? theme.palette.primary[100] : "transparent",
                })}
              >
                {p}
              </Button>
            )
          )}
        </Box>

        <Button
          sx={{
            borderColor: theme.palette.grey[300],
            color: theme.palette.grey[700],
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "capitalize",
          }}
          variant="outlined"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
