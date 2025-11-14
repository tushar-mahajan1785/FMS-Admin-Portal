/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, IconButton, Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useParams } from "react-router-dom";
import TypographyComponent from "../../../components/custom-typography";
import DocumentGroupIcon from "../../../assets/icons/DocumentGroupIcon";
import EyeIcon from "../../../assets/icons/EyeIcon";
import UploadIcon from "../../../assets/icons/UploadIcon";
import { actionDocumentCategoriesDetails, resetDocumentCategoriesDetailsResponse } from "../../../store/documents";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useBranch } from "../../../hooks/useBranch";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import UploadFilePopup from "../upload-file-popup";

export default function ViewDocument() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const { uuid } = useParams()

    //Stores
    const { documentCategoriesDetails } = useSelector(state => state.documentStore)

    // state
    const [documentDetails, setDocumentDetails] = useState(null)
    const [openUploadFilePopup, setOpenUploadFilePopup] = useState(false)
    const [currentDocumentData, setCurrentDocumentData] = useState(null)

    // initial render
    useEffect(() => {
        if (uuid && uuid !== null) {
            dispatch(actionDocumentCategoriesDetails({
                document_group_uuid: uuid,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
    }, [branch?.currentBranch])

    /**
     * useEffect
     * @dependency : documentCategoriesDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of document Categories Details API
     */
    useEffect(() => {
        if (documentCategoriesDetails && documentCategoriesDetails !== null) {
            dispatch(resetDocumentCategoriesDetailsResponse())
            if (documentCategoriesDetails?.result === true) {
                setDocumentDetails(documentCategoriesDetails?.response)
            } else {
                setDocumentDetails(null)
                switch (documentCategoriesDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDocumentCategoriesDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: documentCategoriesDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [documentCategoriesDetails])

    const resolveThemeColor = (colorString, theme) => {
        if (!colorString) return undefined;

        // Match both theme.palette.grey[50] or theme.palette.primary.main
        const regex = /theme\.palette\.([\w]+)(?:\[(\d+)\]|\.([\w]+))?/;
        const match = colorString.match(regex);

        if (!match) return colorString;

        const [, paletteKey, shade, colorProp] = match;
        const palette = theme.palette[paletteKey];

        if (shade && palette?.[shade]) return palette[shade];
        if (colorProp && palette?.[colorProp]) return palette[colorProp];
        return undefined;
    };

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
                                    {documentDetails?.assets && documentDetails?.assets?.length > 0 && documentDetails?.assets?.map(item => item).join(', ')}
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
                {documentDetails?.document_categories && documentDetails?.document_categories?.length > 0 &&
                    documentDetails?.document_categories.map((cat) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }} key={cat.id}>
                            <Card
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    width: '100%',
                                    borderRadius: "16px",
                                    border: `1px solid ${resolveThemeColor(cat.border_color, theme)}`,
                                    backgroundColor: resolveThemeColor(cat.background_color, theme),
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
                                            backgroundColor: resolveThemeColor(cat.icon_background, theme),
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <img alt={""} src={cat?.image_url} />
                                    </Box>
                                    <Box>
                                        <TypographyComponent fontSize={16} fontWeight={500}>
                                            {cat.title}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                            {cat.short_name}
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
                                        <Box component="span" sx={{ color: resolveThemeColor(cat.icon_color, theme), border: `1px solid ${resolveThemeColor(cat.icon_color, theme)}`, px: 2, borderRadius: '4px', ml: 1 }}>
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
                                        startIcon={<EyeIcon size={16} stroke={resolveThemeColor(cat.icon_color, theme)} />}
                                        sx={{
                                            textTransform: "none",
                                            color: resolveThemeColor(cat.icon_color, theme),
                                            border: `1px solid ${resolveThemeColor(cat.icon_color, theme)}`
                                        }}
                                        onClick={() => {
                                            navigate(`categories-details/${cat?.document_category_uuid}`)
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
                                        onClick={() => {
                                            let objData = Object.assign({}, cat)
                                            objData.document_group_uuid = uuid
                                            setCurrentDocumentData(objData)
                                            setOpenUploadFilePopup(true)
                                        }}
                                    >
                                        Upload File
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            <UploadFilePopup
                open={openUploadFilePopup}
                objData={currentDocumentData}
                handleClose={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionDocumentCategoriesDetails({
                            document_group_uuid: uuid,
                            branch_uuid: branch?.currentBranch?.uuid
                        }))
                    }
                    setOpenUploadFilePopup(false)
                }}
            />
        </React.Fragment>
    )
}