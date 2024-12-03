const jwt = require(`jsonwebtoken`);
class ResetPassWorld {
  "use strict";
  static #Sql = require("../db/database");
  static verifyJwtToken(req) {
    return new Promise((sucess, reject) => {
      const token = req.headers.authorization.split(` `)[1];

      if (token) {
        jwt.verify(token, process.env.SECRET_KEY_JWT, (err, decod) => {
          if (err) {
            reject(new Error("The 5-minute expiration time to change the password has passed, make a new request"));
          }

          const { email } = decod;
          sucess(email);
        });
      } else {
        reject(new Error("Token not found"));
      }
    });
  }

  static async routers(req, res) {
    const validePasWord = require(`../utils/SenhaValideService`);
    try {
      const email = await ResetPassWorld.verifyJwtToken(req, res);


      const { OldPassword, NewPassword } = req.body;

      validePasWord.validacoesSenha(OldPassword);
      validePasWord.validacoesSenha(NewPassword);
      ResetPassWorld.checkDifferentPasswords(OldPassword, NewPassword);

      await ResetPassWorld.updatePassWord(OldPassword, email);
      await ResetPassWorld.lookingforid(email, res);
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }

  static checkDifferentPasswords(pass1, pass2) {
    if (pass1 != pass2) {
      throw new Error("the passwords are not the same");
    }
  }

  static async updatePassWord(passWord, email) {
    const db = await ResetPassWorld.#Sql.db();
    try {
      await db.exec(`BEGIN TRANSACTION`);

      const query = `UPDATE USER SET senha = ? WHERE email = ?`;

      await db.run(query, [passWord, email]);


      await db.exec(`COMMIT`);
    } catch (error) {
      await db.exec(`ROLLBACK`);
      console.log(error);

      throw new Error("Erro reset passWord", error);
    } finally {
      await db.close();
    }
  }

  static async lookingforid(email, res) {
    const db = await ResetPassWorld.#Sql.db();
    const { ID } = await db.get(`SELECT * FROM USER WHERE EMAIL = ?`, [email]);
    console.log(ID);

    res.status(200).send({
      msg: `the password was changed successfully`,
      token: this.jwtAssign(ID),
      resetPass: true,
    });

    await db.close();
  }
  static jwtAssign(id) {
    return jwt.sign({ id }, process.env.SECRET_KEY_JWT, { expiresIn: `2h` });
  }
}

module.exports = ResetPassWorld;
