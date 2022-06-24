import jwt from 'jsonwebtoken';
import config from '../utils/config';

export const getToken = (request) => {
  const authorization = request.headers?.authorization;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

export const verifyToken = (request) => {
  const token = getToken(request);
  return jwt.verify(token, config.SECRET_KEY);
};
