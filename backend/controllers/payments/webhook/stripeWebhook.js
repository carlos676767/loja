class WebHookStripe {
  static #cache = require(`../../../cache/cacheData`);
  static #database = require(`../../../db/database`);
  static #GetDate = require("../../../utils/getDateService");
  static #getHours = require("../../../utils/getHoursService");
  static email = require("../../../utils/email/email");

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
      const user = WebHookStripe.#cache.get(`user`);

      if (user) {
        const { email, ID } = user;

        await WebHookStripe.historyPayment(ID);

        const charge = req.body.data.object;

        await WebHookStripe.sendEmailComprovante(charge, email);
        await WebHookStripe.contentPay(ID);
      }
    }
  }

  static async historyPayment(ID_USER) {
    const db = await this.#database.db();
    try {
      await db.exec(`BEGIN TRANSACTION`);

      const query = `INSERT INTO HISTORICO_PAGAMENTO (ID_USER, DIA_PAGAMENTO, HORA_PAGAMENTO) VALUES (?, ?, ?);`;
      await db.run(query, [
        ID_USER,
        WebHookStripe.#GetDate(),
        WebHookStripe.#getHours(),
      ]);

      await db.exec(`COMMIT`);
    } catch (error) {
      await db.exec(`ROLLBACK`);
      throw new Error(error);
    }
  }

  static async contentPay(ID) {
    const database = await this.#database.db();
    try {
      const getIds = WebHookStripe.#cache.get(`idProducts`).split(` `);

      await database.exec(`BEGIN TRANSACTION`);
      const query = `INSERT INTO CONTEUDOSCOMPRADOSUSUARIO (ID_CONTEUDO, ID_USUARIO) VALUES (?, ?)`;

      for (const idsProducts of getIds) {
        await database.run(query, [idsProducts, ID]);
      }

      await database.exec(`COMMIT`);
    } catch (error) {
      await database.exec(`ROLLBACK`);
      throw new Error(error);
    }
  }
}

module.exports = WebHookStripe