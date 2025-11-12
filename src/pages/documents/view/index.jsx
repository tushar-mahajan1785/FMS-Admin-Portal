import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, IconButton, Stack, useTheme } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
import TypographyComponent from "../../../components/custom-typography";
import DocumentGroupIcon from "../../../assets/icons/DocumentGroupIcon";
import EyeIcon from "../../../assets/icons/EyeIcon";
import UploadIcon from "../../../assets/icons/UploadIcon";

export default function ViewDocument() {
    const navigate = useNavigate()
    const theme = useTheme()
    const documentDetails = {
        group_name: 'HVAC Units',
        assets: ['HVAC-001', 'HVAC-002', 'HVAC-003', 'HVAC-004'],
        no_of_assets: '4 Assets',
        document_categories: [
            {
                id: 1,
                title: "Emergency Operating Procedures",
                shortName: "EOP",
                description: "Critical emergency procedures and protocols",
                total_document: 3,
                updated_on: "03 Nov 2025",
                background_color: theme.palette.error[50],
                border_color: theme.palette.error[600],
                icon_background: theme.palette.common.white,
                icon_color: theme.palette.error[600],
                image_url: '/assets/person.png'
            },
            {
                id: 2,
                title: "Standard Operating Procedures",
                shortName: "SOP",
                description: "Day-to-day operational procedures and guidelines",
                total_document: 5,
                updated_on: "03 Nov 2025",
                background_color: theme.palette.primary[50],
                border_color: theme.palette.primary[600],
                icon_background: theme.palette.common.white,
                icon_color: theme.palette.primary[600],
                image_url: '/assets/person.png'
            },
            {
                id: 3,
                title: "Safety Documents",
                shortName: "Safety",
                description: "Safety protocols, MSDS, and compliance documents",
                total_document: 3,
                updated_on: "03 Nov 2025",
                background_color: theme.palette.success[50],
                border_color: theme.palette.success[600],
                icon_background: theme.palette.common.white,
                icon_color: theme.palette.success[600],
                image_url: '/assets/person.png'
            },
            {
                id: 4,
                title: "Vendor Policies",
                shortName: "Vendor",
                description: "Vendor agreements, warranties, and policies",
                total_document: 3,
                updated_on: "03 Nov 2025",
                background_color: theme.palette.warning[50],
                border_color: theme.palette.warning[600],
                icon_background: theme.palette.common.white,
                icon_color: theme.palette.warning[600],
                image_url: '/assets/person.png'
            },
            {
                id: 5,
                title: "Miscellaneous Files",
                shortName: "Archive",
                description: "Archived and historical documents",
                total_document: 0,
                updated_on: "03 Nov 2025",
                background_color: theme.palette.grey[50],
                border_color: theme.palette.grey[600],
                icon_background: theme.palette.common.white,
                icon_color: theme.palette.grey[600],
                image_url: '/assets/person.png'
            },
            {
                id: 6,
                title: "Archive Files",
                shortName: "Archive",
                description: "Archived and historical documents",
                total_document: 0,
                updated_on: "03 Nov 2025",
                background_color: theme.palette.grey[50],
                border_color: theme.palette.grey[600],
                icon_background: theme.palette.common.white,
                icon_color: theme.palette.grey[600],
                image_url: '/assets/person.png'
            },
        ]
    }

    return (
        <React.Fragment>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                <Stack>
                    <IconButton
                        onClick={() => {
                            navigate('/documents')
                        }}
                    >
                        <ArrowBackIosIcon fontSize={'small'} />
                    </IconButton>
                </Stack>
                <Stack>
                    <TypographyComponent fontSize={16} fontWeight={400}>Back to Documents</TypographyComponent>
                </Stack>
            </Stack>
            <Card sx={{ borderRadius: '16px', padding: '8px', gap: '6px', border: `1px solid ${theme.palette.primary[400]}`, mt: 4 }}>
                <CardContent>
                    <Stack flexDirection={'row'} columnGap={2}>
                        <Box
                            sx={{
                                borderRadius: '8px',
                                gap: '10px',
                                height: '72px',
                                width: '72px',
                                backgroundColor: theme.palette.primary[200],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <DocumentGroupIcon stroke={theme.palette.primary[700]} />
                        </Box>
                        <Stack flexDirection={'column'} rowGap={1} my={'auto'}>
                            <Stack flexDirection={'row'} columnGap={2}>
                                <TypographyComponent fontSize={16} fontWeight={500}>
                                    {documentDetails?.group_name}
                                </TypographyComponent>
                                <Chip
                                    label={documentDetails?.no_of_assets}
                                    size="small"
                                    sx={{ background_color: theme.palette.primary[50], color: theme.palette.primary[600], fontWeight: 500, px: '4px', py: '8px', borderRadius: 0 }}
                                />
                            </Stack>
                            <Stack flexDirection={'row'} columnGap={1}>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                    Assets in this group:
                                </TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={500}>
                                    {documentDetails?.assets?.map(item => item).join(', ')}
                                </TypographyComponent>
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
            <Stack my={2}>
                <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>Document Categories</TypographyComponent>
            </Stack>
            <Grid container spacing={2}>
                {documentDetails?.document_categories.map((cat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }} key={cat.id}>
                        <Card
                            sx={{
                                p: 3,
                                height: "100%",
                                width: '100%',
                                borderRadius: "16px",
                                border: `1px solid ${cat.border_color}`,
                                backgroundColor: cat.background_color,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        height: 64,
                                        width: 64,
                                        borderRadius: "8px",
                                        backgroundColor: cat.icon_background,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Avatar alt={""} src={cat.image_url} />
                                </Box>
                                <Box>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {cat.title}
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                        {cat.shortName}
                                    </TypographyComponent>
                                </Box>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                    {cat.description}
                                </TypographyComponent>
                                <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }} mb={1}>
                                    Total Documents:
                                    <Box component="span" sx={{ color: cat.icon_color, border: `1px solid ${cat.icon_color}`, px: 2, borderRadius: '4px', ml: 1 }}>
                                        {cat.total_document} Files
                                    </Box>
                                </TypographyComponent>
                                <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                    Updated on: {cat.updated_on}
                                </TypographyComponent>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" spacing={1.5}>
                                <Button
                                    variant="outlined"
                                    startIcon={<EyeIcon size={16} stroke={cat.icon_color} />}
                                    sx={{
                                        textTransform: "none",
                                        color: cat.icon_color,
                                        border: `1px solid ${cat.icon_color}`
                                    }}
                                >
                                    View All
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<UploadIcon size={16} />}
                                    sx={{
                                        textTransform: "none",
                                        border: `1px solid ${theme.palette.grey[900]}`,
                                        color: theme.palette.grey[900],
                                        background: theme.palette.common.white
                                    }}
                                >
                                    Upload File
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    )
}