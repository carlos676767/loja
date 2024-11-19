

class cadastroUserController {
  static #db = require(`../db/database`);
  static EmailValide = require("../utils/validacoesEmail");
  static SenhaValide = require("../utils/senhaValide");
  static async router(req, res) {
    try {
      const { email, senha } = req.body;

      new this.EmailValide(email).valideEmail();
      new this.SenhaValide(senha).validacoesSenha();
      
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }
}

module.exports = cadastroUserController;
