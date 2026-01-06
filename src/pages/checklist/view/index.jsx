/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, IconButton, InputAdornment, MenuItem, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TypographyComponent from "../../../components/custom-typography";
import CheckboxIcon from "../../../assets/icons/CheckboxIcon";
import AlertTriangleIcon from "../../../assets/icons/AlertTriangleIcon";
import { useNavigate, useParams } from "react-router-dom";
import ChevronLeftIcon from "../../../assets/icons/ChevronLeft";
import moment from "moment";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "../../../components/datapicker-wrapper";
import CustomTextField from "../../../components/text-field";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import GenerateReportIcon from "../../../assets/icons/GenerateReportIcon";
import ExportIcon from "../../../assets/icons/ExportIcon";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import EditCircleIcon from "../../../assets/icons/EditCircleIcon";
import { useDispatch, useSelector } from "react-redux";
import { actionChecklistGroupAssetApprove, actionChecklistGroupDetails, actionChecklistGroupHistoryAdd, resetChecklistGroupAssetApproveResponse, resetChecklistGroupDetailsResponse, resetChecklistGroupHistoryAddResponse } from "../../../store/checklist";
import { useBranch } from "../../../hooks/useBranch";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import CircleDashedIcon from "../../../assets/icons/CircleDashedIcon";
import { useForm, FormProvider, Controller } from "react-hook-form";
import CloseIcon from "../../../assets/icons/CloseIcon";
import { isCurrentTimeInRange, isFutureTimeRange } from "../../../utils";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import AlertPopup from "../../../components/alert-confirm";
import EmptyContent from "../../../components/empty_content";
import ExcelJS from "exceljs";

export default function ChecklistView() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { assetId, groupUuid } = useParams()
    const scrollRef = useRef(null);

    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))

    const methods = useForm();

    const {
        control, handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = methods

    //Stores
    const { checklistGroupDetails, checklistGroupHistoryAdd, checklistGroupAssetApprove } = useSelector(state => state.checklistStore)

    //Default Checklists Counts Array
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(moment().format('DD/MM/YYYY'))
    const [getChecklistDetails, setGetChecklistDetails] = useState(null)
    const [selectedTimeUuid, setSelectedTimeUuid] = useState(null)
    const [openAssetApprovalPopup, setOpenAssetApprovalPopup] = useState(false)
    const [loadingApprove, setLoadingApprove] = useState(false)
    const [currentAssetApprovalDetails, setCurrentAssetApprovalDetails] = useState(null)
    const [loadingChecklist, setLoadingChecklist] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [formMode, setFormMode] = useState('view')

    //Scroll times to current selected time
    const getScrollTargetIndex = () => {
        // Check if the times array exists
        if (!getChecklistDetails || !getChecklistDetails.times) return -1;

        // Find the index where is_selected is true
        return getChecklistDetails.times.findIndex(timeSlot => timeSlot.is_selected === true);
    };

    useEffect(() => {
        //set initial scroll state
        setIsInitialLoad(true)

        return () => {
            setSelectedTimeUuid(null)
            setCurrentAssetApprovalDetails(null)
        }
    }, [])

    /**
     * set value for current asset on click of Edit
     */
    useEffect(() => {
        if (formMode == 'edit') {
            let checklistData = Object.assign({}, getChecklistDetails)

            let currentTime = checklistData?.times.find(obj => obj?.is_selected == true)

            if (currentTime && currentTime !== null) {
                if (currentTime?.schedules && currentTime?.schedules !== null && currentTime?.schedules.length > 0) {
                    let currentAsset = currentTime?.schedules.find(obj => obj?.is_view == 0)
                    if (currentAsset && currentAsset !== null) {
                        if (currentAsset?.values && currentAsset?.values !== null && currentAsset?.values.length > 0) {
                            currentAsset?.values?.forEach(param => {
                                let getCurrentParameter = getChecklistDetails?.parameters.find(p => p.id == param.parameter_id)
                                const fieldName = getCurrentParameter?.name
                                setValue(fieldName, param?.value || "");
                            });
                        }

                    }
                }
            }
        }
    }, [formMode])

    //Scroll times on update of getChecklistDetails & isInitialLoad as true
    useEffect(() => {
        if (isInitialLoad === true) {
            // 1. Get the target index
            const index = getScrollTargetIndex();
            if (index === -1) return;

            // 2. Perform the scroll logic
            const container = scrollRef.current;
            const slots = container?.children;
            if (!slots || !slots[index]) return;

            container.scrollTo({
                left: slots[index].offsetLeft - (isSMDown ? 100 : 520),
                behavior: "smooth"
            });

            // 3. Set the flag to false
            setIsInitialLoad(false)
        }
    }, [getChecklistDetails])

    /**
     * Call checklistGroupDetails API
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && groupUuid && groupUuid !== null) {
            setFormMode('view')
            setLoadingChecklist(true)
            dispatch(actionChecklistGroupDetails({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type_id: assetId,
                group_uuid: groupUuid,
                date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            }))
        }

    }, [branch?.currentBranch?.uuid, groupUuid])

    /**
     * Function to find and return previously filled parameters
     * @param {*} asset_id 
     * @param {*} time_uuid 
     * @param {*} assets_json 
     * @returns 
     */
    const getParameters = (asset_id, time_uuid, assets_json) => {
        let parameters = null
        let getCurrentSchedules = assets_json?.find(obj => obj?.asset_id == asset_id)
        if (getCurrentSchedules && getCurrentSchedules !== null) {
            parameters = getCurrentSchedules?.times?.find(obj => obj?.uuid == String(time_uuid))
        }
        return parameters && parameters !== null ? parameters?.values : null
    }

    /**
     * Function to get Asset Status
     * @param {*} asset_checklist_json 
     * @param {*} asset_id 
     * @param {*} time_uuid 
     * @returns 
     */
    const getAssetTimeStatus = (asset_checklist_json, asset_id, time_uuid, key = 'status') => {
        try {
            // Validate main array
            if (!Array.isArray(asset_checklist_json) || asset_checklist_json.length === 0) {
                return '';
            }

            // Validate inputs
            if (!asset_id || !time_uuid) {
                return '';
            }

            // Find asset entry safely
            const assetEntry = asset_checklist_json.find(
                item => item && item.asset_id === asset_id
            );
            if (!assetEntry || !Array.isArray(assetEntry.times) || assetEntry.times.length === 0) {
                return '';
            }

            // Find time entry safely
            const timeEntry = assetEntry.times.find(
                t => t && t.uuid === time_uuid
            );
            if (!timeEntry) {
                return '';
            }

            // Return the status (if blank, return null)
            return timeEntry[key] || '';

        } catch (error) {
            console.error("Error in getAssetTimeStatus:", error);
            return '';
        }
    };

    /**
     * function to generate times json along with corresponding - Assets, Parameters from asset_checklist_json
     * @param {*} assetGroup 
     * @returns 
     */
    const prepareAssetWiseJson = (assetGroup) => {
        const { assets, checklist_json, asset_checklist_json } = assetGroup;
        const { parameters, times } = checklist_json;

        // Get current time in "HH:mm"
        const now = moment().format("HH:mm");

        // Helper to check if now is between timeObj.from and timeObj.to
        const isCurrentTimeInRange = (from, to) => {
            const current = moment(now, "HH:mm");
            const start = moment(from, "HH:mm");
            const end = moment(to, "HH:mm");
            return current.isBetween(start, end, undefined, "[)");
        };

        // Determine default selected time if no selectedTimeUuid
        let defaultSelectedTimeUuid = null;

        if (!selectedTimeUuid) {
            const matched = times.find(t => isCurrentTimeInRange(t.from, t.to));
            defaultSelectedTimeUuid = matched ? matched.uuid : times[0]?.uuid; // fallback to first slot
        }

        return times?.map((timeObj) => ({
            ...timeObj,
            is_selected: selectedTimeUuid
                ? selectedTimeUuid === timeObj.uuid
                : defaultSelectedTimeUuid === timeObj.uuid,

            schedules: assets?.map(asset => ({
                asset_id: asset?.asset_id,
                asset_name: asset?.asset_name,
                status: getAssetTimeStatus(asset_checklist_json, asset?.asset_id, timeObj?.uuid, 'status'),
                is_abnormal_approved: getAssetTimeStatus(asset_checklist_json, asset?.asset_id, timeObj?.uuid, 'is_abnormal_approved') == 1 ? 1 : 0,
                is_view: 1,
                values:
                    getParameters(asset?.asset_id, timeObj?.uuid, asset_checklist_json) &&
                        getParameters(asset?.asset_id, timeObj?.uuid, asset_checklist_json)?.length > 0
                        ? getParameters(asset?.asset_id, timeObj?.uuid, asset_checklist_json)
                        : parameters.map(param => ({
                            parameter_id: param.id,
                            value: "",
                            max: param.max,
                            min: param.min,
                            name: param.name,
                            unit: param.unit,
                            options: param.options,
                            sequence: param.sequence,
                            parameter_type: param?.parameter_type,
                            sub_name: param.sub_name,
                            parent_id: param.parent_id,
                            input_type: param.input_type,
                            priority: param.priority,
                            is_mandatory: param.is_mandatory,
                            default_value: param.default_value
                        }))
            }))
        }));
    };

    /**
     * function to generate times json along with corresponding - Assets, Parameters from assets, parameters, times
     * @param {*} assetGroup 
     * @returns 
     */
    const prepareScheduleJson = (assetGroup) => {
        const { assets, checklist_json } = assetGroup;
        const { parameters, times } = checklist_json;

        // --- Get current time in HH:mm format ---
        const now = moment().format("HH:mm");

        // --- Check if current time is within range (from <= now < to) ---
        const isCurrentTimeInRange = (from, to) => {
            const current = moment(now, "HH:mm");
            const start = moment(from, "HH:mm");
            const end = moment(to, "HH:mm");
            return current.isBetween(start, end, undefined, "[)");
        };

        // --- Find time matching current time ---
        let defaultTime = times.find(t => isCurrentTimeInRange(t.from, t.to));

        // --- If none match, fallback to first ---
        const defaultSelectedUuid = defaultTime ? defaultTime.uuid : times[0]?.uuid;

        return times?.map((timeObj) => ({
            ...timeObj,
            is_selected: timeObj.uuid === defaultSelectedUuid,
            schedules: assets?.map(asset => ({
                asset_id: asset.asset_id,
                asset_name: asset.asset_name,
                status: "",
                is_view: 1,
                values: parameters?.map(param => ({
                    parameter_id: param.id,
                    value: "",
                    max: param.max,
                    min: param.min,
                    name: param.name,
                    unit: param.unit,
                    options: param.options,
                    sequence: param.sequence,
                    parameter_type: param?.parameter_type,
                    sub_name: param.sub_name,
                    parent_id: param.parent_id,
                    input_type: param.input_type,
                    priority: param.priority,
                    is_mandatory: param.is_mandatory,
                    default_value: param.default_value
                }))
            }))
        }));
    };

    /**
     * on updating of getCurrentAssetGroup prepare the times json
     */
    useEffect(() => {
        if (getCurrentAssetGroup && getCurrentAssetGroup !== null) {
            if (getCurrentAssetGroup?.asset_checklist_json && getCurrentAssetGroup?.asset_checklist_json !== null && getCurrentAssetGroup?.asset_checklist_json.length > 0) {
                let preparedData = prepareAssetWiseJson(getCurrentAssetGroup)
                let statusUpdateTimes = updateTimesStatus(preparedData)
                let currentDetails = Object.assign({}, getChecklistDetails)
                currentDetails.times = statusUpdateTimes
                currentDetails.parameters = getCurrentAssetGroup?.checklist_json?.parameters
                setGetChecklistDetails(currentDetails)
            } else {
                let preparedData = prepareScheduleJson(getCurrentAssetGroup)
                let statusUpdateTimes = updateTimesStatus(preparedData)
                let currentDetails = Object.assign({}, getChecklistDetails)
                currentDetails.times = statusUpdateTimes
                currentDetails.parameters = getCurrentAssetGroup?.checklist_json?.parameters
                setGetChecklistDetails(currentDetails)
            }
        }

    }, [getCurrentAssetGroup])

    /**
     * function checks the length of edit mode in checklist
     * @returns true/false
     */
    const getEditModeCount = () => {
        let count = 0;

        getChecklistDetails?.times?.forEach((time) => {
            time?.schedules?.forEach((asset) => {
                if (asset.is_view === 0) {
                    count += 1; // or count++
                }
            });
        });
        if (Number(count) > 0) {
            return true
        }
        return false
    }

    /**
     * Function return true is selectedStartDate is today
     */
    const isToday = useCallback(() => {
        if (!selectedStartDate) return false;

        const selectedDate = new Date(moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD'));
        const today = new Date();

        // Format both dates to YYYY-MM-DD for accurate comparison
        const format = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                d.getDate()
            ).padStart(2, "0")}`;
        return format(selectedDate) === format(today);
    }, [selectedStartDate]);

    /**
        * useEffect
        * @dependency : checklistGroupDetails
        * @type : HANDLE API RESULT
        * @description : Handle the result of checklist group List API
       */
    useEffect(() => {
        if (checklistGroupDetails && checklistGroupDetails !== null) {
            dispatch(resetChecklistGroupDetailsResponse())
            if (checklistGroupDetails?.result === true) {
                setFormMode('view')
                setLoadingChecklist(false)
                let response = Object.assign({}, checklistGroupDetails?.response)
                setGetCurrentAssetGroup(response)
            } else {
                setLoadingChecklist(false)
                setGetCurrentAssetGroup(null)
                setGetChecklistDetails(null)
                switch (checklistGroupDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetChecklistGroupDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: checklistGroupDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupDetails])

    /**
    * useEffect
    * @dependency : checklistGroupHistoryAdd
    * @type : HANDLE API RESULT
    * @description : Handle the result of checklist group history/asset save API
    */
    useEffect(() => {
        if (checklistGroupHistoryAdd && checklistGroupHistoryAdd !== null) {
            dispatch(resetChecklistGroupHistoryAddResponse())
            if (checklistGroupHistoryAdd?.result === true) {
                setFormMode('view')
                setLoadingSubmit(false)
                methods.reset()
                showSnackbar({ message: checklistGroupHistoryAdd.message, severity: "success" })
                setLoadingChecklist(true)
                dispatch(actionChecklistGroupDetails({
                    branch_uuid: branch?.currentBranch?.uuid,
                    asset_type_id: assetId,
                    group_uuid: groupUuid,
                    date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                }))
            } else {
                setLoadingSubmit(false)
                switch (checklistGroupHistoryAdd?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        showSnackbar({ message: checklistGroupHistoryAdd.message, severity: "error" })
                        dispatch(resetChecklistGroupHistoryAddResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: checklistGroupHistoryAdd.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupHistoryAdd])

    /**
    * useEffect
    * @dependency : checklistGroupAssetApprove
    * @type : HANDLE API RESULT
    * @description : Handle the result of checklist group history/asset save API
    */
    useEffect(() => {
        if (checklistGroupAssetApprove && checklistGroupAssetApprove !== null) {
            dispatch(resetChecklistGroupAssetApproveResponse())
            if (checklistGroupAssetApprove?.result === true) {
                setLoadingApprove(false)

                showSnackbar({ message: checklistGroupAssetApprove.message, severity: "success" })
                setOpenAssetApprovalPopup(false)
                setCurrentAssetApprovalDetails(null)
                setLoadingChecklist(true)
                dispatch(actionChecklistGroupDetails({
                    branch_uuid: branch?.currentBranch?.uuid,
                    asset_type_id: assetId,
                    group_uuid: groupUuid,
                    date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                }))
            } else {
                setLoadingApprove(false)
                switch (checklistGroupAssetApprove?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        showSnackbar({ message: checklistGroupAssetApprove.message, severity: "error" })
                        dispatch(resetChecklistGroupAssetApproveResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: checklistGroupAssetApprove.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [checklistGroupAssetApprove])

    /**
     * function to export excel for horizontal layout
     * @param {*} groupData 
     */
    const exportChecklistHorizontal = async (groupData) => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Checklist");

        const { assets, checklist_json, asset_checklist_json, branch_name, branch_location } = groupData;

        // ---------------------------
        // DATE FORMAT
        // ---------------------------
        const formattedDate = selectedStartDate
            ? moment(selectedStartDate, 'DD/MM/YYYY').format('DD-MM-YYYY')
            : new Date().toLocaleDateString();

        // ---------------------------
        // 1️⃣ TIME SLOT MERGING (MASTER + ASSET TIMES)
        // ---------------------------
        const masterTimeSlots = checklist_json?.times || [];
        const assetTimeSlots = [];

        if (!asset_checklist_json?.length) {
            showSnackbar({ message: 'No Data found to export excel', severity: "error" })
            return
        };

        asset_checklist_json?.forEach(asset => {
            asset?.times?.forEach(t => {
                if (!assetTimeSlots.find(x => x.uuid === t.uuid)) {
                    assetTimeSlots.push(t);
                }
            });
        });

        const timeSlots = masterTimeSlots.map(m => {
            const found = assetTimeSlots.find(a => a.uuid === m.uuid);
            return found || m;
        });

        const parameters = checklist_json?.parameters || [];

        // =============================
        // IMPORTANT: PUSH 3 EMPTY ROWS
        // row1 = Branch Name (later merged)
        // row2 = Date (later merged)
        // row3 = Time Slot row
        // =============================
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        // ---------------------------
        // 2️⃣ HEADER ROW — TIME SLOTS MERGED
        // ---------------------------
        let col = 2; // Column 1 is Parameter

        timeSlots.forEach(slot => {
            const startCol = col;
            const endCol = col + assets.length - 1;

            sheet.mergeCells(3, startCol, 3, endCol);
            const cell = sheet.getCell(3, startCol);
            cell.value = `${slot.from}-${slot.to}`;
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };

            col = endCol + 1;
        });

        // ---------------------------
        // 3️⃣ ASSET NAME ROW (Row 4)
        // ---------------------------
        const assetHeaderRow = sheet.addRow([]);
        assetHeaderRow.getCell(1).value = "Parameter";
        assetHeaderRow.getCell(1).font = { bold: true };

        let assetCol = 2;

        timeSlots.forEach(() => {
            assets.forEach(a => {
                assetHeaderRow.getCell(assetCol).value = a.asset_name;
                assetHeaderRow.getCell(assetCol).alignment = { horizontal: "center" };
                assetHeaderRow.getCell(assetCol).font = { bold: true };
                assetCol++;
            });
        });

        // ---------------------------
        // 4️⃣ PARAMETER ROWS WITH VALUES
        // ---------------------------
        parameters.forEach((param) => {
            const row = sheet.addRow([]);
            row.getCell(1).value = param.name;
            row.getCell(1).font = { bold: true };

            let writeCol = 2;

            timeSlots.forEach(slot => {
                assets.forEach(a => {

                    const assetRecord = asset_checklist_json.find(ac => ac.asset_id === a.asset_id);
                    const slotEntry = assetRecord?.times?.find(t => t.uuid === slot.uuid);
                    const valObj = slotEntry?.values?.find(v => v.parameter_id === param.id);

                    const value = valObj?.value ? `${valObj.value}` : "-";

                    const cell = row.getCell(writeCol);

                    cell.value = value;

                    cell.alignment = {
                        horizontal: "center",
                        vertical: "middle"
                    };

                    let fontColor = 'FF000000'; // default black

                    if (valObj?.param_status === 'Abnormal') {
                        if (valObj?.priority === 'High') {
                            fontColor = 'FFD92D20'; // 🔴 Red
                        } else if (valObj?.priority === 'Low') {
                            fontColor = 'FFF79009'; // 🟠 Orange
                        }
                    }

                    cell.font = {
                        color: { argb: fontColor }
                    };

                    writeCol++;
                });
            });
        });

        // ---------------------------
        // 5️⃣ NOW WE KNOW EXACT LAST COLUMN
        // CENTER BRANCH NAME + DATE
        // ---------------------------
        const lastColumn = sheet.getRow(4).cellCount;

        // Branch Name Row = Row 1
        sheet.mergeCells(1, 1, 1, lastColumn);
        sheet.getCell(1, 1).value = branch_name && branch_name !== null ? `${branch_name} ${branch_location && branch_location !== null ? `, ${branch_location}` : ''} ` : "Branch";
        sheet.getCell(1, 1).font = { bold: true, size: 14 };
        sheet.getCell(1, 1).alignment = { horizontal: "center", vertical: "middle" };

        // Date Row = Row 2
        sheet.mergeCells(2, 1, 2, lastColumn);
        sheet.getCell(2, 1).value = `Date:- ${formattedDate}`;
        sheet.getCell(2, 1).font = { bold: true, size: 12 };
        sheet.getCell(2, 1).alignment = { horizontal: "center", vertical: "middle" };

        // ---------------------------
        // 6️⃣ BORDERS ON ALL CELLS
        // ---------------------------
        sheet.eachRow({ includeEmpty: true }, row => {
            row.eachCell({ includeEmpty: true }, cell => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });
        });

        // ---------------------------
        // 7️⃣ Auto column width
        // ---------------------------
        sheet.columns.forEach(col => (col.width = 15));

        // ---------------------------
        // 8️⃣ Export file
        // ---------------------------
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Checklist-Horizontal.xlsx";
        link.click();
    };

    /**
     * function to export excel for Vertical Layout
     * @param {*} data 
     * @param {*} filename 
     * @returns 
     */
    const exportVerticalDynamic = async (data, filename = "Checklist_Vertical.xlsx") => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Checklist");

        // ---------------------------------------
        // Extract Data
        // ---------------------------------------
        const checklist = data?.asset_checklist_json || [];
        const parameters = data?.checklist_json?.parameters || [];

        const branchName =
            data?.branch_name && data?.branch_name !== null
                ? `${data.branch_name}${data?.branch_location ? `, ${data?.branch_location}` : ""}`
                : "Branch";

        const date = selectedStartDate
            ? moment(selectedStartDate, 'DD/MM/YYYY').format('DD-MM-YYYY')
            : new Date().toLocaleDateString();

        if (!checklist?.length) {
            showSnackbar({ message: 'No Data found to export excel', severity: "error" })
            return
        };

        const parents = parameters?.filter(p => p.parent_id === 0);
        const children = parameters?.filter(p => p.parent_id !== 0);

        const timeSlots = checklist[0]?.times || [];

        // ---------------------------------------
        // BUILD HEADER ROWS
        // ---------------------------------------
        let headerRowA = ["Assets"];
        let headerRowB = ["Parameters"];
        let headerRowC = [""];

        const assetBlocks = checklist.map(asset => {
            const blocks = parents.map(parent => {
                const childList = children.filter(c => c.parent_id === parent.id);
                return {
                    parent,
                    childList,
                    childCount: childList.length || 1
                };
            });

            const totalCols = blocks.reduce((s, b) => s + b.childCount, 0);
            return {
                assetEntry: asset,
                blocks,
                totalCols
            };
        });

        assetBlocks.forEach(block => {
            headerRowA.push(...Array(block.totalCols).fill(block.assetEntry.asset_name));

            block.blocks.forEach(b => {
                headerRowB.push(...Array(b.childCount).fill(b.parent.name));

                if (b.childList.length === 0) {
                    headerRowC.push("");
                } else {
                    b.childList.forEach(c => headerRowC.push(c.sub_name || c.name));
                }
            });
        });

        const totalCols = headerRowA.length;

        // ---------------------------------------
        // INSERT HEADER ROWS
        // ---------------------------------------
        const rowA = sheet.addRow(headerRowA);
        const rowB = sheet.addRow(headerRowB);
        const rowC = sheet.addRow(headerRowC);

        rowA.font = { bold: true };
        rowB.font = { bold: true };
        rowC.font = { bold: true };

        // ---------------------------------------
        // INSERT BRANCH + DATE TOP ROWS
        // ---------------------------------------
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

        // ---------------------------------------
        // MERGE HEADER BLOCK CELLS
        // ---------------------------------------
        let colCursor = 2;

        // Merge asset-name row
        assetBlocks.forEach(block => {
            const start = colCursor;
            const end = colCursor + block.totalCols - 1;
            sheet.mergeCells(3, start, 3, end);
            colCursor = end + 1;
        });

        // Merge parent row
        colCursor = 2;
        assetBlocks.forEach(block => {
            block.blocks.forEach(b => {
                const start = colCursor;
                const end = colCursor + b.childCount - 1;
                sheet.mergeCells(4, start, 4, end);
                colCursor = end + 1;
            });
        });

        // ---------------------------------------
        // DATA ROWS
        // ---------------------------------------
        let currentRow = 6;

        timeSlots.forEach(time => {
            const row = sheet.getRow(currentRow);
            row.getCell(1).value = `${time.from}-${time.to}`;

            let writeCol = 2;

            assetBlocks.forEach(block => {
                const asset = block.assetEntry;
                const slot = asset?.times?.find(t => t.uuid === time.uuid);

                if (!slot) {
                    for (let i = 0; i < block.totalCols; i++) {
                        row.getCell(writeCol).value = "-";
                        writeCol++;
                    }
                    return;
                }

                block.blocks.forEach(b => {
                    if (b.childList.length === 0) {
                        // parent has no children
                        const v = slot.values.find(x => x?.parameter_id === b.parent.id);

                        const cell = row.getCell(writeCol);
                        cell.value = "-";

                        if (v) {
                            cell.value = v.unit ? `${v.value}` : v.value;

                            let color = 'FF000000'; // black

                            if (v.param_status === 'Abnormal') {
                                if (v.priority == 'High') {
                                    color = 'FFD92D20'; // 🔴 red
                                } else if (v.priority == 'Low') {
                                    color = 'FFF79009'; // 🟠 orange
                                }
                            }

                            cell.font = { color: { argb: color } };
                        }

                        writeCol++;
                    } else {
                        // parent has children
                        b.childList.forEach(child => {
                            const v = slot.values.find(x => x?.parameter_id === child.id);

                            const cell = row.getCell(writeCol);
                            cell.value = "-";

                            if (v) {
                                cell.value = v.unit ? `${v.value}` : v.value;

                                let color = 'FF000000'; // black

                                if (v.param_status === 'Abnormal') {
                                    if (v.priority == 'High') {
                                        color = 'FFD92D20'; // 🔴 red
                                    } else if (v.priority == 'Low') {
                                        color = 'FFF79009'; // 🟠 orange
                                    }
                                }

                                cell.font = { color: { argb: color } };
                            }

                            writeCol++;
                        });
                    }
                });
            });

            currentRow++;
        });

        // ---------------------------------------
        // STYLING
        // ---------------------------------------
        sheet.eachRow(row => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
                cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            });
        });

        // ---------------------------------------
        // SMART AUTO-WIDTH (tight)
        // ---------------------------------------
        sheet.columns.forEach((column, index) => {
            const parent = sheet.getRow(4).getCell(index + 1).value;
            const child = sheet.getRow(5).getCell(index + 1).value;

            if (index === 0) {
                column.width = 22;
                return;
            }

            const parentName = parent ? parent.toString() : "";
            const childName = child ? child.toString() : "";

            // Parent with NO child
            if (childName === "" && parentName !== "") {
                column.width = Math.max(parentName.length + 1, 10);
                return;
            }

            // Child column
            if (childName !== "") {
                column.width = Math.max(childName.length + 1, 4);
                return;
            }

            column.width = 12;
        });

        // ---------------------------------------
        // DOWNLOAD
        // ---------------------------------------
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    /**
     * function to call export checklist function as per Layout Selection
     * @returns 
     */
    const exportChecklist = () => {
        if (!getCurrentAssetGroup?.layout_type) {
            return;
        }

        if (getCurrentAssetGroup.layout_type === "Horizontal") {
            exportChecklistHorizontal(getCurrentAssetGroup);
        }
        else if (getCurrentAssetGroup.layout_type === "Vertical") {
            exportVerticalDynamic(getCurrentAssetGroup, "Checklist_Vertical.xlsx");
        }
    };

    /**
     * Check if a time slot is enabled based on current time
     * @param {string} from - start time in HH:mm format
     * @param {string} to - end time in HH:mm format
     * @returns {boolean} - true if time slot is available (clickable), false if in future
     */
    const isTimeSlotEnabled = (from, to) => {
        const now = new Date();

        // Parse from time
        const [fromHour, fromMinute] = from.split(':').map(Number);
        const fromTime = new Date();
        fromTime.setHours(fromHour, fromMinute, 0, 0);

        // Parse to time
        const [toHour, toMinute] = to.split(':').map(Number);
        const toTime = new Date();
        toTime.setHours(toHour, toMinute, 0, 0);

        // Logic: enable if now >= from
        return isToday() == true ? (now >= fromTime) : true;
    };

    /**
     * Function to Update Times Status as per its Assets Status
     * @param {*} timesArray 
     * @returns 
     */
    const updateTimesStatus = (timesArray = []) => {
        if (!Array.isArray(timesArray) || timesArray.length === 0) return [];

        return timesArray.map(timeSlot => {
            const schedules = timeSlot?.schedules;

            // No schedules → keep existing status
            if (!Array.isArray(schedules) || schedules.length === 0) {
                return { ...timeSlot, status: timeSlot?.status || "", is_abnormal_approved: 0 };
            }

            // Extract status info
            const statuses = schedules.map(s => s?.status ?? "");
            const abnormalApprovedCount = schedules.filter(s => s?.is_abnormal_approved == 1).length;
            const approvedCount = schedules.filter(s => s?.status === "Approved").length;

            const hasApprovedAbnormal = abnormalApprovedCount > 0;
            const hasApproved = statuses.includes("Approved");
            const hasActive = statuses.includes("Active");
            const hasEmpty = statuses.includes("");
            const hasAbnormal = statuses.includes("Abnormal");
            const totalSchedules = schedules.length;

            //
            // ----------------------------- LOGIC USING IF / ELSE IF ---------------------------------
            //

            // 1️⃣ Any abnormal-approved present
            if (hasApprovedAbnormal) {
                if (hasApproved && hasAbnormal) {
                    return { ...timeSlot, status: "Abnormal", is_abnormal_approved: 0 };
                } else if (hasApproved && hasActive) {
                    return { ...timeSlot, status: "Active", is_abnormal_Approved: 0 };
                } else {
                    return { ...timeSlot, status: "Approved", is_abnormal_approved: 1 };
                }
            }

            // 2️⃣ All statuses are Approved
            else if (approvedCount === totalSchedules) {
                return { ...timeSlot, status: "Approved", is_abnormal_approved: 0 };
            }

            // 3️⃣ Approved + Abnormal (+ maybe Active)
            else if (hasApproved && hasAbnormal && hasActive) {
                return { ...timeSlot, status: "Abnormal", is_abnormal_approved: 0 };
            }

            else if (hasApproved && hasAbnormal) {
                return { ...timeSlot, status: "Abnormal", is_abnormal_approved: 0 };
            }

            // 4️⃣ Approved + Active
            else if (hasApproved && hasActive) {
                return { ...timeSlot, status: "Active", is_abnormal_approved: 0 };
            }

            // 6️⃣ Abnormal + (Empty or Active)
            else if (hasAbnormal && (hasEmpty && hasActive)) {
                return { ...timeSlot, status: "Abnormal", is_abnormal_approved: 0 };
            }


            // 6️⃣ Abnormal + (Empty or Active)
            else if (hasAbnormal && hasActive) {
                return { ...timeSlot, status: "Abnormal", is_abnormal_approved: 0 };
            }
            else if (hasAbnormal && hasEmpty) {
                return { ...timeSlot, status: "Abnormal", is_abnormal_approved: 0 };
            }

            // 7️⃣ Active + Empty → Pending
            else if (hasActive && hasEmpty) {
                return { ...timeSlot, status: "Pending", is_abnormal_approved: 0 };
            }
            // 7️⃣ Approved → Pending
            else if (hasApproved && hasEmpty) {
                return { ...timeSlot, status: "Pending", is_abnormal_approved: 0 };
            }

            // 8️⃣ Only Empty
            else if (hasEmpty) {
                return { ...timeSlot, status: "", is_abnormal_approved: 0 };
            }

            // 9️⃣ Only Active (no Approved, no Abnormal)
            else if (!hasApproved && hasActive) {
                return { ...timeSlot, status: "Active", is_abnormal_approved: 0 };
            }

            // 🔟 Only Abnormal (no Approved)
            else if (!hasApproved && hasAbnormal) {
                return { ...timeSlot, status: "Abnormal", is_abnormal_approved: 0 };
            }

            // 🔚 Default case
            else {
                return { ...timeSlot, status: "", is_abnormal_approved: 0 };
            }
        });
    };

    /**
     * Function to return fields with validations
     * @param {*} params, value
     * @returns 
     */
    const FieldRenderer = React.memo(({ params }) => {

        const fieldName = params.name
        const validationRules = {
            required: params?.is_mandatory ? `${params?.name} is required` : false,
            min: params?.min
                ? { value: Number(params.min), message: `Value should be between ${params.min} and ${params.max} ` }
                : undefined,
            max: params?.max
                ? { value: Number(params.max), message: `Value should be between ${params.min} and ${params.max} ` }
                : undefined,
        };

        return (
            <Controller
                name={fieldName}
                control={control}
                rules={validationRules}
                render={({ field }) => {

                    switch (params?.input_type) {

                        // ---------------- TEXT INPUT ----------------
                        case "Text Input":
                            return (
                                <CustomTextField
                                    fullWidth
                                    placeholder={`Enter ${params?.name} `}
                                    {...field}
                                    error={!!errors[fieldName]}
                                    helperText={errors[fieldName]?.message}
                                />
                            );

                        // ---------------- NUMBER INPUT ----------------
                        case "Number (with range)":
                            return (
                                <CustomTextField
                                    fullWidth
                                    type="number"
                                    size="small"
                                    placeholder={`Enter ${params?.name} `}
                                    {...field}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {params?.unit}
                                            </InputAdornment>
                                        )
                                    }}
                                    error={!!errors[fieldName]}
                                    helperText={errors[fieldName]?.message}
                                />
                            );

                        // ---------------- SELECT INPUT ----------------
                        case "Multiple Choice":
                        case "Yes/No":
                            return (
                                <CustomTextField
                                    select
                                    fullWidth
                                    {...field}
                                    value={field.value ?? ""}
                                    error={!!errors[fieldName]}
                                    helperText={errors[fieldName]?.message}
                                >
                                    <MenuItem value="">
                                        <em>Select Option</em>
                                    </MenuItem>

                                    {params?.options && params?.options !== null && params?.options.length > 0 && params?.options?.map((opt, index) => (
                                        <MenuItem key={index} value={opt?.name}>
                                            {opt?.name}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            );

                        default:
                            return null;
                    }
                }}
            />
        );
    });

    /**
     * OnSubmit the Asset
     */
    const onSubmit = (formData) => {
        setIsInitialLoad(true)
        let objChecklists = Object.assign({}, getChecklistDetails)
        let arrTimes = Object.assign([], objChecklists?.times)

        let currentTimes = arrTimes.find(t => t.is_selected == true)

        let objTimes = Object.assign({}, currentTimes)
        let arrAssets = Object.assign([], objTimes?.schedules)

        let getCurrentAsset = arrAssets.find(s => s.is_view == 0)
        let currentValues = Object.assign([], getCurrentAsset?.values)

        const updatedValues = currentValues.map(param => {
            const fieldName = param.name;

            return {
                ...param,
                is_view: 1,
                value: formData[fieldName] ?? param.value
            };
        });
        let objData = {
            "asset_type_id": Number(assetId),
            "asset_id": getCurrentAsset?.asset_id,
            "group_uuid": groupUuid,
            "date": selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            "checklist_json": {
                "asset_id": getCurrentAsset?.asset_id,
                "asset_name": getCurrentAsset?.asset_name,
                "status": getCurrentAsset?.status,
                "is_view": 0,
                "times": [
                    {
                        "to": currentTimes?.to,
                        "from": currentTimes?.from,
                        "uuid": currentTimes?.uuid,
                        "is_selected": true,
                        "values": updatedValues || []
                    }
                ]
            }
        }
        setLoadingSubmit(true)
        dispatch(actionChecklistGroupHistoryAdd(objData))
    }

    /**
     * 
     * @param {*} param
     * @returns Times Component as per Status
     */
    const TimeSlotBox = ({
        objData,
        isEnabled,
        onClick,
        theme,
        isToday,
        isCurrentTimeInRange,
        isFutureTimeInRange
    }) => {

        if (objData?.status == 'Approved' && objData?.is_abnormal_approved == 1) {
            return (
                <Stack
                    key={objData.uuid}
                    sx={{
                        cursor: isEnabled ? 'pointer' : 'default',
                        justifyContent: 'center',
                        minWidth: '175px',
                        flexDirection: 'row',
                        gap: 1,
                        p: '10px 16px',
                        borderRadius: '8px',
                        alignItems: 'center',
                        background: objData?.is_selected
                            ? theme.palette.common.black : theme.palette.common.white
                    }}
                    onClick={onClick}
                >
                    {isEnabled && (
                        <>
                            {isCurrentTimeInRange
                                ? <CircleDashedIcon />
                                : <AlertTriangleIcon stroke={theme.palette.warning[600]} size={24} />
                            }
                        </>
                    )}
                    <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{
                            color: objData?.is_selected
                                ? theme.palette.common.white
                                : theme.palette.grey[500]
                        }}
                    >
                        {`${objData?.from} -${objData?.to} `}
                    </TypographyComponent>
                </Stack>
            );
        } else if (objData?.status == 'Approved' && objData?.is_abnormal_approved == 0) {
            return (
                <Stack
                    key={objData.uuid}
                    sx={{
                        cursor: isEnabled ? 'pointer' : 'default',
                        justifyContent: 'center',
                        minWidth: '175px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        p: '10px 16px',
                        borderRadius: '8px',
                        background: objData?.is_selected
                            ? theme.palette.common.black : theme.palette.common.white
                    }}
                    onClick={onClick}
                >
                    {isEnabled && (
                        <>
                            {isCurrentTimeInRange
                                ? <CircleDashedIcon />
                                : <CheckboxIcon stroke={theme.palette.success[600]} size={24} />
                            }
                        </>
                    )}
                    <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{
                            color: objData?.is_selected
                                ? theme.palette.common.white
                                : theme.palette.grey[500]
                        }}
                    >
                        {`${objData?.from} -${objData?.to} `}
                    </TypographyComponent>
                </Stack>
            );
        }
        else if (objData?.status == 'Abnormal' && objData?.is_abnormal_approved == 0) {
            return (
                <Stack
                    key={objData.uuid}
                    sx={{
                        cursor: isEnabled ? 'pointer' : 'default',
                        justifyContent: 'center',
                        minWidth: '175px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        p: '10px 16px',
                        borderRadius: '8px',
                        border: objData?.is_selected == false ? `1px solid ${theme.palette.primary[600]} ` : 'none',
                        background: objData?.is_selected
                            ? theme.palette.common.black : 'transparent'
                    }}
                    onClick={onClick}
                >
                    {isEnabled && (
                        <>
                            {isCurrentTimeInRange
                                ? <CircleDashedIcon />
                                : <AlertTriangleIcon stroke={theme.palette.warning[600]} size={24} />
                            }
                        </>
                    )}
                    <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{
                            color: objData?.is_selected
                                ? theme.palette.common.white
                                : theme.palette.grey[500]
                        }}
                    >
                        {`${objData?.from} -${objData?.to} `}
                    </TypographyComponent>
                </Stack>
            );
        } else if (objData?.status == '' && objData?.is_abnormal_approved == 0) {
            return (
                <Stack
                    key={objData.uuid}
                    sx={{
                        cursor: isEnabled ? 'pointer' : 'default',
                        justifyContent: 'center',
                        minWidth: '175px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        p: '10px 16px',
                        borderRadius: '8px',
                        background: objData?.is_selected
                            ? theme.palette.common.black : 'transparent'
                    }}
                    onClick={onClick}
                >
                    {isEnabled && (
                        <>
                            {isCurrentTimeInRange
                                ? <CircleDashedIcon />
                                : ''
                            }
                        </>
                    )}
                    <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{
                            color: objData?.is_selected
                                ? theme.palette.common.white
                                : isFutureTimeInRange && isToday ? theme.palette.grey[500] : isCurrentTimeInRange && isToday ? theme.palette.grey[500] : theme.palette.error[600]

                        }}
                    >
                        {`${objData?.from} -${objData?.to} `}
                    </TypographyComponent>
                </Stack>
            );
        } else if (objData?.status == 'Active' && objData?.is_abnormal_approved == 0) {
            return (
                <Stack
                    key={objData.uuid}
                    sx={{
                        cursor: isEnabled ? 'pointer' : 'default',
                        justifyContent: 'center',
                        minWidth: '175px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        p: '10px 16px',
                        borderRadius: '8px',
                        border: objData?.is_selected == false ? `1px solid ${theme.palette.primary[600]} ` : 'none',
                        background: objData?.is_selected
                            ? theme.palette.common.black : 'transparent'
                    }}
                    onClick={onClick}
                >
                    {isEnabled && (
                        <>
                            {isCurrentTimeInRange
                                ? <CircleDashedIcon />
                                : <CheckboxIcon stroke={theme.palette.success[600]} size={24} />
                            }
                        </>
                    )}
                    <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{
                            color: objData?.is_selected
                                ? theme.palette.common.white
                                : theme.palette.grey[500]
                        }}
                    >
                        {`${objData?.from} -${objData?.to} `}
                    </TypographyComponent>
                </Stack>
            );
        } else if (objData?.status == 'Pending' && objData?.is_abnormal_approved == 0) {
            return (
                <Stack
                    key={objData.uuid}
                    sx={{
                        cursor: isEnabled ? 'pointer' : 'default',
                        justifyContent: 'center',
                        minWidth: '175px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        p: '10px 16px',
                        borderRadius: '8px',
                        border: objData?.is_selected == false ? `1px solid ${theme.palette.primary[600]} ` : 'none',
                        background: objData?.is_selected
                            ? theme.palette.common.black : 'transparent'
                    }}
                    onClick={onClick}
                >
                    <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{
                            color: objData?.is_selected
                                ? theme.palette.common.white
                                : theme.palette.grey[500]
                        }}
                    >
                        {`${objData?.from} -${objData?.to} `}
                    </TypographyComponent>
                </Stack>
            );
        } else {
            return (
                <Stack
                    key={objData.uuid}
                    sx={{
                        cursor: isEnabled ? 'pointer' : 'default',
                        justifyContent: 'center',
                        minWidth: '175px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                        p: '10px 16px',
                        borderRadius: '8px',
                        background: isEnabled
                            ? (objData?.is_selected ? theme.palette.common.black : theme.palette.common.white)
                            : isToday ? 'transparent' : theme.palette.common.white
                    }}
                    onClick={onClick}
                >
                    {isEnabled && (
                        <>
                            {isCurrentTimeInRange
                                ? <CircleDashedIcon />
                                : <CheckboxIcon size={24} stroke={theme.palette.success[600]} />
                            }
                        </>
                    )}
                    <TypographyComponent
                        fontSize={16}
                        fontWeight={400}
                        sx={{
                            color: objData?.is_selected
                                ? theme.palette.common.white
                                : theme.palette.grey[500]
                        }}
                    >
                        {`${objData?.from} -${objData?.to} `}
                    </TypographyComponent>
                </Stack>
            );
        }

    };

    return (<>
        <React.Fragment>
            <Stack sx={{ flexDirection: { xs: 'row', sm: 'row' }, alignItems: 'center', gap: 1, mb: 3 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate(`/checklist/asset-groups/${assetId}`)
                }}>
                    <ChevronLeftIcon size={26} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={18} fontWeight={400}>Back</TypographyComponent>
            </Stack>
            <Stack sx={{
                p: '12px',
                height: "100%",
                width: '100%',
                borderRadius: "16px",
                border: `1px solid ${theme.palette.primary[600]} `,
                backgroundColor: theme.palette.common.white,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center'
            }}>
                <Stack sx={{ width: '100%', rowGap: 1 }}>
                    <Stack flexDirection={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }} gap={2} justifyContent={'space-between'} sx={{ width: '100%' }}>
                        <Stack>
                            <TypographyComponent fontSize={16} fontWeight={500}>
                                {`${getCurrentAssetGroup?.asset_type_name && getCurrentAssetGroup?.asset_type_name !== null ? getCurrentAssetGroup?.asset_type_name : ''} Checklist & Reading Report - ${getCurrentAssetGroup?.group_name && getCurrentAssetGroup?.group_name !== null ? getCurrentAssetGroup?.group_name : ''} `}
                            </TypographyComponent>
                            <Stack flexDirection={'row'} columnGap={0.5} sx={{ mb: 1.5 }}>
                                <TypographyComponent fontSize={14} fontWeight={400} color={theme.palette.grey[600]}>
                                    Location:
                                </TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={500}>
                                    {getCurrentAssetGroup?.branch_name && getCurrentAssetGroup?.branch_name !== null ? `${getCurrentAssetGroup?.branch_name} ${getCurrentAssetGroup?.branch_location && getCurrentAssetGroup?.branch_location !== null ? `, ${getCurrentAssetGroup?.branch_location}` : ''} ` : ''}
                                </TypographyComponent>
                            </Stack>
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
                                    sx={{ textTransform: "capitalize", textWrap: 'nowrap', px: 2, gap: 1, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, border: `1px solid ${theme.palette.primary[600]} ` }}
                                    onClick={() => {
                                        setIsInitialLoad(true)
                                        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && groupUuid && groupUuid !== null) {
                                            setLoadingChecklist(true)
                                            dispatch(actionChecklistGroupDetails({
                                                branch_uuid: branch?.currentBranch?.uuid,
                                                asset_type_id: assetId,
                                                group_uuid: groupUuid,
                                                date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                                            }))
                                        }
                                    }}
                                    variant='outlined'
                                >
                                    <GenerateReportIcon /> Load Checklist
                                </Button>
                            </Stack>
                            {
                                hasPermission('CHECKLIST_EXPORT') ?
                                    <Stack>
                                        <Button
                                            title="Click to export checklist for selected date"
                                            size={'small'}
                                            sx={{ textTransform: "capitalize", px: 2, gap: 1, borderRadius: '8px', backgroundColor: theme.palette.common.white, color: theme.palette.primary[600], fontSize: 16, fontWeight: 600, border: `1px solid ${theme.palette.primary[600]} `, boxShadow: 'none' }}
                                            onClick={exportChecklist}
                                            variant='outlined'
                                        >
                                            <ExportIcon stroke={theme.palette.primary[600]} />
                                            Export
                                        </Button>
                                    </Stack>
                                    :
                                    <></>
                            }
                        </Stack>
                    </Stack>
                    {
                        loadingChecklist == false ?
                            <Stack ref={scrollRef} sx={{ flexDirection: 'row', gap: 2, background: theme.palette.primary[50], padding: '8px', borderRadius: '8px', width: '100%', overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                                {
                                    getChecklistDetails && getChecklistDetails?.times?.length > 0 ?
                                        getChecklistDetails.times.map((objData) => {
                                            const isEnabled = isTimeSlotEnabled(objData.from, objData.to);
                                            const currentInRange = isCurrentTimeInRange(objData.from, objData.to);
                                            const futureRange = isFutureTimeRange(objData.from, objData.to);

                                            return (
                                                <Box
                                                    key={objData.uuid}
                                                    sx={{ display: "inline-block" }}
                                                >
                                                    <TimeSlotBox
                                                        key={objData.uuid}
                                                        objData={objData}
                                                        isEnabled={isEnabled}
                                                        theme={theme}
                                                        isToday={isToday()}
                                                        isCurrentTimeInRange={currentInRange}
                                                        isFutureTimeInRange={futureRange}
                                                        onClick={() => {
                                                            setIsInitialLoad(false)
                                                            if (isEnabled == true) {
                                                                let details = Object.assign({}, getChecklistDetails)
                                                                let arrTimes = details?.times || [];

                                                                const updatedTimes = arrTimes.map(time => {
                                                                    const isSelected = time?.uuid === objData?.uuid;

                                                                    setSelectedTimeUuid(objData?.uuid)

                                                                    // Update all assets in this time's schedules
                                                                    const updatedSchedules = time?.schedules.map(asset => ({
                                                                        ...asset,
                                                                        is_view: 1, // mark all assets as viewed
                                                                        values: asset.values.map(param => ({
                                                                            ...param,
                                                                            is_view: 1 // optionally mark all values as viewed
                                                                        }))
                                                                    }));

                                                                    return {
                                                                        ...time,
                                                                        is_selected: isSelected, // mark current time selected
                                                                        schedules: updatedSchedules
                                                                    };
                                                                });
                                                                details.times = updatedTimes;
                                                                setGetChecklistDetails(details);
                                                                methods.reset()
                                                                setFormMode('view')
                                                            }

                                                        }}
                                                    />
                                                </Box>
                                            );
                                        })
                                        : null
                                }
                            </Stack>
                            :
                            <></>
                    }
                </Stack>
            </Stack>
            {
                loadingChecklist ?
                    <Stack sx={{ height: '600px', alignItems: 'center', rowGap: 1, justifyContent: 'center' }}>
                        <CircularProgress sx={{ color: theme.palette.grey[900] }} />
                        <TypographyComponent
                            fontSize={22}
                            fontWeight={500}
                            sx={{ mt: 2, color: theme.palette.grey[900] }}
                        >
                            Loading....
                        </TypographyComponent>
                    </Stack>
                    :
                    <>
                        {
                            getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times?.length > 0 ?
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <TableContainer
                                            sx={{
                                                maxHeight: '600px',
                                                maxWidth: '100%',
                                                overflow: 'auto',
                                                background: theme.palette.grey[50],
                                                my: 1
                                            }}
                                        >
                                            <Table stickyHeader sx={{
                                                borderCollapse: "separate",
                                                borderSpacing: "8px 0",
                                                tableLayout: "fixed",
                                                background: theme.palette.grey[50]
                                            }}>
                                                <TableHead sx={{ background: theme.palette.grey[50] }}>
                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                position: { xs: '', sm: 'sticky' },
                                                                left: { xs: '', sm: 0 },
                                                                zIndex: 100,
                                                                background: theme.palette.common.white,
                                                                width: 300,
                                                                border: `1px solid ${theme.palette.divider} `,
                                                                borderRadius: '8px',
                                                                p: '15px 24px',
                                                            }
                                                            }
                                                        >
                                                            <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={500}>Parameters</TypographyComponent>

                                                        </TableCell>
                                                        {/* Time Slot Headers (00:00, 02:00, ...) */}
                                                        {getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 && getChecklistDetails?.times?.find(t => t.is_selected == true)?.schedules?.map((asset, indexAsset) => (
                                                            <TableCell
                                                                key={indexAsset}
                                                                sx={{
                                                                    backgroundColor: asset?.status == 'Approved' ? theme.palette.success[50] : theme.palette.common.white,// theme.palette.success[50],
                                                                    color: theme.palette.grey[600],
                                                                    border: asset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,//`1px solid ${ theme.palette.success[600] } `,
                                                                    borderRadius: '8px',
                                                                    fontWeight: 'bold',
                                                                    width: 255,
                                                                    p: '15px 24px',
                                                                }}
                                                            >
                                                                <Stack sx={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                                                    <Stack><TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={500}>{asset?.asset_name}</TypographyComponent></Stack>
                                                                    {
                                                                        asset?.status == 'Abnormal' || (asset?.status == 'Approved' && asset.is_abnormal_approved == 1) ?
                                                                            <Stack><AlertTriangleIcon stroke={theme.palette.warning[600]} /></Stack>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </Stack>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell sx={{
                                                            position: { xs: '', sm: 'sticky' },
                                                            top: { xs: '', sm: 0 },
                                                            zIndex: 100,
                                                            minHeight: '8px',
                                                            py: 0,
                                                            border: 0
                                                        }}>
                                                            <Stack sx={{ height: '8px' }}></Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                position: { xs: '', sm: 'sticky' },
                                                                left: { xs: '', sm: 0 },
                                                                zIndex: 1,
                                                                background: theme.palette.grey[100],
                                                                fontWeight: 'bold',
                                                                width: 300,
                                                                borderTop: `1px solid ${theme.palette.grey[300]} `,
                                                                borderLeft: `1px solid ${theme.palette.grey[300]} `,
                                                                borderRight: `1px solid ${theme.palette.grey[300]} `,
                                                                borderTopLeftRadius: '8px',
                                                                borderTopRightRadius: '8px',
                                                            }}
                                                        >
                                                            Created By
                                                        </TableCell>
                                                        {getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 && getChecklistDetails?.times.find(t => t.is_selected == true)?.schedules.map((asset, assetIndex) => {
                                                            return (
                                                                <React.Fragment>
                                                                    <TableCell
                                                                        key={`${assetIndex} -${asset?.asset_name} `}
                                                                        align="center"
                                                                        sx={{
                                                                            background: theme.palette.grey[100],
                                                                            fontWeight: 'bold',
                                                                            minWidth: 255,
                                                                            p: '15px 24px',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            borderTop: asset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                            borderLeft: asset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                            borderRight: asset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                            borderTopLeftRadius: '8px',
                                                                            borderTopRightRadius: '8px',

                                                                        }}
                                                                    >

                                                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 1, width: '100%' }}>
                                                                            <TypographyComponent fontSize={14} fontWeight={600}>{asset?.created_by && asset?.created_by !== null ? asset?.created_by : 'Rahul Mahajan'}</TypographyComponent>

                                                                        </Stack>
                                                                    </TableCell>
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                    </TableRow>

                                                    {getChecklistDetails?.parameters?.filter(p => p?.parameter_type !== 'Grouping').map((row, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell
                                                                sx={{
                                                                    position: { xs: '', sm: 'sticky' },
                                                                    left: { xs: '', sm: 0 },
                                                                    p: '15px 24px',
                                                                    background: theme.palette.common.white,
                                                                    zIndex: 1,
                                                                    // borderTop: i == 0 ? `1px solid ${theme.palette.divider} ` : '',
                                                                    borderBottom: `1px solid ${theme.palette.divider} `,
                                                                    borderLeft: `1px solid ${theme.palette.divider} `,
                                                                    borderRight: `1px solid ${theme.palette.divider} `,
                                                                    // borderTopLeftRadius: i == 0 ? '8px' : 'none',
                                                                    // borderTopRightRadius: i == 0 ? '8px' : 'none',
                                                                }}
                                                            >
                                                                <Stack sx={{ flexDirection: 'row' }}>
                                                                    <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={400}> {row.name}</TypographyComponent>
                                                                    {
                                                                        row.is_mandatory == 1 ?
                                                                            <span style={{ color: 'red' }}>*</span>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </Stack>

                                                            </TableCell>
                                                            {getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 && getChecklistDetails?.times.find(t => t.is_selected == true)?.schedules.map((objAsset) => {
                                                                // Find the value object for the current parameter in the current time slot
                                                                const paramValue = objAsset?.values?.find(v => v.parameter_id === row.id);
                                                                const value = paramValue ? paramValue.value : '';

                                                                return (
                                                                    <TableCell key={`${objAsset?.id} -${objAsset?.asset_name} `}
                                                                        sx={{
                                                                            alignItems: 'flex-start',
                                                                            p: '15px 24px',
                                                                            // borderTop: i == 0 ?
                                                                            //     objAsset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `// `1px solid ${ theme.palette.success[600] } `
                                                                            //     : '',
                                                                            borderBottom: `1px solid ${theme.palette.grey[300]} `,
                                                                            background: paramValue?.param_status == 'Abnormal' && objAsset?.is_view == 1 ? theme.palette.error[50] : objAsset?.status == 'Approved' ? theme.palette.success[50] : theme.palette.common.white,//theme.palette.success[50],
                                                                            borderLeft: objAsset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                            borderRight: objAsset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                            // borderTopLeftRadius: i == 0 ? '8px' : 'none',
                                                                            // borderTopRightRadius: i == 0 ? '8px' : 'none',
                                                                        }}>
                                                                        {/* Placeholder for the Input Field (like a TextField) */}
                                                                        {
                                                                            objAsset?.is_view == 1 ?
                                                                                <>
                                                                                    <TypographyComponent sx={{ color: paramValue?.param_status == 'Abnormal' ? theme.palette.error[600] : theme.palette.grey[900] }} fontSize={14} fontWeight={400}>{value && value !== null ? `${value} ${paramValue?.input_type == 'Number (with range)' ? (paramValue?.unit && paramValue?.unit !== null ? paramValue?.unit : '') : ''} ` : '--'} </TypographyComponent>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <FieldRenderer key={`${i} -${objAsset?.asset_id} `} params={paramValue} value={value} assetId={objAsset?.asset_id} />
                                                                                </>
                                                                        }

                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    ))}

                                                    {
                                                        isToday() == true ?
                                                            <TableRow>
                                                                <TableCell
                                                                    sx={{
                                                                        position: { xs: '', sm: 'sticky' },
                                                                        left: { xs: '', sm: 0 },
                                                                        zIndex: 100,
                                                                        background: theme.palette.common.white,
                                                                        fontWeight: 'bold',
                                                                        width: 300,
                                                                        borderBottom: `1px solid ${theme.palette.grey[300]} `,
                                                                        borderLeft: `1px solid ${theme.palette.grey[300]} `,
                                                                        borderRight: `1px solid ${theme.palette.grey[300]} `,
                                                                        borderBottomLeftRadius: '8px',
                                                                        borderBottomRightRadius: '8px',
                                                                    }}
                                                                >
                                                                    Approval Actions
                                                                </TableCell>
                                                                {getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 && getChecklistDetails?.times.find(t => t.is_selected == true)?.schedules.map((asset, assetIndex) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <TableCell
                                                                                key={`${assetIndex} -${asset?.asset_name} `}
                                                                                align="center"
                                                                                sx={{
                                                                                    backgroundColor: 'transparent',
                                                                                    fontWeight: 'bold',
                                                                                    minWidth: 255,
                                                                                    p: '15px 24px',
                                                                                    background: asset?.status == 'Approved' ? theme.palette.success[50] : theme.palette.common.white,//theme.palette.success[50],
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    borderBottom: asset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                                    borderLeft: asset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                                    borderRight: asset?.status == 'Approved' ? `1px solid ${theme.palette.success[600]} ` : `1px solid ${theme.palette.grey[300]} `,// `1px solid ${ theme.palette.success[600] } `
                                                                                    borderBottomLeftRadius: '8px',
                                                                                    borderBottomRightRadius: '8px',

                                                                                }}
                                                                            >

                                                                                <Stack sx={{ flexDirection: 'row', justifyContent: 'center', gap: 1, width: '100%' }}>

                                                                                    {
                                                                                        asset?.is_view == 1 ?
                                                                                            <>
                                                                                                {
                                                                                                    hasPermission('CHECKLIST_APPROVAL') ?
                                                                                                        <>
                                                                                                            <Button
                                                                                                                size={'small'}
                                                                                                                disabled={asset?.status == 'Approved' || asset?.status == '' ? true : false}
                                                                                                                sx={{ cursor: asset?.status == 'Approved' || asset?.status == '' ? 'default' : 'pointer', textTransform: "capitalize", px: asset?.is_view == 0 ? 4 : 6, borderRadius: '4px', backgroundColor: asset?.status == 'Approved' || asset?.status == '' ? theme.palette.grey[300] : theme.palette.primary[600], color: asset?.status == 'Approved' || asset?.status == '' ? theme.palette.grey[600] : theme.palette.common.white, fontSize: 14, fontWeight: 500, borderColor: theme.palette.primary[600] }}
                                                                                                                onClick={() => {
                                                                                                                    setOpenAssetApprovalPopup(true)
                                                                                                                    let objData = {
                                                                                                                        asset_id: asset?.asset_id,
                                                                                                                        title: `Approve ${asset?.asset_name} `,
                                                                                                                        text: `Are you sure you want to approve this asset ? This action cannot be undone.`
                                                                                                                    }
                                                                                                                    setCurrentAssetApprovalDetails(objData)
                                                                                                                }}
                                                                                                                variant='contained'
                                                                                                            >
                                                                                                                Approve
                                                                                                            </Button>
                                                                                                        </>
                                                                                                        :
                                                                                                        <></>
                                                                                                }

                                                                                                {
                                                                                                    asset?.status !== 'Approved' && hasPermission('CHECKLIST_UPDATE') ?
                                                                                                        <Button disabled={getEditModeCount()} sx={{ columnGap: 0.5, px: 2, border: getEditModeCount() ? `1px solid ${theme.palette.grey[300]} ` : `1px solid ${theme.palette.primary[600]} `, background: getEditModeCount() ? theme.palette.grey[300] : '', color: getEditModeCount() ? theme.palette.grey[600] : theme.palette.primary[600], textTransform: 'capitalize', borderRadius: '4px' }}
                                                                                                            onClick={() => {
                                                                                                                // methods.reset()

                                                                                                                let details = Object.assign({}, getChecklistDetails)
                                                                                                                let arrTimes = Object.assign([], details?.times)
                                                                                                                let currentTime = arrTimes?.find(t => t.is_selected == true)
                                                                                                                let currentTimeIndex = arrTimes?.findIndex(t => t.is_selected == true)

                                                                                                                let arrSchedules = Object.assign([], currentTime?.schedules)

                                                                                                                let currentAsset = arrSchedules?.find(a => a.asset_id == asset?.asset_id)
                                                                                                                currentAsset.is_view = 0
                                                                                                                let currentAssetIndex = arrSchedules?.findIndex(a => a.asset_id == asset?.asset_id)
                                                                                                                arrSchedules[currentAssetIndex] = currentAsset
                                                                                                                currentTime.schedules = arrSchedules
                                                                                                                arrTimes[currentTimeIndex] = currentTime
                                                                                                                details.times = arrTimes
                                                                                                                setGetChecklistDetails(details)

                                                                                                                setFormMode('edit')
                                                                                                            }}>
                                                                                                            <EditCircleIcon stroke={getEditModeCount() ? theme.palette.grey[600] : theme.palette.primary[600]} size={18} /> Edit
                                                                                                        </Button>
                                                                                                        :
                                                                                                        <></>
                                                                                                }

                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                                <Button
                                                                                                    title={'Cancel'}
                                                                                                    sx={{ columnGap: 0.5, px: 6, color: theme.palette.primary[600], border: `1px solid ${theme.palette.primary[600]} `, background: theme.palette.common.white, textTransform: 'capitalize', borderRadius: '4px' }}
                                                                                                    onClick={() => {
                                                                                                        let details = Object.assign({}, getChecklistDetails)
                                                                                                        let arrTimes = Object.assign([], details?.times)
                                                                                                        let currentTime = arrTimes?.find(t => t.is_selected == true)
                                                                                                        let currentTimeIndex = arrTimes?.findIndex(t => t.is_selected == true)

                                                                                                        let arrSchedules = Object.assign([], currentTime?.schedules)

                                                                                                        let currentAsset = arrSchedules?.find(a => a.asset_id == asset?.asset_id)
                                                                                                        currentAsset.is_view = 1
                                                                                                        let currentAssetIndex = arrSchedules?.findIndex(a => a.asset_id == asset?.asset_id)
                                                                                                        arrSchedules[currentAssetIndex] = currentAsset
                                                                                                        currentTime.schedules = arrSchedules
                                                                                                        arrTimes[currentTimeIndex] = currentTime
                                                                                                        details.times = arrTimes
                                                                                                        setGetChecklistDetails(details)

                                                                                                        reset()
                                                                                                        setFormMode('view')
                                                                                                    }}
                                                                                                >
                                                                                                    <CloseIcon stroke={theme.palette.primary[600]} size={10} />
                                                                                                    Cancel
                                                                                                </Button>
                                                                                                {
                                                                                                    hasPermission('CHECKLIST_UPDATE') ?
                                                                                                        <>
                                                                                                            {loadingSubmit ?
                                                                                                                <Button sx={{ backgroundColor: theme.palette.grey[300] }}>
                                                                                                                    <CircularProgress size={16} sx={{ color: theme.palette.grey[600] }} />
                                                                                                                </Button>
                                                                                                                :
                                                                                                                <Button sx={{ columnGap: 0.5, px: 6, color: theme.palette.common.white, background: theme.palette.success[600], textTransform: 'capitalize', borderRadius: '4px' }}
                                                                                                                    onClick={() => {
                                                                                                                        methods.handleSubmit(onSubmit)()
                                                                                                                    }}
                                                                                                                >
                                                                                                                    Save
                                                                                                                </Button>
                                                                                                            }
                                                                                                        </>
                                                                                                        :
                                                                                                        <></>
                                                                                                }

                                                                                            </>
                                                                                    }
                                                                                </Stack>
                                                                            </TableCell>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </TableRow>
                                                            :
                                                            <></>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </form>
                                </FormProvider>
                                :
                                <Stack sx={{ borderRadius: '16px', mt: 2, pb: 2, height: { xs: '100%', sm: '100%', md: '500px', lg: '500px' }, background: theme.palette.common.white }}><EmptyContent mt={6} imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Checklist Found'} subTitle={''} /></Stack>
                        }
                    </>
            }
            {
                openAssetApprovalPopup &&
                <AlertPopup
                    open={openAssetApprovalPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                    color={theme.palette.error[600]}
                    objData={currentAssetApprovalDetails}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenAssetApprovalPopup(false)
                        }}>
                            Cancel
                        </Button>
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={loadingApprove} onClick={() => {
                            setLoadingApprove(true)
                            let getCurrentTimes = getChecklistDetails?.times.find(t => t.is_selected == true)
                            if (currentAssetApprovalDetails?.asset_id && currentAssetApprovalDetails?.asset_id !== null) {
                                dispatch(actionChecklistGroupAssetApprove({
                                    group_uuid: groupUuid,
                                    time_uuid: getCurrentTimes && getCurrentTimes !== null ? getCurrentTimes?.uuid : '',
                                    asset_id: currentAssetApprovalDetails?.asset_id,
                                    date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
                                }))
                            }
                        }}>
                            {loadingApprove ? <CircularProgress size={20} color="white" /> : 'Confirm'}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment >
    </>)
}