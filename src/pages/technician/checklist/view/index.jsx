import { Box, Button, Card, Chip, CircularProgress, Divider, IconButton, InputAdornment, MenuItem, Stack, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import TypographyComponent from '../../../../components/custom-typography'
import { getPercentage, isCurrentTimeInRange, isFutureTimeRange, skipEvery } from '../../../../utils'
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
import { ChecklistLinearProgress } from '../../../../components/checklist-progress-bar'

export default function ChecklistView() {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const scrollRef = useRef(null);
    const { showSnackbar } = useSnackbar()
    const { groupUuid, assetTypeId, assetId } = useParams()

    //Media Query
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
    const [assetMasterData, setAssetMasterData] = useState([])
    const [selectedAssetId, setSelectedAssetId] = useState(assetId ? assetId : null)
    const [selectedAssetStatus, setSelectedAssetStatus] = useState(null)
    const [getCurrentParametersRenderedLength, setGetCurrentParametersRenderedLength] = useState(0)
    const [ViewFilledCount, setViewFilledCount] = useState(0)
    const [getAbnormalCount, setGetAbnormalCount] = useState(0)

    //Form
    const { control, handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors } } = useForm();

    useEffect(() => {
        if (assetMasterData && assetMasterData !== null && assetMasterData.length > 0) {
            setSelectedAssetId(assetMasterData[0]?.id || null)
        }

    }, [assetMasterData])

    /**
     * get Filled Count and Percentage for Progress Bar
     */
    useEffect(() => {
        const subscription = watch((values) => {
            const filled = Object.values(values).filter(
                v => v !== "" && v !== null && v !== undefined
            ).length;

            const total = getCurrentParametersRenderedLength || 0;
            const percent = total ? Math.round((filled / total) * 100) : 0;

            // 🔹 Update text counters
            const filledEl = document.getElementById("filled-count");
            const percentEl = document.getElementById("filled-percent");
            const bar = document.getElementById("progress-bar");

            if (filledEl) {
                filledEl.textContent = `(${String(filled).padStart(2, "0")}/${String(total || 0).padStart(2, "0")})`;
            }

            if (percentEl) {
                percentEl.textContent = `${percent}%`;
            }

            // 🔹 Update progress bar (THIS IS WHERE IT GOES)
            if (bar) {
                bar.style.width = `${percent}%`;
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, getCurrentParametersRenderedLength]);


    /**
     * In View Mode, calculate filled count and abnormal count
     */
    useEffect(() => {
        if (selectedTimeUuid && selectedTimeUuid !== null) {
            //Get Total Count of Parameters to be rendered
            let count = 0
            getCurrentAssetDetailsData?.checklist_json?.parameters?.forEach(param => {

                if (param && param !== null && param?.parameter_type !== "Grouping") {
                    count += 1
                }
            });
            setGetCurrentParametersRenderedLength(count)
            //----------------------------------------------

            //Get Total Filled Count of Parameters to be rendered
            const parametersList = getCurrentAssetDetailsData?.checklist_json?.parameters || [];
            let nonGroupingFilledCount = 0;
            currentData?.forEach(param => {
                const matchedParam = parametersList?.find(
                    p => p.id == param.parameter_id
                );

                // skip if no match
                if (!matchedParam) return;

                // skip grouping parameters
                if (matchedParam.parameter_type == "Grouping") return;

                // count only filled values
                if (param.value != "" && param.value !== null && param.value !== undefined) {
                    nonGroupingFilledCount += 1;
                }
            });
            setViewFilledCount(nonGroupingFilledCount)
            //----------------------------------------------

            //-----------Get abnormal Count-----------
            let abnormalCount = 0;
            currentData?.forEach(param => {
                if (param?.param_status == 'Abnormal' && param?.priority == 'High') {
                    abnormalCount += 1
                }
            });
            setGetAbnormalCount(abnormalCount)
            //----------------------------------------------
        }

    }, [selectedTimeUuid, currentData])

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

    //Initial Load
    useEffect(() => {
        setIsInitialLoad(true)
    }, [])

    //Initial call Asset checklist group asset List API
    useEffect(() => {
        dispatch(actionTechnicianChecklistGroupAssetList({
            branch_uuid: branch?.currentBranch?.uuid,
            group_uuid: groupUuid && groupUuid !== null ? groupUuid : '',
        }))
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

                let checklistTimes = technicianAssetChecklistDetails?.response?.checklist_json?.times || [];
                let assetTimes = technicianAssetChecklistDetails?.response?.asset_checklist_json?.times || [];

                // Find current time range
                const matched = checklistTimes?.find(t => isCurrentTimeInRange(t.from, t.to));
                const matchedAssetJSON = assetTimes?.find(t => isCurrentTimeInRange(t.from, t.to));
                if (matchedAssetJSON?.status && matchedAssetJSON?.status !== null) {
                    setSelectedAssetStatus(matchedAssetJSON?.status);
                } else {
                    setSelectedAssetStatus(null);
                }

                let updated = checklistTimes?.map((timeObj) => {

                    // Find matching object in asset_checklist_json.times
                    const found = assetTimes?.find(a => a.uuid === timeObj.uuid);

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
                setSelectedAssetStatus(null);
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

    //Create Values for Asset Render
    const createValuesFromParameters = (parameters = []) => {
        if (!Array.isArray(parameters) || parameters?.length === 0) return [];

        return parameters?.map(param => ({
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
            priority: param?.priority ?? "",
            parameter_type: param?.parameter_type ?? "",
            is_view: 1,
        }));
    };

    /**
     * Fill currentData on createValuesFromParameters
     */
    useEffect(() => {
        if (getCurrentAssetDetailsData && getCurrentAssetDetailsData !== null) {
            if (getCurrentAssetDetailsData?.checklist_json?.parameters && getCurrentAssetDetailsData?.checklist_json?.parameters !== null && getCurrentAssetDetailsData?.checklist_json?.parameters.length > 0) {
                if (getCurrentAssetDetailsData?.asset_checklist_json && getCurrentAssetDetailsData?.asset_checklist_json !== null) {
                    let currentTime = getCurrentAssetDetailsData?.asset_checklist_json?.times?.find(t => t.uuid == selectedTimeUuid?.uuid) || []
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

    useEffect(() => {
        if (getCurrentAssetDetailsData?.is_view == 0) {
            if (currentData && currentData !== null && currentData.length > 0) {
                currentData.forEach(param => {
                    const fieldName = param.name
                    const currentValueObj = getValue(param.parameter_id);
                    setValue(fieldName, currentValueObj?.value || "");
                });
            }
        }

    }, [getCurrentAssetDetailsData?.is_view])

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
    const FieldRenderer = React.memo(({ params }) => {

        const fieldName = params.name

        return (
            <Controller
                name={fieldName}
                control={control}
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

    /**
     * Form OnSubmit
     * @param formData 
     */
    const onSubmit = (formData) => {

        const updatedValues = currentData?.map(param => {

            const fieldName = param.name

            return {
                ...param,
                is_view: 1,
                value: formData[fieldName] ?? param.value
            };
        });

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
    }) => {
        return (
            <Stack
                key={objData.uuid}
                sx={{
                    cursor: isEnabled ? 'pointer' : 'default',
                    justifyContent: 'center',
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
        <Stack rowGap={2}
            sx={{ overflowY: 'scroll', height: "100%" }}
        >
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    // navigate(`/checklist/checklist-groups/${assetTypeId}/select-assets/${groupUuid}`)
                    navigate(`/checklist/checklist-groups/${assetTypeId}`)
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}> {getCurrentAssetDetailsData?.asset_name}</TypographyComponent>
            </Stack>} />
            <Stack sx={{ rowGap: 1 }}>
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
                        boxShadow: 'none',
                        border: `1px solid ${theme.palette.grey[100]}`
                        // boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
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
                                {
                                    getCurrentAssetDetailsData?.time_interval && getCurrentAssetDetailsData?.time_interval !== null ?
                                        <Chip size='small' label={getCurrentAssetDetailsData?.time_interval && getCurrentAssetDetailsData?.time_interval !== null ? skipEvery(getCurrentAssetDetailsData?.time_interval) : ''} sx={{ background: theme.palette.primary[600], borderRadius: '4px', padding: '0px 1px', color: theme.palette.common.white, fontSize: '12px' }}>
                                        </Chip>
                                        :
                                        <></>
                                }
                                <ChevronDownIcon />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack ref={scrollRef} sx={{ flexDirection: 'row', paddingY: '8px', borderRadius: '8px', width: '100%', overflowX: 'scroll', scrollbarWidth: 'thin' }}>
                        {
                            getTimesArray && getTimesArray !== null && getTimesArray?.length > 0 ?
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
                                                isCurrentTimeInRange={currentInRange}
                                                isFutureTimeInRange={futureRange}
                                                onClick={() => {
                                                    setIsInitialLoad(false)
                                                    if (isEnabled == true) {
                                                        const updatedTimes = getTimesArray && getTimesArray !== null && getTimesArray.length > 0 ?
                                                            getTimesArray?.map(time => {
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
                                                            }) : []
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
                    <Stack sx={{ borderTop: `1.5px solid ${theme.palette.grey[300]}`, mx: -2, mb: 1.5 }}></Stack>
                    {
                        getCurrentAssetDetailsData?.is_view == 0 ?
                            <Stack>
                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.7 }}>
                                    <TypographyComponent sx={{ color: theme.palette.common.black }} fontSize={16} fontWeight={400} mb={1}>
                                        Checklist Progress
                                    </TypographyComponent>
                                    <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
                                        <TypographyComponent
                                            fontSize={16}
                                            fontWeight={400}
                                            mb={1}
                                            sx={{ color: theme.palette.success[700] }}
                                        >
                                            <span id="filled-count">
                                                (00/{String(getCurrentParametersRenderedLength || 0).padStart(2, "0")})
                                            </span>
                                        </TypographyComponent>
                                        <TypographyComponent
                                            id="filled-percent"
                                            fontSize={16}
                                            fontWeight={400}
                                            mb={1}
                                            sx={{ color: theme.palette.success[700] }}
                                        >
                                            0%
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <ChecklistLinearProgress id="progress-bar" bgColor={theme.palette.success[700]} />
                                </Box>
                            </Stack>
                            :
                            <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mt: 0.3 }}>

                                {/* LEFT SIDE — Checklist Details */}
                                <Stack spacing={0.1}>
                                    <TypographyComponent sx={{ color: theme.palette.common.black }} fontSize={16} fontWeight={400}>
                                        Checklist Details
                                    </TypographyComponent>

                                    <Stack direction="row" spacing={1.2}>
                                        <TypographyComponent
                                            fontSize={16}
                                            fontWeight={400}
                                            sx={{ color: theme.palette.success[700] }}
                                        >
                                            ({String(ViewFilledCount || 0).padStart(2, "0")}/
                                            {String(getCurrentParametersRenderedLength || 0).padStart(2, "0")})
                                        </TypographyComponent>

                                        <TypographyComponent
                                            fontSize={16}
                                            fontWeight={400}
                                            sx={{ color: theme.palette.success[700] }}
                                        >
                                            {getCurrentParametersRenderedLength > 0
                                                ? getPercentage(ViewFilledCount, getCurrentParametersRenderedLength)
                                                : 0}%
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>

                                {/* RIGHT SIDE — Abnormalities */}
                                <Stack spacing={0.1} alignItems="flex-end">
                                    <TypographyComponent sx={{ color: theme.palette.common.black }} fontSize={16} fontWeight={400}>
                                        Abnormalities
                                    </TypographyComponent>

                                    <Stack direction="row" spacing={1.2}>
                                        <TypographyComponent
                                            fontSize={16}
                                            fontWeight={400}
                                            sx={{ color: theme.palette.warning[700] }}
                                        >
                                            ({String(getAbnormalCount || 0).padStart(2, "0")})
                                        </TypographyComponent>

                                        <TypographyComponent
                                            fontSize={16}
                                            fontWeight={400}
                                            sx={{ color: theme.palette.warning[700] }}
                                        >
                                            {getCurrentParametersRenderedLength > 0
                                                ? getPercentage(getAbnormalCount, getCurrentParametersRenderedLength)
                                                : 0}%
                                        </TypographyComponent>
                                    </Stack>
                                </Stack>

                            </Stack>

                    }
                </Card>
            </Stack>
            <Stack sx={{ rowGap: 1, marginBottom: 8, border: `1px solid ${theme.palette.grey[100]}`, borderRadius: '16px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack sx={{ width: "100%", background: "#fff", borderRadius: '16px' }}>
                        {loadingList ? (
                            <FullScreenLoader open={true} />
                        ) : getCurrentAssetDetailsData?.checklist_json?.parameters && getCurrentAssetDetailsData?.checklist_json?.parameters !== null && getCurrentAssetDetailsData?.checklist_json?.parameters.length > 0 && getCurrentAssetDetailsData?.checklist_json?.parameters?.filter(p => p?.parameter_type !== 'Grouping').map((param, index) => {
                            const valueObj = getValue(param.id);
                            return (
                                <Box
                                    key={param.id}
                                    sx={{
                                        background: "#fff",
                                        padding: "16px 16px",
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
                                    <Stack sx={{ flexDirection: 'row', width: '100%' }}>
                                        <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={16} fontWeight={400}> {param.name}</TypographyComponent>
                                    </Stack>

                                    {/* RIGHT: Input Field */}
                                    {
                                        getCurrentAssetDetailsData?.is_view == 0 ?
                                            <>
                                                <FieldRenderer key={param?.asset_id} params={param} value={valueObj.value} assetId={param?.asset_id} />
                                            </>
                                            :
                                            <Stack sx={{ padding: '12px 18px', width: '100%', alignItems: 'center', background: theme.palette.grey[100], borderRadius: '8px' }}>
                                                <TypographyComponent
                                                    sx={{ color: valueObj?.param_status == 'Abnormal' && valueObj?.priority == 'High' ? theme.palette.error[600] : (valueObj?.param_status == 'Abnormal' && valueObj?.priority == 'Low') ? theme.palette.warning[600] : theme.palette.grey[900] }}
                                                    fontSize={16} fontWeight={400}
                                                >{valueObj.value && valueObj.value !== null ? `${valueObj.value} ${param?.input_type == 'Number (with range)' ? (param?.unit && param?.unit !== null ? param?.unit : '') : ''} ` : '--'} </TypographyComponent>
                                            </Stack>
                                    }
                                </Box>
                            );
                        })}
                    </Stack>
                </form>
            </Stack>
            {
                (selectedTimeUuid?.uuid == getTimesArray?.find(t => isCurrentTimeInRange(t.from, t.to))?.uuid) && selectedAssetStatus !== 'Approved' ?
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
                                        let objDetails = Object.assign({}, getCurrentAssetDetailsData)
                                        objDetails.is_view = 0
                                        setGetCurrentAssetDetailsData(objDetails)
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
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{item?.completed && item?.completed !== null ? item?.completed.toString().padStart(2, "0") : '00'} Completed</TypographyComponent>
                                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                        </Stack>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{item?.pending && item?.pending !== null ? item?.pending.toString().padStart(2, "0") : '00'} Pending</TypographyComponent>
                                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Stack sx={{ background: theme.palette.common.black, height: '4px', width: '4px', borderRadius: '5px', alignItems: 'center' }}></Stack>
                                        </Stack>
                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{item?.overdue && item?.overdue !== null ? item?.overdue.toString().padStart(2, "0") : '00'} Skipped</TypographyComponent>
                                    </Stack>
                                </Box>

                                <Chip size='small' label={item?.interval && item?.interval !== null ? skipEvery(item?.interval) : ''} sx={{ background: theme.palette.primary[600], borderRadius: '4px', padding: '0px 1px', color: theme.palette.common.white, fontSize: '12px' }}>
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
