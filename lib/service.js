export const config = (token) => {
  return {
    headers: { Authorization: `bearer ${token}` },
  };
};
