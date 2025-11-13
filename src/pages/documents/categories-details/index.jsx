/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, CardContent, Chip, IconButton, Stack, Tooltip, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useParams } from "react-router-dom";
import TypographyComponent from "../../../components/custom-typography";
import { actionUploadDocumentCategoriesList, resetUploadDocumentCategoriesListResponse } from "../../../store/documents";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useBranch } from "../../../hooks/useBranch";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import UploadFilePopup from "../upload-file-popup";
import EmptyContent from "../../../components/empty_content";
import ListComponents from "../../../components/list-components";
import DownloadIcon from "../../../assets/icons/DownloadIcon";
import ArchiveIcon from "../../../assets/icons/ArchiveIcon";
import EyeIcon from "../../../assets/icons/EyeIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import ColoredSvgIcon from "../../../components/colored-svg-icon";

export default function CategoriesDetails() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const { uuid } = useParams()

    //Stores
    const { uploadDocumentCategoriesList } = useSelector(state => state.documentStore)

    // state
    const [uploadDocumentDetails, setUploadDocumentDetails] = useState({
        "id": 1,
        "document_category_uuid": "g3byyjmesdnc6aRw36Ijy8bNUBRcCEAxPX74",
        "document_group_uuid": "cBTVlicJ1pUEBro8G0DBdIG4FwBJ0x0gNiMi",
        "title": "Emergency Operating Procedures",
        "background_color": "theme.palette.error[50]",
        "border_color": "theme.palette.error[600]",
        "icon_background": "theme.palette.common.white",
        "icon_color": "theme.palette.error[600]",
        "image_url": "https://fms-super-admin.interdev.in/fms/icon/1/1_1763033726124.svg",
        "assets": ["Frezzer Cooling"],
        "asset_type": "Cooling",
        "short_name": "EOP",
        "document_list":
            [
                {
                    "id": 1,
                    "file_name": "1_1763012215109.png",
                    "version": "VERSION-SERIES",
                    "uploaded_by": "UPLOADED-USER-NAME",
                    "upload_date": "1 NOV 2025",
                    "file_size": "2.4 MB",
                    "notes": "NOTES-ADDED",
                    "file_url": "https://fms-super-admin.interdev.in/fms/icon/1/1_1763012215109.png"
                }
            ]
    })
    const [openUploadFilePopup, setOpenUploadFilePopup] = useState(false)

    // initial render
    useEffect(() => {
        if (uuid && uuid !== null) {
            dispatch(actionUploadDocumentCategoriesList({
                document_category_uuid: uuid,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
    }, [branch?.currentBranch])

    /**
     * useEffect
     * @dependency : uploadDocumentCategoriesList
     * @type : HANDLE API RESULT
     * @description : Handle the result of document Categories Details API
     */
    useEffect(() => {
        if (uploadDocumentCategoriesList && uploadDocumentCategoriesList !== null) {
            dispatch(resetUploadDocumentCategoriesListResponse())
            if (uploadDocumentCategoriesList?.result === true) {
                setUploadDocumentDetails(uploadDocumentCategoriesList?.response)
            } else {
                setUploadDocumentDetails(null)
                switch (uploadDocumentCategoriesList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetUploadDocumentCategoriesListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: uploadDocumentCategoriesList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [uploadDocumentCategoriesList])

    const handleDownload = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = url.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
    };

    // list columns
    const columns = [
        {
            flex: 0.02,
            field: 'file_name',
            headerName: 'File Name'
        },
        {
            flex: 0.02,
            field: 'version',
            headerName: 'Version'
        },
        {
            flex: 0.02,
            field: 'uploaded_by',
            headerName: 'Uploaded By'
        },
        {
            flex: 0.02,
            field: 'upload_date',
            headerName: 'Upload Date'
        },
        {
            flex: 0.01,
            field: 'file_size',
            headerName: 'File Size'
        },
        {
            flex: 0.03,
            field: 'notes',
            headerName: 'Notes'
        },
        {
            flex: 0.04,
            sortable: false,
            field: "",
            headerName: "",
            renderCell: (params) => {
                return (
                    <Stack sx={{ flexDirection: 'row', alignItems: "center", height: '100%', columnGap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", height: '100%' }}>
                            <Tooltip title="View File" followCursor placement="top">
                                {/* open ticket details */}
                                <Button
                                    variant="outlined"
                                    startIcon={<EyeIcon stroke={'#6941C6'} />}
                                    sx={{ border: `1px solid ${theme.palette.primary[700]}`, borderRadius: '8px', color: theme.palette.primary[700] }}
                                    onClick={() => {
                                        window.open(params?.row?.file_url, '_blank')
                                    }}
                                >
                                    View Documents
                                </Button>
                            </Tooltip>
                        </Box>
                        <Tooltip title="Download File" followCursor placement="top">
                            {/* open ticket details */}
                            <IconButton
                                variant="outlined"
                                sx={{ border: `1px solid ${theme.palette.primary[700]}`, borderRadius: '8px' }}
                                onClick={() => handleDownload(params?.row?.file_url)}
                            >
                                <DownloadIcon stroke={'#6941C6'} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Archive File" followCursor placement="top">
                            {/* open ticket details */}
                            <IconButton
                                variant="outlined"
                                sx={{ border: `1px solid ${theme.palette.primary[700]}`, borderRadius: '8px' }}
                                onClick={() => {

                                }}
                            >
                                <ArchiveIcon stroke={'#6941C6'} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete File" followCursor placement="top">
                            {/* open ticket details */}
                            <IconButton
                                variant="outlined"
                                sx={{ border: `1px solid ${theme.palette.error[600]}`, borderRadius: '8px' }}
                                onClick={() => {

                                }}
                            >
                                <DeleteIcon stroke={'#D92D20'} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                );
            },
        }
    ];

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
                            navigate(`/documents/view/${uploadDocumentDetails?.document_group_uuid}`)
                        }}
                    >
                        <ArrowBackIosIcon fontSize={'small'} />
                    </IconButton>
                </Stack>
                <Stack>
                    <TypographyComponent fontSize={16} fontWeight={400}>Back to Document Category</TypographyComponent>
                </Stack>
            </Stack>
            <Card
                sx={{
                    borderRadius: '16px',
                    padding: '8px',
                    gap: '6px',
                    border: `1px solid ${resolveThemeColor(uploadDocumentDetails.border_color, theme)}`,
                    backgroundColor: resolveThemeColor(uploadDocumentDetails.background_color, theme),
                    mt: 4
                }}>
                <CardContent>
                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                        <Stack flexDirection={'row'} columnGap={2}>
                            <Box
                                sx={{
                                    height: 64,
                                    width: 64,
                                    borderRadius: "8px",
                                    backgroundColor: resolveThemeColor(uploadDocumentDetails.icon_background, theme),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ColoredSvgIcon
                                    svgUrl={uploadDocumentDetails.image_url}
                                    fillColor={resolveThemeColor(uploadDocumentDetails.icon_color, theme)}
                                />
                            </Box>
                            <Stack flexDirection={'column'} rowGap={1} my={'auto'}>
                                <Stack flexDirection={'row'} columnGap={2}>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {uploadDocumentDetails?.title}
                                    </TypographyComponent>
                                </Stack>
                                <Stack flexDirection={'row'} columnGap={1}>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                        Assets in this group:
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={500}>
                                        {uploadDocumentDetails?.assets && uploadDocumentDetails?.assets?.length > 0 && uploadDocumentDetails?.assets?.map(item => item).join(', ')}
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                        Asset Type:
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={500}>
                                        {uploadDocumentDetails?.asset_type}
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                                        Document Type:
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={500}>
                                        {uploadDocumentDetails?.short_name}
                                    </TypographyComponent>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Button
                            startIcon={<DownloadIcon stroke={theme.palette.common.white} />}
                            sx={{
                                textTransform: "capitalize",
                                px: 6,
                                borderRadius: '8px',
                                backgroundColor: theme.palette.primary[600],
                                color: theme.palette.common.white,
                                fontSize: 16,
                                fontWeight: 600,
                                borderColor: theme.palette.primary[600]
                            }}
                            onClick={() => {
                                setOpenUploadFilePopup(true)
                            }}
                            variant="contained"
                        >
                            Upload New File
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
            <Stack my={2}>
                <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>Document Versions ({uploadDocumentDetails?.document_list && uploadDocumentDetails?.document_list !== null && uploadDocumentDetails?.document_list?.length > 0 ? String(uploadDocumentDetails?.document_list?.length).padStart(2, '0') : 0})</TypographyComponent>
            </Stack>
            <Card sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.grey[300]}`, width: '100%' }}>
                <CardContent>
                    {uploadDocumentDetails?.document_list && uploadDocumentDetails?.document_list !== null && uploadDocumentDetails?.document_list.length > 0 ? (
                        <ListComponents
                            rows={uploadDocumentDetails?.document_list}
                            columns={columns}
                            isCheckbox={false}
                            height={450}
                            onChange={(selectedIds) => {
                                console.log("Selected row IDs in DocumentList:", selectedIds);
                            }}
                        />
                    ) : (
                        <Stack sx={{ height: 310 }}>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Document List Found'} subTitle={''} />
                        </Stack>
                    )}
                </CardContent>
            </Card>
            <UploadFilePopup
                open={openUploadFilePopup}
                objData={uploadDocumentDetails}
                handleClose={() => {
                    setOpenUploadFilePopup(false)
                }}
            />
        </React.Fragment>
    )
}