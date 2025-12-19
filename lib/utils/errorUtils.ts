// Safe error message extraction utility
// Handles cases where Error constructor might not be available

export function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An error occurred";
  }

  // Check if it's an Error instance (but safely)
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
    // Try to stringify if it's an object
    try {
      const str = String(error);
      if (str !== "[object Object]") {
        return str;
      }
    } catch {
      // Ignore
    }
  }

  // Fallback to string conversion
  if (typeof error === "string") {
    return error;
  }

  return "An error occurred";
}

// Type guard for Error-like objects
export function isErrorLike(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}



