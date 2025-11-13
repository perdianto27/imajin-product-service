const Jwt = require('jsonwebtoken');

const generateToken = async (data) => {
  const {email, roleId } = data;
    const verifyOptionsAccess = {
      algorithm: "HS512",
      expiresIn: process.env.JWT_EXPIRES
    };

    const access_token = { email, roleId };
    const access_token_sign = Jwt.sign(access_token, process.env.JWT_SECRET, verifyOptionsAccess);

    return {
      email,
      access_token: access_token_sign
    };
};

module.exports = {
  generateToken
}