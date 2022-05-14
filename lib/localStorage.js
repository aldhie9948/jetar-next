const set = (obj, name = 'default') => {
  window.localStorage.setItem(
    name,
    typeof obj === 'string' ? obj : JSON.stringify(obj)
  );
};

const get = (key, isObject = false) => {
  const data = window.localStorage.getItem(key);
  return isObject ? JSON.parse(data) : data;
};

const clear = () => {
  window.localStorage.clear();
};

const remove = (key) => {
  window.localStorage.removeItem(key);
};
// eslint-disable-next-line
export default { set, get, clear, remove };
