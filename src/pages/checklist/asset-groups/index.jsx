/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, CircularProgress, Divider, Grid, IconButton, InputAdornment, Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import TypographyComponent from "../../../components/custom-typography";
import CheckboxIcon from "../../../assets/icons/CheckboxIcon";
import AlertTriangleIcon from "../../../assets/icons/AlertTriangleIcon";
import EyeIcon from "../../../assets/icons/EyeIcon";
import { StyledLinearProgress } from "../../../components/common";
import { getPercentage } from "../../../utils";
import ClockIcon from "../../../assets/icons/ClockIcon";
import FileXIcon from "../../../assets/icons/FileXIcon";
import { useNavigate, useParams } from "react-router-dom";
import ChevronLeftIcon from "../../../assets/icons/ChevronLeft";
import AddIcon from '@mui/icons-material/Add';
import AddChecklistAssetGroup from "./add";
import { useDispatch, useSelector } from "react-redux";
import { actionChecklistGroupAllGroupDetails, actionChecklistGroupList, resetChecklistGroupAllGroupDetailsResponse, resetChecklistGroupListResponse } from "../../../store/checklist";
import { useBranch } from "../../../hooks/useBranch";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import FullScreenLoader from "../../../components/fullscreen-loader";
import EmptyContent from "../../../components/empty_content";
import moment from "moment";
import DatePickerWrapper from "../../../components/datapicker-wrapper";
import DatePicker from "react-datepicker";
import CustomTextField from "../../../components/text-field";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import ExcelJS from "exceljs";
import GenerateReportIcon from "../../../assets/icons/GenerateReportIcon";

export default function ChecklistAssetGroups() {
    const theme = useTheme()
    const navigate = useNavigate()
    const { assetId } = useParams()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    //Stores
    const { checklistGroupList, checklistGroupAllGroupDetails } = useSelector(state => state.checklistStore)

    //Default Checklists Counts Array
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)
    const [arrAssetGroupsData, setArrAssetGroupsData] = useState([])
    const [openAddChecklistAssetGroup, setOpenAddChecklistAssetGroup] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState(moment().format('DD/MM/YYYY'))
    const [loadingChecklist, setLoadingChecklist] = useState(false)
    // const [getChecklistGroupExcelDetails, setGetChecklistGroupExcelDetails] = useState(null)

    /**
     * Initial call Checklist group list API
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && assetId && assetId !== null) {
            setLoadingList(true)
            dispatch(actionChecklistGroupList({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type_id: assetId
            }))
        }

    }, [branch?.currentBranch?.uuid, assetId])

    /**
     * function to export excel for Vertical Layout
     * @param {*} data 
     * @param {*} filename 
     * @returns 
     */
    const exportVerticalDynamic = async (dataArray, filename = "Checklist_Group_Vertical.xlsx") => {
        try {
            // --------------------------------------------------
            // VALIDATE INPUT
            // --------------------------------------------------
            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                console.error("exportVerticalDynamic ERROR: dataArray is not an array", dataArray);
                return;
            }

            const workbook = new ExcelJS.Workbook();

            // --------------------------------------------------
            // LOOP THROUGH ALL GROUP OBJECTS
            // --------------------------------------------------
            for (let g = 0; g < dataArray.length; g++) {
                const data = dataArray[g] || {};

                // Sheet Name (max 31 chars)
                const sheetName =
                    data?.group_name ||
                    data?.asset_type_name ||
                    `Group_${g + 1}`;

                const sheet = workbook.addWorksheet(sheetName.substring(0, 31));

                // --------------------------------------------------
                // Extract Values
                // --------------------------------------------------
                const checklist = data?.asset_checklist_json ?? [];
                const parameters = data?.checklist_json?.parameters ?? [];

                if (!Array.isArray(checklist) || checklist.length === 0) continue;

                const parents = parameters.filter(p => p?.parent_id === 0);
                const children = parameters.filter(p => p?.parent_id !== 0);

                const branchName =
                    data?.branch_name
                        ? `${data.branch_name}${data?.branch_location ? `, ${data.branch_location}` : ""}`
                        : "Branch";

                const date = selectedStartDate
                    ? moment(selectedStartDate, "DD/MM/YYYY").format("DD-MM-YYYY")
                    : new Date().toLocaleDateString();

                const timeSlots = checklist[0]?.times ?? [];

                // --------------------------------------------------
                // BUILD HEADER ROWS
                // --------------------------------------------------
                let rowA = ["Assets"];
                let rowB = ["Parameters"];
                let rowC = [""];

                const assetBlocks = checklist.map(asset => {
                    const blocks = parents.map(parent => {
                        const childList = children.filter(c => c?.parent_id === parent?.id);
                        return {
                            parent,
                            childList,
                            childCount: childList.length || 1
                        };
                    });

                    const totalCols = blocks.reduce((sum, b) => sum + b.childCount, 0);

                    return {
                        asset,
                        blocks,
                        totalCols
                    };
                });

                assetBlocks.forEach(block => {
                    // Row A → asset name repeated N times
                    rowA.push(...Array(block.totalCols).fill(block.asset?.asset_name ?? "Asset"));

                    // Row B → parent names
                    block.blocks.forEach(b => {
                        rowB.push(...Array(b.childCount).fill(b.parent?.name ?? ""));
                    });

                    // Row C → child names OR blank if no children
                    block.blocks.forEach(b => {
                        if (b.childList.length === 0) {
                            rowC.push("");
                        } else {
                            b.childList.forEach(c => rowC.push(c?.sub_name || c?.name || ""));
                        }
                    });
                });

                const totalCols = rowA.length;

                // --------------------------------------------------
                // ADD BRANCH + DATE ROWS
                // --------------------------------------------------
                sheet.spliceRows(1, 0, ["".padStart(totalCols)]);
                sheet.spliceRows(2, 0, ["".padStart(totalCols)]);

                sheet.mergeCells(1, 1, 1, totalCols);
                sheet.getCell(1, 1).value = branchName;
                sheet.getCell(1, 1).alignment = { horizontal: "center", vertical: "middle" };
                sheet.getCell(1, 1).font = { bold: true, size: 16 };

                sheet.mergeCells(2, 1, 2, totalCols);
                sheet.getCell(2, 1).value = `Date:- ${date}`;
                sheet.getCell(2, 1).alignment = { horizontal: "center", vertical: "middle" };
                sheet.getCell(2, 1).font = { bold: true, size: 12 };

                // --------------------------------------------------
                // ADD HEADER ROWS (A, B, C)
                // --------------------------------------------------
                const rowARef = sheet.addRow(rowA);
                const rowBRef = sheet.addRow(rowB);
                const rowCRef = sheet.addRow(rowC);

                rowARef.font = { bold: true };
                rowBRef.font = { bold: true };
                rowCRef.font = { bold: true };

                // --------------------------------------------------
                // MERGE CELLS FOR ASSETS + PARENT GROUPS
                // --------------------------------------------------
                let cursor = 2;

                // Merge Row A
                assetBlocks.forEach(block => {
                    const start = cursor;
                    const end = cursor + block.totalCols - 1;
                    sheet.mergeCells(3, start, 3, end);
                    cursor = end + 1;
                });

                // Merge Row B (parent groups)
                cursor = 2;
                assetBlocks.forEach(block => {
                    block.blocks.forEach(b => {
                        const start = cursor;
                        const end = cursor + b.childCount - 1;
                        sheet.mergeCells(4, start, 4, end);
                        cursor = end + 1;
                    });
                });

                // --------------------------------------------------
                // ADD DATA ROWS
                // --------------------------------------------------
                let currentRow = 6;

                timeSlots.forEach(time => {
                    const row = sheet.getRow(currentRow);
                    row.getCell(1).value = `${time?.from ?? ""}-${time?.to ?? ""}`;

                    let col = 2;

                    assetBlocks.forEach(block => {
                        const asset = block.asset;
                        const slot = asset?.times?.find(t => t?.uuid === time?.uuid);

                        // If no time slot exists for this asset ⇒ fill blanks
                        if (!slot) {
                            for (let i = 0; i < block.totalCols; i++) {
                                row.getCell(col).value = "-";
                                col++;
                            }
                            return;
                        }

                        block.blocks.forEach(b => {
                            if (b.childList.length === 0) {
                                // parent without children
                                const v = slot?.values?.find(x => x?.parameter_id === b.parent?.id);
                                row.getCell(col).value = v?.value ?? "-";
                                col++;
                            } else {
                                b.childList.forEach(child => {
                                    const v = slot?.values?.find(x => x?.parameter_id === child?.id);
                                    row.getCell(col).value = v?.value ?? "-";
                                    col++;
                                });
                            }
                        });
                    });

                    currentRow++;
                });

                // --------------------------------------------------
                // STYLING + BORDERS
                // --------------------------------------------------
                sheet.eachRow(row => {
                    row.eachCell(cell => {
                        cell.border = {
                            top: { style: "thin" },
                            left: { style: "thin" },
                            bottom: { style: "thin" },
                            right: { style: "thin" }
                        };
                        cell.alignment = {
                            horizontal: "center",
                            vertical: "middle",
                            wrapText: true
                        };
                    });
                });

                // --------------------------------------------------
                // AUTO-WIDTH
                // --------------------------------------------------
                sheet.columns.forEach(col => {
                    col.width = 15;
                });
            }

            // --------------------------------------------------
            // DOWNLOAD FILE
            // --------------------------------------------------
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);

        } catch (err) {
            console.error("EXPORT ERROR:", err);
        }
    };

    /**
       * useEffect
       * @dependency : checklistGroupList
       * @type : HANDLE API RESULT
       * @description : Handle the result of checklist group List API
      */
    useEffect(() => {
        if (checklistGroupList && checklistGroupList !== null) {
            dispatch(resetChecklistGroupListResponse())
            if (checklistGroupList?.result === true) {
                setGetCurrentAssetGroup(checklistGroupList?.response)
                if (checklistGroupList?.response?.group_data && checklistGroupList?.response?.group_data !== null && checklistGroupList?.response?.group_data.length > 0) {
                    setArrAssetGroupsData(checklistGroupList?.response?.group_data)
                } else {
                    setArrAssetGroupsData([])
                }
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setGetCurrentAssetGroup(null)
                setArrAssetGroupsData([])
                switch (checklistGroupList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetChecklistGroupListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: checklistGroupList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupList])

    /**
         * useEffect
         * @dependency : checklistGroupAllGroupDetails
         * @type : HANDLE API RESULT
         * @description : Handle the result of checklist group List API
        */
    useEffect(() => {
        if (checklistGroupAllGroupDetails && checklistGroupAllGroupDetails !== null) {
            dispatch(resetChecklistGroupAllGroupDetailsResponse())
            if (checklistGroupAllGroupDetails?.result === true) {
                setLoadingChecklist(false)
                let response = Object.assign([], checklistGroupAllGroupDetails?.response)
                if (response && response !== null && response.length > 0) {
                    exportVerticalDynamic(response, "Checklist_Group_Download.xlsx");
                } else {
                    showSnackbar({ message: 'No Group data found for Excel Export', severity: "error" })
                }
            } else {
                setLoadingChecklist(false)
                switch (checklistGroupAllGroupDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetChecklistGroupAllGroupDetailsResponse())
                        showSnackbar({ message: checklistGroupAllGroupDetails?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: checklistGroupAllGroupDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupAllGroupDetails])

    return (<>
        <React.Fragment>
            <Stack sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'row' }, justifyContent: 'space-between' }}>
                <Stack sx={{ flexDirection: { xs: 'row', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 3 }}>
                    <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                        navigate('/checklist')
                    }}>
                        <ChevronLeftIcon size={26} />
                    </Stack>
                    <TypographyComponent color={theme.palette.text.primary} fontSize={18} fontWeight={400}>Back to Asset Types</TypographyComponent>
                </Stack>

                <Stack sx={{ flexDirection: { xs: 'column', sm: 'row', md: 'row', lg: 'row' }, alignItems: { xs: 'flex-start', sm: 'center', md: 'center' }, gap: '16px' }}>
                    <DatePickerWrapper>
                        <DatePicker
                            id='start_date'
                            placeholderText='Start Date'
                            customInput={
                                <CustomTextField
                                    size='small'
                                    fullWidth
                                    sx={{ width: { xs: '300px', sm: '200px' } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    onMouseDown={e => e.preventDefault()}
                                                >
                                                    <CalendarIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            }
                            value={selectedStartDate}
                            selected={selectedStartDate ? moment(selectedStartDate, 'DD/MM/YYYY').toDate() : null}
                            maxDate={moment().toDate()}
                            showYearDropdown={true}
                            onChange={date => {
                                const formattedDate = moment(date).format('DD/MM/YYYY')
                                setSelectedStartDate(formattedDate)
                            }}
                        />
                    </DatePickerWrapper>
                    <Stack>
                        <Button
                            title="Click to load checklist for selected date"
                            size={'small'}
                            disabled={loadingChecklist}
                            sx={{ textTransform: "capitalize", textWrap: 'nowrap', px: 2, gap: 1, borderRadius: '8px', backgroundColor: loadingChecklist ? theme.palette.grey[300] : theme.palette.primary[600], color: loadingChecklist ? theme.palette.grey[600] : theme.palette.common.white, fontSize: 16, fontWeight: 600, border: loadingChecklist ? `1px solid ${theme.palette.grey[400]}` : `1px solid ${theme.palette.primary[600]}` }}
                            onClick={() => {
                                if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && assetId && assetId !== null) {
                                    setLoadingChecklist(true)
                                    dispatch(actionChecklistGroupAllGroupDetails({
                                        branch_uuid: branch?.currentBranch?.uuid,
                                        asset_type_id: assetId,
                                        date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                                    }))
                                }
                            }}
                            variant='outlined'
                        >
                            {loadingChecklist ? <CircularProgress size={16} sx={{ color: theme.palette.grey[600] }} /> : <GenerateReportIcon />}
                            Export
                        </Button>
                    </Stack>
                </Stack>
            </Stack>

            <Stack sx={{
                p: '12px',
                height: "100%",
                width: '100%',
                borderRadius: "16px",
                border: `1px solid ${theme.palette.primary[600]}`,
                backgroundColor: theme.palette.common.white,
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: "space-between",
                alignItems: { xs: 'flex-start', sm: 'center' },
                rowGap: 2,
            }}>
                <Stack sx={{ rowGap: 1, width: '100%', }}>
                    <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} gap={1} alignItems={{ sm: 'flex-start', md: 'center' }}>
                        <TypographyComponent fontSize={16} fontWeight={500}>
                            {`${getCurrentAssetGroup?.title && getCurrentAssetGroup?.title !== null ? getCurrentAssetGroup?.title : ''} Checklist & Reading Report`}
                        </TypographyComponent>
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_groups} Groups</TypographyComponent>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_assets} Assets</TypographyComponent>
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                            </Stack>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_checklists} Checklists</TypographyComponent>
                            {/* </Stack> */}
                        </Stack>
                    </Stack>
                    <Grid container rowGap={1} sx={{ width: '100%' }}>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <CheckboxIcon size={'20'} stroke={theme.palette.success[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.success[600] }}>{getCurrentAssetGroup?.total_completed} Completed</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <AlertTriangleIcon size={'20'} stroke={theme.palette.error[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.error[600] }}>{getCurrentAssetGroup?.total_overdue} Overdue</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <AlertTriangleIcon size={'20'} stroke={theme.palette.warning[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.warning[600] }}>{getCurrentAssetGroup?.total_abnormal} Abnormal</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <ClockIcon size={'18'} stroke={theme.palette.warning[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.warning[600] }}>{getCurrentAssetGroup?.total_pending} Pending</TypographyComponent>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4, md: 2.5, lg: 2, xl: 1.2 }}>
                            <Stack sx={{ flexDirection: 'row', alignItems: 'center', borderRadius: '8px' }}>
                                <FileXIcon size={'20'} stroke={theme.palette.grey[600]} />
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ ml: 1, color: theme.palette.grey[600] }}>{getCurrentAssetGroup?.total_not_approved} Not Approved</TypographyComponent>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
                <Stack>
                    <Button
                        size={'small'}
                        sx={{ textTransform: "capitalize", textWrap: 'nowrap', px: 2, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            setOpenAddChecklistAssetGroup(true)
                        }}
                        variant='contained'
                    >
                        <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} />
                        Create New Group
                    </Button>
                </Stack>

            </Stack>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
                <TypographyComponent fontSize={16} fontWeight={600}>Assets Groups</TypographyComponent>
            </Stack>
            <Grid container spacing={3}>
                {loadingList ? (
                    <FullScreenLoader open={true} />
                ) : arrAssetGroupsData && arrAssetGroupsData !== null && arrAssetGroupsData?.length > 0 ?
                    arrAssetGroupsData?.map((objAsset, index) => (
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }} key={`${objAsset?.id}-${index}`}>
                            <Card
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    width: '100%',
                                    borderRadius: "16px",
                                    border: `1px solid ${theme.palette.primary[600]}`,
                                    backgroundColor: theme.palette.common.white,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>
                                    <Stack direction="row" gap={2} alignItems="center">
                                        <Box>
                                            <TypographyComponent fontSize={16} fontWeight={500}>
                                                {objAsset?.group_name}
                                            </TypographyComponent>
                                            <Stack flexDirection={'row'} sx={{ gap: '16px' }}>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_assets} Assets</TypographyComponent>
                                                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                                </Stack>
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_checklists} Checklists</TypographyComponent>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                    <Box>
                                        <Stack sx={{ cursor: 'pointer', flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.success[50], border: `1px solid ${theme.palette.success[200]}` }}
                                            onClick={() => {
                                                navigate(`view/${objAsset?.group_uuid}`)
                                            }}>
                                            <EyeIcon size={'20'} stroke={theme.palette.success[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.success[600] }}> View</TypographyComponent>
                                        </Stack>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                            Today's Progress
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.primary[600] }}>
                                            {getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? Math.round(getPercentage(objAsset?.total_completed, objAsset?.total_checklists)) : 0}% Complete
                                        </TypographyComponent>
                                    </Stack>
                                    <Stack sx={{ width: '100%' }}>
                                        <Box sx={{ width: '100%', mr: 1 }}>
                                            <StyledLinearProgress variant="determinate" value={getPercentage(objAsset?.total_completed, objAsset?.total_checklists) ? getPercentage(objAsset?.total_completed, objAsset?.total_checklists) : 0} bgColor={theme.palette.primary[600]} />
                                        </Box>
                                    </Stack>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Stack sx={{ gap: 1 }}>
                                    <Stack direction="row" spacing={1.5} sx={{ textWrap: 'wrap' }}>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.success[50], border: `1px solid ${theme.palette.success[200]}` }}>
                                            <CheckboxIcon size={'20'} stroke={theme.palette.success[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.success[600] }}>{objAsset?.total_completed} Completed</TypographyComponent>
                                        </Stack>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.error[50], border: `1px solid ${theme.palette.error[200]}` }}>
                                            <AlertTriangleIcon size={'20'} stroke={theme.palette.error[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.error[600] }}>{objAsset?.total_overdue} Overdue</TypographyComponent>
                                        </Stack>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.warning[50], border: `1px solid ${theme.palette.warning[200]}` }}>
                                            <AlertTriangleIcon size={'20'} stroke={theme.palette.warning[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.warning[600] }}>{objAsset?.total_abnormal} Abnormal</TypographyComponent>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} sx={{ textWrap: 'wrap' }}>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.warning[50], border: `1px solid ${theme.palette.warning[200]}` }}>
                                            <ClockIcon size={'18'} stroke={theme.palette.warning[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.warning[600] }}>{objAsset?.total_pending} Pending</TypographyComponent>
                                        </Stack>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', padding: '4px 8px', borderRadius: '8px', background: theme.palette.grey[50], border: `1px solid ${theme.palette.grey[200]}` }}>
                                            <FileXIcon size={'20'} stroke={theme.palette.grey[600]} />
                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objAsset?.total_not_approved} Not Approved</TypographyComponent>
                                        </Stack>
                                    </Stack>
                                </Stack>

                            </Card>
                        </Grid>
                    ))
                    :
                    <Stack sx={{ height: '100%', width: '100%', background: theme.palette.common.white, pb: 20, borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}` }}>
                        <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Asset Groups Found'} subTitle={''} />
                    </Stack>
                }
            </Grid>
            <AddChecklistAssetGroup
                open={openAddChecklistAssetGroup}
                handleClose={(data) => {
                    setOpenAddChecklistAssetGroup(false)
                    if (data == 'save') {
                        setLoadingList(true)
                        dispatch(actionChecklistGroupList({
                            branch_uuid: branch?.currentBranch?.uuid,
                            asset_type_id: assetId
                        }))
                    }
                }}
            />
        </React.Fragment>
    </>)

}