// src/pages/api/pincode/check.js

import pincodeDirectory from "india-pincode-lookup";

export default async function handler(req, res) {
  try {
    const { pincode } = req.query;

    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode",
      });
    }

    const result = pincodeDirectory.lookup(pincode);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pincode not found",
      });
    }

    const location = result[0];

    return res.status(200).json({
      success: true,
      data: {
        state: location.stateName || location.state || "",
        city: location.districtName || location.district || "",
        district: location.districtName || location.district || "",
        country: "India",
      },
    });
  } catch (error) {
    console.error("Backend pincode error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify pincode",
    });
  }
}