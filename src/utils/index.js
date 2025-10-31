import CryptoJS from "crypto-js";
import { CRYPTO_SECRET_KEY } from "../common/api/constants";

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


