const MONGODB_URI = process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET_KEY;
const STATIC_MAP_API = process.env.STATIC_MAP_API;
const MAP_API = process.env.MAP_API;
const PRIVATE_VAPID_KEY = 'yu15zf_MqQE-wrdG-bLzl4gzyBWOaD3V6cepT1-Dd1s';
const PUBLIC_VAPID_KEY =
  'BJUByaKO6fCdTpIJXPgzAUOuKluvE11vyBn9m9EgsGjahBJ9MQwwasxQtchdBprUXMFeFLB8xEo_k-TBJMWXP84';

// eslint-disable-next-line
export default {
  MONGODB_URI,
  SECRET_KEY,
  PRIVATE_VAPID_KEY,
  PUBLIC_VAPID_KEY,
  STATIC_MAP_API,
  MAP_API,
};
