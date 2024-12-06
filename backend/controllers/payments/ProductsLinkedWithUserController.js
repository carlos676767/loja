class ProductsLinkedWithUserController {
  static #db = require(`../../db/database`);

  static async router(req, res) {
    try {
      const id = req.params.user;


      if (!id) {
        throw new Error("enter the user id");
      }

      const historics = await ProductsLinkedWithUserController.getProducts(id);
      res.status(200).send({ vinculations: historics });
    } catch (error) {
      res.status(200).send({ err: error.message });
    }
  }

  static async getProducts(id) {
    const database = await this.#db.db();
    try {
      const query = `
    SELECT 
    CONTEUDOSCOMPRADOSUSUARIO.ID_CONTEUDO, 
    CONTEUDO.CONTEUDO,
    HISTORICO_PAGAMENTO.DIA_PAGAMENTO, 
    HISTORICO_PAGAMENTO.HORA_PAGAMENTO
FROM 
    CONTEUDOSCOMPRADOSUSUARIO
JOIN 
    CONTEUDO 
ON 
    CONTEUDOSCOMPRADOSUSUARIO.ID_CONTEUDO = CONTEUDO.ID
JOIN 
    HISTORICO_PAGAMENTO 
ON 
    HISTORICO_PAGAMENTO.ID_USER = CONTEUDOSCOMPRADOSUSUARIO.ID_USUARIO
WHERE 
    CONTEUDOSCOMPRADOSUSUARIO.ID_USUARIO = ?
ORDER BY 
    CONTEUDO.NOME_IMG ASC;
            `;

      const user = await database.all(query, [Number(id)]);

      if (user.length == 0) {
        throw new Error("There is no payment product for this user");
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ProductsLinkedWithUserController;
