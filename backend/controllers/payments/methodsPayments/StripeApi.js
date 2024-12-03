

class StripeApi {
  "use strict";
  static #stripeApi = require("stripe")(process.env.SECRET_KEY_STRIPE);
  static #cache = require(`../../../cache/cacheData`);
  static email = require("../../../utils/email/email");
  static database = require(`../../../db/database`);
  static GetDate = require("../../../utils/getDATE");
  static getHours = require("../../../utils/getHours");
  

  static #informacoesPagamento(valor, itens) {
    const valorParaMultiplicarEmCentavos = 100;
    const valorEmCentavos = valor * valorParaMultiplicarEmCentavos;
    const price_data = {
      price_data: {
        currency: "brl",
        product_data: { name: `${itens}` },
        unit_amount: valorEmCentavos,
      },
      quantity: 1,
    };

    return price_data;
  }

  static configsRedirecionamentoEpagamneto() {
    return {
      mode: "payment",
      success_url: "https://www.exemplo.com",
      cancel_url: "https://www.exemplo.com",
    };
  }

  static async gerarPagamento(valor, itens) {
    try {
      console.log(valor, itens, `aaaaaaaaaaaaaa`);

      const { url } = await StripeApi.#stripeApi.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [this.#informacoesPagamento(valor, itens)],
        ...this.configsRedirecionamentoEpagamneto(),
      });

      return { url };
    } catch (error) {
      throw new Error("error ao criar pagamento.");
    }
  }

  static async sendEmailComprovante(charge, email) {
  
    const configs = {
      title: `🧾 Comprovante de Pagamento`,
      content: `🔍 Para visualizar o comprovante da Stripe, clique no link abaixo:  
👉 [Ver comprovante](${charge.receipt_url})`,

      eu: process.env.EMAIL_YAHOO,
      emailUser: email,
    };

    const { eu, emailUser, title, content } = configs;
    await this.email.sendEmail(eu, emailUser, title, content);
  }


  static async webWhook(req, res) {
    const typeNotification = req.body.type;

    if (typeNotification === `charge.succeeded`) {
      console.log(`pagamento com sucesso.`);
      const user = StripeApi.#cache.get(`user`);
       
      if (user) {
        
        const { email, ID } = user;

        await StripeApi.historyPayment(ID)

       
        const charge = req.body.data.object;

        await StripeApi.sendEmailComprovante(charge, email);
        await StripeApi.contentPay(ID)
        
      }
    }
  }

  static async historyPayment(ID_USER ) {
    const db = await this.database.db();
    try {
      await db.exec(`BEGIN TRANSACTION`)
      

      const query = `INSERT INTO HISTORICO_PAGAMENTO (ID_USER, DIA_PAGAMENTO, HORA_PAGAMENTO)
VALUES (?, ?, ?);


`
      await db.run(query, [ID_USER,    StripeApi.GetDate(), StripeApi.getHours()])

      await db.exec(`COMMIT`)
    } catch (error) {
      await db.exec(`ROLLBACK`)
      throw new Error(error);
    }
  }


  static async contentPay(ID){
    const database = await this.database.db()
    try {
      const getIds = StripeApi.#cache.get(`idProducts`).split(` `)
      

      await database.exec(`BEGIN TRANSACTION`)
      const query = `INSERT INTO CONTEUDOSCOMPRADOSUSUARIO (ID_CONTEUDO, ID_USUARIO) VALUES (?, ?)`

      for (const idsProducts of getIds) {
        await database.run(query, [idsProducts, ID])
      }
      await database.exec(`COMMIT`)
    } catch (error) {
      console.log(error);
      
      await database.exec(`ROLLBACK`)
      throw new Error(error)
    }
  }
}

module.exports = StripeApi;



