/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, CardContent, Chip, CircularProgress, IconButton, Stack, Tooltip, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useParams } from "react-router-dom";
import TypographyComponent from "../../../components/custom-typography";
import { actionUploadDocumentCategoriesList, resetUploadDocumentCategoriesListResponse, actionDeleteUploadDocumentCategories, resetDeleteUploadDocumentCategoriesResponse, actionUploadDocumentCategoriesArchive, resetUploadDocumentCategoriesArchiveResponse } from "../../../store/documents";
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
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";

export default function CategoriesDetails() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const { documentCategoryUuid, uuid } = useParams()

    //Stores
    const { uploadDocumentCategoriesList, deleteUploadDocumentCategories, uploadDocumentCategoriesArchive } = useSelector(state => state.documentStore)

    // state
    const [uploadDocumentDetails, setUploadDocumentDetails] = useState(null)
    const [openUploadFilePopup, setOpenUploadFilePopup] = useState(false)
    const [openDeleteDocumentPopup, setOpenDeleteDocumentPopup] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [currentUploadDocumentData, setCurrentUploadDocumentData] = useState(null)

    // initial render
    useEffect(() => {
        if (documentCategoryUuid && documentCategoryUuid !== null && uuid && uuid !== null) {
            dispatch(actionUploadDocumentCategoriesList({
                document_category_uuid: documentCategoryUuid,
                document_group_uuid: uuid,
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

    /**
        * useEffect
        * @dependency : deleteUploadDocumentCategories
        * @type : HANDLE API RESULT
        * @description : Handle the result of delete Upload Document Categories API
        */
    useEffect(() => {
        if (deleteUploadDocumentCategories && deleteUploadDocumentCategories !== null) {
            dispatch(resetDeleteUploadDocumentCategoriesResponse())
            if (deleteUploadDocumentCategories?.result === true) {
                setOpenDeleteDocumentPopup(false)
                setLoadingDelete(false)
                showSnackbar({ message: deleteUploadDocumentCategories?.message, severity: "success" })
                dispatch(actionUploadDocumentCategoriesList({
                    document_category_uuid: documentCategoryUuid,
                    document_group_uuid: uuid,
                    branch_uuid: branch?.currentBranch?.uuid
                }))
                if (currentUploadDocumentData?.uuid || currentUploadDocumentData?.uuid === '' || currentUploadDocumentData?.uuid === null) {
                    navigate(`/documents/view/${uuid}`)
                }
            } else {
                setLoadingDelete(false)
                switch (deleteUploadDocumentCategories?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteUploadDocumentCategoriesResponse())
                        showSnackbar({ message: deleteUploadDocumentCategories?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: deleteUploadDocumentCategories?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteUploadDocumentCategories])

    /**
        * useEffect
        * @dependency : uploadDocumentCategoriesArchive
        * @type : HANDLE API RESULT
        * @description : Handle the result of upload Document Categories Archive API
        */
    useEffect(() => {
        if (uploadDocumentCategoriesArchive && uploadDocumentCategoriesArchive !== null) {
            dispatch(resetUploadDocumentCategoriesArchiveResponse())
            if (uploadDocumentCategoriesArchive?.result === true) {
                setOpenDeleteDocumentPopup(false)
                setLoadingDelete(false)
                showSnackbar({ message: uploadDocumentCategoriesArchive?.message, severity: "success" })
                dispatch(actionUploadDocumentCategoriesList({
                    document_category_uuid: documentCategoryUuid,
                    document_group_uuid: uuid,
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            } else {
                setLoadingDelete(false)
                switch (uploadDocumentCategoriesArchive?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetUploadDocumentCategoriesArchiveResponse())
                        showSnackbar({ message: uploadDocumentCategoriesArchive?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: uploadDocumentCategoriesArchive?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [uploadDocumentCategoriesArchive])

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
            headerName: 'File Name',
            renderCell: (params) => {
                const fileName = params?.row?.file_name || "";
                const ext = fileName.split('.').pop().toLowerCase();

                let iconPath = "/asset/pdf-file.png"; // default

                if (ext === "jpg" || ext === "jpeg" || ext === "png") {
                    iconPath = "/assets/jpg-file.png";
                } else if (ext === "pdf") {
                    iconPath = "/assets/pdf-file.png";
                }

                return (
                    <Stack direction="row" spacing={1} alignItems="center" my={2}>
                        <img
                            src={iconPath}
                            alt="file icon"
                            style={{ width: 24, height: 24 }}
                        />
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ my: 'auto' }}>{fileName}</TypographyComponent>
                    </Stack>
                );
            }
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
                                {/* open documents details */}
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
                            {/* download documents */}
                            <IconButton
                                variant="outlined"
                                sx={{ border: `1px solid ${theme.palette.primary[700]}`, borderRadius: '8px' }}
                                onClick={() => handleDownload(params?.row?.file_url)}
                            >
                                <DownloadIcon stroke={'#6941C6'} />
                            </IconButton>
                        </Tooltip>
                        {
                            uploadDocumentDetails?.short_name !== 'Archive' &&
                            <Tooltip title="Archive File" followCursor placement="top">
                                {/* archive Documents */}
                                <IconButton
                                    variant="outlined"
                                    sx={{ border: `1px solid ${theme.palette.primary[700]}`, borderRadius: '8px' }}
                                    onClick={() => {
                                        let details = {
                                            uuid: params?.row?.uuid,
                                            title: `Archive Document`,
                                            text: `Are you sure you want to archive this document? This action cannot be undone.`,
                                            type: 'Archive'
                                        }
                                        setCurrentUploadDocumentData(details)
                                        setOpenDeleteDocumentPopup(true)

                                    }}
                                >
                                    <ArchiveIcon stroke={'#6941C6'} />
                                </IconButton>
                            </Tooltip>
                        }
                        <Tooltip title="Delete File" followCursor placement="top">
                            {/* delete Documents */}
                            <IconButton
                                variant="outlined"
                                sx={{ border: `1px solid ${theme.palette.error[600]}`, borderRadius: '8px' }}
                                onClick={() => {
                                    let details = {
                                        uuid: params?.row?.uuid,
                                        title: `Delete Document`,
                                        text: `Are you sure you want to delete this document? This action cannot be undone.`,
                                        type: 'Delete'
                                    }
                                    setCurrentUploadDocumentData(details)
                                    setOpenDeleteDocumentPopup(true)
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
                    border: `1px solid ${resolveThemeColor(uploadDocumentDetails?.border_color, theme)}`,
                    backgroundColor: resolveThemeColor(uploadDocumentDetails?.background_color, theme),
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
                                    backgroundColor: resolveThemeColor(uploadDocumentDetails?.icon_background, theme),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img alt={""} src={uploadDocumentDetails?.image_url} />
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
                handleClose={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionUploadDocumentCategoriesList({
                            document_category_uuid: documentCategoryUuid,
                            document_group_uuid: uuid,
                            branch_uuid: branch?.currentBranch?.uuid
                        }))
                    }
                    setOpenUploadFilePopup(false)
                }}
            />
            {
                openDeleteDocumentPopup &&
                <AlertPopup
                    open={openDeleteDocumentPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={currentUploadDocumentData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenDeleteDocumentPopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={loadingDelete} onClick={() => {
                            setLoadingDelete(true)
                            if (currentUploadDocumentData?.uuid && currentUploadDocumentData?.uuid !== null && currentUploadDocumentData?.type === 'Delete') {
                                dispatch(actionDeleteUploadDocumentCategories({
                                    uuid: currentUploadDocumentData?.uuid
                                }))
                            } else if (currentUploadDocumentData?.uuid && currentUploadDocumentData?.uuid !== null && currentUploadDocumentData?.type === 'Archive') {
                                dispatch(actionUploadDocumentCategoriesArchive({ uuid: currentUploadDocumentData?.uuid }))
                            }
                        }}>
                            {loadingDelete ? <CircularProgress size={20} color="white" /> : currentUploadDocumentData?.type}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment>
    )
}