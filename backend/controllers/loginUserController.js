class Login {
  "use strict";
  static db = require(`../db/database`);
  static tokenJwt = require(`jsonwebtoken`);

  static middlareLogin(req, res, next) {
    if (!req.headers.authorization.split(` `)[1]) {
      return res.status(401).send({ msg: `token not provided` })
    }

    const token = req.headers.authorization.split(` `)[1] 
    Login.tokenJwt.verify(token, process.env.SECRET_KEY_JWT, (err, sucess) => {
      if (err) {
        return res.status(401).send({ msg: `the token entered is invalid`, login: false })
      }
    

      next()
    })
  }


  static async router(req, res) {
    try {
      const { email, senhaUser } = req.body
      console.log(req.body);
      
      await Login.login(email, senhaUser, res)
    } catch (error) {
      res.status(400).send({ err: error.message })
    }
  }


  static async login(email, senhaUser, res) {
    const db = await this.db.db()
    try {

      const query = `SELECT * FROM USER WHERE email = ?`
      const dbProcure = await db.get(query, [email])

      if (!dbProcure) {
        throw new Error("the email provided does not exist");
      }


      Login.loginSystem(senhaUser, res, dbProcure)

    } catch (error) {
      throw new Error(error);
    } finally {
      await db.close()
    }
  }


  static loginSystem(senhaUser, res, db) {
    const { senha, ID } = db

    if (senha === senhaUser) {
      const token = this.tokenJwt.sign({ ID }, process.env.SECRET_KEY_JWT, { expiresIn: `2h` })
      return res.status(200).send({ token: token, login: true })
    }

    return res.status(401).send({ msg: `the password is incorrect` })
  }
}

module.exports = Login;
