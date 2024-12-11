import db from "../db/database.js";
import SenhaValide from "../utils/SenhaValideService.js";
import EmailValide from "../utils/validacoesEmailService.js";

class databaseQueryService {
  static async updateUser(newValue, id, opcao) {
    const database = await db.db();
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
  static validacoes(opcao, newValue) {
    const options = {
      senha: () => {
        SenhaValide.validacoesSenha(newValue);
      },
      email: () => {
        EmailValide.valideEmail(  newValue  );
      },
    };

    const optionValue = options[opcao];
    
    if (optionValue) {
      return optionValue();
    }

    throw new Error("provide a valid option for trocar");
  }
}

 export default class UpdateUserController extends databaseQueryService {
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

