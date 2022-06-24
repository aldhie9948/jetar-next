import { toast } from '../components/Sweetalert2';

export const axiosError = (error) => {
  // toast({ title: error.response.data.error, icon: 'error' });
  console.log(error.response.data.error);
  return { error: error.response.data.error };
};
