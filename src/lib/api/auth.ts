import { getApiBaseUrl } from "./config";

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  data?: {
    resetToken?: string;
    accessToken?: string;
    token?: string;
    [key: string]: any;
  };
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Step 1: Send OTP to user email: POST /api/v1/auth/forgot-password
 * Equivalent to:
 * curl -X 'POST' 'http://localhost:5000/api/v1/auth/forgot-password' \
 *   -H 'accept: *\/*' \
 *   -H 'Content-Type: application/json' \
 *   -d '{"email": "user@example.com"}'
 */
export async function sendForgotPasswordOtp(
  email: string
): Promise<ForgotPasswordResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/auth/forgot-password`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return {
        success: true,
        message: data.message || "Forgot password reset OTP sent successfully!",
        data: data.data || data,
      };
    }

    let errorMessage = "Failed to send reset code. Please try again.";
    if (data.message) {
      errorMessage = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    } else if (data.errorMessages && data.errorMessages.length > 0) {
      errorMessage = data.errorMessages.join(", ");
    }

    throw new Error(errorMessage);
  } catch (err: any) {
    if (err.message && err.message !== "Failed to fetch") {
      throw err;
    }
    throw new Error(err.message || "Network error. Unable to reach server.");
  }
}

/**
 * Step 2: Verify OTP code: POST /api/v1/auth/verify-reset-password-otp
 * Body: { email, otp }
 */
export async function verifyPasswordResetOtp(
  email: string,
  otp: string
): Promise<VerifyOtpResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/auth/verify-reset-password-otp`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      const extractedToken =
        data.token ||
        data.accessToken ||
        data.resetToken ||
        (data.data && (data.data.token || data.data.accessToken || data.data.resetToken));

      return {
        success: true,
        message: data.message || "OTP verified successfully!",
        data: {
          ...(data.data || data),
          resetToken: extractedToken,
          token: extractedToken,
        },
      };
    }

    let errorMessage = "Invalid or expired verification code.";
    if (data.message) {
      errorMessage = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    } else if (data.errorMessages && data.errorMessages.length > 0) {
      errorMessage = data.errorMessages.join(", ");
    }

    throw new Error(errorMessage);
  } catch (err: any) {
    if (err.message && err.message !== "Failed to fetch") {
      throw err;
    }
    throw new Error(err.message || "Network error. Unable to verify code.");
  }
}

/**
 * Step 3: Reset password with OTP / Token: POST /api/v1/auth/reset-password
 * Headers: Authorization: Bearer <token>
 * Body: { password }
 */
export async function resetPasswordWithOtp(params: {
  email: string;
  otp?: string;
  newPassword: string;
  confirmPassword?: string;
  token?: string;
}): Promise<ResetPasswordResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/auth/reset-password`;

  const token =
    params.token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("fluentia_reset_token") || localStorage.getItem("fluentia_auth_token")
      : undefined);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "*/*",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        password: params.newPassword,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("fluentia_reset_token");
      }
      return {
        success: true,
        message: data.message || "Your password has been reset successfully. You can now login.",
        data: data.data || data,
      };
    }

    let errorMessage = "Failed to reset password. Please try again.";
    if (data.message) {
      errorMessage = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    } else if (data.errorMessages && data.errorMessages.length > 0) {
      errorMessage = data.errorMessages.join(", ");
    }

    throw new Error(errorMessage);
  } catch (err: any) {
    if (err.message && err.message !== "Failed to fetch") {
      throw err;
    }
    throw new Error(err.message || "Network error. Unable to reset password.");
  }
}

