// Consistent date formatting utilities to avoid hydration mismatches
// These use fixed formats that don't depend on user locale

/**
 * Format date in a consistent format (MMM DD, YYYY)
 * This avoids hydration mismatches from locale differences
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

/**
 * Format date in short format (MMM DD)
 */
export const formatDateShort = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const day = d.getDate();
  return `${month} ${day}`;
};

/**
 * Format time in consistent format (HH:MM:SS)
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

