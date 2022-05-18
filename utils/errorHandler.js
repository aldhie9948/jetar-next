export const axiosError = ({ label, error }) => {
  console.error(label, error.response.data);
};
