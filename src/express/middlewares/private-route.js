'use strict';

module.exports = (req, res, next) => {
  const {isLogged, avatar} = req.session;

  if (!isLogged) {
    return res.redirect(`/login`);
  }

  res.locals.isLogged = isLogged;
  res.locals.avatar = avatar;
  return next();
};
