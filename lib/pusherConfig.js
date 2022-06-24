import Pusher from 'pusher-js';

const initPusher = () => {
  return new Pusher('8f9efd823ced7f4805fc', {
    cluster: 'ap1',
  });
};

export default initPusher;
