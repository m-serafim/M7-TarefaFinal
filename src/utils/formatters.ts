/**
 * Data Formatting Utilities
 * Handles formatting of different data types with pt-PT locale
 */

/**
 * Format string with fallback
 * @param value - String value to format
 * @param fallback - Fallback value (default: "—")
 * @returns Formatted string or fallback
 */
export const formatString = (value: string | null | undefined, fallback = '—'): string => {
  return value && value.trim() !== '' ? value : fallback;
};

/**
 * Format number with Portuguese locale
 * @param value - Number value to format
 * @param fallback - Fallback value (default: "—")
 * @returns Formatted number string or fallback
 */
export const formatNumber = (value: number | null | undefined, fallback = '—'): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value.toLocaleString('pt-PT');
};

/**
 * Format currency with Portuguese locale
 * @param value - Number value in cents
 * @param currency - Currency code (default: 'EUR')
 * @param fallback - Fallback value (default: "—")
 * @returns Formatted currency string or fallback
 */
export const formatCurrency = (
  value: number | null | undefined, 
  currency = 'EUR', 
  fallback = '—'
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  // Steam prices are in cents
  const amount = value / 100;
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format date with Portuguese locale
 * @param dateString - Date string to format
 * @param fallback - Fallback value (default: "—")
 * @returns Formatted date string or fallback
 */
export const formatDate = (dateString: string | null | undefined, fallback = '—'): string => {
  if (!dateString || dateString.trim() === '') {
    return fallback;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return fallback;
    }
    
    return new Intl.DateTimeFormat('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return fallback;
  }
};

/**
 * Format date and time with Portuguese locale
 * @param dateString - Date string to format
 * @param fallback - Fallback value (default: "—")
 * @returns Formatted date and time string or fallback
 */
export const formatDateTime = (dateString: string | null | undefined, fallback = '—'): string => {
  if (!dateString || dateString.trim() === '') {
    return fallback;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return fallback;
    }
    
    return new Intl.DateTimeFormat('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return fallback;
  }
};

/**
 * Format boolean as icon/badge
 * @param value - Boolean value
 * @param trueLabel - Label for true (default: "✓")
 * @param falseLabel - Label for false (default: "✗")
 * @returns Icon/badge string
 */
export const formatBoolean = (
  value: boolean | null | undefined,
  trueLabel = '✓',
  falseLabel = '✗'
): string => {
  return value === true ? trueLabel : falseLabel;
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @param ellipsis - Ellipsis string (default: "...")
 * @returns Truncated text
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength = 100,
  ellipsis = '...'
): string => {
  if (!text) return '—';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Strip HTML tags from string
 * @param html - HTML string
 * @returns Plain text
 */
export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  // Multiple passes to handle nested tags and incomplete sanitization
  let text = html;
  let previousText = '';
  
  // Keep replacing until no more tags are found
  while (text !== previousText) {
    previousText = text;
    text = text.replace(/<[^>]*>/g, '');
  }
  
  // Also decode common HTML entities
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};
