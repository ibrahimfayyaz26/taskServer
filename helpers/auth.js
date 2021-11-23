const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/upload(.*)/, method: ["GET", "OPTIONS"] },
      "/User/login",
      "/User/register",
    ],
  });
}


module.exports = authJwt;