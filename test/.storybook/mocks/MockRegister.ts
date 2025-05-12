import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

export const mockRegister: UseFormRegister<FieldValues> = (name, options) => ({
  onChange: async (event) => {},
  onBlur: async (event) => {},
  name,
  ref: (ref) => {},
});

export const mockErrors: FieldErrors<FieldValues> = {};