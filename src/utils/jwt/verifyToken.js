import jwt from "jsonwebtoken";


export const verifyToken = (payload,secret ) => {
  return jwt.verify(payload, secret);
};