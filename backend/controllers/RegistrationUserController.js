"use strict";

class JsonWebToken {
  static jwt = require(`jsonwebtoken`);
  static tokenJwt(id) {
    const config = {
      id,
    };
    return this.jwt.sign(config, process.env.SECRET_KEY_JWT, {
      expiresIn: `2h`,
    });
  }
}

class DatabaseService {
  static Sql = require("../db/database");
  static async insertUser(email, senha, res) {
    const db = await this.Sql.db();
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
  static cache = require(`../cache/cacheData`);
  static verifyCache() {
    const getUser = this.cache.get(`dadosUser`);

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
  static Email = require(`../utils/email/email`);
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
    await ConfigEmailRegister.Email.sendEmail(text, userEmail, title)
  }
}

class RegistrationUserController extends ValidacoesUser  {
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

module.exports = RegistrationUserController;
