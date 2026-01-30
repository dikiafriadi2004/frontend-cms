/**
 * Format phone numbers for display
 * Converts +62/62 to 0 and adds dashes every 4 digits
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Convert +62 or 62 to 0
  if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.substring(2);
  }
  
  // Add dashes every 4 digits
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1-');
  
  return formatted;
};

/**
 * Get clean phone number for tel: links and WhatsApp
 * Keeps the original format for functionality
 */
export const getCleanPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // For tel: links, keep the original format
  return phoneNumber;
};

/**
 * Get WhatsApp number (remove all non-numeric characters)
 */
export const getWhatsAppNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters for WhatsApp links
  return phoneNumber.replace(/[^0-9]/g, '');
};