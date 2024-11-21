const emailValide = require(`../utils/validacoesEmail`)
const validePasWord = require(`../utils/senhaValide`)

const Sql = require("../db/database")

class checkDataRegistrationUser {

  static cache = require(`../cache/cacheData`)
  static Email = require("../utils/email/email")
  static RandomCod = require(`../utils/randomCods`)
  static async routerVerfify(req, res) {
    try {
      const { email, senha } = req.body;
      emailValide.valideEmail(email)
      validePasWord.validacoesSenha(senha)
      await checkDataRegistrationUser.verificarEmailExiste(email)
      await checkDataRegistrationUser.setDadosYsendEmail(email, senha, res)
    } catch (error) {
      console.log(error);

      res.status(400).send({ err: error.message });
    }
  }



  static async verificarEmailExiste(email) {
    const db = await Sql.db()
    try {


      const user = await db.get('SELECT COUNT(*) AS COUNT FROM USER WHERE email = ?', [email]);


      if (user.count > 0) {
        throw new Error("the email provided already exists");
      }


    } catch (error) {
      throw error
    } finally {
      await db.close()
    }
  }


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

    res.status(200).send({msg:`Please check your email, remembering you only have 5 minutes.`, emailSend: true})
  }

  static setCacheDados(email, senha, code) {
    return this.cache.set(`dadosUser`, {
      email,
      senha,
      code
    }, 5 * 60)
  }
}


module.exports = checkDataRegistrationUser;
