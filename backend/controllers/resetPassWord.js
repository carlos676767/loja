import jwt from "jsonwebtoken";
import Sql from "../db/database.js";
("use strict");

class MiddlaJs {
  static verifyJwtToken(req) {
    return new Promise((sucess, reject) => {
      const token = req.headers.authorization.split(` `)[1];

      if (token) {
        jwt.ver7(token, process.env.SECRET_KEY_JWT, (err, decod) => {
          if (err) {
            reject(  new Error( "The 5-minute expiration time to change the password has passed, make a new request") );
          }

          const { email } = decod;
          sucess(email);
        });
      } else {
        reject(new Error("Token not found"));
      }
    });
  }
}

import validePass from "../utils/SenhaValideService.js";
class Validations {
  static validePasWord = validePass
  static checkDifferentPasswords(pass1, pass2) {
    Validations.validePasWord.validacoesSenha(pass1);
    Validations.validePasWord.validacoesSenha(pass2);
    if (pass1 != pass2) {
      throw new Error("the passwords are not the same");
    }
  }
}

class Jwt {
  static jwtAssign(id) {
    return jwt.sign({ id }, process.env.SECRET_KEY_JWT, { expiresIn: `2h` });
  }
}

class DatabaseService extends Jwt {
  static async updatePassWord(passWord, email) {
    const db = await Sql.db();
    try {
      await db.exec(`BEGIN TRANSACTION`);
      const query = `UPDATE USER SET senha = ? WHERE email = ?`;
      await db.run(query, [passWord, email]);
      await db.exec(`COMMIT`);
    } catch (error) {
      await db.exec(`ROLLBACK`);
      throw new Error("Erro reset passWord", error);
    } finally {
      await db.close();
    }
  }

  static async lookingforid(email, res) {
    const db = await Sql.db();
    const { ID } = await db.get(`SELECT * FROM USER WHERE EMAIL = ?`, [email]);

    res.status(200).send({
      msg: `the password was changed successfully`,
      token: Jwt.jwtAssign(ID),
      resetPass: true,
    });

    await db.close();
  }
}

export default class ResetPassWorld {
  static async routers(req, res) {
    try {
      const email = await MiddlaJs.verifyJwtToken(req, res);
      const { OldPassword, NewPassword } = req.body;
      Validations.checkDifferentPasswords(OldPassword, NewPassword);

      await DatabaseService.updatePassWord(OldPassword, email);
      await DatabaseService.lookingforid(email, res);
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }
}
