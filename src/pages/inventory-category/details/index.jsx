/* eslint-disable react-hooks/exhaustive-deps */
import {
    Drawer,
    Button,
    Stack,
    Divider,
    Grid,
    IconButton,
    CircularProgress,
    useTheme,
    Tooltip,
} from "@mui/material";
import FormHeader from "../../../components/form-header";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../assets/icons/EditIcon";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import FieldBox from "../../../components/field-box";
import ClientsIcon from "../../../assets/icons/ClientsIcon";
import TypographyComponent from "../../../components/custom-typography";
import AddInventory from "../../inventory/add";
import { actionDeleteInventoryCategory, actionGetInventoryCategoryDetails, actionInventoryCategoryList, resetDeleteInventoryCategoryResponse, resetGetInventoryCategoryDetailsResponse } from "../../../store/inventory";
import AddInventoryCategory from "../add";

export default function InventoryCategoryDetails({ open, objData, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()

    //Stores
    const { getInventoryCategoryDetails, deleteInventoryCategory } = useSelector(state => state.inventoryStore)

    //States
    const [openViewDeleteInventoryCategoryPopup, setOpenViewDeleteInventoryCategoryPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [openViewEditInventoryCategoryPopup, setOpenViewEditInventoryCategoryPopup] = useState(false)
    const [viewInventoryCategoryData, setViewInventoryCategoryData] = useState(null)
    const [inventoryCategoryDetailData, setInventoryCategoryDetailData] = useState({
        "id": 1,
        "name": "TATA",
        "description": "TATA Group",
        "status": "Active"
    })
    const [loadingInventoryCategoryDetail, setLoadingInventoryCategoryDetail] = useState(false)

    /**
     * Initial Render
     * @action : actionInventoryCategoryDetails
     * @description : Call client group details api at Initial
     */
    useEffect(() => {
        if (open === true) {
            setViewLoadingDelete(false)
            if (objData && objData !== null) {
                setLoadingInventoryCategoryDetail(true)
                dispatch(actionGetInventoryCategoryDetails({ id: objData?.id }))
            }
        }
    }, [open])

    /**
     * useEffect
     * @dependency : getInventoryCategoryDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of Inventory Category details API
     */
    useEffect(() => {
        if (getInventoryCategoryDetails && getInventoryCategoryDetails !== null) {
            dispatch(resetGetInventoryCategoryDetailsResponse())
            if (getInventoryCategoryDetails?.result === true) {
                setLoadingInventoryCategoryDetail(false)
                setInventoryCategoryDetailData(getInventoryCategoryDetails?.response)
            } else {
                setLoadingInventoryCategoryDetail(false)
                // setInventoryCategoryDetailData(null)
                switch (getInventoryCategoryDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetInventoryCategoryDetailsResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: getInventoryCategoryDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getInventoryCategoryDetails])

    /**
     * useEffect
     * @dependency : deleteInventoryCategory
     * @type : HANDLE API RESULT
     * @description : Handle the result of Inventory Category delete API
     */
    useEffect(() => {
        if (deleteInventoryCategory && deleteInventoryCategory !== null) {
            dispatch(resetDeleteInventoryCategoryResponse())
            if (deleteInventoryCategory?.result === true) {
                setOpenViewDeleteInventoryCategoryPopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: deleteInventoryCategory?.message, severity: "success" })
                dispatch(actionInventoryCategoryList())
                handleClose('delete')
            } else {
                setViewLoadingDelete(false)
                switch (deleteInventoryCategory?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteInventoryCategoryResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteInventoryCategory?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteInventoryCategory])

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: 750 } } }}
            >
                <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<ClientsIcon stroke={theme.palette.primary[600]} size={18} />}
                        title="View Category Details"
                        subtitle="View and manage category information"
                        actions={[
                            hasPermission("CATEGORY_DELETE") && (
                                <Tooltip title="Delete" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let details = {
                                                id: inventoryCategoryDetailData.id,
                                                title: `Delete Category`,
                                                text: `Are you sure you want to delete this category? This action cannot be undone.`
                                            }
                                            setViewInventoryCategoryData(details)
                                            setOpenViewDeleteInventoryCategoryPopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                            hasPermission("CATEGORY_EDIT") && (
                                <Tooltip title="Edit" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            setViewInventoryCategoryData(inventoryCategoryDetailData)
                                            setOpenViewEditInventoryCategoryPopup(true)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                        ].filter(Boolean)}
                    />
                    <Divider sx={{ m: 2 }} />
                    {loadingInventoryCategoryDetail ? (
                        <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={30} />
                            <TypographyComponent fontSize={20} fontWeight={600}>Loading...</TypographyComponent>
                        </Stack>

                    ) : inventoryCategoryDetailData && inventoryCategoryDetailData !== null ? (
                        <Stack
                            sx={{
                                px: 2,
                                flexGrow: 1,
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '2px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#ccc',
                                    borderRadius: '2px'
                                }
                            }}
                        >
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Name */}
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <FieldBox label="Name" value={inventoryCategoryDetailData?.name && inventoryCategoryDetailData?.name !== null ? inventoryCategoryDetailData?.name : ''} />
                                </Grid>
                                {/* Description */}
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <FieldBox type="description" length={160} label="Description" value={inventoryCategoryDetailData?.description && inventoryCategoryDetailData?.description !== null ? inventoryCategoryDetailData?.description : ''} />
                                </Grid>
                                {/* Status */}
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <FieldBox label="Status" value={inventoryCategoryDetailData?.status && inventoryCategoryDetailData?.status !== null ? inventoryCategoryDetailData?.status : ''} />
                                </Grid>
                            </Grid>
                        </Stack>)
                        :
                        <></>
                    }
                    <Divider sx={{ m: 2 }} />
                    <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                        <Button
                            sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                            onClick={handleClose}
                            variant='contained'
                        >
                            Close
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
            <AddInventoryCategory
                open={openViewEditInventoryCategoryPopup}
                objData={viewInventoryCategoryData}
                handleClose={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionGetInventoryCategoryDetails({ id: objData?.id }))
                        dispatch(actionInventoryCategoryList())
                    }
                    setOpenViewEditInventoryCategoryPopup(false)
                    setViewInventoryCategoryData(null)
                }}
            />
            <AlertPopup
                open={openViewDeleteInventoryCategoryPopup}
                icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                color={theme.palette.error[600]}
                objData={viewInventoryCategoryData}
                actionButtons={[
                    <Button key='cancel' color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                        setOpenViewDeleteInventoryCategoryPopup(false)
                    }}>
                        Cancel
                    </Button >
                    ,
                    <Button key='delete' variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                        setViewLoadingDelete(true)
                        if (inventoryCategoryDetailData?.id && inventoryCategoryDetailData?.id !== null) {
                            dispatch(actionDeleteInventoryCategory({
                                id: inventoryCategoryDetailData?.id
                            }))
                        }
                    }}>
                        {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                    </Button>
                ]
                }
            />
        </React.Fragment>
    );
}
