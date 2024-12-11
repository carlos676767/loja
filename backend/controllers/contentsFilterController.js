
"use strict"
import database from "../db/database.js";
class FilterItem {
  static db = database
  static async getItemFilter(option, item) {
    const database = await this.db.db();
    const query = `SELECT * FROM CONTEUDO WHERE ${option} = ?`;


    const filterItem = await database.all(query, [item]);
    

    if (filterItem.length === 0 || filterItem === undefined) {
      throw new Error( "The item for the specified filter does not exist in our database, try another option." );
    }
    

    const itensFilter = filterItem.map(char => ({
        productId: char.ID,
        data_postagem:  char.DATACONTEUDO,
        imagem_conteudo: char.NOME_IMG,
        preco: char.PRECO_CONTEUDO
    }) )

    return itensFilter;
  }
}


class Options extends FilterItem {
  static async option(option, valueItem) {
    if (!option || option == null) {
      throw new Error("the value cannot be null or empty");
    }

    const ibjectSelect = {
      valor: async () => {
        return await FilterItem.getItemFilter(`PRECO_CONTEUDO`, valueItem);
      },
      data: async () => {
        return await FilterItem.getItemFilter(`DATACONTEUDO`, valueItem);
      },
    };

    const selectOption = ibjectSelect[option];

    if (selectOption) {
      return await selectOption();
    }

    throw new Error("select a valid option, data or valor");
  }
}


 export default class ApiMain extends Options {
  static async router(req, res) {
    try {
      const { option, value } = req.params;
  
      
      const itens = await Options.option(option, value);
      return res.status(200) .send({ itensFilter: itens, filterItensSucess: true });
    } catch (error) {
      return res.status(400).send({ err: error.message });
    }
  }
}

