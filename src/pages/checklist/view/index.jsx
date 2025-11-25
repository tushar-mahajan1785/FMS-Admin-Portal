import { Button, IconButton, InputAdornment, Stack, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import AddIcon from '@mui/icons-material/Add';
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { actionChecklistGroupDetails, resetChecklistGroupDetailsResponse } from "../../../store/checklist";
import { useBranch } from "../../../hooks/useBranch";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";

export default function ChecklistView() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { assetId, groupUuid } = useParams()

    //Stores
    const { checklistGroupDetails } = useSelector(state => state.checklistStore)

    //Default Checklists Counts Array
    const [getCurrentAssetGroup, setGetCurrentAssetGroup] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(moment().format('DD/MM/YYYY'))
    const [getChecklistDetails] = useState({
        parameters: [
            { "id": 1, "name": "Temperature Teture Temperature Temperature Terature Temperature Temperature Temperature Temperature Temperature", "parent_id": 0, "sub_name": "Temp", "is_mandatory": 1, "input_type": "Number (with range)", "min": "50", "max": "150", "unit": "celsius", "default_value": '' },
            { "id": 2, "name": "IP Voltage", "parent_id": 0, "sub_name": null, "input_type": "", "parameter_type": "Grouping", "default_value": '' },
            { "id": 4, "name": "Current", "parent_id": 0, "sub_name": null, "input_type": "", "parameter_type": "Grouping", "default_value": '' },
            { "id": 5, "name": "Flow Rate", "parent_id": 0, "sub_name": "Flow", "input_type": "Yes/No", "options": ["Yes", "No"], "is_mandatory": 1, "default_value": '' },
            { "id": 6, "name": "Vibration Level", "parent_id": 0, "sub_name": "Vib", "input_type": "Free Text", "is_mandatory": 0, "default_value": '' },
            { "id": 7, "name": "Oil Level", "parent_id": 0, "sub_name": "Oil", "input_type": "Multiple Choice", "options": ["A", "B", "C"], "default_value": '' },
            { "id": 8, "name": "Free service", "parent_id": 0, "sub_name": "Service", "input_type": "Free Text", "is_mandatory": 0, "default_value": '' },
            { "id": 20, "name": "IP Voltage - RN", "parent_id": 2, "sub_name": "RN", "input_type": "Free Text", "is_mandatory": 1, "default_value": '' },
            { "id": 21, "name": "IP Voltage - YN", "parent_id": 2, "sub_name": "YN", "input_type": "Free Text", "is_mandatory": 1, "default_value": '' },
            { "id": 22, "name": "IP Voltage - BN", "parent_id": 2, "sub_name": "BN", "input_type": "Free Text", "is_mandatory": 1, "default_value": '' },
            { "id": 40, "name": "Current - R", "parent_id": 4, "sub_name": "R", "input_type": "Set per sub-reading", "default_value": '' },
            { "id": 41, "name": "Current - Y", "parent_id": 4, "sub_name": "Y", "input_type": "Set per sub-reading", "is_mandatory": 1, "default_value": '' },
            { "id": 42, "name": "Current - B", "parent_id": 4, "sub_name": "B", "input_type": "Set per sub-reading", "default_value": '' }
        ],
        times: [
            {
                uuid: 'ghghj-huyghhgh',
                from: '12:00',
                to: '01:00',
                schedules: [
                    {
                        "asset_id": 1,
                        "asset_name": "Asset 1-1",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "12" },
                            { "parameter_id": 20, "value": "34" },
                            { "parameter_id": 21, "value": "43" },
                            { "parameter_id": 22, "value": "45" },
                            { "parameter_id": 40, "value": "43" },
                            { "parameter_id": 41, "value": "34" },
                            { "parameter_id": 42, "value": "22" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 2,
                        "asset_name": "Asset 1-2",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "4" },
                            { "parameter_id": 20, "value": "5" },
                            { "parameter_id": 21, "value": "6" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 3,
                        "asset_name": "Asset 1-3",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 4,
                        "asset_name": "Asset 1-4",
                        "status": 'Overdue',
                        "is_view": 0,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 5,
                        "asset_name": "Asset 1-5",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 6,
                        "asset_name": "Asset 1-6",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 7,
                        "asset_name": "Asset 1-7",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 8,
                        "asset_name": "Asset 1-8",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                ]
            },
            {
                uuid: 'ghsdddj-huyghhgh',
                from: '01:00',
                to: '02:00',
                schedules: [
                    {
                        "asset_id": 1,
                        "asset_name": "Asset 2-1",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 2,
                        "asset_name": "Asset 2-2",
                        "status": 'Overdue',
                        "is_view": 0,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 3,
                        "asset_name": "Asset 2-3",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 4,
                        "asset_name": "Asset 2-4",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 5,
                        "asset_name": "Asset 2-5",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 6,
                        "asset_name": "Asset 2-6",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 7,
                        "asset_name": "Asset 2-7",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 8,
                        "asset_name": "Asset 2-8",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                ]
            },
            {
                uuid: 'ghghj-huyg678hhyhhgh',
                from: '02:00',
                to: '03:00',
                schedules: [
                    {
                        "asset_id": 1,
                        "asset_name": "Asset 3-1",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 2,
                        "asset_name": "Asset 3-2",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 3,
                        "asset_name": "Asset 3-3",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 4,
                        "asset_name": "Asset 3-4",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 5,
                        "asset_name": "Asset 3-5",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 6,
                        "asset_name": "Asset 3-6",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 7,
                        "asset_name": "Asset 3-7",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                    {
                        "asset_id": 8,
                        "asset_name": "Asset 3-8",
                        "status": 'Overdue',
                        "is_view": 1,
                        "values": [
                            { "parameter_id": 1, "value": "" },
                            { "parameter_id": 20, "value": "" },
                            { "parameter_id": 21, "value": "" },
                            { "parameter_id": 22, "value": "" },
                            { "parameter_id": 40, "value": "" },
                            { "parameter_id": 41, "value": "" },
                            { "parameter_id": 42, "value": "" },
                            { "parameter_id": 5, "value": "" },
                            { "parameter_id": 6, "value": "" },
                            { "parameter_id": 7, "value": "" },
                            { "parameter_id": 8, "value": "" }
                        ]
                    },
                ]
            },
            {
                uuid: 'ghffffghj-444dfff',
                from: '03:00',
                to: '04:00'
            },
            {
                uuid: 'ghgddfr887hj-huyg555hhgh',
                from: '04:00',
                to: '05:00'
            },
            {
                uuid: 'ghgerthj-huyghhgh',
                from: '12:00',
                to: '01:00'
            },
            {
                uuid: 'ghsd444ddj-huyghhgh',
                from: '01:00',
                to: '02:00'
            },
            {
                uuid: 'ghghj-hu666yg678hhyhhgh',
                from: '02:00',
                to: '03:00'
            },
            {
                uuid: 'ghff234ffghj-444dfff',
                from: '03:00',
                to: '04:00'
            },
            // {
            //     uuid: 'ghgddfr887hj-hudfgyg555hhgh',
            //     from: '04:00',
            //     to: '05:00'
            // },
            // {
            //     uuid: 'gh345ghj-huyghhgh',
            //     from: '05:00',
            //     to: '06:00'
            // },
            // {
            //     uuid: 'ghsdddj-h789uyghhgh',
            //     from: '06:00',
            //     to: '07:00'
            // },
            // {
            //     uuid: 'ghg345hj-huyg678hhyhhgh',
            //     from: '07:00',
            //     to: '08:00'
            // },
            // {
            //     uuid: 'ghf345fffghj-44dfg4dfff',
            //     from: '08:00',
            //     to: '09:00'
            // },
            // {
            //     uuid: 'ghgddfr887hj-huyg5dfg55hhgh',
            //     from: '09:00',
            //     to: '10:00'
            // },
        ]
    })
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(getChecklistDetails.times[0]);

    useEffect(() => {


        dispatch(actionChecklistGroupDetails({
            branch_uuid: branch?.currentBranch?.uuid,
            asset_type_id: assetId,
            group_uuid: groupUuid,
            date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        }))
    }, [branch?.currentBranch?.uuid, groupUuid])


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
                setGetCurrentAssetGroup(checklistGroupDetails?.response)

                // setLoadingList(false)
            } else {
                // setLoadingList(false)

                setSelectedTimeSlot(getChecklistDetails.times[0])
                setGetCurrentAssetGroup({
                    "id": 1,
                    "asset_type_id": "1",
                    "asset_type": "DG",
                    "asset_group": "DG Set Tower 1",
                    "location": 'Vodafone India Pvt Ltd',
                    "total_groups": "2",
                    "total_assets": "15",
                    "total_checklists": "36",
                    "total_completed": "12",
                    "total_overdue": "2",
                    "total_abnormal": "4",
                    "total_pending": "24",
                    "total_not_approved": "2",
                    "times": [
                        {
                            uuid: 'ghghj-huyghhgh',
                            frm: '12:00',
                            to: '02:00'
                        },
                        {
                            uuid: 'ghsdddj-huyghhgh',
                            frm: '02:00',
                            to: '04:00'
                        },
                        {
                            uuid: 'ghghj-huyg678hhyhhgh',
                            frm: '04:00',
                            to: '06:00'
                        },
                        {
                            uuid: 'ghffffghj-444dfff',
                            frm: '06:00',
                            to: '08:00'
                        },
                        {
                            uuid: 'ghgddfr887hj-huyg555hhgh',
                            frm: '08:00',
                            to: '10:00'
                        },
                    ]
                })
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


    // --- Custom Styling ---
    const StyledTextField = styled(TextField)({
        '& .MuiOutlinedInput-root': {
            height: '35px', // Adjust height to fit table cells better
            borderRadius: 0,
            '& fieldset': {
                borderColor: '#c0c0c0', // Light grey border
            },
            '&:hover fieldset': {
                borderColor: '#909090', // Slightly darker on hover
            },
            '&.Mui-focused fieldset': {
                borderColor: '#2196f3', // Blue on focus
                borderWidth: 1,
            },
            '& .MuiInputBase-input': {
                padding: '8px 10px', // Adjust padding inside input
                textAlign: 'center', // Center text as in your image
            }
        },
    });



    console.log('------assetId-------', assetId)
    console.log('------groupUuid-------', groupUuid)

    return (<>
        <React.Fragment>
            <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1, mb: 3 }}>
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
                <Stack sx={{ width: '100%' }}>
                    <Stack direction="row" gap={2} justifyContent={'space-between'} sx={{ width: '100%' }}>
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
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                            <DatePickerWrapper>
                                <DatePicker
                                    id='start_date'
                                    placeholderText='Start Date'
                                    customInput={
                                        <CustomTextField
                                            size='small'
                                            fullWidth
                                            sx={{ width: '200px' }}
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
                                    return (<Stack
                                        key={index}
                                        sx={{ cursor: 'pointer', justifyContent: 'center', minWidth: '175px', flexDirection: 'row', gap: 1, p: '10px 16px', borderRadius: '8px', background: selectedTimeSlot?.uuid === objData?.uuid ? theme.palette.common.black : theme.palette.common.white }}
                                        onClick={() => {

                                            let getCurrentTimeSlot = getChecklistDetails?.times.find(obj => obj?.uuid === objData?.uuid)
                                            setSelectedTimeSlot(getCurrentTimeSlot)
                                        }}
                                    >
                                        <CheckboxIcon size={24} />
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: selectedTimeSlot?.uuid === objData?.uuid ? theme.palette.common.white : theme.palette.grey[500] }}>{`${objData?.from}-${objData?.to}`}</TypographyComponent>

                                    </Stack>)
                                })
                                :
                                <></>
                        }
                    </Stack>
                </Stack>
            </Stack>
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
                                    fontWeight: 'bold',
                                    width: 300,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    p: '15px 24px',
                                }}
                            >
                                Parameter
                            </TableCell>
                            {/* Time Slot Headers (00:00, 02:00, ...) */}
                            {selectedTimeSlot?.schedules.map((asset) => (
                                <TableCell
                                    key={asset}
                                    sx={{
                                        backgroundColor: theme.palette.success[50],
                                        color: theme.palette.grey[600],
                                        border: `1px solid ${theme.palette.success[600]}`,
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        width: 255,
                                        p: '15px 24px',
                                    }}
                                >
                                    <Stack sx={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                        <Stack>{asset?.asset_name}</Stack>
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
                        {getChecklistDetails?.parameters.filter(p => p.parameter_type !== 'Grouping').map((row, i) => (
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
                                        borderBottomLeftRadius: i === getChecklistDetails?.parameters?.length - 1 ? '8px' : '',
                                        borderBottomRightRadius: i == getChecklistDetails?.parameters?.length - 1 ? '8px' : '',
                                    }}
                                >
                                    <Stack sx={{ flexDirection: 'row' }}>
                                        {row.name}
                                        <span style={{ color: 'red' }}>*</span>
                                    </Stack>

                                </TableCell>
                                {selectedTimeSlot?.schedules.map((timeSlot) => {
                                    // Find the value object for the current parameter in the current time slot
                                    const paramValue = timeSlot.values.find(v => v.parameter_id === row.id);
                                    const value = paramValue ? paramValue.value : '';

                                    return (
                                        <TableCell key={`${timeSlot?.id}-${timeSlot?.asset_name}`}
                                            sx={{
                                                alignItems: 'flex-start',
                                                p: '15px 24px',
                                                borderTop: i == 0 ? `1px solid ${theme.palette.success[600]}` : '',
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                                background: theme.palette.success[50],
                                                borderLeft: `1px solid ${theme.palette.success[600]}`,
                                                borderRight: `1px solid ${theme.palette.success[600]}`,
                                                borderTopLeftRadius: i == 0 ? '8px' : 'none',
                                                borderTopRightRadius: i == 0 ? '8px' : 'none',
                                                borderBottomLeftRadius: i === getChecklistDetails?.parameters?.length - 1 ? '8px' : '',
                                                borderBottomRightRadius: i == getChecklistDetails?.parameters?.length - 1 ? '8px' : '',
                                            }}>
                                            {/* Placeholder for the Input Field (like a TextField) */}
                                            {
                                                timeSlot?.is_view == 1 ?
                                                    <>
                                                        {value}
                                                    </>
                                                    :
                                                    <StyledTextField
                                                        required
                                                        variant="outlined"
                                                        size="small"
                                                        defaultValue={value}
                                                    />
                                            }

                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
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
                            {selectedTimeSlot?.schedules.map((asset, assetIndex) => {
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
                                                background: theme.palette.success[50],
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                // borderTop: i == 0 ? `1px solid ${theme.palette.success[600]}` : '',
                                                borderBottom: `1px solid ${theme.palette.success[600]}`,
                                                borderLeft: `1px solid ${theme.palette.success[600]}`,
                                                borderRight: `1px solid ${theme.palette.success[600]}`,
                                                // borderTopLeftRadius: i == 0 ? '8px' : 'none',
                                                // borderTopRightRadius: i == 0 ? '8px' : 'none',
                                                borderBottomLeftRadius: '8px',
                                                borderBottomRightRadius: '8px',

                                            }}
                                        >

                                            <Stack sx={{ flexDirection: 'row', justifyContent: 'center', gap: 0.8, width: '100%' }}>
                                                <Button
                                                    size={'small'}
                                                    sx={{ textTransform: "capitalize", px: 6, borderRadius: '4px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 14, fontWeight: 500, borderColor: theme.palette.primary[600] }}
                                                    onClick={() => {
                                                        // setOpenAddTicket(true)
                                                    }}
                                                    variant='contained'
                                                >
                                                    {/* <AddIcon sx={{ color: 'white', fontSize: { xs: '20px', sm: '20px', md: '22px' } }} /> */}
                                                    Approve
                                                </Button>
                                                {
                                                    asset?.is_view == 1 ?
                                                        <IconButton sx={{ border: `1px solid ${theme.palette.primary[600]}`, borderRadius: '4px' }}>
                                                            <EditCircleIcon stroke={theme.palette.grey[700]} size={22} />
                                                        </IconButton>
                                                        :
                                                        <IconButton sx={{ border: `1px solid ${theme.palette.primary[600]}`, borderRadius: '4px' }}>
                                                            <AddIcon />
                                                        </IconButton>
                                                }

                                            </Stack>
                                        </TableCell>
                                    </React.Fragment>
                                )
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment >
    </>)

}