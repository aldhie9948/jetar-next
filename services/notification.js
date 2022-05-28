import axios from 'axios';
import PenggunaService from './pengguna';

export const sendNotification = async ({ idPengguna, title, body, token }) => {
  try {
    const pengguna = await PenggunaService.find(idPengguna, token);
    if (pengguna.subscription) {
      const data = {
        notification: { title, body },
        to: pengguna.subscription,
      };
      const fcmSendResponse = await axios.post('/api/notification', data);
      return fcmSendResponse.data;
    }
    return { status: false };
  } catch (error) {
    console.log('error service notification', error);
  }
};
