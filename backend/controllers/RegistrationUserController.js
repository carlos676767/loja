"use strict";
import email from "../utils/email/email.js";
import jwt from "jsonwebtoken";
import Sql from "../db/database.js";
import cache from "../cache/cacheData.js";
class JsonWebToken {
  static tokenJwt(id) {
    const config = {
      id,
    };
    return jwt.sign(config, process.env.SECRET_KEY_JWT, {
      expiresIn: `2h`,
    });
  }
}

class DatabaseService {
  static async insertUser(email, senha, res) {
    const db = await Sql.db();
    try {
      await db.exec(`BEGIN TRANSACTION`);

      const { lastID } = await db.run(
        `INSERT INTO USER(email, senha) VALUES(?, ?)`,
        [email, senha]
      );

      await db.exec(`COMMIT`);

      res
        .status(200)
        .send({ jwt: JsonWebToken.tokenJwt(lastID), register: true });
    } catch (error) {
      await db.exec(`ROLLBACK`);
      throw new Error(error.message);
    } finally {
      await db.close();
    }
  }
}


class GetUser {
  static verifyCache() {
    const getUser = cache.get(`dadosUser`);

    if (getUser == undefined) {
      throw new Error(
        "The time to check your email has passed, make a new request or enter an invalid code, check and try again"
      );
    }

    const { email, senha, code } = getUser;

    return { email, senha, code };
  }
}

class ValidacoesUser {
  static verifyCode(codigo) {
    if (!codigo) {
      throw new Error("enter the code");
    }
  }

  static verifyCodeInConfirm(codigoUserBody, codeInCache) {
    if (codigoUserBody != codeInCache) {
      throw new Error("the code provided is not the same in our database");
    }

    return true;
  }
}



class ConfigEmailRegister {
  static async sendEmail(user) {
    const configEmail = {
      text: `Olá, Estrela!  

Parabéns por dar o primeiro passo e criar sua 
conta no csdev assinaturas
 Estamos muito felizes por tê-lo conosco nesta jornada.`,
      userEmail: user,
      title: `Bem-vindo ao csdev assinatura! Conta criada com sucesso!  `,
    };

    const {text, title, userEmail} = configEmail
    await email.sendEmail(text, userEmail, title)
  }
}

 export default class RegistrationUserController extends ValidacoesUser  {
  static async router(req, res) {
    try {
      const { codigo } = req.body;
      ValidacoesUser.verifyCode(codigo);

      const { code, senha, email } = GetUser.verifyCache();

      const codeConfirm = ValidacoesUser.verifyCodeInConfirm(codigo, code);

      if (codeConfirm) {
        await DatabaseService.insertUser(email, senha, res);
        await ConfigEmailRegister.sendEmail(email)
      }

      throw new Error("Error registering user, try again.");
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }
}


