"use strict"


import  Sql  from "../db/database.js";
import cache from "../cache/cacheData.js";
import emailSend from "../utils/email/email.js";
import codeRandom from "../utils/RandomCodService.js";
class EmailExist {
  static async verificarEmailExiste(email) {
    const db = await Sql.db()
    try {

      const user = await db.get('SELECT * FROM USER WHERE email = ?', [email]);

      if (user) {
        throw new Error("the email provided already exists");
      }

    } catch (error) {
      throw new Error(error);
    } finally {
      await db.close()
    }
  }
}

class SetCache {
  static cache = cache
  static setCacheDados(email, senha, code) {
    return this.cache.set(`dadosUser`, {
      email,
      senha,
      code
    }, 5 * 60)
  }
}


class EmailCod extends SetCache {
  static Email = emailSend
  static RandomCod = codeRandom

  static async setDadosYsendEmail(email, senha, res) {
    const code = this.RandomCod.code()

    const configs = {
      text: `copy and paste this code to confirm your email: ${code}`,
      emailDestination: email,
      titleEmail: `email confirmation`,
      pass: senha
    }

    const { text, emailDestination, titleEmail, pass } = configs


    await this.Email.sendEmail(text, emailDestination, titleEmail)

    this.setCacheDados(emailDestination, pass, code)

    res.status(200).send({ msg: `Please check your email, remembering you only have 5 minutes.`, emailSend: true })
  }

}


 export default class checkDataRegistrationUser {
  static async routerVerfify(req, res) {
    const emailValide = require(`../utils/validacoesEmailService`)
    const validePasWord = require(`../utils/SenhaValideService`)
    try {
      const { email, senha } = req.body;
      emailValide.valideEmail(email)
      validePasWord.validacoesSenha(senha)
      await EmailExist.verificarEmailExiste(email)
      await EmailCod.setDadosYsendEmail(email, senha, res)
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }
}



