export const STATE_CODES = [
  { code: 'A', name: 'Australian Capital Territory' },
  { code: 'N', name: 'New South Wales' },
  { code: 'Q', name: 'Queensland' },
  { code: 'S', name: 'South Australia' },
  { code: 'T', name: 'Tasmania' },
  { code: 'V', name: 'Victoria' },
  { code: 'W', name: 'Western Australia' },
  { code: 'X', name: 'Northern Territory' }
] as const;

export const SCALE_CODES = [
  { code: 'S', name: 'Single' },
  { code: 'D', name: 'Couple' },
  { code: 'F', name: 'Family' },
  { code: 'P', name: 'Sole Parent' },
  { code: 'E', name: 'Extended Family' },
  { code: 'Q', name: 'Sole Parent Extended Family' }
] as const;

export const YES_NO_OPTIONS = ['Y', 'N'] as const;
export const HEALTH_CATEGORIES = [2, 3, 5] as const;

export const SEX_OPTIONS = [
  { code: 'F', name: 'Female' },
  { code: 'M', name: 'Male' }
] as const;

export const PAYMENT_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'halfYearly', label: 'Half Yearly' },
  { value: 'yearly', label: 'Yearly' }
] as const;