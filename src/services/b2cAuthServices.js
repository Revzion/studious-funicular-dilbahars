import api from "./api";

// ✅ Step 1: Signup with phone
export const signupService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/signup", data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Signup failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// ✅ Step 2: Verify phone OTP
export const verifyPhoneService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/signup/verify-phone", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "OTP verification failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// ✅ Signin Step 1: Request OTP
export const signinRequestOtpService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/signin", data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Signin OTP request failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// ✅ Signin Step 2: Verify OTP
export const signinVerifyOtpService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/signin/verify", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Signin verification failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// ✅ Email verification Step 1: Request OTP
export const sendEmailOtpService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/verify-email/request-otp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Email OTP request failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// ✅ Email verification Step 2: Confirm OTP
export const verifyEmailOtpService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/verify-email/confirm-otp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Email OTP verification failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};


export const sendPhoneOtpService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/verify-phone/request-otp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Phone OTP request failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// ✅ Email verification Step 2: Confirm OTP
export const verifyPhoneOtpService = async (data) => {
  try {
    const response = await api.post("/b2c-auth/verify-phone/confirm-otp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Phone OTP verification failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};
