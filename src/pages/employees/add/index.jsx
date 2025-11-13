/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import {
  Drawer,
  Button,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  Grid,
  MenuItem,
  InputAdornment,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
  ERROR,
  isAlphaNumeric,
  isEmail,
  isMobile,
  isNumber,
  SERVER_ERROR,
  UNAUTHORIZED,
} from '../../../constants';
import { actionAddEmployee, resetAddEmployeeResponse, actionEmployeeManagerList, resetEmployeeManagerListResponse } from "../../../store/employee";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormHeader from "../../../components/form-header";
import ChevronDownIcon from "../../../assets/icons/ChevronDown";
import MailIcon from "../../../assets/icons/MailIcon";
import AddressIcon from "../../../assets/icons/AddressIcon";
import SectionHeader from "../../../components/section-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import { actionGetRoleTypeList, resetGetRoleTypeListResponse } from "../../../store/master/role-type";
import { actionRole, resetRolesResponse } from '../../../store/master/role';
import StatusSwitch from "../../../components/status-switch";
import CloseIcon from "../../../assets/icons/CloseIcon";
import { encrypt } from "../../../utils";
import CustomAutocomplete from "../../../components/custom-autocomplete";
import CountryCodeSelect from "../../../components/country-code-component";
import { CommonDynamicFields } from "../../../components/common-dynamic-fields";
import DatePickerWrapper from "../../../components/datapicker-wrapper";
import ClientsIcon from "../../../assets/icons/ClientsIcon";
import { useBranch } from "../../../hooks/useBranch";

export default function AddEmployee({ open, syncData, toggle }) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { logout } = useAuth()
  const { showSnackbar } = useSnackbar()
  const branch = useBranch()

  // store
  const { addEmployee, employeeManagerList } = useSelector(state => state.employeeStore)
  const { getRoleTypeList } = useSelector(state => state.masterRoleTypeStore)
  const { roleList } = useSelector(state => state.masterRoleStore)
  const { masterCountryCodeList } = useSelector(state => state.vendorStore)
  const { additionalFieldsDetails } = useSelector(state => state.CommonStore)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      employee_id: "",
      name: "",
      role_type_id: null,
      email: "",
      contact: "",
      alternate_contact: "",
      role_id: null,
      company_name: "",
      manager_id: null,
      address: '',
      age: '',
      contact_country_code: "+91",
      alternate_contact_country_code: "+91",
      asset_status: 'Active'
    }
  });

  //  state
  const [loading, setLoading] = useState(false)
  const [assetStatus, setAssetStatus] = useState("Active");
  const [masterCountryCodeOptions, setMasterCountryCodeOptions] = useState([])
  const [employeeRoleOptions, setEmployeeRoleOptions] = useState([])
  const [employeeRoleTypeOptions, setEmployeeRoleTypeOptions] = useState([])
  const [managerNameOptions, setManagerNameOptions] = useState([])
  const [additionalFieldsArray, setAdditionalFieldsArray] = useState([])

  // watch
  const watchRoleType = watch('role_type_id')

  /**
   * initial API call
   */
  useEffect(() => {
    if (open === true) {
      if (branch?.currentBranch?.role_type_flag == 1) {
        dispatch(actionGetRoleTypeList({
          client_uuid: branch?.currentBranch?.client_uuid
        }))
      } else {
        dispatch(actionRole({ role_type_id: null, branch_uuid: branch?.currentBranch?.uuid }))
      }

    }
  }, [open, branch?.currentBranch?.client_uuid, branch?.currentBranch?.uuid])

  /**
   * 
   * @param {*} watch : progress bar manage as per field value changes
   * @param {*} errors 
   * @param {*} fields 
   * @returns 
   */
  const useSectionProgress = (watch, errors, fields) => {
    const values = watch(fields);

    const filled = fields.filter((f, i) => {
      const value = values[i];
      const hasError = !!errors[f];
      return value && value.toString().trim() !== "" && !hasError;
    }).length;

    return Math.round((filled / fields.length) * 100);
  };

  /**
   * all section progress bar manage as per field value changes
   */
  const personalProgress = useSectionProgress(watch, errors, ["employee_id", "name", "age"]);
  const employmentProgress = useSectionProgress(watch, errors, ["role_type_id", "role_id", "company_name", "manager_id"]);
  const contactProgress = useSectionProgress(watch, errors, ["email", "contact", "alternate_contact"]);
  const addressProgress = useSectionProgress(watch, errors, ["address", "asset_status"]);

  /**
   * handle close function call
   */
  const handleClose = () => {
    toggle()
    reset()
  }

  /**
   *  client id & Branch uuid depend employee manager list API call
   */
  useEffect(() => {
    if (branch?.currentBranch?.client_id && branch?.currentBranch?.client_id !== null && branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
      dispatch(actionEmployeeManagerList({ client_id: branch?.currentBranch?.client_id, branch_uuid: branch?.currentBranch?.uuid }))
    }
  }, [branch?.currentBranch?.client_id, branch?.currentBranch?.uuid])

  /**
   * if syncData found then set all values
   */
  useEffect(() => {
    if (!open || !syncData) return;
    if (!masterCountryCodeOptions || masterCountryCodeOptions.length === 0) return;

    setValue('employee_id', syncData.employee_id ?? '');
    setValue('name', syncData.name ?? '');
    setValue('age', syncData.age ?? '');
    setValue('role_type_id', syncData.role_type_id ?? null);
    setValue('role_id', syncData.role_id ?? null);
    setValue('company_name', syncData.company_name ?? '');
    setValue('manager_id', syncData.manager_id ?? null);
    setValue('email', syncData.email);
    setValue('contact', syncData.contact && syncData.contact !== null ? String(syncData.contact) : null);
    setValue('alternate_contact', syncData.alternate_contact && syncData.alternate_contact !== null ? String(syncData.alternate_contact) : null);
    setValue('address', syncData.address ?? '');

    // only run once options exist
    const hasValue = masterCountryCodeOptions?.some(
      opt => opt?.code === syncData?.contact_country_code
    );

    setValue(
      'contact_country_code',
      hasValue && hasValue !== null && syncData && syncData !== null ? syncData?.contact_country_code : '+91'
    );

    const hasAlt = masterCountryCodeOptions?.some(
      opt => opt?.code === syncData?.alternate_contact_country_code
    );
    setValue(
      'alternate_contact_country_code',
      hasAlt && hasAlt !== null && syncData && syncData !== null && syncData?.alternate_contact_country_code
        ? syncData?.alternate_contact_country_code
        : '+91'
    );
  }, [open, syncData, masterCountryCodeOptions]);

  /**
   * Function to render Additional fields as per Configured Additional Fields for Employee
   */
  useEffect(() => {
    if (additionalFieldsDetails && additionalFieldsDetails !== null && additionalFieldsDetails?.response?.fields && additionalFieldsDetails?.response?.fields !== null && additionalFieldsDetails?.response?.fields.length > 0) {
      // 1. Create a copy of the array (using spread syntax is cleaner than Object.assign)
      const arrFields = [...additionalFieldsDetails.response.fields];

      // 2. Use .map() to transform the array elements into the desired format
      const updatedArray = arrFields.filter(element => element.is_deleted !== 1).map(element => {
        return {
          key: element?.key,
          type: element?.type,
          label: element?.label,
          value: ''
        }
      });

      // 3. Set the state with the newly created array
      setAdditionalFieldsArray(updatedArray)
    }
  }, [additionalFieldsDetails?.response?.fields])

  /**
   * role type depend Master Role API call
   */
  useEffect(() => {
    if (watchRoleType && watchRoleType !== null) {
      dispatch(actionRole({
        role_type_id: watchRoleType,
        branch_uuid: branch?.currentBranch?.uuid
      }))
    }
  }, [watchRoleType, branch?.currentBranch?.uuid])

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
  * @dependency : roleList
  * @type : HANDLE API RESULT
  * @description : Handle the result of get role List API
  */
  useEffect(() => {
    if (roleList && roleList !== null) {
      dispatch(resetRolesResponse())
      if (roleList?.result === true) {
        setEmployeeRoleOptions(roleList?.response)
      } else {
        setEmployeeRoleOptions([])
        switch (roleList?.status) {
          case UNAUTHORIZED:
            logout()
            break
          case ERROR:
            dispatch(resetRolesResponse())
            break
          case SERVER_ERROR:
            toast.dismiss()
            showSnackbar({ message: roleList?.message, severity: "error" })
            break
          default:
            break
        }
      }
    }
  }, [roleList])

  /**
    * useEffect
    * @dependency : employeeManagerList
    * @type : HANDLE API RESULT
    * @description : Handle the result of employee Manager List API
    */
  useEffect(() => {
    if (employeeManagerList && employeeManagerList !== null) {
      dispatch(resetEmployeeManagerListResponse())
      if (employeeManagerList?.result === true) {
        setManagerNameOptions(employeeManagerList?.response)
      } else {
        setManagerNameOptions([])
        switch (employeeManagerList?.status) {
          case UNAUTHORIZED:
            logout()
            break
          case ERROR:
            dispatch(resetEmployeeManagerListResponse())
            break
          case SERVER_ERROR:
            toast.dismiss()
            showSnackbar({ message: employeeManagerList?.message, severity: "error" })
            break
          default:
            break
        }
      }
    }
  }, [employeeManagerList])

  /**
    * useEffect
    * @dependency : masterCountryCodeList
    * @type : HANDLE API RESULT
    * @description : Handle the result of master Country Code List API
    */
  useEffect(() => {
    if (masterCountryCodeList && masterCountryCodeList !== null) {
      if (masterCountryCodeList?.response && masterCountryCodeList?.response !== null && masterCountryCodeList?.response.length > 0) {
        setMasterCountryCodeOptions(masterCountryCodeList?.response)
      } else {
        setMasterCountryCodeOptions([])
      }

    }
  }, [masterCountryCodeList])

  /**
   * if syncData found then set master country code value
   */
  useEffect(() => {
    if (syncData && syncData !== null) {
      // only run once options exist
      const hasValue = masterCountryCodeOptions?.some(
        opt => opt?.code === syncData?.contact_country_code
      );

      setValue(
        'contact_country_code',
        hasValue && hasValue !== null && syncData && syncData !== null ? syncData?.contact_country_code : '+91'
      );

      const hasAlt = masterCountryCodeOptions?.some(
        opt => opt?.code === syncData?.alternate_contact_country_code
      );
      setValue(
        'alternate_contact_country_code',
        hasAlt && syncData && syncData !== null && syncData?.alternate_contact_country_code
          ? syncData?.alternate_contact_country_code
          : '+91'
      );
    }

  }, [masterCountryCodeOptions])

  /**
      * useEffect
      * @dependency : addEmployee
      * @type : HANDLE API RESULT
      * @description : Handle the result of add Employee API
      */
  useEffect(() => {
    if (addEmployee && addEmployee !== null) {
      dispatch(resetAddEmployeeResponse())
      if (addEmployee?.result === true) {
        toggle('save')
        reset()
        setLoading(false)
        toast.dismiss()
        showSnackbar({ message: addEmployee?.message, severity: "success" })
      } else {
        setLoading(false)
        switch (addEmployee?.status) {
          case UNAUTHORIZED:
            logout()
            break
          case ERROR:
            dispatch(resetAddEmployeeResponse())
            toast.dismiss()
            showSnackbar({ message: addEmployee?.message, severity: "error" })
            break
          case SERVER_ERROR:
            toast.dismiss()
            showSnackbar({ message: addEmployee?.message, severity: "error" })
            break
          default:
            break
        }
      }
    }
  }, [addEmployee])

  // handle submit function
  const onSubmit = data => {
    setLoading(true)
    if (syncData && syncData !== null) {
      data.processing_id = syncData?.id
    }
    data.client_id = branch?.currentBranch?.client_id && branch?.currentBranch?.client_id !== null && branch?.currentBranch?.client_id !== '' ? branch?.currentBranch?.client_id : null
    data.branch_uuid = branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && branch?.currentBranch?.uuid !== '' ? branch?.currentBranch?.uuid : null
    data.age = data.age && data.age !== null && data.age !== '' ? data.age : null
    data.manager_id = data.manager_id && data.manager_id !== null && data.manager_id !== '' ? data.manager_id : null
    data.asset_status = assetStatus
    data.email = data.email && data.email !== null ? encrypt(data.email.toLowerCase()) : null
    data.contact = data.contact && data.contact !== null ? encrypt(data.contact) : null
    data.alternate_contact = data.alternate_contact && data.alternate_contact !== null ? encrypt(data.alternate_contact) : null
    data.alternate_contact_country_code = data.alternate_contact && data.alternate_contact !== null && data.alternate_contact !== "" ? data.alternate_contact_country_code : null
    data.additional_fields = additionalFieldsArray && additionalFieldsArray !== null && additionalFieldsArray.length > 0 ? additionalFieldsArray : []

    const additionalKeys = additionalFieldsArray.map(f => f.key);

    // remove them from data
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !additionalKeys.includes(key))
    );
    dispatch(actionAddEmployee(cleanedData))
  };

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: 1100 } } }}
    >
      <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
        <FormHeader
          color={theme.palette.primary[600]}
          size={48}
          icon={<ClientsIcon stroke={theme.palette.primary[600]} size={18} />}
          title="Add New Employee"
          subtitle="Fill below form to add new employee"
          message=""
          actions={[
            <IconButton
              onClick={handleClose}
            >
              <CloseIcon size={16} />
            </IconButton>
          ]}
        />
        <Divider sx={{ m: 2 }} />
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
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <SectionHeader title="Personal Information" progress={personalProgress} />
            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
              {/* employee id */}
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <Controller
                  name='employee_id'
                  control={control}
                  rules={{
                    required: "Employee ID is required",
                    validate: {
                      isAlphaNumeric: value => !value || isAlphaNumeric(value) || 'Invalid Employee ID'
                    },
                    maxLength: {
                      value: 45,
                      message: 'Maximum length is 45 characters'
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field?.value ?? ''}
                      inputProps={{ maxLength: 45 }}
                      label={<FormLabel label='Employee ID' required={true} />}
                      onChange={field.onChange}
                      error={Boolean(errors.employee_id)}
                      {...(errors.employee_id && { helperText: errors.employee_id.message })}
                    />
                  )}
                />
              </Grid>
              {/* employee name */}
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <Controller
                  name='name'
                  control={control}
                  rules={{
                    required: "Employee Name is required",
                    maxLength: {
                      value: 255,
                      message: 'Maximum length is 255 characters'
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field?.value ?? ''}
                      label={<FormLabel label='Employee Name' required={true} />}
                      onChange={field.onChange}
                      inputProps={{ maxLength: 255 }}
                      error={Boolean(errors.name)}
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>
              {/* age */}
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <Controller
                  name='age'
                  control={control}
                  rules={{
                    validate: {
                      isNumber: value => !value || isNumber(value) || 'Invalid Age'
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field?.value ?? ''}
                      label={<FormLabel label='Age' required={false} />}
                      inputProps={{ maxLength: 3 }}
                      onChange={field.onChange}
                      error={Boolean(errors.age)}
                      {...(errors.age && { helperText: errors.age.message })}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <SectionHeader title="Employment Details" progress={employmentProgress} sx={{ marginTop: 2 }} />

            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
              {/* employee type */}
              {
                branch?.currentBranch?.role_type_flag == 1 ?
                  <Grid Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name='role_type_id'
                      control={control}
                      rules={{
                        required: "Please select Employee Type",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          value={field?.value ?? ''}
                          label={<FormLabel label='Employee Type' required={true} />}
                          onChange={field?.onChange}
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
                                  maxWidth: 250,               // control dropdown width
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
                  </Grid>
                  :
                  <></>
              }
              {/* employee role */}
              <Grid size={{ xs: 12, sm: 6, md: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4, lg: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4, xl: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4 }}>
                <Controller
                  name='role_id'
                  control={control}
                  rules={{
                    required: "Please select Employee Role",
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={field?.value ?? ''}
                      label={<FormLabel label='Employee Role' required={true} />}
                      onChange={field?.onChange}
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
                      error={Boolean(errors.role_id)}
                      {...(errors.role_id && { helperText: errors.role_id.message })}
                    >
                      <MenuItem value='' disabled>
                        <em>Select Employee Role</em>
                      </MenuItem>
                      {employeeRoleOptions &&
                        employeeRoleOptions.map(option => (
                          <MenuItem
                            key={option?.id}
                            value={option?.id}
                            sx={{
                              whiteSpace: 'normal',        // allow wrapping
                              wordBreak: 'break-word',     // break long words if needed
                              maxWidth: 250,               // control dropdown width
                              display: '-webkit-box',
                              WebkitLineClamp: 2,          // limit to 2 lines
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {option?.name}
                          </MenuItem>
                        ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              {/* employee company */}
              <Grid size={{ xs: 12, sm: 6, md: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4, lg: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4, xl: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4 }}>
                <Controller
                  name='company_name'
                  control={control}
                  rules={{
                    required: "Employee Company is required",
                    maxLength: {
                      value: 150,
                      message: 'Maximum length is 150 characters'
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field?.value ?? ''}
                      label={<FormLabel label='Employee Company' required={true} />}
                      onChange={field.onChange}
                      inputProps={{ maxLength: 150 }}
                      error={Boolean(errors.company_name)}
                      {...(errors.company_name && { helperText: errors.company_name.message })}
                    />
                  )}
                />
              </Grid>
              {/* manager name */}
              <Grid size={{ xs: 12, sm: 6, md: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4, lg: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4, xl: branch?.currentBranch?.role_type_flag == 1 ? 3 : 4 }}>
                <Controller
                  name='manager_id'
                  control={control}
                  render={({ field }) => (
                    <CustomAutocomplete
                      {...field}
                      label="Manager Name"
                      displayName1="name"
                      displayName2="role"
                      options={managerNameOptions}
                      error={Boolean(errors.manager_id)}
                      helperText={errors.manager_id?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <SectionHeader title="Personal Information" progress={contactProgress} sx={{ marginTop: 2 }} />
            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
              {/* employee email */}
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{
                    required: 'Employee Email is required',
                    validate: {
                      isEmail: value => !value || isEmail(value) || 'Invalid email address'
                    },
                    maxLength: {
                      value: 150,
                      message: 'Maximum length is 150 characters'
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field?.value ?? ''}
                      label={<FormLabel label='Employee Email' required={true} />}
                      onChange={field?.onChange}
                      inputProps={{ maxLength: 150 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <IconButton
                              edge='start'
                              onMouseDown={e => e.preventDefault()}
                            >
                              <MailIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Grid>
              {/* employee contact */}
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <Controller
                  name="contact"
                  control={control}
                  rules={{
                    required: 'Employee Contact is required',
                    validate: {
                      isMobile: value => !value || isMobile(value) || 'Invalid mobile number'
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field.value ?? ''}
                      label={<FormLabel label="Employee Contact" required={true} />}
                      onChange={field.onChange}
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        '& .MuiInputBase-root': { paddingLeft: '0 !important' }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ p: 0, display: 'flex', m: 0, boxShadow: 'none' }}
                          >
                            <CountryCodeSelect
                              name={'contact_country_code'}
                              control={control}
                            />
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(errors.contact)}
                      {...(errors.contact && { helperText: errors.contact.message })}
                    />
                  )}
                />
              </Grid>
              {/* employee alternate contact */}
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                <Controller
                  name="alternate_contact"
                  control={control}
                  rules={{
                    validate: {
                      isMobile: value =>
                        !value || isMobile(value) || 'Invalid mobile number'
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field.value ?? ''}
                      label={<FormLabel label="Alternate Contact" required={false} />}
                      onChange={field.onChange}
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        '& .MuiInputBase-root': {
                          paddingLeft: '0 !important'
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ p: 0, display: 'flex', m: 0, boxShadow: 'none' }}
                          >
                            <CountryCodeSelect
                              name={'alternate_contact_country_code'}
                              control={control}
                            />
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(errors.alternate_contact)}
                      {...(errors.alternate_contact && {
                        helperText: errors.alternate_contact.message
                      })}
                    />
                  )}
                />
              </Grid>

            </Grid>
            <SectionHeader title="Address & Status" progress={addressProgress} sx={{ marginTop: 2 }} />
            <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
              {/* Address */}
              <Grid size={{ xs: 12, sm: 7, md: 7, lg: 7, xl: 7 }}>
                <Controller
                  name='address'
                  control={control}
                  rules={{
                    maxLength: {
                      value: 500,
                      message: 'Maximum length is 500 characters'
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      value={field?.value ?? ''}
                      label={<FormLabel label='Address' required={false} />}
                      onChange={field?.onChange}
                      inputProps={{ maxLength: 500 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <IconButton
                              edge='start'
                              onMouseDown={e => e.preventDefault()}
                            >
                              <AddressIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(errors.address)}
                      {...(errors.address && { helperText: errors.address.message })}
                    />
                  )}
                />
              </Grid>
              {/* asset status */}
              <Grid size={{ xs: 12, sm: 5, md: 5, lg: 5, xl: 5 }}>
                <StatusSwitch value={assetStatus} onChange={setAssetStatus} label="Asset Status" />
              </Grid>
            </Grid>

            {
              additionalFieldsArray && additionalFieldsArray !== null && additionalFieldsArray.length > 0 ?
                <React.Fragment>
                  <SectionHeader title="Additional Fields" sx={{ marginTop: 2 }} show_progress={0} />
                  <DatePickerWrapper>
                    <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                      <CommonDynamicFields
                        control={control}
                        errors={errors}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        additionalFields={additionalFieldsArray}
                        setAdditionalFields={setAdditionalFieldsArray}
                      />
                    </Grid>
                  </DatePickerWrapper>
                </React.Fragment>
                :
                <></>
            }
          </form>
        </Stack>
        <Divider sx={{ m: 2 }} />
        <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
          <Button
            sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
            onClick={() => {
              toggle()
              reset()
            }}
            variant='outlined'
          >
            Cancel
          </Button>
          <Button
            sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
            onClick={() => {
              handleSubmit(onSubmit)()
            }}
            type='submit'
            variant='contained'
            disabled={loading}
          >
            {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Confirm'}
          </Button>
        </Stack>
      </Stack>
    </Drawer >
  );
}
