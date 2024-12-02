class GetHistory {
  static #db = require(`../../db/database`);

  static async router(req, res) {
    try {
      const id = req.params.user
      console.log(id);
      
      if (!id) {
        throw new Error("enter the user id");
      }

      const historics = await GetHistory.getHistoricy(id);
      res.status(200).send({ itens: historics });
    } catch (error) {
      res.status(200).send({ err: error.message });
    }
  }

  static async getHistoricy(id) {
    const database = await this.#db.db();
    try {
        const query = `
        SELECT 
          user.id, 
          HISTORICO_PAGAMENTO.*
        FROM 
          user
        JOIN 
          HISTORICO_PAGAMENTO
        ON 
          user.ID = HISTORICO_PAGAMENTO.iD_USER
        WHERE 
          HISTORICO_PAGAMENTO.iD_USER = ?
        ORDER BY 
          user.ID ASC;
      `;
      

      const historics = await database.all(query, [Number(id)]);
      console.log(historics);
      

      if (historics.length == 0) {
        throw new Error("There is no payment history for this user");
      }

      return historics;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = GetHistory