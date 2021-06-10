'use strict';

const {HttpCode} = require(`../../constants`);
const {sendData} = require(`../request`);

module.exports = async (req, res, next) => {
  const {userEmail, userPassword} = req.body;
  const response = await sendData(`/api/user/login`, {
    username: userEmail,
    password: userPassword,
  });

  if (response.statusCode === HttpCode.FORBIDDEN) {
    req.session.isLogged = false;
  } else {
    req.session.isLogged = true;
    req.session.avatar = response.avatar;
  }

  return next();
};
