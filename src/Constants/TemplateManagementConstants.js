export const STATUS_OPTIONS = [
  { value: 'all', label: 'All status' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'AUTHENTICATION', label: 'Authentication' },
];

export const STATUS_COLORS = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'error',
};

export const CATEGORY_COLORS = {
  MARKETING: 'primary',
  UTILITY: 'success',
  AUTHENTICATION: 'warning',
};
