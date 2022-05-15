// ! number to currency
export function localCurrency(number) {
  return parseFloat(number.toString().replace(/\D/g, '')).toLocaleString(
    'id-ID'
  );
}

// ! currency to number
export function currencyNumber(curr) {
  if (curr === 0) return 0;
  return parseFloat(curr.replace(/,|\./g, ''));
}
