import { localCurrency } from './currency';

export const onChangeHandler = (setter, e, isNumber = false) => {
  let value = e.target.value;
  if (isNumber) {
    const convertedValue = localCurrency(value);
    value = value !== '' || value === null ? convertedValue : '';
  }
  return setter(value);
};

export const borderInputHandler = (value) => {
  return value === '' ? 'border-error' : 'border-success';
};
