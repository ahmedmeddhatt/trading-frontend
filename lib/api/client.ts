// src/lib/api/client.ts
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { logger } from "@/lib/utils/logger";

// Get API URL from environment variable or use default
// Backend runs on http://localhost:9000/api by default
// IMPORTANT: Ensure this URL starts with https:// not hhttps://
const getApiBaseUrl = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

  if (envUrl) {
    // Fix any hhttps typos
    const fixedUrl = envUrl.replace(/^hhttps:/, "https:");
    if (fixedUrl !== envUrl) {
      console.warn("Fixed hhttps typo in API URL:", envUrl, "->", fixedUrl);
    }
    return fixedUrl;
  }

  return "https://aeb984f5-3583-4f23-a88f-25828e3ceac3-00-g337wi7drv6o.picard.replit.dev/api";
};

const API_BASE_URL = getApiBaseUrl();

// Validate URL format
if (API_BASE_URL.startsWith("hhttps://")) {
  console.error(
    "ERROR: API URL has invalid protocol 'hhttps://'. Please check your environment variables."
  );
  throw new Error("Invalid API URL protocol");
}

logger.info("API Client initialized", { baseURL: API_BASE_URL });

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to include token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const fullUrl = `${config.baseURL}${config.url}`;

    logger.api(config.method?.toUpperCase() || "GET", fullUrl, {
      params: config.params,
      hasToken: !!token,
    });

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.error("API Request Error", { error: error.message });
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL}${response.config.url}`;
    logger.apiResponse(
      response.config.method?.toUpperCase() || "GET",
      fullUrl,
      response.status,
      { dataLength: JSON.stringify(response.data).length }
    );
    return response;
  },
  (error) => {
    const fullUrl = error.config?.baseURL
      ? `${error.config.baseURL}${error.config.url}`
      : error.config?.url || "unknown";

    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase() || "GET";

    // Log full error details for debugging
    const errorDetails = {
      message: error.message,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      responseStatusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        data: error.config?.data,
      },
    };

    logger.apiResponse(method, fullUrl, status || 0, errorDetails);

    // Log full error response for 500 errors to help debugging
    if (status === 500) {
      console.error("Backend 500 Error Details:", {
        url: fullUrl,
        method,
        requestData: error.config?.data ? JSON.parse(error.config.data) : null,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
      });
    }

    // Handle 401 Unauthorized - clear token and redirect to login
    if (status === 401) {
      logger.warn("Unauthorized access - clearing token", { url: fullUrl });
      localStorage.removeItem("token");
      const { logout } = useAuthStore.getState();
      logout();
      // Only redirect if we're in the browser and not already on login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Extract error message from response - try multiple possible formats
    let errorMessage =
      error.response?.data?.error || // Backend format: {error: "message"}
      error.response?.data?.message || // Alternative format: {message: "message"}
      error.response?.data?.msg || // Another alternative
      (typeof error.response?.data === "string" ? error.response.data : null) || // String response
      error.message ||
      "An error occurred";

    // For 500 errors, try to extract more details
    if (status === 500) {
      if (!error.response) {
        errorMessage =
          "Cannot connect to backend server. Please ensure the backend is running on https://aeb984f5-3583-4f23-a88f-25828e3ceac3-00-g337wi7drv6o.picard.replit.dev";
      } else {
        // Try to get more details from the error response
        const responseData = error.response.data;
        if (typeof responseData === "object" && responseData !== null) {
          // Check for common error fields
          const possibleErrors = [
            responseData.error,
            responseData.message,
            responseData.msg,
            responseData.details,
            responseData.stack, // Sometimes backend sends stack trace
          ].filter(Boolean);

          if (possibleErrors.length > 0) {
            errorMessage = possibleErrors[0];
          } else {
            // If no clear error message, show the full response for debugging
            errorMessage = `Backend server error (500). Response: ${JSON.stringify(
              responseData
            ).substring(0, 200)}`;
          }
        } else if (typeof responseData === "string") {
          errorMessage = responseData;
        } else {
          errorMessage =
            errorMessage ||
            "Backend server error (500). Please check the backend logs for details.";
        }
      }
    } else if (
      status === 0 ||
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK"
    ) {
      errorMessage =
        "Cannot connect to backend server. Please ensure the backend is running on https://aeb984f5-3583-4f23-a88f-25828e3ceac3-00-g337wi7drv6o.picard.replit.dev";
    } else if (status === 404) {
      errorMessage = errorMessage || "Resource not found";
    } else if (status === 400) {
      errorMessage =
        errorMessage || "Invalid request. Please check your input.";
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
      status,
      isNetworkError: !error.response,
    });
  }
);
