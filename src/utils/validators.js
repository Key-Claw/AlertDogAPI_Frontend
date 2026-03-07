export const isRequired = (value) => value !== undefined && value !== null && `${value}`.trim() !== '';

export const isEmail = (value) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};