const MONGODB_URI = process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET_KEY;
const STATIC_MAP_API = process.env.STATIC_MAP_API;
const MAP_API = process.env.MAP_API;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;
const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;

// eslint-disable-next-line
export default {
  MONGODB_URI,
  SECRET_KEY,
  PRIVATE_VAPID_KEY,
  PUBLIC_VAPID_KEY,
  STATIC_MAP_API,
  MAP_API,
};
