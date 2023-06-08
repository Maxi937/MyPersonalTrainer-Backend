import jwt from "jsonwebtoken";
import { db } from "../models/db.js";
import { createlogger } from "../utility/logger.js";

const logger = createlogger();

export function createToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const options = {
    algorithm: "HS256",
    expiresIn: "6h",
  };
  return jwt.sign(payload, process.env.cookie_password, options);
}

export function decodeToken(token) {
  const userInfo = {};
  try {
    const decoded = jwt.verify(token, process.env.cookie_password);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
    console.log(e.message);
  }
  return userInfo;
}

export async function validate(decoded) {
  const user = await db.User.findOne({ _id: decoded.id });
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}

export function getUserIdFromRequest(request) {
  let userId = null;
  try {
    const { authorization } = request.headers;
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secretpasswordnotrevealedtoanyone");
    userId = decodedToken.id;
  } catch (e) {
    userId = null;
  }
  return userId;
}

export function getTokenFromRequest(request) {
  let token = {};
  try {
    const { authorization } = request.headers;
    // eslint-disable-next-line prefer-destructuring
    token = authorization.split(" ")[1];
    return token;
  } catch (e) {
    return token;
  }
}

export async function checkTokenExpired(token) {
  try {
    if (decodeToken(token) === "jwt expired") {
      return true;
    }
    return false;
  } catch (e) {
    logger.error(e.message);
    return true;
  }
}
