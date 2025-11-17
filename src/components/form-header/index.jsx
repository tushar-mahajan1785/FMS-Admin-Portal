// src/components/FormHeader.jsx
import { Box, Stack, Divider, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TwoColorIconCircle from "../../components/two-layer-icon";
import TypographyComponent from "../custom-typography";
import React from "react";
import CustomChip from "../custom-chip";

export default function FormHeader({
  excelIcon,
  icon,
  color,
  title,
  subtitle,
  actions = [],
  size = 40,
  message,
  centerSection,
  rightSection,
  currentStatus,
  need_responsive = 0
}) {
  const theme = useTheme();

  const getCurrentStatus = (status) => {
    let color = 'primary'
    switch (status) {
      case 'Open':
        color = 'primary'//'#6941C6'
        break
      case 'Re Open':
        color = 'info'//'#039BE5'
        break
      case 'Closed':
      case 'Good Stock':
        color = 'success'//'#039855'
        break
      case 'On Hold':
      case 'Low Stock':
        color = 'warning'//#FEC84B'
        break
      case 'Rejected':
      case 'Out Of Stock':
        color = 'error'//'#D32F2F'
        break
      case 'Overdue':
        color = 'warning'//'#F79009'
        break
      default:
        color = 'primary'
    }
    return (
      <React.Fragment><CustomChip text={status} colorName={color} /></React.Fragment>
    )
  }

  return (
    <Stack
      sx={{
        backgroundColor: "white",
        p: 2,
        rowGap: 1,
        flexDirection: need_responsive == 0 ? 'row' : { sm: 'column', md: 'row' },
        alignItems: need_responsive == 0 ? "center" : '',
        justifyContent: "space-between",
      }}
    >
      {/* Left side */}
      <Stack direction="row" spacing={2} alignItems="center">
        <TwoColorIconCircle IconComponent={icon} color={color} size={size} />

        <Box>
          <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
            <TypographyComponent fontSize={18} fontWeight={600} color={theme.palette.grey[900]} sx={{ gap: 1 }}>
              {title}
            </TypographyComponent>
            {currentStatus && currentStatus !== null ?
              getCurrentStatus(currentStatus)
              : ''}
          </Stack>


          {subtitle && (
            <TypographyComponent fontSize={14} fontWeight={400} color={theme.palette.grey[900]}>
              {subtitle}
            </TypographyComponent>
          )}

          {message && message !== null && (
            <Box
              sx={{
                backgroundColor: theme.palette.primary[50],
                borderRadius: '16px',
                padding: '4px 12px',
                marginY: '2px',
                paddingY: '2px',
                display: 'inline-flex',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <InfoOutlinedIcon fontSize="16" sx={{ color: theme.palette.primary[600] }} />
                {/* The text label */}
                <TypographyComponent variant="body2" sx={{ color: theme.palette.primary[600], fontWeight: 'medium' }}>
                  {message}
                </TypographyComponent>
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>
      {centerSection && centerSection !== null ? centerSection : <></>}
      {/* Right side actions */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {rightSection && rightSection !== null ?
          rightSection
          :
          <></>
        }
        {excelIcon}
        {actions.map((action, index) => (
          <Box key={index} display="flex" alignItems="center">
            {index > 0 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, borderColor: "grey.300" }}
              />
            )}
            {action}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
