class databaseQueryService {
  static db = require(`../db/database`);
  static async updateUser(newValue, id, opcao) {
    const database = await this.db.db();
    try {
      await database.exec(`BEGIN TRANSACTION`);
      const query = `UPDATE USER SET ${opcao} = ? WHERE id = ?`;
      await database.run(query, [newValue, id]);
      await database.exec(`COMMIT`);
    } catch (error) {
      await database.exec(`ROLLBACK`);
      throw new Error("error updating data try again");
    } finally {
      await database.close();
    }
  }
}

class ValideItens {
  static SenhaValide = require("../utils/SenhaValideService");
  static EmailValide = require("../utils/validacoesEmailService");

  static validacoes(opcao, newValue) {
    const options = {
      senha: () => {
        ValideItens.SenhaValide.validacoesSenha(newValue);
      },
      email: () => {
        ValideItens.EmailValide.valideEmail(
            newValue
        );
      },
    };

    const optionValue = options[opcao];
    
    if (optionValue) {
      return optionValue();
    }

    throw new Error("provide a valid option for trocar");
  }
}

class UpdateUserController extends databaseQueryService {
  static async router(req, res) {
    const { newValue, id, opcao } = req.body;
    try {


        
      ValideItens.validacoes(opcao,newValue);
      await UpdateUserController.updateUser(newValue, id, opcao);
      return res.status(200).send({msg: `user updated successfully.`})
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  }
}

module.exports = UpdateUserController