import { ENV } from '../common/api/constants'


export const API_TIMEOUT = 5000

/**
 * API Error Codes
 */
export const UNAUTHORIZED = 400

export const FORBIDDEN = 403

export const SUCCESS = 200

export const ERROR = 402

export const SERVER_ERROR = 500

export const LIST_LIMIT = 10

export const LOG_TYPE = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    ERROR: 'ERROR'
}

export const SHOW_LOGS = ENV === 'prod' ? 'NO' : 'YES'

export const TOAST_DURATION = 4000

export const TOAST_POSITION = 'top-right'

export const isWord = word => /^[A-Za-z]+$/.test(word)

export const isTypeWord = word => /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(word)

export const isEmail = email => /^[A-Za-z0-9]+([._%+-]?[A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/i.test(email);

export const isPinCode = pinCode => /^[1-9][0-9]{5}$/.test(pinCode)

export const isMobile = mobile => /^$|^(\+91[-\s]?)?[0]?(91)?[6789]\d{9}$/.test(mobile);

export const isLandlineNumber = number => /^\d{11,}$/.test(number)

export const isNumberPattern = number => /^\d+$/.test(number)

export const isNumber = number => /^[0-9]*$/.test(number);

export const vehicleNumberPattern = value => /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(value)

export const isAlphaNumeric = (word) => /^[a-zA-Z0-9]*$/.test(word)

export const isWebsite = (word) => /^(https?:\/\/)?(www\.)?[a-z0-9-]+(\.[a-z]{2,})(\.[a-z]{2,})?$/i.test(word.trim());

export const DATA_GRID_ROW_HEIGHT = 80

export const STATUS = {
    A: { label: 'Active', color: 'success' },
    I: { label: 'Inactive', color: 'warning' },
    D: { label: 'Delete', color: 'error' }
}

/**Validation */
export const validateFileSize = file => {
    if (!file) return true // File is optional, so return true if no file is selected
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > 5) {
        return 'File size exceeds the limit of 5MB'
    }

    return true // Validation passed
}

export const validateFileType = file => {
    if (!file) {
        return true // Return true if file is undefined or null
    }
    const fileName = file.name
    if (!fileName) {
        return true // Return true if file name is undefined or null
    }
    const fileExtension = fileName.split('.').pop().toLowerCase() // Extract file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png'] // Allowed file extensions
    if (!allowedExtensions.includes(fileExtension)) {
        return 'Only JPG, JPEG, and PNG files are allowed'
    }

    return true // Check if file extension is allowed
}

export const IMAGES_SCREEN_NO_DATA = {
    NO_DATA_FOUND: '/assets/no_data_found.png'
}

export const toTitleCase = str => {
    if (str && str !== null) {
        return str
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase())
    }

    return ''
}

export const genderArray = [
    {
        id: 'Male',
        name: 'Male'
    },
    {
        id: 'Female',
        name: 'Female'
    }
]
export const getPriorityArray = [
    {
        id: 'Low',
        name: 'Low'
    },
    {
        id: 'Medium',
        name: 'Medium'
    },
    {
        id: 'High',
        name: 'High'
    },

]
export const getMasterTicketStatus = [{
    id: 'Open',
    name: 'Open'
},
{
    id: 'Closed',
    name: 'Closed'
},
{
    id: 'On Hold',
    name: 'On Hold'
},
{
    id: 'Rejected',
    name: 'Rejected'
}]

export const getInventoryStockStatus = [{
    id: 'Low Stock',
    name: 'Low Stock'
},
{
    id: 'Out Of Stock',
    name: 'Out Of Stock'
},
{
    id: 'Good Stock',
    name: 'Good Stock'
}]
export const getMasterPMActivityStatus = [{
    id: 'Active',
    name: 'Active'
},
{
    id: 'Completed',
    name: 'Completed'
},
{
    id: 'Overdue',
    name: 'Overdue'
}
]

export const getPmActivityFrequencyArray = [
    {
        id: 'Monthly',
        name: 'Monthly'
    },
    {
        id: '3 Month',
        name: '3 Month'
    },
    {
        id: '6 Month',
        name: '6 Month'
    },
    {
        id: 'Yearly',
        name: 'Yearly'
    }

]

export const getMasterPMActivitySchedule = [{
    id: 'This Week',
    name: 'This Week'
},
{
    id: 'Next Week',
    name: 'Next Week'
},
{
    id: 'This Month',
    name: 'This Month'
},

]
