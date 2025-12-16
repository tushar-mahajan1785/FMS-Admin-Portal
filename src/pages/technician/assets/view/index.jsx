import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft';
import { Stack, Box, Divider, Avatar } from '@mui/material';
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header';
import TypographyComponent from '../../../../components/custom-typography';
import { getInitials, getPMActivityLabel } from '../../../../utils';
import moment from 'moment';
import _ from 'lodash';
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants';
import PaperClipIcon from '../../../../assets/icons/PaperClipIcon';
import MessageDotsIcon from '../../../../assets/MessageDotsIcon';
import HistoryIcon from '../../../../assets/icons/HistoryIcon';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { useBranch } from '../../../../hooks/useBranch';
import { useAuth } from '../../../../hooks/useAuth';
import { actionTechnicianAssetDetails, resetTechnicianAssetDetailsResponse } from '../../../../store/technician/assets';

export default function TechnicianAssetView() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const { logout } = useAuth()
    const { assetUuid } = useParams()

    //Store
    const { technicianAssetDetails } = useSelector(state => state.technicianAssetStore)

    //States
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [assetDetails, setAssetDetails] = useState(null)
    const [documentArray, setDocumentArray] = useState([])

    /**
     * useEffect
     * @dependency : technicianAssetDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of technician asset details API
     */
    useEffect(() => {
        if (technicianAssetDetails && technicianAssetDetails !== null) {
            dispatch(resetTechnicianAssetDetailsResponse())

            if (technicianAssetDetails?.result === true) {
                setLoadingDetail(false)
                let assetResponse = Object.assign({}, technicianAssetDetails?.response)

                let documentCategoryArray = Object.assign([], assetResponse?.document_categories);
                const updatedArray = documentCategoryArray?.map((cat, index) => ({
                    ...cat,
                    is_selected: index === 0
                }));
                assetResponse.document_categories = updatedArray;
                setAssetDetails(assetResponse)
                let findSelected = assetResponse?.document_categories?.find(obj => obj?.is_selected == true)
                if (findSelected && findSelected.documents && findSelected.documents !== null && findSelected.documents.length > 0) {
                    setDocumentArray(findSelected.documents)
                } else {
                    setDocumentArray([])
                }

            } else {
                setLoadingDetail(false)
                setAssetDetails([])
                setDocumentArray([])
                switch (technicianAssetDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianAssetDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianAssetDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianAssetDetails])

    /**
      * Initial Render Call Asset Type list
      */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionTechnicianAssetDetails({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_uuid: assetUuid
            }))
        }

    }, [branch?.currentBranch?.uuid, assetUuid])


    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate('/assets')
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}>{assetDetails?.title}</TypographyComponent>
            </Stack>} />
            <Stack
                sx={{
                    borderRadius: '8px',
                    p: '16px',
                    width: '100%',
                    border: `1px solid ${theme.palette.grey[100]}`,
                    backgroundColor: theme.palette.common.white,
                }}
            >
                {/* Top section */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={{
                            height: 40,
                            width: 40,
                            borderRadius: 1.5,
                            backgroundColor: theme.palette.primary[600],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: theme.palette.common.white,
                        }}
                    >
                        {getInitials(assetDetails?.title, 1)}
                    </Box>

                    <Stack>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.title && assetDetails?.title !== null ? assetDetails?.title : ''}
                        </TypographyComponent>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            {assetDetails?.group_name && assetDetails?.group_name !== null ? assetDetails?.group_name : ''}
                        </TypographyComponent>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Bottom stats */}
                <Stack direction="row" justifyContent="space-between">
                    <Stack>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            Documents
                        </TypographyComponent>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.total_documents && assetDetails?.total_documents !== null && assetDetails?.total_documents > 0 ? String(assetDetails?.total_documents).padStart(2, "0") : 0}
                        </TypographyComponent>
                    </Stack>

                    <Stack>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            Active Tickets
                        </TypographyComponent>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.total_active_tickets && assetDetails?.total_active_tickets !== null && assetDetails?.total_active_tickets > 0 ? String(assetDetails?.total_active_tickets).padStart(2, "0") : 0}
                        </TypographyComponent>
                    </Stack>

                    <Stack>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>
                            PM Activity
                        </TypographyComponent>
                        <TypographyComponent fontSize={16} fontWeight={600}>
                            {assetDetails?.upcoming_pm_activity_date && assetDetails?.upcoming_pm_activity_date !== null ? getPMActivityLabel(assetDetails?.upcoming_pm_activity_date) : 'N/A'}
                        </TypographyComponent>
                    </Stack>
                </Stack>
            </Stack>
            {
                loadingDetail ? (
                    <FullScreenLoader open={true} />
                ) :
                    <>
                        <Stack sx={{ width: '100%' }}>
                            <TypographyComponent fontSize={18} fontWeight={500} >
                                Documents
                            </TypographyComponent>
                            <Stack gap={1} sx={{ flexDirection: 'row', alignItems: 'center', width: '100%', py: 1, overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                                {assetDetails?.document_categories && assetDetails?.document_categories.length > 0 ?
                                    assetDetails?.document_categories.map((category, index) => (
                                        <Stack
                                            key={index}
                                            sx={{
                                                flexDirection: 'row', alignItems: 'center', gap: 0.8,
                                                background: category?.is_selected == true ? theme.palette.common.black : theme.palette.common.white, padding: '8px 16px', textWrap: 'nowrap',
                                                borderRadius: '8px', justifyContent: 'center', cursor: 'pointer',
                                                border: `1px solid ${theme.palette.grey[100]}`,
                                            }}
                                            onClick={() => {
                                                let details = Object.assign({}, assetDetails);
                                                let documentCategory = Object.assign([], details.document_categories);
                                                const updatedArray = documentCategory?.map((cat) => ({
                                                    ...cat,
                                                    is_selected: cat?.id == category?.id
                                                }));
                                                details.document_categories = updatedArray;
                                                setAssetDetails(details);
                                                if (category?.documents && category?.documents.length > 0) {
                                                    setDocumentArray(category?.documents);
                                                } else {
                                                    setDocumentArray([]);
                                                }
                                            }}
                                        >
                                            <TypographyComponent fontSize={16} fontWeight={600} sx={{ textWrap: 'nowrap', color: category?.is_selected == true ? theme.palette.common.white : theme.palette.text.primary }}>
                                                {category?.category_short_name && category?.category_short_name !== null ? category?.category_short_name : ''}
                                            </TypographyComponent>
                                        </Stack>
                                    )) : <></>}
                            </Stack>
                            <Stack gap={1} sx={{ background: theme.palette.common.white, p: 2, borderRadius: '8px', mt: 1, minHeight: '150px', maxHeight: '250px', overflowY: 'scroll' }}>
                                {documentArray && documentArray !== null && documentArray.length > 0 ?
                                    documentArray?.map((doc, index) => {
                                        const fileName = doc?.file_name || "";
                                        const ext = fileName.split('.').pop().toLowerCase();

                                        let iconPath = "/asset/pdf-file.png"; // default

                                        if (ext === "jpg" || ext === "jpeg" || ext === "png") {
                                            iconPath = "/assets/jpg-file.png";
                                        } else if (ext === "pdf") {
                                            iconPath = "/assets/pdf-file.png";
                                        }

                                        return (
                                            <>
                                                <Stack key={index} gap={0.5}>
                                                    {/* Row */}
                                                    <Stack direction="row" justifyContent="space-between" gap={2}>
                                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }} >
                                                            {/* File badge */}
                                                            <img
                                                                src={iconPath}
                                                                alt="file icon"
                                                                style={{ width: 24, height: 24 }}
                                                            />

                                                            {/* File info */}
                                                            <Stack spacing={0.3}>
                                                                <TypographyComponent fontSize={16} fontWeight={600}>
                                                                    {doc?.file_name && doc?.file_name !== null ? _.truncate(doc?.file_name, { length: 28 }) : ''}
                                                                </TypographyComponent>
                                                            </Stack>
                                                        </Stack>

                                                        {/* Version + date */}
                                                        <Stack alignItems="flex-end" gap={0.5}>
                                                            <TypographyComponent fontSize={14} fontWeight={600}>
                                                                {doc?.version && doc?.version !== null ? _.truncate(doc?.version, { length: 8 }) : ''}
                                                            </TypographyComponent>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction="row" justifyContent="space-between" gap={2}>
                                                        <Stack direction="row" gap={1.5}>
                                                            {/* File info */}
                                                            <Stack gap={0.3}>
                                                                <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                                    {doc?.notes && doc?.notes !== null ? doc?.notes : ''}
                                                                </TypographyComponent>
                                                            </Stack>
                                                        </Stack>

                                                        {/* Version + date */}
                                                        <Stack alignItems="flex-end" gap={0.5}>
                                                            <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500], textWrap: 'nowrap' }}>
                                                                {doc?.updated_at && doc?.updated_at !== null ? moment(doc?.updated_at).format("D MMM YYYY") : ''}
                                                            </TypographyComponent>
                                                        </Stack>
                                                    </Stack>

                                                    {/* Divider except last item */}

                                                </Stack>
                                                {index !== documentArray?.length - 1 && <Divider sx={{ mx: -2, my: 0.5, color: theme.palette.grey[200] }} />}
                                            </>
                                        );
                                    })
                                    :
                                    <Stack sx={{ background: theme.palette.common.white, py: 2, mt: 0, alignItems: 'center', justifyContent: 'center' }}>
                                        <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                                        <TypographyComponent fontSize={16} fontWeight={400}>No Documents Found</TypographyComponent>
                                    </Stack>
                                }

                            </Stack>
                        </Stack>
                        <Stack sx={{ width: '100%' }}>
                            <TypographyComponent fontSize={18} fontWeight={500} >
                                Active Tickets
                            </TypographyComponent>
                            <Stack gap={1} sx={{ alignItems: 'center', width: '100%', py: 1 }}>
                                {
                                    assetDetails?.tickets && assetDetails?.tickets !== null && assetDetails?.tickets.length > 0 ?
                                        assetDetails?.tickets?.map((objTicket, index) => {
                                            return (
                                                <Stack
                                                    key={index}
                                                    sx={{
                                                        borderRadius: 2,
                                                        p: 2,
                                                        backgroundColor: "#fff",
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Stack spacing={1}>
                                                        {/* Title */}
                                                        <TypographyComponent fontSize={16} fontWeight={600}>
                                                            {objTicket?.name && objTicket?.name !== null ? objTicket?.name : ''}
                                                        </TypographyComponent>

                                                        {/* Ticket number */}
                                                        <TypographyComponent
                                                            fontSize={14}
                                                            fontWeight={500}
                                                            sx={{ color: "#7C3AED", textDecoration: "underline" }}
                                                        >
                                                            {objTicket?.ticket_no && objTicket?.ticket_no !== null ? objTicket?.ticket_no : ''}
                                                        </TypographyComponent>

                                                        {/* Description */}
                                                        <TypographyComponent
                                                            fontSize={14}
                                                            sx={{ color: theme.palette.grey[500] }}
                                                        >
                                                            {objTicket?.description && objTicket?.description !== null ? objTicket?.description : ''}
                                                        </TypographyComponent>

                                                        {/* Footer */}
                                                        <Stack direction="row" gap={1.5} alignItems="center" mt={0.5}>
                                                            <Stack direction="row" gap={'2px'} alignItems="center" justifyContent={'center'}>
                                                                <HistoryIcon size={14} />
                                                                <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                                    {objTicket?.created_at && objTicket?.created_at !== null ? moment(objTicket?.created_at).fromNow() : ''}
                                                                </TypographyComponent>
                                                            </Stack>
                                                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                            </Stack>
                                                            <Stack direction="row" gap={'4px'} alignItems="center" justifyContent={'center'}>
                                                                <MessageDotsIcon size={14} />
                                                                <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                                    {objTicket?.updates && objTicket?.updates !== null ? objTicket?.updates : ''} Updates
                                                                </TypographyComponent>
                                                            </Stack>
                                                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                            </Stack>
                                                            <Stack direction="row" gap={'4px'} alignItems="center" justifyContent={'center'}>
                                                                <PaperClipIcon size={14} />
                                                                <TypographyComponent fontSize={14} sx={{ color: theme.palette.grey[500] }}>
                                                                    {objTicket?.attachments && objTicket?.attachments !== null ? objTicket?.attachments : ''} Attachments
                                                                </TypographyComponent>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            )
                                        })
                                        :
                                        <Stack sx={{ background: theme.palette.common.white, py: 2, mt: 0, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                            <Avatar alt={""} src={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} sx={{ overFlow: 'hidden', borderRadius: 0, height: 120, width: 120 }} />
                                            <TypographyComponent fontSize={16} fontWeight={400}>No Tickets Found</TypographyComponent>
                                        </Stack>
                                }
                            </Stack>
                        </Stack>
                    </>
            }
        </Stack>
    )
}
