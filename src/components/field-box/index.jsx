import { Box, Stack, useTheme, Link } from "@mui/material";
import TypographyComponent from "../custom-typography";
import _ from "lodash";
import { useState } from "react";
import { ShowMorePopup } from "../show-more-popup";

function buildHref(value, type) {
  if (!value) return "";
  switch (type) {
    case "phone":
      return `tel:${value}`;
    case "email":
      return `mailto:${value}`;
    case "url":
    default:
      return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  }
}

export default function FieldBox({
  label,
  value,
  icon,
  isLink = false,
  linkType = "url", // "url" | "phone" | "email"
  type,
  length
}) {
  const theme = useTheme();
  const href = isLink ? buildHref(value, linkType) : value;

  const [openShowMorePopup, setOpenShowMorePopup] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpenShowMorePopup(true);
  };

  const renderValue = () => {
    if (!value) return "-";

    if (isLink) {
      return (
        <Link
          href={href}
          underline="hover"
          target={linkType === "url" ? "_blank" : undefined}
          rel={linkType === "url" ? "noopener noreferrer" : undefined}
          sx={{
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "1.5",
            color: theme.palette.grey[600],
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {value && value !== null ? value : '-'}
        </Link>
      );
    }

    return (
      <>
        {
          type === 'description' ?
            <TypographyComponent
              title={value}
              fontWeight={500}
              fontSize={16}
              lineHeight="1.5"
              sx={{
                maxWidth: "100%",
                color: theme.palette.grey[600],
              }}
            >
              {value.length > length
                ? `${_.truncate(value, { length: length })} `
                : value}
              {value.length > length && (
                <TypographyComponent
                  component="span"
                  onClick={handleOpen}
                  sx={{
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                    fontWeight: 600,
                    ml: 1,
                    textDecoration: "underline",
                  }}
                >
                  show more
                </TypographyComponent>
              )}
            </TypographyComponent>
            :
            <TypographyComponent
              title={value}
              fontWeight={500}
              fontSize={16}
              lineHeight="1.5"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2, // show only 2 lines
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal', // allow wrapping
                wordBreak: 'break-word',
                maxWidth: '100%',
                color: theme.palette.grey[600],
              }}
            >
              {value && value !== null && value !== 'null' ? value : '-'}
            </TypographyComponent>
        }

        <ShowMorePopup
          open={openShowMorePopup}
          label={label}
          value={value}
          handleClose={() => {
            setOpenShowMorePopup(false)
          }}
        />

      </>

    );
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        height: "100%",
      }}
    >
      <TypographyComponent
        variant="caption"
        fontSize={14}
        fontWeight={400}
        sx={{ color: theme.palette.grey[500] }}
      >
        {label}
      </TypographyComponent>

      {value ? (
        <Stack direction="row" alignItems="center" gap={1}>
          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.primary[600],
              }}
            >
              {icon}
            </Box>
          )}
          {renderValue()}
        </Stack>
      ) : (
        <>-</>
      )}
    </Box>
  );
}