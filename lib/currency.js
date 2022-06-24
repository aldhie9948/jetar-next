// ! number to currency
export function localCurrency(number) {
  if (!number) return number;
  const value = number
    .toString()
    .replaceAll(/^0+(?!$)/g)
    .replaceAll(/[^0-9]/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return value;
}

// ! currency to number
export function currencyNumber(curr) {
  if (curr === 0) return 0;
  try {
    return parseFloat(curr.replace(/,|\./g, ''));
  } catch (error) {
    console.log(error);
    return curr;
  }
}

// number only
export function numberOnly({ value = '', isPhone = false }) {
  let result = '';
  const filterNumber = value.toString().replaceAll(/[^0-9]/gi, '');
  if (isPhone) result = filterNumber.replace(/^62|^0/, '');
  if (!isPhone) result = filterNumber.replaceAll(/^0+(?!$)/g);
  return result;
}
