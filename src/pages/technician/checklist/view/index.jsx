import { Box, Button, Card, Chip, CircularProgress, Divider, Grid, IconButton, InputAdornment, MenuItem, Stack, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import TypographyComponent from '../../../../components/custom-typography'
import { getPercentage, isCurrentTimeInRange, isFutureTimeRange } from '../../../../utils'
import { StyledLinearProgress } from '../../../../components/common'
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import CustomTextField from '../../../../components/text-field'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { actionTechnicianAssetChecklistDetails, actionTechnicianAssetChecklistUpdate, actionTechnicianChecklistGroupAssetList, resetTechnicianAssetChecklistDetailsResponse, resetTechnicianAssetChecklistUpdateResponse, resetTechnicianChecklistGroupAssetListResponse } from '../../../../store/technician/checklist'
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants'
import { useBranch } from '../../../../hooks/useBranch'
import { useSnackbar } from '../../../../hooks/useSnackbar'
import { useAuth } from '../../../../hooks/useAuth'
import FullScreenLoader from '../../../../components/fullscreen-loader'
import ChevronDownIcon from '../../../../assets/icons/ChevronDown'
import CheckboxIcon from '../../../../assets/icons/CheckboxIcon'
import CloseIcon from '../../../../assets/icons/CloseIcon'

export default function ChecklistView() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const scrollRef = useRef(null);
    const { showSnackbar } = useSnackbar()
    const { groupUuid, assetTypeId, assetId } = useParams()

    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))

    //Stores
    const { technicianChecklistGroupAssetList, technicianAssetChecklistDetails, technicianAssetChecklistUpdate } = useSelector(state => state.technicianChecklistStore)

    //States
    const [loadingList, setLoadingList] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [getCurrentAssetDetailsData, setGetCurrentAssetDetailsData] = useState(null)
    const [currentData, setCurrentData] = useState([])
    const [isInitialLoad, setIsInitialLoad] = useState(false)
    const [getTimesArray, setGetTimesArray] = useState([])
    const [selectedTimeUuid, setSelectedTimeUuid] = useState(null)
    const [openAssetListDrawer, setOpenAssetListDrawer] = useState(false)
    const [assetMasterData, setAssetMasterData] = useState([
        {
            "id": 1,
            "title": "Battery Monitoring system"
        },
        {
            "id": 4,
            "title": " MBC (Miniature Circuit Breaker)"
        },
        {
            "id": 9,
            "title": "Electric vehicles (EVs)"
        }
    ])
    const [selectedAssetId, setSelectedAssetId] = useState(assetId ? assetId : null)
    const [currentDataCalculations,
        // setCurrentDataCalculations
    ] = useState({
        total_count: 0,
        pending_count: 0,
        completed_count: 0,
    })


    //Form
    const { control, handleSubmit,
        // getValues,
        reset,
        // watch,
        formState: { errors } } = useForm();

    console.log('----currentData-------', currentData)
    console.log('----getCurrentAssetDetailsData-------', getCurrentAssetDetailsData)
    console.log('----currentDataCalculations-------', currentDataCalculations)
    console.log('----getTimesArray-------', getTimesArray)

    // const watchedValues = watch();

    // useEffect(() => {
    //     checklistStats();
    // }, [watchedValues]);

    // const checklistStats = useCallback(() => {
    //     const formValues = getValues();
    //     const keys = Object.keys(formValues);

    //     let total = keys.length;
    //     let pending = 0;

    //     keys.forEach((key) => {
    //         if (
    //             formValues[key] === "" ||
    //             formValues[key] === null ||
    //             formValues[key] === undefined
    //         ) {
    //             pending++;
    //         }
    //     });

    //     return {
    //         total_count: total,
    //         pending_count: pending,
    //         completed_count: total - pending,
    //     };
    // }, [getValues]);

    // console.log('----checklistStats-------', checklistStats)


    //Scroll times to current selected time
    const getScrollTargetIndex = () => {
        // Check if the times array exists
        if (!getTimesArray) return -1;

        // Find the index where is_selected is true
        return getTimesArray.findIndex(timeSlot => timeSlot.is_selected === true);
    };

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
                left: slots[index].offsetLeft - 100,
                behavior: "smooth"
            });

            // 3. Set the flag to false
            setIsInitialLoad(false)
        }
    }, [getTimesArray])

    useEffect(() => {
        setIsInitialLoad(true)
        // let times = [
        //     {
        //         "to": "02:00",
        //         "from": "00:00",
        //         "status": 'Active',
        //         "uuid": "2b3e61e4-bf47-4a72-b44f-0594fc05384f"
        //     },
        //     {
        //         "to": "04:00",
        //         "from": "02:00",
        //         "status": 'Active',
        //         "uuid": "6b75553c-a30e-4adb-8d9b-fbbd9d330613"
        //     },
        //     {
        //         "to": "06:00",
        //         "from": "04:00",
        //         "uuid": "b714b8de-5376-4ab1-b24a-899cde56d7c4"
        //     },
        //     {
        //         "to": "08:00",
        //         "from": "06:00",
        //         "uuid": "c79d301a-a0a0-4548-b091-ace8492431b0"
        //     },
        //     {
        //         "to": "10:00",
        //         "from": "08:00",
        //         "status": 'Active',
        //         "uuid": "48c701e9-07a7-45d1-86c9-2e6c32abe201"
        //     },
        //     {
        //         "to": "12:00",
        //         "from": "10:00",
        //         "uuid": "55cd008f-cec4-46a5-bf8b-cd8ec7d76016"
        //     },
        //     {
        //         "to": "14:00",
        //         "from": "12:00",
        //         "uuid": "a189e6ad-fc25-46b6-adb8-bf1f71c1f791"
        //     },
        //     {
        //         "to": "16:00",
        //         "from": "14:00",
        //         "uuid": "4854a4b2-dc76-42f0-a7d2-891ad033fbd3"
        //     },
        //     {
        //         "to": "18:00",
        //         "from": "16:00",
        //         "uuid": "8366367f-6332-4714-95cd-dd2895e1d0ef"
        //     },
        //     {
        //         "to": "20:00",
        //         "from": "18:00",
        //         "uuid": "896e145f-6375-4b38-8a69-877097507148"
        //     },
        //     {
        //         "to": "22:00",
        //         "from": "20:00",
        //         "uuid": "98fbe09f-e9f4-4295-80b8-f56687bc0f12"
        //     },
        //     {
        //         "to": "00:00",
        //         "from": "22:00",
        //         "uuid": "286c2ae1-02f5-4006-8c32-c9ff7449db36"
        //     }
        // ]
        // // Helper to check if now is between timeObj.from and timeObj.to
        // const matched = times?.find(t => isCurrentTimeInRange(t.from, t.to));

        // let updated = times?.map((timeObj) => ({
        //     ...timeObj,
        //     is_selected: matched?.uuid == timeObj?.uuid ? true : false
        // }))
        // setGetTimesArray(updated)

        // setSelectedTimeUuid(matched)

    }, [])

    useEffect(() => {
        // if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && groupUuid && groupUuid !== null) {
        dispatch(actionTechnicianChecklistGroupAssetList({
            branch_uuid: branch?.currentBranch?.uuid,
            group_uuid: groupUuid,
        }))
        // }
    }, [branch?.currentBranch?.uuid, groupUuid])

    /**
     * Initial call Asset checklist details API
     */
    useEffect(() => {
        if (selectedAssetId && selectedAssetId !== null && groupUuid && groupUuid !== null) {

            setLoadingList(true)
            dispatch(actionTechnicianAssetChecklistDetails({
                asset_id: selectedAssetId,
                group_uuid: groupUuid,
                date: moment().format('YYYY-MM-DD'),
            }))
        }
    }, [groupUuid, selectedAssetId])

    /**
        * useEffect
        * @dependency : technicianChecklistGroupAssetList
        * @type : HANDLE API RESULT
        * @description : Handle the result of checklist group asset List API
       */
    useEffect(() => {
        if (technicianChecklistGroupAssetList && technicianChecklistGroupAssetList !== null) {
            dispatch(resetTechnicianChecklistGroupAssetListResponse())
            if (technicianChecklistGroupAssetList?.result === true) {
                setAssetMasterData(technicianChecklistGroupAssetList?.response)

            } else {
                setAssetMasterData([])
                // setCurrentData([])
                switch (technicianChecklistGroupAssetList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianChecklistGroupAssetListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianChecklistGroupAssetList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianChecklistGroupAssetList])
    /**
        * useEffect
        * @dependency : technicianAssetChecklistDetails
        * @type : HANDLE API RESULT
        * @description : Handle the result of checklist group List API
       */
    useEffect(() => {
        if (technicianAssetChecklistDetails && technicianAssetChecklistDetails !== null) {
            dispatch(resetTechnicianAssetChecklistDetailsResponse())
            if (technicianAssetChecklistDetails?.result === true) {
                setGetCurrentAssetDetailsData(technicianAssetChecklistDetails?.response)
                // let times = technicianAssetChecklistDetails?.response?.checklist_json?.times || []
                // const matched = times?.find(t => isCurrentTimeInRange(t.from, t.to));

                // let updated = times?.map((timeObj) => ({
                //     ...timeObj,
                //     is_selected: matched?.uuid == timeObj?.uuid ? true : false
                // }))
                // setGetTimesArray(updated)
                let checklistTimes = technicianAssetChecklistDetails?.response?.checklist_json?.times || [];
                let assetTimes = technicianAssetChecklistDetails?.response?.asset_checklist_json?.times || [];

                // Find current time range
                const matched = checklistTimes.find(t => isCurrentTimeInRange(t.from, t.to));

                let updated = checklistTimes.map((timeObj) => {

                    // Find matching object in asset_checklist_json.times
                    const found = assetTimes.find(a => a.uuid === timeObj.uuid);

                    return {
                        ...timeObj,
                        status: found?.status ?? "",   // <-- inject status
                        is_selected: matched?.uuid === timeObj.uuid
                    };
                });

                setGetTimesArray(updated);
                setSelectedTimeUuid(matched)
                setLoadingList(false)
            } else {
                setLoadingList(false)
                setGetCurrentAssetDetailsData(null)
                setGetTimesArray([])
                setSelectedTimeUuid(null)
                // setCurrentData([])
                switch (technicianAssetChecklistDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianAssetChecklistDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianAssetChecklistDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianAssetChecklistDetails])

    /**
 * useEffect
 * @dependency : technicianAssetChecklistUpdate
 * @type : HANDLE API RESULT
 * @description : Handle the result of asset checklist save API
 */
    useEffect(() => {
        if (technicianAssetChecklistUpdate && technicianAssetChecklistUpdate !== null) {
            dispatch(resetTechnicianAssetChecklistUpdateResponse())
            if (technicianAssetChecklistUpdate?.result === true) {
                setLoadingSubmit(false)
                reset()
                showSnackbar({ message: technicianAssetChecklistUpdate.message, severity: "success" })
                setLoadingList(true)
                console.log('-------selectedAssetId, groupUuid-------', selectedAssetId, groupUuid)
                if (selectedAssetId && selectedAssetId !== null && groupUuid && groupUuid !== null) {
                    setLoadingList(true)
                    dispatch(actionTechnicianAssetChecklistDetails({
                        asset_id: selectedAssetId,
                        group_uuid: groupUuid,
                        date: moment().format('YYYY-MM-DD'),
                    }))
                }
            } else {
                setLoadingSubmit(false)
                switch (technicianAssetChecklistUpdate?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        showSnackbar({ message: technicianAssetChecklistUpdate.message, severity: "error" })
                        dispatch(resetTechnicianAssetChecklistUpdateResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianAssetChecklistUpdate.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianAssetChecklistUpdate])

    // console.log('----se-------', selectedTimeUuid?.uuid == getCurrentAssetDetailsData?.time_uuid)
    // console.log('----selectedTimeUuid-------', selectedTimeUuid)
    // console.log('----getCurrentAssetDetailsData-------', getCurrentAssetDetailsData)
    /**
    * Initial Render
    */
    // useEffect(() => {

    //     setGetCurrentAssetDetailsData({
    //         "asset_type_id": "1",
    //         "title": "GF-BMS UPS Room-A",
    //         "total_groups": 2,
    //         "total_assets": 5,
    //         "time_interval": '3 Hrs',
    //         "total_checklists": 36,
    //         "total_completed": 15,
    //         "total_overdue": 0,
    //         "total_abnormal": 6,
    //         "total_pending": 0,
    //         "total_not_approved": 15,
    //         "to": "20:00",
    //         "from": "18:00",
    //         "time_uuid": "896e145f-6375-4b38-8a69-877097507148",
    //         "is_view": 1,
    //         "interval": "3 Hrs",
    //         "parameters": [
    //             {
    //                 "id": 1,
    //                 "max": "200",
    //                 "min": "10",
    //                 "name": "Temperature",
    //                 "unit": "F",
    //                 "is_view": 0,
    //                 "options": [],
    //                 "sequence": 1,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Number (with range)",
    //                 "is_mandatory": 1,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 2,
    //                 "max": "",
    //                 "min": "",
    //                 "name": "Pressure",
    //                 "unit": "",
    //                 "is_view": 0,
    //                 "options": [],
    //                 "sequence": 2,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Text Input",
    //                 "is_mandatory": 0,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 3,
    //                 "max": "",
    //                 "min": "",
    //                 "name": "Flow Rate",
    //                 "unit": "",
    //                 "is_view": 0,
    //                 "options": [
    //                     "AB",
    //                     "BC",
    //                     "QR",
    //                     "MN"
    //                 ],
    //                 "sequence": 3,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Multiple Choice",
    //                 "is_mandatory": 0,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 4,
    //                 "max": "200",
    //                 "min": "10",
    //                 "name": "Vibration Level",
    //                 "unit": "F",
    //                 "is_view": 0,
    //                 "options": [],
    //                 "sequence": 4,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Number (with range)",
    //                 "is_mandatory": 1,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 5,
    //                 "max": "",
    //                 "min": "",
    //                 "name": "Oil Level",
    //                 "unit": "",
    //                 "is_view": 0,
    //                 "options": [
    //                     "Yes",
    //                     "No"
    //                 ],
    //                 "sequence": 5,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Yes/No",
    //                 "is_mandatory": 1,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 6,
    //                 "max": "",
    //                 "min": "",
    //                 "name": "kwh Meter Reading",
    //                 "unit": "",
    //                 "is_view": 0,
    //                 "options": [],
    //                 "sequence": 6,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Text Input",
    //                 "is_mandatory": 0,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 7,
    //                 "max": "",
    //                 "min": "",
    //                 "name": "Check Any Leakage",
    //                 "unit": "",
    //                 "is_view": 0,
    //                 "options": [
    //                     "AA",
    //                     "SS",
    //                     "FF",
    //                     "QQ"
    //                 ],
    //                 "sequence": 7,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Multiple Choice",
    //                 "is_mandatory": 1,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 8,
    //                 "max": "",
    //                 "min": "",
    //                 "name": "Check Battery System",
    //                 "unit": "",
    //                 "is_view": 0,
    //                 "options": [
    //                     "Yes",
    //                     "No"
    //                 ],
    //                 "sequence": 8,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Yes/No",
    //                 "is_mandatory": 0,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 9,
    //                 "max": "100",
    //                 "min": "20",
    //                 "name": "Check Air Filter",
    //                 "unit": "F",
    //                 "is_view": 0,
    //                 "options": [],
    //                 "sequence": 9,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Number (with range)",
    //                 "is_mandatory": 1,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             },
    //             {
    //                 "id": 10,
    //                 "max": "",
    //                 "min": "",
    //                 "name": "DG Status",
    //                 "unit": "",
    //                 "is_view": 0,
    //                 "options": [],
    //                 "sequence": 10,
    //                 "sub_name": "",
    //                 "parent_id": 0,
    //                 "input_type": "Text Input",
    //                 "is_mandatory": 0,
    //                 "default_value": "",
    //                 "multiple_choice_option": ""
    //             }
    //         ]
    //     })

    // }, [])

    //Create Values for Asset Render
    const createValuesFromParameters = (parameters = []) => {
        if (!Array.isArray(parameters) || parameters.length === 0) return [];

        return parameters.map(param => ({
            parameter_id: param?.id ?? null,
            value: param?.default_value ?? "",   // or "" always
            max: param?.max ?? "",
            min: param?.min ?? "",
            name: param?.name ?? "",
            unit: param?.unit ?? "",
            options: Array.isArray(param?.options) ? param.options : [],
            sequence: param?.sequence ?? null,
            sub_name: param?.sub_name ?? "",
            parent_id: param?.parent_id ?? 0,
            input_type: param?.input_type ?? "",
            is_mandatory: param?.is_mandatory ?? 0,
            default_value: param?.default_value ?? "",
            is_view: 1,
        }));
    };

    /**
     * Fill currentData on createValuesFromParameters
     */
    useEffect(() => {
        if (getCurrentAssetDetailsData && getCurrentAssetDetailsData !== null) {
            // if (isInitialLoad == true) {
            //     setSelectedTimeUuid({
            //         to: getCurrentAssetDetailsData?.to,
            //         from: getCurrentAssetDetailsData?.from,
            //         uuid: getCurrentAssetDetailsData?.time_uuid
            //     })
            // }

            if (getCurrentAssetDetailsData?.checklist_json?.parameters && getCurrentAssetDetailsData?.checklist_json?.parameters !== null && getCurrentAssetDetailsData?.checklist_json?.parameters.length > 0) {
                if (getCurrentAssetDetailsData?.asset_checklist_json && getCurrentAssetDetailsData?.asset_checklist_json !== null) {
                    console.log('---getCurrentAssetDetailsData?.asset_checklist_json?.times---', getCurrentAssetDetailsData?.asset_checklist_json?.times)
                    let currentTime = getCurrentAssetDetailsData?.asset_checklist_json?.times?.find(t => t.uuid == selectedTimeUuid?.uuid) || []
                    console.log('---selectedTimeUuid---', selectedTimeUuid)
                    console.log('---currentTime---', currentTime)
                    if (currentTime && currentTime !== null && currentTime?.values && currentTime?.values.length > 0) {
                        setCurrentData(currentTime?.values)
                    } else {
                        let values = createValuesFromParameters(getCurrentAssetDetailsData?.checklist_json?.parameters)
                        if (values && values !== null && values.length > 0) {
                            setCurrentData(values)
                        } else {
                            setCurrentData([])
                        }
                    }
                } else {
                    let values = createValuesFromParameters(getCurrentAssetDetailsData?.checklist_json?.parameters)
                    if (values && values !== null && values.length > 0) {
                        setCurrentData(values)
                    } else {
                        setCurrentData([])
                    }
                }


            }
        }
    }, [getCurrentAssetDetailsData])

    /**
     * Get Current Value of Parameter
     * @param {*} paramId 
     * @returns 
     */
    const getValue = (paramId) => {
        return currentData?.find(v => v.parameter_id === paramId) || {};
    };

    /**
        * Function to return fields with validations
        * @param {*} params, value
        * @returns 
        */
    const FieldRenderer = ({ params, value }) => {

        const fieldName = `${params.name} `;

        return (
            <Controller
                name={fieldName}
                control={control}
                defaultValue={value ?? ""}
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
                                    error={!!errors[fieldName]}
                                    helperText={errors[fieldName]?.message}
                                >
                                    <MenuItem value="">
                                        <em>Select Option</em>
                                    </MenuItem>

                                    {params.options?.map((opt, index) => (
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
        return now >= fromTime;
    };

    const onSubmit = (formData) => {
        console.log('-------formData-------', formData)
        console.log('-------currentData-------', currentData)
        console.log('-------selectedAssetId, groupUuid-------', selectedAssetId, groupUuid)
        const updatedValues = currentData?.map(param => {
            // Construct the dynamic fieldName
            console.log('---param param---', param)
            const fieldName = `${param.name} `;
            // const fieldName = `param_${param.parameter_id}`;

            return {
                ...param,
                is_view: 1,
                value: formData[fieldName] ?? param.value
            };
        });

        // console.log('-------updatedValues-------', updatedValues)

        let objData = {
            "asset_type_id": assetTypeId,
            "asset_id": selectedAssetId,
            "group_uuid": groupUuid,
            "date": moment().format('YYYY-MM-DD'),
            "checklist_json": {
                "asset_id": selectedAssetId,
                "asset_name": getCurrentAssetDetailsData?.asset_name,
                "status": '',
                "is_view": 0,
                "times": [
                    {
                        "to": selectedTimeUuid?.to,
                        "from": selectedTimeUuid?.from,
                        "uuid": selectedTimeUuid?.uuid,
                        "is_selected": true,
                        "values": updatedValues || []
                    }
                ]
            }
        }

        // console.log('-------objData-------', objData)
        setLoadingSubmit(true)
        dispatch(actionTechnicianAssetChecklistUpdate(objData))
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
        // isToday,
        // isCurrentTimeInRange,
        // isFutureTimeInRange
    }) => {
        // console.log('---objData---', objData)
        return (
            <Stack
                key={objData.uuid}
                sx={{
                    cursor: isEnabled ? 'pointer' : 'default',
                    justifyContent: 'center',
                    // minWidth: '175px',
                    minWidth: objData?.status == 'Active'
                        ? '155px'
                        : '135px'
                    ,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                    p: '7px 7px',
                    borderRadius: '8px',
                }}
                onClick={onClick}
            >

                <TypographyComponent
                    fontSize={isSMDown ? 20 : 16}
                    fontWeight={objData?.is_selected
                        ? 600 : 400}
                    sx={{
                        color: objData?.is_selected
                            ? theme.palette.grey[900]
                            : theme.palette.grey[500]
                    }}
                >
                    {`${objData?.from} -${objData?.to} `}
                </TypographyComponent>
                {objData?.status != 'Active' && objData?.status != 'Abnormal'
                    ? ''
                    : <CheckboxIcon size={24} stroke={theme.palette.success[600]} />
                }
            </Stack>
        );
    };

    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', height: "100%" }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate(`/checklist/checklist-groups/${assetTypeId}/select-assets/${groupUuid}`)
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}> {getCurrentAssetDetailsData?.asset_name}</TypographyComponent>
            </Stack>} />
            <Stack sx={{ rowGap: 1 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} key={`${getCurrentAssetDetailsData?.id}`}>
                        <Card
                            sx={{
                                p: '16px',
                                height: "100%",
                                width: '100%',
                                borderRadius: "8px",
                                backgroundColor: theme.palette.common.white,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            }}
                            onClick={() => {
                                // navigate(`select-assets/${getCurrentAssetDetailsData?.id}`)
                            }}
                        >
                            <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }} onClick={() => {
                                setOpenAssetListDrawer(true)
                            }}>
                                <Stack flexDirection={'row'} gap={2} justifyContent={'space-between'} alignItems="center" sx={{ width: '100%', border: `1.5px solid ${theme.palette.primary[600]}`, padding: '8px', borderRadius: '4px' }}>
                                    <Box>
                                        <TypographyComponent fontSize={18} fontWeight={500}>
                                            {getCurrentAssetDetailsData?.asset_name}
                                        </TypographyComponent>
                                    </Box>
                                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, cursor: 'pointer' }} >
                                        <Chip size='small' label={getCurrentAssetDetailsData?.time_interval} sx={{ background: theme.palette.primary[600], borderRadius: '4px', padding: '0px 1px', color: theme.palette.common.white, fontSize: '12px' }}>
                                        </Chip>
                                        <ChevronDownIcon />
                                    </Stack>

                                    {/* <TypographyComponent fontSize={18} fontWeight={400}>{`${getCurrentAssetDetailsData?.from}-${getCurrentAssetDetailsData?.to}`}</TypographyComponent> */}
                                </Stack>

                            </Stack>
                            <Stack ref={scrollRef} sx={{ flexDirection: 'row', paddingY: '8px', borderRadius: '8px', width: '100%', overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                                {
                                    getTimesArray && getTimesArray?.length > 0 ?
                                        getTimesArray.map((objData) => {
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
                                                        // isToday={isToday()}
                                                        isCurrentTimeInRange={currentInRange}
                                                        isFutureTimeInRange={futureRange}
                                                        onClick={() => {
                                                            setIsInitialLoad(false)
                                                            if (isEnabled == true) {


                                                                // console.log('---objData---onClick---', objData)
                                                                const updatedTimes = getTimesArray.map(time => {
                                                                    const isSelected = time?.uuid === objData?.uuid;

                                                                    setSelectedTimeUuid({
                                                                        uuid: objData?.uuid,
                                                                        from: objData?.from,
                                                                        to: objData?.to
                                                                    })

                                                                    return {
                                                                        ...time,
                                                                        is_selected: isSelected
                                                                    };
                                                                });
                                                                setGetTimesArray(updatedTimes)

                                                                let objDetails = Object.assign({}, getCurrentAssetDetailsData)
                                                                objDetails.is_view = 1
                                                                setGetCurrentAssetDetailsData(objDetails)

                                                            }

                                                        }}
                                                    />
                                                </Box>
                                            );
                                        })
                                        : null
                                }
                            </Stack>
                            <Stack>
                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.7 }}>
                                    <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                        Checklist Progress
                                    </TypographyComponent>
                                    <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.success[700] }}>
                                            {/* {`(${checklistStats()?.completed_count && checklistStats()?.completed_count !== null ? checklistStats()?.completed_count?.toString().padStart(2, "0") : 0}/${currentData?.length && currentData?.length !== null ? currentData?.length?.toString().padStart(2, "0") : 0})`} */}
                                        </TypographyComponent>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.success[700] }}>
                                            {getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists) ? Math.round(getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists)) : 0}%
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ width: '100%' }}>
                                    <Box sx={{ width: '100%', mr: 1 }}>
                                        <StyledLinearProgress variant="determinate" value={getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists) ? getPercentage(getCurrentAssetDetailsData?.total_completed, getCurrentAssetDetailsData?.total_checklists) : 0} bgColor={theme.palette.success[700]} />
                                    </Box>
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
            <Stack sx={{ rowGap: 1, marginBottom: 8 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack sx={{ width: "100%", background: "#fff", borderRadius: '16px' }}>
                        {loadingList ? (
                            <FullScreenLoader open={true} />
                        ) : getCurrentAssetDetailsData?.checklist_json?.parameters && getCurrentAssetDetailsData?.checklist_json?.parameters !== null && getCurrentAssetDetailsData?.checklist_json?.parameters.length > 0 && getCurrentAssetDetailsData?.checklist_json?.parameters?.filter(p => p?.parameter_type !== 'Grouping').map((param, index) => {
                            const valueObj = getValue(param.id);
                            // console.log('----valueObj-------', valueObj)
                            return (
                                <Box
                                    key={param.id}
                                    sx={{
                                        background: "#fff",
                                        padding: "16px 16px",
                                        // borderRadius: "8px",
                                        borderTopLeftRadius: index == 0 ? '16px' : 'none',
                                        borderTopRightRadius: index == 0 ? '16px' : 'none',
                                        borderBottomLeftRadius: index == getCurrentAssetDetailsData?.checklist_json?.parameters.length - 1 ? '16px' : 'none',
                                        borderBottomRightRadius: index == getCurrentAssetDetailsData?.checklist_json?.parameters.length - 1 ? '16px' : 'none',
                                        borderBottom: index < getCurrentAssetDetailsData?.checklist_json?.parameters.length - 1 ? "1px solid #E0E0E0" : 'none',
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    {/* LEFT: Parameter Name */}
                                    <TypographyComponent
                                        fontSize={16}
                                        fontWeight={400}
                                        sx={{

                                            width: "70%",
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {param.name}
                                    </TypographyComponent>

                                    {/* RIGHT: Input Field */}
                                    {
                                        getCurrentAssetDetailsData?.is_view == 0 ?
                                            <>
                                                <FieldRenderer key={`${param?.asset_id} `} params={param} value={valueObj.value} assetId={param?.asset_id} />
                                            </>
                                            :
                                            <Stack sx={{ padding: '12px 18px', width: '100%', alignItems: 'center', background: theme.palette.grey[100], borderRadius: '8px' }}>
                                                <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={400}>{valueObj.value && valueObj.value !== null ? `${valueObj.value} ${param?.input_type == 'Number (with range)' ? (param?.unit && param?.unit !== null ? param?.unit : '') : ''} ` : '--'} </TypographyComponent>
                                            </Stack>
                                    }
                                </Box>
                            );
                        })}
                    </Stack>
                </form>
            </Stack>
            {
                selectedTimeUuid?.uuid == getTimesArray?.find(t => isCurrentTimeInRange(t.from, t.to))?.uuid ?
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            background: theme.palette.grey[50],
                            p: 2,
                        }}
                    >
                        {
                            getCurrentAssetDetailsData?.is_view == 0 ?
                                <React.Fragment>
                                    {loadingSubmit ?
                                        <Button fullWidth sx={{ backgroundColor: theme.palette.grey[300], color: theme.palette.grey[600] }}>
                                            <CircularProgress size={16} sx={{ color: theme.palette.grey[600], mr: 1 }} />Submit
                                        </Button>
                                        :
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size='small'
                                            sx={{
                                                background: theme.palette.primary[600],
                                                color: theme.palette.common.white,
                                                borderRadius: "10px",
                                                py: 1,
                                                px: 4,
                                                textTransform: "none",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                            }}
                                            onClick={() => {
                                                handleSubmit(onSubmit)()
                                            }}
                                        >
                                            Submit Checklist
                                        </Button>
                                    }
                                </React.Fragment>

                                :
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size='small'
                                    sx={{
                                        background: theme.palette.common.white,
                                        color: theme.palette.primary[600],
                                        boxShadow: 'none',
                                        border: `1px solid ${theme.palette.primary[600]}`,
                                        borderRadius: "10px",
                                        py: 1,
                                        px: 4,
                                        textTransform: "none",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                    }}
                                    onClick={() => {
                                        // handleSubmit(onSubmit)()
                                        let objDetails = Object.assign({}, getCurrentAssetDetailsData)
                                        objDetails.is_view = 0
                                        setGetCurrentAssetDetailsData(objDetails)
                                        console.log('---------EDit------currentData-------', currentData)
                                    }}
                                >
                                    Edit Checklist
                                </Button>

                        }

                    </Box>
                    :
                    <></>
            }
            <SwipeableDrawer
                anchor="bottom"
                open={openAssetListDrawer}
                onClose={() => setOpenAssetListDrawer(false)}
                onOpen={() => setOpenAssetListDrawer(true)}
                PaperProps={{
                    sx: {
                        height: "40vh", // 👉 Half screen height
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        p: 2,
                        background: theme.palette.grey[100],
                    },
                }}
            >
                {/* Header Row */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <TypographyComponent fontSize={22} fontWeight={600}>
                        Select asset from the group
                    </TypographyComponent>

                    <IconButton onClick={() => setOpenAssetListDrawer(false)}>
                        <CloseIcon size={16} strokeWidth={'3'} />
                    </IconButton>
                </Stack>

                <Divider sx={{ my: 1 }} />

                {/* List Items */}
                <Stack sx={{ overflowY: "auto", background: theme.palette.common.white, borderRadius: '16px', height: '30vh' }}>
                    {assetMasterData && assetMasterData !== null && assetMasterData.length > 0 && assetMasterData?.map((item, index) => (
                        <>
                            <Stack
                                key={index}
                                sx={{
                                    p: 2,
                                    // borderRadius: 3,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    flexDirection: 'row',
                                }}
                                onClick={() => {
                                    setSelectedAssetId(item?.id)
                                    setOpenAssetListDrawer(false)
                                    setIsInitialLoad(true)
                                }}
                            >
                                <Box>
                                    <TypographyComponent fontSize={18} fontWeight={600}>
                                        {item?.title}
                                    </TypographyComponent>
                                    <Stack flexDirection={'row'} sx={{ gap: '10px', marginTop: 0.5 }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{item?.total_assets && item?.total_assets !== null ? item?.total_assets.toString().padStart(2, "0") : '00'} Completed</TypographyComponent>
                                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                        </Stack>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{item?.total_assets && item?.total_assets !== null ? item?.total_assets.toString().padStart(2, "0") : '00'} Pending</TypographyComponent>
                                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                        </Stack>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{item?.total_checklists && item?.total_checklists !== null ? item?.total_checklists.toString().padStart(2, "0") : '00'} Skipped</TypographyComponent>
                                    </Stack>
                                </Box>

                                <Chip size='small' label={item?.interval} sx={{ background: theme.palette.primary[600], borderRadius: '4px', padding: '0px 1px', color: theme.palette.common.white, fontSize: '12px' }}>
                                </Chip>
                            </Stack >
                            <Divider sx={{ my: -0.2 }} />
                        </>
                    ))}
                </Stack>
            </SwipeableDrawer>
        </Stack >
    )
}
