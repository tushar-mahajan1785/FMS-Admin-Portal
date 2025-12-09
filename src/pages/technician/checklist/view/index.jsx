import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { TechnicianNavbarHeader } from '../../../../components/technician/navbar-header'
import TypographyComponent from '../../../../components/custom-typography'
import { getPercentage } from '../../../../utils'
import { StyledLinearProgress } from '../../../../components/common'
import ChevronLeftIcon from '../../../../assets/icons/ChevronLeft'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import CustomTextField from '../../../../components/text-field'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { actionTechnicianAssetChecklistDetails, actionTechnicianAssetChecklistUpdate, resetTechnicianAssetChecklistDetailsResponse, resetTechnicianAssetChecklistUpdateResponse } from '../../../../store/technician/checklist'
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../../constants'
import { useBranch } from '../../../../hooks/useBranch'
import { useSnackbar } from '../../../../hooks/useSnackbar'
import { useAuth } from '../../../../hooks/useAuth'
import FullScreenLoader from '../../../../components/fullscreen-loader'

export const ChecklistView = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const { groupUuid, assetTypeId, assetId, timeUuid } = useParams()

    //Stores
    const { technicianAssetChecklistDetails, technicianAssetChecklistUpdate } = useSelector(state => state.technicianChecklistStore)

    //States
    const [loadingList, setLoadingList] = useState(false)
    const [getCurrentAssetDetailsData, setGetCurrentAssetDetailsData] = useState(null)
    const [currentData, setCurrentData] = useState([])

    //Form
    const { control, handleSubmit, formState: { errors } } = useForm();

    console.log('----currentData-------', currentData)

    /**
     * useEffect
     * @dependency : technicianAssetChecklistUpdate
     * @type : HANDLE API RESULT
     * @description : Handle the result of checklist group history/asset save API
     */
    useEffect(() => {
        if (technicianAssetChecklistUpdate && technicianAssetChecklistUpdate !== null) {
            dispatch(resetTechnicianAssetChecklistUpdateResponse())
            if (technicianAssetChecklistUpdate?.result === true) {
                // setLoadingSubmit(false)
                // reset()
                // showSnackbar({ message: technicianAssetChecklistUpdate.message, severity: "success" })
                // setLoadingChecklist(true)
                // dispatch(actionChecklistGroupDetails({
                //     branch_uuid: branch?.currentBranch?.uuid,
                //     asset_type_id: assetId,
                //     group_uuid: groupUuid,
                //     date: selectedStartDate && selectedStartDate !== null ? moment(selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
                // }))
            } else {
                // setLoadingSubmit(false)
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

    /**
     * Initial call Asset checklist details API
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && assetId && assetId !== null && timeUuid && timeUuid !== null) {
            setLoadingList(true)
            dispatch(actionTechnicianAssetChecklistDetails({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_id: assetId,
                time_uuid: timeUuid
            }))
        }
    }, [branch?.currentBranch?.uuid, assetId, timeUuid])

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
                setLoadingList(false)
            } else {
                setLoadingList(false)
                // setGetCurrentAssetDetailsData(null)
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
    * Initial Render
    */
    useEffect(() => {

        setGetCurrentAssetDetailsData({
            "asset_type_id": "1",
            "title": "GF-BMS UPS Room-A",
            "total_groups": 2,
            "total_assets": 5,
            "time_interval": '3 Hrs',
            "total_checklists": 36,
            "total_completed": 15,
            "total_overdue": 0,
            "total_abnormal": 6,
            "total_pending": 0,
            "total_not_approved": 15,
            "to": "14:00",
            "from": "12:00",
            "is_view": 1,
            "parameters": [
                {
                    "id": 1,
                    "max": "200",
                    "min": "10",
                    "name": "Temperature",
                    "unit": "F",
                    "is_view": 0,
                    "options": [],
                    "sequence": 1,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Number (with range)",
                    "is_mandatory": 1,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 2,
                    "max": "",
                    "min": "",
                    "name": "Pressure",
                    "unit": "",
                    "is_view": 0,
                    "options": [],
                    "sequence": 2,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Text Input",
                    "is_mandatory": 0,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 3,
                    "max": "",
                    "min": "",
                    "name": "Flow Rate",
                    "unit": "",
                    "is_view": 0,
                    "options": [
                        "AB",
                        "BC",
                        "QR",
                        "MN"
                    ],
                    "sequence": 3,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Multiple Choice",
                    "is_mandatory": 0,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 4,
                    "max": "200",
                    "min": "10",
                    "name": "Vibration Level",
                    "unit": "F",
                    "is_view": 0,
                    "options": [],
                    "sequence": 4,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Number (with range)",
                    "is_mandatory": 1,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 5,
                    "max": "",
                    "min": "",
                    "name": "Oil Level",
                    "unit": "",
                    "is_view": 0,
                    "options": [
                        "Yes",
                        "No"
                    ],
                    "sequence": 5,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Yes/No",
                    "is_mandatory": 1,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 6,
                    "max": "",
                    "min": "",
                    "name": "kwh Meter Reading",
                    "unit": "",
                    "is_view": 0,
                    "options": [],
                    "sequence": 6,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Text Input",
                    "is_mandatory": 0,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 7,
                    "max": "",
                    "min": "",
                    "name": "Check Any Leakage",
                    "unit": "",
                    "is_view": 0,
                    "options": [
                        "AA",
                        "SS",
                        "FF",
                        "QQ"
                    ],
                    "sequence": 7,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Multiple Choice",
                    "is_mandatory": 1,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 8,
                    "max": "",
                    "min": "",
                    "name": "Check Battery System",
                    "unit": "",
                    "is_view": 0,
                    "options": [
                        "Yes",
                        "No"
                    ],
                    "sequence": 8,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Yes/No",
                    "is_mandatory": 0,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 9,
                    "max": "100",
                    "min": "20",
                    "name": "Check Air Filter",
                    "unit": "F",
                    "is_view": 0,
                    "options": [],
                    "sequence": 9,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Number (with range)",
                    "is_mandatory": 1,
                    "default_value": "",
                    "multiple_choice_option": ""
                },
                {
                    "id": 10,
                    "max": "",
                    "min": "",
                    "name": "DG Status",
                    "unit": "",
                    "is_view": 0,
                    "options": [],
                    "sequence": 10,
                    "sub_name": "",
                    "parent_id": 0,
                    "input_type": "Text Input",
                    "is_mandatory": 0,
                    "default_value": "",
                    "multiple_choice_option": ""
                }
            ]
        })

    }, [])

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
        if (getCurrentAssetDetailsData && getCurrentAssetDetailsData !== null && getCurrentAssetDetailsData?.parameters && getCurrentAssetDetailsData?.parameters !== null && getCurrentAssetDetailsData?.parameters.length > 0) {
            let values = createValuesFromParameters(getCurrentAssetDetailsData?.parameters)
            if (values && values !== null && values.length > 0) {
                setCurrentData(values)
            } else {
                setCurrentData([])
            }
        }
    }, [getCurrentAssetDetailsData])

    /**
     * Get Current Value of Parameter
     * @param {*} paramId 
     * @returns 
     */
    const getValue = (paramId) => {
        return currentData.find(v => v.parameter_id === paramId) || {};
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
                disabled={getCurrentAssetDetailsData?.is_view == 0 ? false : true}
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
        console.log('-------formData-------', formData)
        const updatedValues = currentData.map(param => {
            // Construct the dynamic fieldName
            const fieldName = `${param.name} `;

            return {
                ...param,
                is_view: 1,
                value: formData[fieldName] ?? param.value
            };
        });

        let objData = {
            "asset_type_id": assetTypeId,
            "asset_id": assetId,
            "group_uuid": groupUuid,
            "date": moment().format('YYYY-MM-DD'),
            "checklist_json": {
                "asset_id": assetId,
                "asset_name": getCurrentAssetDetailsData?.asset_name,
                "status": getCurrentAssetDetailsData?.status,
                "is_view": 0,
                "times": [
                    {
                        "to": getCurrentAssetDetailsData?.to,
                        "from": getCurrentAssetDetailsData?.from,
                        "uuid": timeUuid,
                        "is_selected": true,
                        "values": updatedValues || []
                    }
                ]
            }
        }

        console.log('-------objData-------', objData)
        dispatch(actionTechnicianAssetChecklistUpdate(objData))
    }


    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', height: "100%" }}>
            <TechnicianNavbarHeader leftSection={<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                    navigate(`/checklist/checklist-groups/${assetTypeId}/select-assets/${groupUuid}/select-time/${assetId}`)
                }}>
                    <ChevronLeftIcon size={24} />
                </Stack>
                <TypographyComponent color={theme.palette.text.primary} fontSize={22} fontWeight={500}> {getCurrentAssetDetailsData?.title}</TypographyComponent>
            </Stack>} />
            <Stack sx={{ rowGap: 1 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }} key={`${getCurrentAssetDetailsData?.id}`}>
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
                                navigate(`select-assets/${getCurrentAssetDetailsData?.id}`)
                            }}
                        >
                            <Stack direction="row" justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>
                                <Stack flexDirection={'row'} gap={2} justifyContent={'space-between'} alignItems="center" sx={{ width: '100%' }}>

                                    <Box>
                                        <TypographyComponent fontSize={18} fontWeight={500}>
                                            {getCurrentAssetDetailsData?.title}
                                        </TypographyComponent>
                                    </Box>
                                    <TypographyComponent fontSize={18} fontWeight={400}>{`${getCurrentAssetDetailsData?.from}-${getCurrentAssetDetailsData?.to}`}</TypographyComponent>
                                </Stack>

                            </Stack>
                            <Stack>
                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.7 }}>
                                    <TypographyComponent fontSize={16} fontWeight={400} mb={1}>
                                        Checklist Progress
                                    </TypographyComponent>
                                    <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
                                        <TypographyComponent fontSize={16} fontWeight={400} mb={1} sx={{ color: theme.palette.success[700] }}>
                                            {`(${getCurrentAssetDetailsData?.total_completed.toString().padStart(2, "0")}/${getCurrentAssetDetailsData?.total_checklists.toString().padStart(2, "0")})`}
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
                        ) : getCurrentAssetDetailsData?.parameters.map((param, index) => {
                            const valueObj = getValue(param.id);
                            console.log('----valueObj-------', valueObj)
                            return (
                                <Box
                                    key={param.id}
                                    sx={{
                                        background: "#fff",
                                        padding: "16px 16px",
                                        // borderRadius: "8px",
                                        borderTopLeftRadius: index == 0 ? '16px' : 'none',
                                        borderTopRightRadius: index == 0 ? '16px' : 'none',
                                        borderBottomLeftRadius: index == getCurrentAssetDetailsData?.parameters.length - 1 ? '16px' : 'none',
                                        borderBottomRightRadius: index == getCurrentAssetDetailsData?.parameters.length - 1 ? '16px' : 'none',
                                        borderBottom: index < getCurrentAssetDetailsData?.parameters.length - 1 ? "1px solid #E0E0E0" : 'none',
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
                                    {/* {
                                        getCurrentAssetDetailsData?.is_view == 1 ?
                                            <>
                                                <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={14} fontWeight={400}>{valueObj.value && valueObj.value !== null ? `${valueObj.value} ${param?.input_type == 'Number (with range)' ? (param?.unit && param?.unit !== null ? param?.unit : '') : ''} ` : '--'} </TypographyComponent>
                                            </>
                                            : */}
                                    <>
                                        <FieldRenderer key={`${param?.asset_id} `} params={param} value={valueObj.value} assetId={param?.asset_id} />
                                    </>
                                    {/* } */}
                                    {/* <TextField
                                    size="small"
                                    sx={{ width: "180px" }}
                                    value={valueObj.value || ""}
                                // onChange={(e) => onValueChange(param.id, e.target.value)}
                                /> */}
                                </Box>
                            );
                        })}
                    </Stack>
                </form>
            </Stack>
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
                    // zIndex: 100,
                    // paddingBottom: 8
                }}
            >
                {
                    getCurrentAssetDetailsData?.is_view == 0 ?
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
                            }}
                        >
                            Edit Checklist
                        </Button>

                }

            </Box>
        </Stack >
    )
}
