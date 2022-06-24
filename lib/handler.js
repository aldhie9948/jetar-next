import { localCurrency, numberOnly } from './currency';

export const onChangeHandler = (
  setter,
  e,
  isNumber = false,
  isPhone = false
) => {
  let value = e.target.value;
  if (isNumber) {
    const convertedValue = localCurrency(value);
    value = value !== '' || value === null ? convertedValue : '';
  }
  if (isPhone) {
    const convertedValue = numberOnly({ value, isPhone: true });
    value = convertedValue;
  }
  return setter(value);
};

export const borderInputHandler = (value) => {
  return !value ? 'border-error' : 'border-success';
};
