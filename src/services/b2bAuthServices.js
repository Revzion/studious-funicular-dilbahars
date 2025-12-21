import api from "./api";

export const sendPhoneOtpService = async (phoneNo) => {
  try {
    const res = await api.post("/b2b-auth/send-phone-otp", { phoneNo });
    return res.data;
  } catch (err) {
    console.error("Error sending phone OTP:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to send phone OTP" };
  }
};

// Verify phone OTP
export const verifyPhoneOtpService = async (phoneNo, otp) => {
  try {
    const res = await api.post("/b2b-auth/verify-phone-otp", { phoneNo, otp });
    return res.data;
  } catch (err) {
    console.error("Error verifying phone OTP:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to verify phone OTP" };
  }
};

// Send email OTP
export const sendEmailOtpService = async (email) => {
  try {
    const res = await api.post("/b2b-auth/send-email-otp", { email });
    return res.data;
  } catch (err) {
    console.error("Error sending email OTP:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to send email OTP" };
  }
};

// Verify email OTP
export const verifyEmailOtpService = async (email, otp) => {
  try {
    const res = await api.post("/b2b-auth/verify-email-otp", { email, otp });
    return res.data;
  } catch (err) {
    console.error("Error verifying email OTP:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to verify email OTP" };
  }
};

// Register B2B user
export const registerB2bUserService = async (data, hasFile = false) => {
  try {
    console.log('data', data)
    const res = await api.post("/b2b-auth/register", data, {
      headers: {
        "Content-Type": hasFile ? "multipart/form-data" : "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error registering B2B user:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to register user" };
  }
};

