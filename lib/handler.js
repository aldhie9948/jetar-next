export const onChangeHandler = (setter, e) => {
  return setter(e.target.value);
};

export const borderInputHandler = (value) => {
  return value === '' ? 'border-red-500' : 'border-green-500';
};
