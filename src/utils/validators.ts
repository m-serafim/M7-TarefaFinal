/**
 * Client-side Validation Utilities
 * HTML5 validation with custom messages
 */

/**
 * Validate search input
 * @param input - HTML input element
 * @param value - Value to validate
 * @returns Whether the input is valid
 */
export const validateSearchInput = (input: HTMLInputElement, value: string): boolean => {
  // Clear any previous custom validity
  input.setCustomValidity('');
  
  // Empty search is valid (shows all games)
  if (!value || value.trim() === '') {
    return true;
  }
  
  if (value.length < 2) {
    input.setCustomValidity('O termo de pesquisa deve ter pelo menos 2 caracteres');
    input.reportValidity();
    return false;
  }
  
  if (value.length > 100) {
    input.setCustomValidity('O termo de pesquisa não pode ter mais de 100 caracteres');
    input.reportValidity();
    return false;
  }
  
  return true;
};

/**
 * Validate page size
 * @param input - HTML input element
 * @param value - Value to validate
 * @returns Whether the input is valid
 */
export const validatePageSize = (input: HTMLInputElement, value: number): boolean => {
  input.setCustomValidity('');
  
  if (isNaN(value) || value < 1) {
    input.setCustomValidity('O tamanho da página deve ser pelo menos 1');
    input.reportValidity();
    return false;
  }
  
  if (value > 100) {
    input.setCustomValidity('O tamanho da página não pode ser maior que 100');
    input.reportValidity();
    return false;
  }
  
  return true;
};

/**
 * Check if URL is valid
 * @param url - URL string to validate
 * @returns Whether the URL is valid
 */
export const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
