import dayjs, { Dayjs } from 'dayjs';

export const validateEmail = (email: string) => {
  if (!email.trim()) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format.';
  return '';
};

export const validatePassword = (password: string) => {
  if (!password.trim()) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain a digit.';
  return '';
};

export const validateFirstName = (firstName: string): string => {
  if (!firstName.trim()) return 'Required.';
  if (!/^[A-Za-z\u00C0-\u017F\s'-]+$/.test(firstName) || !/^[A-Z]/.test(firstName))
    return 'Invalid format.';
  return '';
};

export const validateLastName = (lastName: string): string => {
  if (!lastName.trim()) return 'Required.';
  if (!/^[A-Za-z\u00C0-\u017F\s'-]+$/.test(lastName) || !/^[A-Z]/.test(lastName))
    return 'Invalid format.';
  return '';
};

export const validateStreet = (street: string): string => {
  if (!street.trim()) return 'Required.';
  return '';
};

export const validateCity = (city: string): string => {
  if (!city.trim()) return 'City is required.';
  if (!/^[A-Za-z\u00C0-\u017F\s'-]+$/.test(city))
    return 'Only letters, spaces, apostrophes or hyphens.';
  return '';
};

export const validatePostCode = (postCode: string): string => {
  if (!postCode.trim()) return 'Required.';
  if (!/^[A-Za-z0-9 ]{3,10}$/.test(postCode)) return 'Invalid format.';
  return '';
};

export const validateCountry = (country: string): string => {
  if (!country.trim()) return 'Country is required.';
  return '';
};

export const validateDateOfBirth = (date: Dayjs | null): string => {
  if (date === null) return 'Date of birth is required.';
  if (!date.isValid()) return 'Invalid date format.';
  if (date.isAfter(dayjs())) return 'Date of birth cannot be in the future.';
  return '';
};

export const validateStreetShipping = (streetShipping: string): string => {
  if (!streetShipping.trim()) return 'Required.';
  return '';
};

export const validateCityShipping = (cityShipping: string): string => {
  if (!cityShipping.trim()) return 'City is required.';
  if (!/^[A-Za-z\u00C0-\u017F\s'-]+$/.test(cityShipping))
    return 'Only letters, spaces, apostrophes or hyphens.';
  return '';
};

export const validatePostCodeShipping = (postCodeShipping: string): string => {
  if (!postCodeShipping.trim()) return 'Required.';
  if (!/^[A-Za-z0-9 ]{3,10}$/.test(postCodeShipping)) return 'Invalid format.';
  return '';
};

export const validateCountryShipping = (countryShipping: string): string => {
  if (!countryShipping.trim()) return 'Country is required.';
  return '';
};
