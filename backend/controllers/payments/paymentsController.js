class PaymentsController {
  static Database = require(`.././../db/database`);
  static cache = require(`../../cache/cacheData`);
  static StripeApi = require("./methodsPayments/StripeApi");
  static async router(req, res) {
    const { idsProdutos, idUsuario, metodoPagamento } = req.body;
    try {
    
      
      PaymentsController.validacoes(idsProdutos, idUsuario, metodoPagamento);

      await PaymentsController.verifyEmail(idUsuario);

      switch (metodoPagamento) {
        case `pix`:
          break;

        case `boleto`:
          const { nameContents, priceContent } = await PaymentsController.getProducts( idsProdutos );
         
          
          const { url } = await PaymentsController.StripeApi.gerarPagamento( priceContent,   nameContents  );

          res.status(200).send({ url: url, status: `awaiting payment` });
          break;

        default:
          throw new Error("please provide a valid option");
      }
    } catch (error) {
      res.status(200).send({ err: error.message });
    }
  }

  static validacoes(idsProdutos, idUsuario, metodoPagamento) {
    const payMentsValides = [`pix`, `boleto`];

    if (!payMentsValides.includes(metodoPagamento)) {
      throw new Error("Enter a valid payment method between bank slip and oix");
    }

    if (!metodoPagamento || !idsProdutos || !idUsuario) {
      throw new Error(  "Missing required fields: Payment method, product IDs, or user ID is not provided." );
    }
  }

  static async verifyEmail(idUser) {
    const db = await this.Database.db();
    try {
      const query = `SELECT * FROM USER WHERE ID = ?`;
      const user = await db.get(query, [idUser]);

      if (user === undefined) {

        throw new Error("the id entered does not exist in the database");
      }
      
      const { email, ID } = user;
  
      this.cache.set(`user`, {
        email,
        ID,
      });


    } catch (error) {
      throw new Error(error)
    }finally{
      await db.close();
    }
  }

  static async getProducts(idsProdutos) {
    const digits = idsProdutos.split(``).filter((char) => char !== `,`);
    
    
    const formattedVector = digits.map(() => `?`).join(` `);
   
    
    const query = `SELECT * FROM CONTEUDO WHERE ID IN(${formattedVector})`;

    const db = await this.Database.db();
    const digitsFormate = digits.join(`,`)
    const resultsProducts = await db.all(query, [digitsFormate]);

    
    if (!resultsProducts) {
      throw new Error("the id entered does not exist in the database");
    }

    const priceContent = resultsProducts.map((char) => char.PRECO_CONTEUDO)
      .reduce((acc, ac) => ac + acc, 0);

    const nameContents = resultsProducts.map((char) => char.NOME_IMG).join(`,`);


    this.cache.set(`idProducts`, 
      digitsFormate
    )

    return {
      priceContent,
      nameContents,
    };
  }
}


module.exports = PaymentsController