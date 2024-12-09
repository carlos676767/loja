class MiddlareLoginService {
  static tokenJwt = require(`jsonwebtoken`);

  static Oauth(req, res, next) {
    if (!req.headers.authorization.split(` `)[1]) {
      return res.status(401).send({ msg: `token not provided` });
    }

    const token = req.headers.authorization.split(` `)[1];
    MiddlareLoginService.tokenJwt.verify(token, process.env.SECRET_KEY_JWT, (err, sucess) => {
      if (err) {
        return res.status(401).send({ msg: `the token entered is invalid`, login: false });
      }

      next();
    });
  }
}


module.exports = MiddlareLoginService