import jwt from 'jsonwebtoken';

export const getToken = (request) => {
  const authorization = request.headers?.authorization;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

export const verifyToken = (request) => {
  const token = getToken(request);
  return jwt.verify(token, process.env.SECRET_KEY);
};
