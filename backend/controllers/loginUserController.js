"use strict";


import EmailValide from "../utils/validacoesEmailService.js";
import databaseDb from "../db/database.js";

class DatabaseService {
  static db = databaseDb
  static async login(email, senhaUser, res) {
    const db = await this.db.db();
    try {

      const query = `SELECT * FROM USER WHERE email = ?`;
      const dbProcure = await db.get(query, [email]);

      if (!dbProcure) {
        throw new Error("the email provided does not exist");
      }

      Login.loginSystem(senhaUser, res, dbProcure);
    } catch (error) {
      throw new Error(error);
    } finally {
      await db.close();
    }
  }
}

export default  class Login extends DatabaseService {
  static async router(req, res) {
    try {
      const { email, senhaUser } = req.body;
      EmailValide.valideEmail(email)
      await DatabaseService.login(email, senhaUser, res);
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }

  static loginSystem(senhaUser, res, db) {
    const { senha, ID } = db;

    if (senha === senhaUser) {

      const token = this.tokenJwt.sign({ ID }, process.env.SECRET_KEY_JWT, { expiresIn: `2h` });

      return res.status(200).send({ token: token, login: true });
    }

    return res.status(401).send({ msg: `the password is incorrect` });
  }
}


