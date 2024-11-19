class cadastroUserController {
  static #db = require(`../db/database`);
  static EmailValide = require("../utils/validacoesEmail");

  static async router(req, res) {
    try {
      const { email, senha } = req.body;
      new this.EmailValide(email).valideEmail();
      
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }
}

module.exports = cadastroUserController;
