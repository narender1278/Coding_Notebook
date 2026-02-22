// Load environment variables BEFORE constructing the Auth0 verifier
import dotenv from "dotenv";
dotenv.config();

import { auth } from "express-oauth2-jwt-bearer";

// Middleware that validates Auth0 access tokens
export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

export const attachUser = (req, res, next) => {
  if (req.auth && req.auth.payload) {
    req.userId = req.auth.payload.sub || req.auth.payload.user_id || null;
    req.user = req.auth.payload;
  }
  next();
};

export const enforceAuthOrUndefined = (req, res, next) => {
  const mw = checkJwt;
  mw(req, res, (err) => {
    if (err) {
      res.status(200).type("text").send("undefined");
      return;
    }
    attachUser(req, res, next);
  });
};
