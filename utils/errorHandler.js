import { toast } from '../components/Sweetalert2';

export const axiosError = (error) => {
  toast({ title: error.response.data.error, icon: 'error' });
  return { error: error.response.data.error };
};
