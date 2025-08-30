/**
 * Format a number as Indian Rupee currency
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number as Indian Rupee currency with symbol only
 */
export const formatPriceSimple = (amount: number): string => {
  return `₹${amount}`;
};

/**
 * Convert price to paisa (smallest unit) for calculations
 */
export const toPaisa = (rupees: number): number => {
  return Math.round(rupees * 100);
};

/**
 * Convert paisa back to rupees
 */
export const toRupees = (paisa: number): number => {
  return paisa / 100;
};

/**
 * Default currency code for the application
 */
export const DEFAULT_CURRENCY = 'INR';

/**
 * Currency symbol
 */
export const CURRENCY_SYMBOL = '₹';
