import { Button, IconButton, InputAdornment, MenuItem, Stack, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
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
import { actionChecklistGroupDetails, actionChecklistGroupHistoryAdd, resetChecklistGroupDetailsResponse, resetChecklistGroupHistoryAddResponse } from "../../../store/checklist";
import { useBranch } from "../../../hooks/useBranch";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import CircleDashedIcon from "../../../assets/icons/CircleDashedIcon";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import CloseIcon from "../../../assets/icons/CloseIcon";

export default function ChecklistView() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { assetId, groupUuid } = useParams()

    const methods = useForm();

    //Stores
    const { checklistGroupDetails, checklistGroupHistoryAdd } = useSelector(state => state.checklistStore)

    //Default Checklists Counts Array
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(moment().format('DD/MM/YYYY'))
    const [getChecklistDetails, setGetChecklistDetails] = useState(null)
    const [selectedTimeUuid, setSelectedTimeUuid] = useState(null)

    useEffect(() => {
        setSelectedTimeUuid(null)
        dispatch(actionChecklistGroupDetails({
            branch_uuid: branch?.currentBranch?.uuid,
            asset_type_id: assetId,
            group_uuid: groupUuid,
            date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        }))
    }, [branch?.currentBranch?.uuid, groupUuid])

    console.log('-----getChecklistDetails--------', getChecklistDetails)

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
     * function to generate times json along with corresponding - Assets, Parameters from asset_checklist_json
     * @param {*} assetGroup 
     * @returns 
     */
    const prepareAssetWiseJson = (assetGroup) => {
        const { assets, checklist_json, asset_checklist_json } = assetGroup;
        const { parameters, times } = checklist_json;


        return times?.map((timeObj, index) => ({
            ...timeObj,
            is_selected: selectedTimeUuid && selectedTimeUuid !== null && selectedTimeUuid == timeObj?.uuid && index != 0 ? true : (index == 0 && selectedTimeUuid == null ? true : false),
            schedules: assets?.map(asset => ({
                asset_id: asset?.asset_id,
                asset_name: asset?.asset_name,
                status: "",
                is_view: 1,
                values: getParameters(asset?.asset_id, timeObj?.uuid, asset_checklist_json) && getParameters(asset?.asset_id, timeObj?.uuid, asset_checklist_json) !== null && getParameters(asset?.asset_id, timeObj?.uuid, asset_checklist_json)?.length > 0 ? getParameters(asset?.asset_id, timeObj?.uuid, asset_checklist_json) : parameters.map(param => ({
                    parameter_id: param.id,
                    value: "",
                    max: param.max,
                    min: param.min,
                    name: param.name,
                    unit: param.unit,
                    options: param.options,
                    sequence: param.sequence,
                    sub_name: param.sub_name,
                    parent_id: param.parent_id,
                    input_type: param.input_type,
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

        return times?.map((timeObj, index) => ({
            ...timeObj,
            is_selected: index == 0 ? true : false,
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
                    sub_name: param.sub_name,
                    parent_id: param.parent_id,
                    input_type: param.input_type,
                    is_mandatory: param.is_mandatory,
                    default_value: param.default_value
                }))
            }))
        }));
    };

    /**
     * on updation of getCurrentAssetGroup prepare the times json
     */
    useEffect(() => {
        if (getCurrentAssetGroup && getCurrentAssetGroup !== null) {
            if (getCurrentAssetGroup?.asset_checklist_json && getCurrentAssetGroup?.asset_checklist_json !== null && getCurrentAssetGroup?.asset_checklist_json.length > 0) {
                let preparedData = prepareAssetWiseJson(getCurrentAssetGroup)
                let currentDetails = Object.assign({}, getChecklistDetails)
                currentDetails.times = preparedData
                currentDetails.parameters = getCurrentAssetGroup?.checklist_json?.parameters
                setGetChecklistDetails(currentDetails)
            } else {
                let preparedData = prepareScheduleJson(getCurrentAssetGroup)
                let currentDetails = Object.assign({}, getChecklistDetails)
                currentDetails.times = preparedData
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
                console.log('-----------')
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
                let response = Object.assign({}, checklistGroupDetails?.response)
                // response.asset_checklist_json = [
                //     {
                //         "asset_id": 3,
                //         "asset_name": "Solar energy equipment",
                //         "status": "",
                //         "times": [
                //             {
                //                 "to": "02:00",
                //                 "from": "00:00",
                //                 "uuid": "0d9bcdbe-57cd-4353-90d7-905e13bd6f9a",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "04:00",
                //                 "from": "02:00",
                //                 "uuid": "718fb2ce-6edb-4fe3-a29a-bb9ffc77daad",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "06:00",
                //                 "from": "04:00",
                //                 "uuid": "cf761e5e-699b-4293-bc66-4e62919fe63f",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "08:00",
                //                 "from": "06:00",
                //                 "uuid": "01eeef1e-19f8-4256-bb3a-5d0b8c93016e",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "10:00",
                //                 "from": "08:00",
                //                 "uuid": "e7344dc1-adac-4086-b912-05990fa2e4ca",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "12:00",
                //                 "from": "10:00",
                //                 "uuid": "f6bf1534-def0-4e77-b2bd-9fcc344a69b8",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "14:00",
                //                 "from": "12:00",
                //                 "uuid": "841d7ffb-b902-4496-baf1-68b9ae4fb35a",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "16:00",
                //                 "from": "14:00",
                //                 "uuid": "863127f8-9e2c-44ec-a228-f2f68225ebc3",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "18:00",
                //                 "from": "16:00",
                //                 "uuid": "03a5a940-8eac-496c-b78f-6b599f6cfa41",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "20:00",
                //                 "from": "18:00",
                //                 "uuid": "f6a91510-2bea-4971-9408-7356b8cc7e55",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "22:00",
                //                 "from": "20:00",
                //                 "uuid": "7de48ea1-34c6-4cfa-b7ce-25f19e8296b0",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "00:00",
                //                 "from": "22:00",
                //                 "uuid": "63162d05-08c0-429a-b4e5-13f6e8419279",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             }
                //         ]
                //     },
                //     {
                //         "asset_id": 4,
                //         "asset_name": " MBC (Miniature Circuit Breaker)",
                //         "status": "",
                //         "times": [
                //             {
                //                 "to": "02:00",
                //                 "from": "00:00",
                //                 "uuid": "0d9bcdbe-57cd-4353-90d7-905e13bd6f9a",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "04:00",
                //                 "from": "02:00",
                //                 "uuid": "718fb2ce-6edb-4fe3-a29a-bb9ffc77daad",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "06:00",
                //                 "from": "04:00",
                //                 "uuid": "cf761e5e-699b-4293-bc66-4e62919fe63f",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "08:00",
                //                 "from": "06:00",
                //                 "uuid": "01eeef1e-19f8-4256-bb3a-5d0b8c93016e",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "10:00",
                //                 "from": "08:00",
                //                 "uuid": "e7344dc1-adac-4086-b912-05990fa2e4ca",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "12:00",
                //                 "from": "10:00",
                //                 "uuid": "f6bf1534-def0-4e77-b2bd-9fcc344a69b8",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "14:00",
                //                 "from": "12:00",
                //                 "uuid": "841d7ffb-b902-4496-baf1-68b9ae4fb35a",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "16:00",
                //                 "from": "14:00",
                //                 "uuid": "863127f8-9e2c-44ec-a228-f2f68225ebc3",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "18:00",
                //                 "from": "16:00",
                //                 "uuid": "03a5a940-8eac-496c-b78f-6b599f6cfa41",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "20:00",
                //                 "from": "18:00",
                //                 "uuid": "f6a91510-2bea-4971-9408-7356b8cc7e55",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "22:00",
                //                 "from": "20:00",
                //                 "uuid": "7de48ea1-34c6-4cfa-b7ce-25f19e8296b0",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "00:00",
                //                 "from": "22:00",
                //                 "uuid": "63162d05-08c0-429a-b4e5-13f6e8419279",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             }
                //         ]
                //     },
                //     {
                //         "asset_id": 9,
                //         "asset_name": "Electric vehicles (EVs)",
                //         "status": "",
                //         "times": [
                //             {
                //                 "to": "02:00",
                //                 "from": "00:00",
                //                 "uuid": "0d9bcdbe-57cd-4353-90d7-905e13bd6f9a",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "04:00",
                //                 "from": "02:00",
                //                 "uuid": "718fb2ce-6edb-4fe3-a29a-bb9ffc77daad",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "06:00",
                //                 "from": "04:00",
                //                 "uuid": "cf761e5e-699b-4293-bc66-4e62919fe63f",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "08:00",
                //                 "from": "06:00",
                //                 "uuid": "01eeef1e-19f8-4256-bb3a-5d0b8c93016e",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "10:00",
                //                 "from": "08:00",
                //                 "uuid": "e7344dc1-adac-4086-b912-05990fa2e4ca",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "12:00",
                //                 "from": "10:00",
                //                 "uuid": "f6bf1534-def0-4e77-b2bd-9fcc344a69b8",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "14:00",
                //                 "from": "12:00",
                //                 "uuid": "841d7ffb-b902-4496-baf1-68b9ae4fb35a",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "16:00",
                //                 "from": "14:00",
                //                 "uuid": "863127f8-9e2c-44ec-a228-f2f68225ebc3",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "18:00",
                //                 "from": "16:00",
                //                 "uuid": "03a5a940-8eac-496c-b78f-6b599f6cfa41",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "20:00",
                //                 "from": "18:00",
                //                 "uuid": "f6a91510-2bea-4971-9408-7356b8cc7e55",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "22:00",
                //                 "from": "20:00",
                //                 "uuid": "7de48ea1-34c6-4cfa-b7ce-25f19e8296b0",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             },
                //             {
                //                 "to": "00:00",
                //                 "from": "22:00",
                //                 "uuid": "63162d05-08c0-429a-b4e5-13f6e8419279",
                //                 "values": [
                //                     {
                //                         "parameter_id": 1,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Temperature",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 1,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 2,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Pressure",
                //                         "unit": "",
                //                         "options": [
                //                             "ASDFG"
                //                         ],
                //                         "sequence": 2,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Multiple Choice",
                //                         "is_mandatory": 1,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 3,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Flow Rate",
                //                         "unit": "",
                //                         "options": "Number (with range)",
                //                         "sequence": 3,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Number (with range)",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 4,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Vibration Level",
                //                         "unit": "",
                //                         "options": [

                //                         ],
                //                         "sequence": 4,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Text Input",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     },
                //                     {
                //                         "parameter_id": 5,
                //                         "value": "",
                //                         "max": "",
                //                         "min": "",
                //                         "name": "Oil Level",
                //                         "unit": "",
                //                         "options": [
                //                             "Yes",
                //                             "No"
                //                         ],
                //                         "sequence": 5,
                //                         "sub_name": "",
                //                         "parent_id": 0,
                //                         "input_type": "Yes/No",
                //                         "is_mandatory": 0,
                //                         "default_value": ""
                //                     }
                //                 ]
                //             }
                //         ]
                //     }
                // ]
                setGetCurrentAssetGroup(response)

                // setLoadingList(false)
            } else {
                // setLoadingList(false)
                setGetCurrentAssetGroup(null)
                setGetChecklistDetails(null)
                // setSelectedTimeSlot(getChecklistDetails.times[0])
                // setGetCurrentAssetGroup({
                //     "id": 1,
                //     "asset_type_id": "1",
                //     "asset_type": "DG",
                //     "asset_group": "DG Set Tower 1",
                //     "location": 'Vodafone India Pvt Ltd',
                //     "total_groups": "2",
                //     "total_assets": "15",
                //     "total_checklists": "36",
                //     "total_completed": "12",
                //     "total_overdue": "2",
                //     "total_abnormal": "4",
                //     "total_pending": "24",
                //     "total_not_approved": "2",
                //     "times": [
                //         {
                //             uuid: 'ghghj-huyghhgh',
                //             frm: '12:00',
                //             to: '02:00'
                //         },
                //         {
                //             uuid: 'ghsdddj-huyghhgh',
                //             frm: '02:00',
                //             to: '04:00'
                //         },
                //         {
                //             uuid: 'ghghj-huyg678hhyhhgh',
                //             frm: '04:00',
                //             to: '06:00'
                //         },
                //         {
                //             uuid: 'ghffffghj-444dfff',
                //             frm: '06:00',
                //             to: '08:00'
                //         },
                //         {
                //             uuid: 'ghgddfr887hj-huyg555hhgh',
                //             frm: '08:00',
                //             to: '10:00'
                //         },
                //     ]
                // })
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
                // setLoadingSubmit(false)
                methods.reset()
                showSnackbar({ message: checklistGroupHistoryAdd.message, severity: "success" })
                dispatch(actionChecklistGroupDetails({
                    branch_uuid: branch?.currentBranch?.uuid,
                    asset_type_id: assetId,
                    group_uuid: groupUuid,
                    date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                }))
                // handleClose('save')
            } else {
                // setLoadingSubmit(false)
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
        return now >= fromTime;

        // Optional: if you want to disable after 'to' as well
        // return now >= fromTime && now <= toTime;
    };


    // const handleValueUpdate = (assetId, params, value) => {
    //     console.log('---------assetId--------', assetId)
    //     console.log('---------params--------', params)
    //     console.log('---------value--------', value)
    //     let objParams = Object.assign({}, params)
    //     objParams.value = value

    //     let objChecklists = Object.assign({}, getChecklistDetails)
    //     let arrTimes = Object.assign([], objChecklists?.times)

    //     let currentTimesIndex = arrTimes.findIndex(t => t.is_selected == true)
    //     let currentTimes = arrTimes.find(t => t.is_selected == true)

    //     let objTimes = Object.assign({}, currentTimes)
    //     let arrAssets = Object.assign([], objTimes?.schedules)

    //     let getCurrentAssetIndex = arrAssets.findIndex(s => s.asset_id == assetId)
    //     let getCurrentAsset = arrAssets.find(s => s.asset_id == assetId)

    //     let objAsset = Object.assign({}, getCurrentAsset)
    //     let arrParameters = Object.assign([], objAsset?.values)
    //     let getParameterIndex = arrParameters.findIndex(p => p.parameter_id == params?.parameter_id)
    //     arrParameters[getParameterIndex] = objParams
    //     objAsset.values = arrParameters
    //     arrAssets[getCurrentAssetIndex] = objAsset
    //     objTimes.schedules = arrAssets
    //     arrTimes[currentTimesIndex] = objTimes
    //     objChecklists.times = arrTimes
    //     setGetChecklistDetails(objChecklists)
    // }

    // const handleValueUpdate = (assetId, params, value) => {
    //     setGetChecklistDetails(prev => {
    //         return {
    //             ...prev,
    //             times: prev.times.map(time => {
    //                 if (!time.is_selected) return time;

    //                 return {
    //                     ...time,
    //                     schedules: time.schedules.map(asset => {
    //                         if (asset.asset_id !== assetId) return asset;

    //                         return {
    //                             ...asset,
    //                             values: asset.values.map(v =>
    //                                 v.parameter_id === params.parameter_id
    //                                     ? { ...v, value }
    //                                     : v
    //                             )
    //                         };
    //                     })
    //                 };
    //             })
    //         };
    //     });
    // };


    /**
     * Function to return fields with validations
     * @param {*} params, value
     * @returns 
     */
    // const FieldRenderer = ({ params, value, assetId }) => {
    //     const { control, register, formState: { errors } } = useFormContext();

    //     // Dynamic + unique field name 
    //     // const fieldName = `${assetId}_${params.parameter_id}`;
    //     const fieldName = `${params.name}`;

    //     // Validation rules
    //     const validationRules = {
    //         required: params?.is_mandatory ? `${params?.name} is required` : false,
    //         min: params?.min
    //             ? { value: Number(params.min), message: `Value should be between ${params.min} and ${params.max}` }
    //             : undefined,
    //         max: params?.max
    //             ? { value: Number(params.max), message: `Value should be between ${params.min} and ${params.max}` }
    //             : undefined,
    //     };

    //     switch (params?.input_type) {

    //         // ---------------- TEXT INPUT ----------------
    //         case "Text Input":
    //             return (
    //                 <CustomTextField
    //                     fullWidth
    //                     defaultValue={value ?? ""}
    //                     placeholder={`Enter ${params?.name}`}
    //                     {...register(fieldName, validationRules)}
    //                     error={!!errors[fieldName]}
    //                     helperText={errors[fieldName]?.message}
    //                 />
    //             );

    //         // ---------------- NUMBER INPUT ----------------
    //         case "Number (with range)":
    //             return (
    //                 <CustomTextField
    //                     fullWidth
    //                     type="number"
    //                     size="small"
    //                     defaultValue={value ?? ""}
    //                     InputProps={{
    //                         endAdornment: (
    //                             <InputAdornment position='end'>
    //                                 {/* <IconButton
    //                                     edge='end'
    //                                     onMouseDown={e => e.preventDefault()}
    //                                 > */}
    //                                 {params?.unit}
    //                                 {/* </IconButton> */}
    //                             </InputAdornment>
    //                         )
    //                     }}
    //                     placeholder={`Enter ${params?.name}`}
    //                     {...register(fieldName, validationRules)}
    //                     error={!!errors[fieldName]}
    //                     helperText={errors[fieldName]?.message}
    //                 />
    //             );

    //         // ---------------- DROPDOWN INPUT ----------------
    //         case "Multiple Choice":
    //         case "Yes/No":
    //             return (
    //                 <Controller
    //                     control={control}
    //                     name={fieldName}
    //                     defaultValue={value ?? ""}
    //                     rules={validationRules}
    //                     render={({ field }) => (
    //                         <CustomTextField
    //                             select
    //                             fullWidth
    //                             {...field}
    //                             error={!!errors[fieldName]}
    //                             helperText={errors[fieldName]?.message}
    //                         >
    //                             <MenuItem value="">
    //                                 <em>Select Option</em>
    //                             </MenuItem>

    //                             {params.options?.map((opt, i) => (
    //                                 <MenuItem key={i} value={opt}>
    //                                     {opt}
    //                                 </MenuItem>
    //                             ))}
    //                         </CustomTextField>
    //                     )}
    //                 />
    //             );
    //         // return (
    //         //     <CustomTextField
    //         //         select
    //         //         fullWidth
    //         //         defaultValue={value ?? ""}
    //         //         placeholder={`Select ${params?.name}`}
    //         //         {...register(fieldName, validationRules)}
    //         //         error={!!errors[fieldName]}
    //         //         helperText={errors[fieldName]?.message}
    //         //     >
    //         //         <MenuItem value="">
    //         //             <em>Select Option</em>
    //         //         </MenuItem>

    //         //         {params.options?.map((option, index) => (
    //         //             <MenuItem key={index} value={option}>
    //         //                 {option}
    //         //             </MenuItem>
    //         //         ))}
    //         //     </CustomTextField>
    //         // );

    //         default:
    //             return null;
    //     }
    // };


    const FieldRenderer = ({ params, value, assetId }) => {
        const { control, formState: { errors } } = useFormContext();

        const fieldName = `${params.name}`;

        const validationRules = {
            required: params?.is_mandatory ? `${params?.name} is required` : false,
            min: params?.min
                ? { value: Number(params.min), message: `Value should be between ${params.min} and ${params.max}` }
                : undefined,
            max: params?.max
                ? { value: Number(params.max), message: `Value should be between ${params.min} and ${params.max}` }
                : undefined,
        };

        return (
            <Controller
                name={fieldName}
                control={control}
                defaultValue={value ?? ""}
                rules={validationRules}
                render={({ field }) => {
                    switch (params?.input_type) {

                        // ---------------- TEXT INPUT ----------------
                        case "Text Input":
                            return (
                                <CustomTextField
                                    fullWidth
                                    placeholder={`Enter ${params?.name}`}
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
                                    placeholder={`Enter ${params?.name}`}
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
                                    error={!!errors[fieldName]}
                                    helperText={errors[fieldName]?.message}
                                >
                                    <MenuItem value="">
                                        <em>Select Option</em>
                                    </MenuItem>

                                    {params.options?.map((opt, index) => (
                                        <MenuItem key={index} value={opt}>
                                            {opt}
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
    };


    const onSubmit = (formData) => {

        let objChecklists = Object.assign({}, getChecklistDetails)
        let arrTimes = Object.assign([], objChecklists?.times)

        // let currentTimesIndex = arrTimes.findIndex(t => t.is_selected == true)
        let currentTimes = arrTimes.find(t => t.is_selected == true)

        let objTimes = Object.assign({}, currentTimes)
        let arrAssets = Object.assign([], objTimes?.schedules)

        // let getCurrentAssetIndex = arrAssets.findIndex(s => s.is_view == 0)
        let getCurrentAsset = arrAssets.find(s => s.is_view == 0)
        let currentValues = Object.assign([], getCurrentAsset?.values)

        const updatedValues = currentValues.map(param => {
            // Construct the dynamic fieldName
            // const fieldName = `${getCurrentAsset.asset_id}_${param.parameter_id}`;
            const fieldName = `${param.name}`;

            return {
                ...param,
                is_view: 1,
                value: formData[fieldName] ?? param.value
            };
        });


        console.log('--------formData--------', formData)
        //Call save api
        // setGetChecklistDetails(prev => {
        //     return {
        //         ...prev,
        //         times: prev.times.map(time => {
        //             if (!time.is_selected) return time;

        //             // Update only the selected time block
        //             return {
        //                 ...time,
        //                 schedules: time.schedules.map(asset => {

        //                     const updatedValues = asset.values.map(param => {
        //                         // Construct the dynamic fieldName
        //                         const fieldName = `${asset.asset_id}_${param.parameter_id}`;

        //                         return {
        //                             ...param,
        //                             is_view: 1,
        //                             value: formData[fieldName] ?? param.value
        //                         };
        //                     });

        //                     return {
        //                         ...asset,
        //                         values: updatedValues
        //                     };
        //                 })
        //             };
        //         })
        //     };
        // });
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

        console.log('--------objData----@@@@@@@@@@------', objData)
        dispatch(actionChecklistGroupHistoryAdd(objData))
    }

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
                border: `1px solid ${theme.palette.primary[600]}`,
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
                                {`${getCurrentAssetGroup?.asset_type_name && getCurrentAssetGroup?.asset_type_name !== null ? getCurrentAssetGroup?.asset_type_name : ''} Checklist & Reading Report - ${getCurrentAssetGroup?.group_name && getCurrentAssetGroup?.group_name !== null ? getCurrentAssetGroup?.group_name : ''}`}
                            </TypographyComponent>
                            <Stack flexDirection={'row'} columnGap={0.5} sx={{ mb: 1.5 }}>
                                <TypographyComponent fontSize={14} fontWeight={400} color={theme.palette.grey[600]}>
                                    Location:
                                </TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={500}>
                                    {getCurrentAssetGroup?.location}
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
                                    size={'small'}
                                    sx={{ textTransform: "capitalize", px: 2, gap: 1, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, border: `1px solid ${theme.palette.primary[600]}` }}
                                    onClick={() => {
                                        dispatch(actionChecklistGroupDetails({
                                            branch_uuid: branch?.currentBranch?.uuid,
                                            asset_type_id: assetId,
                                            group_uuid: groupUuid,
                                            date: moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
                                        }))
                                    }}
                                    variant='outlined'
                                >
                                    <GenerateReportIcon />
                                    Generate Report
                                </Button>
                            </Stack>


                            <Stack>
                                <Button
                                    size={'small'}
                                    sx={{ textTransform: "capitalize", px: 2, gap: 1, borderRadius: '8px', backgroundColor: theme.palette.common.white, color: theme.palette.primary[600], fontSize: 16, fontWeight: 600, border: `1px solid ${theme.palette.primary[600]}`, boxShadow: 'none' }}
                                    onClick={() => {
                                        // setOpenAddInventoryPopup(true)
                                    }}
                                    variant='outlined'
                                >
                                    <ExportIcon stroke={theme.palette.primary[600]} />
                                    Export
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack sx={{ flexDirection: 'row', gap: 2, background: theme.palette.primary[50], padding: '8px', borderRadius: '8px', width: '100%', overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                        {
                            getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 ?
                                getChecklistDetails?.times?.map((objData, index) => {
                                    const isEnabled = isTimeSlotEnabled(objData.from, objData.to);

                                    return (<Stack
                                        key={index}
                                        sx={{
                                            cursor: isEnabled == true ? 'pointer' : '', justifyContent: 'center', minWidth: '175px', flexDirection: 'row', gap: 1, p: '10px 16px', borderRadius: '8px',
                                            background: isEnabled == true ?
                                                (objData?.is_selected == true ? theme.palette.common.black : theme.palette.common.white)
                                                : 'transparent'
                                        }}
                                        onClick={() => {
                                            if (isEnabled == true) {
                                                let details = Object.assign({}, getChecklistDetails)// shallow copy
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
                                            }

                                        }}
                                    >
                                        {
                                            isEnabled == true ?
                                                <>
                                                    {
                                                        // selectedTimeSlot?.uuid === objData?.uuid ?
                                                        objData?.is_selected == true ?
                                                            <CircleDashedIcon />
                                                            :
                                                            <CheckboxIcon size={24} />
                                                    }
                                                </>
                                                : <></>
                                        }

                                        <TypographyComponent fontSize={16} fontWeight={400}
                                            sx={{
                                                color:
                                                    // selectedTimeSlot?.uuid === objData?.uuid ?
                                                    objData?.is_selected == true ?
                                                        theme.palette.common.white : theme.palette.grey[500]
                                            }}>{`${objData?.from}-${objData?.to}`}</TypographyComponent>
                                    </Stack>)
                                })
                                :
                                <></>
                        }
                    </Stack>

                </Stack>
            </Stack>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                            borderCollapse: "separate",        // REQUIRED for spacing
                            borderSpacing: "8px 0",           // Horizontal gap (12px)
                            tableLayout: "fixed",
                            background: theme.palette.grey[50]
                        }}>
                            <TableHead sx={{ background: theme.palette.grey[50] }}>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 100,
                                            background: theme.palette.common.white,
                                            width: 300,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: '8px',
                                            p: '15px 24px',
                                        }}
                                    >
                                        <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={500}>Parameters</TypographyComponent>

                                    </TableCell>
                                    {/* Time Slot Headers (00:00, 02:00, ...) */}
                                    {getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 && getChecklistDetails?.times?.find(t => t.is_selected == true)?.schedules?.map((asset, indexAsset) => (
                                        <TableCell
                                            key={indexAsset}
                                            sx={{
                                                backgroundColor: theme.palette.common.white,// theme.palette.success[50],
                                                color: theme.palette.grey[600],
                                                border: `1px solid ${theme.palette.grey[300]}`,//`1px solid ${theme.palette.success[600]}`,
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                width: 255,
                                                p: '15px 24px',
                                            }}
                                        >
                                            <Stack sx={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                                <Stack><TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={500}>{asset?.asset_name}</TypographyComponent></Stack>
                                                <Stack><AlertTriangleIcon stroke={theme.palette.warning[600]} /></Stack>
                                            </Stack>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 100,
                                        minHeight: '8px',
                                        py: 0,
                                        border: 0
                                    }}>
                                        <Stack sx={{ height: '8px' }}></Stack>
                                    </TableCell>
                                </TableRow>
                                {getChecklistDetails?.parameters?.filter(p => p?.parameter_type !== 'Grouping').map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell
                                            sx={{
                                                position: 'sticky',
                                                left: 0,
                                                p: '15px 24px',
                                                background: theme.palette.common.white,
                                                zIndex: 1,
                                                borderTop: i == 0 ? `1px solid ${theme.palette.divider}` : '',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                borderLeft: `1px solid ${theme.palette.divider}`,
                                                borderRight: `1px solid ${theme.palette.divider}`,
                                                borderTopLeftRadius: i == 0 ? '8px' : 'none',
                                                borderTopRightRadius: i == 0 ? '8px' : 'none',
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
                                        {/* {selectedTimeSlot?.schedules.map((timeSlot) => { */}
                                        {getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 && getChecklistDetails?.times.find(t => t.is_selected == true)?.schedules.map((objAsset) => {
                                            // Find the value object for the current parameter in the current time slot
                                            const paramValue = objAsset?.values?.find(v => v.parameter_id === row.id);
                                            const value = paramValue ? paramValue.value : '';

                                            return (
                                                <TableCell key={`${objAsset?.id}-${objAsset?.asset_name}`}
                                                    sx={{
                                                        alignItems: 'flex-start',
                                                        p: '15px 24px',
                                                        borderTop: i == 0 ?
                                                            `1px solid ${theme.palette.grey[300]}`// `1px solid ${theme.palette.success[600]}`
                                                            : '',
                                                        borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                        background: theme.palette.common.white,//theme.palette.success[50],
                                                        borderLeft: `1px solid ${theme.palette.grey[300]}`,// `1px solid ${theme.palette.success[600]}`
                                                        borderRight: `1px solid ${theme.palette.grey[300]}`,// `1px solid ${theme.palette.success[600]}`
                                                        borderTopLeftRadius: i == 0 ? '8px' : 'none',
                                                        borderTopRightRadius: i == 0 ? '8px' : 'none',
                                                    }}>
                                                    {/* Placeholder for the Input Field (like a TextField) */}
                                                    {
                                                        objAsset?.is_view == 1 ?
                                                            <>
                                                                <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={400}>{value && value !== null ? `${value} ${paramValue?.input_type == 'Number (with range)' ? (paramValue?.unit && paramValue?.unit !== null ? paramValue?.unit : '') : '--'}` : '--'} </TypographyComponent>
                                                            </>
                                                            :
                                                            <>
                                                                <FieldRenderer key={`${i}-${objAsset?.asset_id}`} params={paramValue} value={value} assetId={objAsset?.asset_id} />
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
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                    background: theme.palette.common.white,
                                                    fontWeight: 'bold',
                                                    width: 300,
                                                    borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                    borderLeft: `1px solid ${theme.palette.grey[300]}`,
                                                    borderRight: `1px solid ${theme.palette.grey[300]}`,
                                                    borderBottomLeftRadius: '8px',
                                                    borderBottomRightRadius: '8px',
                                                }}
                                            >
                                                Approval Actions
                                            </TableCell>
                                            {/* {selectedTimeSlot?.schedules.map((asset, assetIndex) => { */}
                                            {getChecklistDetails && getChecklistDetails !== null && getChecklistDetails?.times && getChecklistDetails?.times !== null && getChecklistDetails?.times.length > 0 && getChecklistDetails?.times.find(t => t.is_selected == true)?.schedules.map((asset, assetIndex) => {
                                                return (
                                                    <React.Fragment>
                                                        <TableCell
                                                            key={`${assetIndex}-${asset?.asset_name}`}
                                                            align="center"
                                                            sx={{
                                                                backgroundColor: 'transparent',
                                                                fontWeight: 'bold',
                                                                minWidth: 255,
                                                                p: '15px 24px',
                                                                background: theme.palette.common.white,//theme.palette.success[50],
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,// `1px solid ${theme.palette.success[600]}`
                                                                borderLeft: `1px solid ${theme.palette.grey[300]}`,// `1px solid ${theme.palette.success[600]}`
                                                                borderRight: `1px solid ${theme.palette.grey[300]}`,// `1px solid ${theme.palette.success[600]}`
                                                                borderBottomLeftRadius: '8px',
                                                                borderBottomRightRadius: '8px',

                                                            }}
                                                        >

                                                            <Stack sx={{ flexDirection: 'row', justifyContent: 'center', gap: 1, width: '100%' }}>

                                                                {
                                                                    asset?.is_view == 1 ?
                                                                        <>
                                                                            <Button
                                                                                size={'small'}
                                                                                sx={{ textTransform: "capitalize", px: asset?.is_view == 0 ? 4 : 6, borderRadius: '4px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 14, fontWeight: 500, borderColor: theme.palette.primary[600] }}
                                                                                onClick={() => {
                                                                                    // setOpenAddTicket(true)
                                                                                }}
                                                                                variant='contained'
                                                                            >
                                                                                {/* <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} /> */}
                                                                                Approve
                                                                            </Button>
                                                                            <Button disabled={getEditModeCount()} sx={{ columnGap: 0.5, px: 2, border: getEditModeCount() ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.palette.primary[600]}`, background: getEditModeCount() ? theme.palette.grey[300] : '', color: getEditModeCount() ? theme.palette.grey[600] : theme.palette.primary[600], textTransform: 'capitalize', borderRadius: '4px' }}
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
                                                                                }}>
                                                                                <EditCircleIcon stroke={getEditModeCount() ? theme.palette.grey[600] : theme.palette.primary[600]} size={18} /> Edit
                                                                            </Button>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <Button
                                                                                title={'Cancel'}
                                                                                sx={{ columnGap: 0.5, px: 6, color: theme.palette.primary[600], border: `1px solid ${theme.palette.primary[600]}`, background: theme.palette.common.white, textTransform: 'capitalize', borderRadius: '4px' }}
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

                                                                                    methods.reset()
                                                                                }}
                                                                            >
                                                                                <CloseIcon stroke={theme.palette.primary[600]} size={10} />
                                                                                Cancel
                                                                            </Button>
                                                                            <Button sx={{ columnGap: 0.5, px: 6, color: theme.palette.common.white, background: theme.palette.success[600], textTransform: 'capitalize', borderRadius: '4px' }}
                                                                                onClick={() => {
                                                                                    methods.handleSubmit(onSubmit)()


                                                                                    // let details = Object.assign({}, getChecklistDetails)
                                                                                    // let arrTimes = Object.assign([], details?.times)
                                                                                    // let currentTime = arrTimes?.find(t => t.is_selected == true)
                                                                                    // let currentTimeIndex = arrTimes?.findIndex(t => t.is_selected == true)

                                                                                    // let arrSchedules = Object.assign([], currentTime?.schedules)

                                                                                    // let currentAsset = arrSchedules?.find(a => a.asset_id == asset?.asset_id)
                                                                                    // currentAsset.is_view = 1
                                                                                    // let currentAssetIndex = arrSchedules?.findIndex(a => a.asset_id == asset?.asset_id)
                                                                                    // arrSchedules[currentAssetIndex] = currentAsset
                                                                                    // currentTime.schedules = arrSchedules
                                                                                    // arrTimes[currentTimeIndex] = currentTime
                                                                                    // details.times = arrTimes
                                                                                    // setGetChecklistDetails(details)
                                                                                }}
                                                                            >
                                                                                Save
                                                                            </Button>
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
        </React.Fragment >
    </>)

}