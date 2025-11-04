/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItem,
    MenuItem,
    Stack,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "../../../../../assets/icons/SearchIcon";
import TypographyComponent from "../../../../../components/custom-typography";
import { AntSwitch, SearchInput } from "../../../../../components/common";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../../hooks/useAuth";
import { useBranch } from "../../../../../hooks/useBranch";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../../../constants";
import toast from "react-hot-toast";
import { useSnackbar } from "../../../../../hooks/useSnackbar";
import { actionRosterData, actionEmployeeTypeWiseList, resetEmployeeTypeWiseListResponse } from "../../../../../store/roster";
import EmptyContent from "../../../../../components/empty_content";
import { actionGetRoleTypeList, resetGetRoleTypeListResponse } from "../../../../../store/master/role-type"
import { Controller, useForm } from "react-hook-form";
import ChevronDownIcon from "../../../../../assets/icons/ChevronDown";
import CustomTextField from "../../../../../components/text-field";
import FormLabel from "../../../../../components/form-label";
import { decrypt, getObjectById } from "../../../../../utils";
import ListComponents from "../../../../../components/list-components";

export default function SelectEmployeesStep() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    const {
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            role_type_id: ''
        }
    });

    // state
    const [searchQuery, setSearchQuery] = useState('')
    const [employeeRoleTypeOptions, setEmployeeRoleTypeOptions] = useState([])
    const [employeeTypeWiseListOptions, setEmployeeTypeWiseListOptions] = useState([])
    const [employeeTypeWiseListOriginalData, setEmployeeTypeWiseListOriginalData] = useState([])

    // store
    const { getRoleTypeList } = useSelector(state => state.masterRoleTypeStore)
    const { rosterData, employeeTypeWiseList } = useSelector(state => state.rosterStore)

    /**
    * initial render
    */
    useEffect(() => {
        if (branch?.currentBranch?.role_type_flag == 1 && branch?.currentBranch?.client_uuid && branch?.currentBranch?.client_uuid !== null) {
            dispatch(actionGetRoleTypeList({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
        }
    }, [branch?.currentBranch])

    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && rosterData?.role_type_id && rosterData?.role_type_id !== null) {
            dispatch(actionEmployeeTypeWiseList({
                branch_uuid: branch?.currentBranch?.uuid,
                role_type_id: rosterData?.role_type_id
            }))
        }
    }, [branch?.currentBranch, rosterData?.role_type_id])

    /**
    * Filter the employee type wise list
    */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (employeeTypeWiseListOriginalData && employeeTypeWiseListOriginalData !== null && employeeTypeWiseListOriginalData.length > 0) {
                var filteredData = employeeTypeWiseListOriginalData.filter(
                    item =>
                        (item?.name && item?.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setEmployeeTypeWiseListOptions(filteredData)
                } else {
                    setEmployeeTypeWiseListOptions([])
                }
            }
        } else {
            setEmployeeTypeWiseListOptions(employeeTypeWiseListOriginalData)
        }
    }, [searchQuery])

    /**
 * useEffect
 * @dependency : getRoleTypeList
 * @type : HANDLE API RESULT
 * @description : Handle the result of get Role Type List API
 */
    useEffect(() => {
        if (getRoleTypeList && getRoleTypeList !== null) {
            dispatch(resetGetRoleTypeListResponse())
            if (getRoleTypeList?.result === true) {
                setEmployeeRoleTypeOptions(getRoleTypeList?.response)
            } else {
                setEmployeeRoleTypeOptions([])
                switch (getRoleTypeList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetRoleTypeListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: getRoleTypeList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getRoleTypeList])

    /**
     * useEffect
     * @dependency : employeeTypeWiseList
     * @type : HANDLE API RESULT
     * @description : Handle the result of employee Type Wise List API
     */
    useEffect(() => {
        if (employeeTypeWiseList && employeeTypeWiseList !== null) {
            dispatch(resetEmployeeTypeWiseListResponse())
            if (employeeTypeWiseList?.result === true) {
                setEmployeeTypeWiseListOptions(employeeTypeWiseList?.response)
                setEmployeeTypeWiseListOriginalData(employeeTypeWiseList?.response)
            } else {
                setEmployeeTypeWiseListOptions([])
                setEmployeeTypeWiseListOriginalData([])
                switch (employeeTypeWiseList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeTypeWiseListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: employeeTypeWiseList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeTypeWiseList])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    // list columns
    const columns = [
        {
            flex: 0.1,
            field: 'full_name',
            headerName: 'Employee Name'
        },
        {
            flex: 0.1,
            field: 'employee_id',
            headerName: 'Employee ID'
        },
        {
            flex: 0.1,
            field: 'role_type',
            headerName: 'Employee Type'
        },
        {
            flex: 0.1,
            field: "contact",
            headerName: "Contact Number",
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        {
                            params.row.contact && params.row.contact !== null ?
                                <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                                    {`${params.row.contact_country_code && params.row.contact_country_code !== null ? params.row.contact_country_code : ''}${decrypt(params.row.contact)}`}
                                </TypographyComponent>
                                :
                                <></>
                        }

                    </Stack>
                )
            }
        }
    ];

    return (
        <Grid container spacing={4} sx={{ mt: 1 }}>
            {/* Left Panel: Select Employees */}
            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                <TypographyComponent fontSize={16} fontWeight={600}>
                    Select Employees
                </TypographyComponent>
                <Card sx={{ borderRadius: '16px', padding: '24px', gap: '32px', border: `1px solid ${theme.palette.grey[300]}`, mt: 2 }}>
                    <CardContent sx={{ p: 0 }}>
                        <Stack>
                            <Controller
                                name='role_type_id'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        select
                                        fullWidth
                                        value={field?.value ?? ''}
                                        label={<FormLabel label='Employee Type' required={false} />}
                                        onChange={(event) => {
                                            field.onChange(event);

                                            // Copy current roster data safely
                                            let objData = Object.assign({}, rosterData);

                                            // 🔹 Preserve previously selected employees
                                            let existingEmployees = Array.isArray(objData.employees) ? [...objData.employees] : [];

                                            // 🔹 Update current role type info
                                            const selectedId = event.target.value;
                                            const objCurrent = getObjectById(employeeRoleTypeOptions, selectedId);

                                            objData.role_type_id = selectedId;
                                            objData.role_type_name = objCurrent?.type || '';

                                            // Keep previous employees
                                            objData.employees = existingEmployees;

                                            // 🔹 Dispatch updated data
                                            dispatch(actionRosterData(objData));
                                        }}
                                        SelectProps={{
                                            displayEmpty: true,
                                            IconComponent: ChevronDownIcon,
                                            MenuProps: {
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 220, // Set your desired max height
                                                        scrollbarWidth: 'thin'
                                                    }
                                                }
                                            }
                                        }}

                                        error={Boolean(errors.role_type_id)}
                                        {...(errors.role_type_id && { helperText: errors.role_type_id.message })}
                                    >
                                        <MenuItem value='' disabled>
                                            <em>Select Employee Type</em>
                                        </MenuItem>
                                        {employeeRoleTypeOptions &&
                                            employeeRoleTypeOptions.map(option => (
                                                <MenuItem
                                                    key={option?.id}
                                                    value={option?.id}
                                                    sx={{
                                                        whiteSpace: 'normal',        // allow wrapping
                                                        wordBreak: 'break-word',     // break long words if needed
                                                        maxWidth: 550,               // control dropdown width
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,          // limit to 2 lines
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {option?.type}
                                                </MenuItem>
                                            ))}
                                    </CustomTextField>
                                )}
                            />
                        </Stack>
                        <Stack sx={{ my: 2 }}>
                            <SearchInput
                                id="search-employees"
                                placeholder="Search"
                                variant="outlined"
                                size="small"
                                fullWidth
                                width='100%'
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 1 }}>
                                            <SearchIcon stroke={theme.palette.grey[500]} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                        <List dense sx={{ p: 0 }}>
                            {employeeTypeWiseListOptions?.length > 0 ? (
                                employeeTypeWiseListOptions.map((employee) => {
                                    const isChecked = rosterData?.employees?.some(
                                        item => item.employee_id === employee.employee_id && item.role_type_id === employee.role_type_id
                                    );

                                    return (
                                        <ListItem
                                            key={employee.id}
                                            disablePadding
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                py: 1.5,
                                                px: 1,
                                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                            }}
                                        >
                                            <Box>
                                                <TypographyComponent
                                                    fontSize={16}
                                                    fontWeight={400}
                                                    sx={{ color: theme.palette.grey[900] }}
                                                >
                                                    {employee?.name}
                                                </TypographyComponent>
                                                <TypographyComponent
                                                    fontSize={14}
                                                    fontWeight={400}
                                                    sx={{ color: theme.palette.grey[600] }}
                                                >
                                                    {employee?.role_name}
                                                </TypographyComponent>
                                            </Box>

                                            <AntSwitch
                                                checked={isChecked}
                                                onChange={(event) => {
                                                    let objData = Object.assign({}, rosterData);
                                                    let updatedEmployees = Array.isArray(objData?.employees) ? [...objData.employees] : [];

                                                    if (event.target.checked) {
                                                        // Check if already exists
                                                        const alreadyAdded = updatedEmployees.some(
                                                            item =>
                                                                item.employee_id === employee.employee_id &&
                                                                item.role_type_id === employee.role_type_id
                                                        );

                                                        if (!alreadyAdded) {
                                                            updatedEmployees.push({
                                                                id: employee.id,
                                                                employee_id: employee.employee_id,
                                                                roster_group_employee_id: employee.id,
                                                                is_manager: objData.role_type_name === 'Manager' ? 1 : 0,
                                                                full_name: employee.name,
                                                                contact_country_code: employee.contact_country_code,
                                                                contact: employee.contact,
                                                                role_type_id: employee.role_type_id,
                                                                role_type: employee.role_type,
                                                            });
                                                        }
                                                    } else {
                                                        updatedEmployees = updatedEmployees.filter(
                                                            item =>
                                                                !(item.employee_id === employee.employee_id && item.role_type_id === employee.role_type_id)
                                                        );
                                                    }

                                                    objData.employees = updatedEmployees;
                                                    dispatch(actionRosterData(objData));
                                                }}
                                            />
                                        </ListItem>
                                    );
                                })
                            ) : (
                                <EmptyContent
                                    imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND}
                                    title="No Employee Found"
                                    subTitle=""
                                />
                            )}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
            {/* Right Panel: Group Details */}
            <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}>
                <Box>
                    <TypographyComponent fontSize={16} fontWeight={600}>
                        Group Details
                    </TypographyComponent>
                    <Card
                        sx={{
                            borderRadius: '16px',
                            padding: '12px',
                            gap: '16px',
                            border: `1px solid ${theme.palette.grey[300]}`,
                            my: 2
                        }}
                    >
                        <CardContent sx={{ p: 2 }}>
                            {rosterData?.assets && rosterData?.assets.length > 0 ? (
                                rosterData.assets.map((asset, index) => (
                                    <React.Fragment key={asset.asset_id || index}>
                                        <Grid container spacing={2} alignItems="center" sx={{ py: 1 }}>
                                            <Grid
                                                size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}
                                                sx={{ borderRight: `1px solid ${theme.palette.grey[300]}` }}
                                            >
                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                    Asset Name
                                                </TypographyComponent>
                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                    {asset?.asset_description ?? 'N/A'}
                                                </TypographyComponent>
                                            </Grid>

                                            <Grid
                                                size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}
                                                sx={{ borderRight: `1px solid ${theme.palette.grey[300]}` }}
                                            >
                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                    Asset Type
                                                </TypographyComponent>
                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                    {asset?.asset_type ?? 'N/A'}
                                                </TypographyComponent>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                <TypographyComponent fontSize={16} fontWeight={400}>
                                                    Group Name
                                                </TypographyComponent>
                                                <TypographyComponent fontSize={18} fontWeight={600}>
                                                    {asset?.roster_group_name ?? 'N/A'}
                                                </TypographyComponent>
                                            </Grid>
                                        </Grid>

                                        {/* Divider only between items */}
                                        {index < rosterData?.assets.length - 1 && (
                                            <Divider sx={{ my: 1.5, borderColor: theme.palette.grey[300] }} />
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <TypographyComponent
                                    fontSize={16}
                                    fontWeight={400}
                                    sx={{ textAlign: 'center', py: 2 }}
                                >
                                    No Employees Selected
                                </TypographyComponent>
                            )}
                        </CardContent>
                    </Card>

                    <TypographyComponent fontSize={16} fontWeight={600} sx={{ mb: 2 }}>
                        Selected Employees
                    </TypographyComponent>
                    <Card sx={{ borderRadius: '16px', padding: '12px', gap: '16px', border: `1px solid ${theme.palette.grey[300]}`, my: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                            {rosterData?.employees && rosterData?.employees !== null && rosterData?.employees.length > 0 ? (
                                <ListComponents
                                    rows={rosterData?.employees}
                                    columns={columns}
                                    isCheckbox={false}
                                    height={200}
                                    onChange={(selectedIds) => {
                                        console.log("Selected row IDs in UsersList:", selectedIds);
                                    }}
                                />
                            ) : (
                                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Employee Found'} subTitle={''} />
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );
}