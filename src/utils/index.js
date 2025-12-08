import CryptoJS from "crypto-js";
import { CRYPTO_SECRET_KEY } from "../common/api/constants";
import imageCompression from 'browser-image-compression';
import CustomChip from "../components/custom-chip";
import React from "react";
import moment from "moment";

/**
 *Function  Handle Server Error
 */
export const getErrorResponse = () => {
  return {
    result: false,
    status: 500,
    message: "Internal server error",
  }
}


export function encrypt(data) {
  var cipherText = CryptoJS.AES.encrypt(data, CRYPTO_SECRET_KEY).toString();
  return cipherText
}

export function decrypt(data) {
  var bytes = CryptoJS.AES.decrypt(data, CRYPTO_SECRET_KEY);
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData
}

export const getFormData = (data, files = null) => {
  var objFormData = new FormData()

  for (var key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      if (data[key] instanceof Array || data[key] instanceof Object) {
        objFormData.append(key, JSON.stringify(data[key]))
      } else {
        objFormData.append(key, data[key])
      }
    } else if (data[key] === "null" && data[key] === "undefined") {
      objFormData.append(key, null)
    }
  }

  if (files !== null && files !== undefined && files.length > 0) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      objFormData.append(file.title, file.data)
    }
  }

  return objFormData
}

/**
 * Extracts flattened escalation level data (e.g., escalation_level_1_name) 
 * from a data object and converts it into a structured 'vendor_escalation' array.
 * * @param {object} syncData - The source object containing flattened fields.
 * @returns {object} A new object based on syncData, with the added/updated 
 * 'vendor_escalation' array.
 */
export const normalizeEscalationLevels = (syncData) => {
  // 1. Create a shallow copy of the object to avoid modifying the original data.
  const syncDetails = { ...syncData };

  const escalationLevelsArray = [];
  const MAX_POSSIBLE_LEVELS = 10; // Sets a safe upper limit for the loop

  for (let i = 1; i <= MAX_POSSIBLE_LEVELS; i++) {
    const levelPrefix = `escalation_level_${i}`;
    const nameKey = `${levelPrefix}_name`;

    // 2. Check for the existence of the level key to handle dynamic levels (3, 4, 5, etc.)
    if (syncDetails[nameKey]) {
      const levelObject = {
        level_id: syncDetails[`${levelPrefix}_level_id`],
        name: syncDetails[nameKey],
        designation: syncDetails[`${levelPrefix}_designation`],
        country_code: syncDetails[`${levelPrefix}_country_code`],
        contact_no: syncDetails[`${levelPrefix}_contact_no`],
        email: syncDetails[`${levelPrefix}_email`],
        // Note: The 'id' field is omitted as it is not present in the source keys
      };
      escalationLevelsArray.push(levelObject);
    } else {
      // Stop the loop immediately once a level is missing (e.g., if 4 is missing)
      break;
    }
  }

  // 3. CORRECTED ASSIGNMENT: Assign the final array to the property outside the loop
  syncDetails.vendor_escalation = escalationLevelsArray;

  // 4. Return the modified object copy
  return syncDetails;
};

// convert count function
export const convertCount = (value) => {
  if (value >= 10000000) {
    return Number(value / 10000000).toFixed(2) + 'CR';
  } else if (value >= 100000) {
    return Number(value / 100000).toFixed(2) + 'L';
  } else if (value >= 1000) {
    return Number(value / 1000).toFixed(2) + 'K';
  } else if (value >= 0 && value < 10) {
    return String(value).padStart(2, '0')
  } else {
    return Number(value);
  }
}

// get object by id function
export const getObjectById = (arr, id) => {
  return arr.find(item => item.id === id) || null;
}
// get object by id function
export const getObjectByUuid = (arr, uuid) => {
  return arr.find(item => item.uuid === uuid) || null;
}

//function to concat multiple strings
export const concatMultipleStrings = (branch) => {
  if (!branch || typeof branch !== "object") return "";

  const fields = [
    branch.address_line_1,
    branch.address_line_2,
    branch.city,
    branch.state,
    branch.pincode,
    branch.country,
  ];

  // Filter out null, undefined, empty string, or only whitespace
  const validParts = fields.filter(
    (val) => val !== null && val !== undefined && String(val).trim() !== ""
  );

  return validParts.join(", ");
};

export const valueFormatter = (item) => `${item.value}%`;

/**
 * Compress an image file while keeping its original name and metadata
 */
export const compressFile = async (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);

  if (isImage) {
    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.9,
      alwaysKeepResolution: true,
    };

    try {
      const compressedBlob = await imageCompression(file, options);

      // 🔹 Preserve the original name and type
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      return file; // fallback to original if compression fails
    }
  }

  return file; // skip non-image files
};

/**
 * Get formatted duration between two dates
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
export const getFormattedDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "00:00 Hrs"; // handle missing dates

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate difference in milliseconds
  const diffMs = end - start;

  if (diffMs < 0) return "00:00 Hrs"; // in case end < start

  // Convert to minutes
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  // Calculate days, hours, minutes
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  // Format based on duration
  if (days > 0) {
    return `${days} Day${days > 1 ? "s" : ""} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} Hrs`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} Hrs`;
}

/**
 * function to get Current Stock value as per type
 */
export const getCurrentStockValue = (type, current, initial) => {
  let total_quantity = initial && initial !== null && Number(initial) > 0 ? initial : 0
  let changed_quantity = current && current !== null && Number(current) > 0 ? current : 0
  if (type == 'Restock') {
    total_quantity = Number(changed_quantity) + Number(total_quantity)
  }
  if (type == 'Consumption') {
    total_quantity = Number(total_quantity) - Number(changed_quantity)
  }
  if (Number(total_quantity) > 0) {
    return total_quantity
  } else {
    return 'Limit Exceed'
  }

}

/**
 * Function to get Current Status Color
 * @param {} status 
 * @returns 
 */
export const getCurrentStatusColor = (status) => {
  let color = 'primary'
  switch (status) {
    case 'Open':
      color = 'primary'//'#6941C6'
      break
    case 'Re Open':
      color = 'info'//'#039BE5'
      break
    case 'Closed':
    case 'Good Stock':
      color = 'success'//'#039855'
      break
    case 'On Hold':
    case 'Low Stock':
      color = 'warning'//#FEC84B'
      break
    case 'Rejected':
    case 'Out Of Stock':
      color = 'error'//'#D32F2F'
      break
    case 'Overdue':
      color = 'warning'//'#F79009'
      break
    default:
      color = 'primary'
  }
  return color
}

/*
* Generate Percentage function
*/
export const getPercentage = (value, total) => {
  let count = (Number(value) / Number(total))
  let percentage = count * Number(100)

  return percentage
}

export const isCurrentTimeInRange = (from, to) => {
  const now = moment();
  const start = moment(from, "HH:mm");
  const end = moment(to, "HH:mm");

  // Handle normal ranges
  if (start.isBefore(end)) {
    return now.isBetween(start, end, null, '[)');
  }

  // Handle overnight range like 21:00–04:00
  return now.isAfter(start) || now.isBefore(end);
};

export const isFutureTimeRange = (from, to) => {
  const now = moment();
  const start = moment(from, "HH:mm");
  const end = moment(to, "HH:mm");

  // ⚠ If the range is overnight (e.g., 21:00–04:00)
  if (start.isAfter(end)) {
    // Future only if now is BEFORE start
    return now.isBefore(start);
  }

  // Normal case: time range within same day
  return now.isBefore(start);
};

export const parseScheduleStartDate = (schedule) => {
  if (!schedule) return null;

  const [startPart] = schedule.split(" - ");
  const currentYear = moment().year();

  const parsed = moment(`${startPart} ${currentYear}`, "D MMM YYYY");
  return parsed.isValid() ? parsed : null;
};

