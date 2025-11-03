// src/components/FormHeader.jsx
import { Box, Stack, Divider, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TwoColorIconCircle from "../../components/two-layer-icon";
import TypographyComponent from "../custom-typography";

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
  rightSection
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left side */}
      <Stack direction="row" spacing={2} alignItems="center">
        <TwoColorIconCircle IconComponent={icon} color={color} size={size} />

        <Box>
          <TypographyComponent fontSize={18} fontWeight={600} color={theme.palette.grey[900]}>
            {title}
          </TypographyComponent>

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
    </Box>
  );
}
