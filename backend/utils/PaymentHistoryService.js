class PaymentHistoryService {
  static #database = require(`../db/database`);
  static #GetDate = require("./getDateService");
  static #getHours = require("./getHoursService");
  static #cache = require(`./../cache/cacheData`);

  static async historyPayment(ID_USER) {
    const db = await this.#database.db();
    try {
      await db.exec(`BEGIN TRANSACTION`);

      const query = `INSERT INTO HISTORICO_PAGAMENTO (ID_USER, DIA_PAGAMENTO, HORA_PAGAMENTO) VALUES (?, ?, ?);`;

      await db.run(query, [
        ID_USER,
        PaymentHistoryService.#GetDate(),
        PaymentHistoryService.#getHours(),
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
      await database.exec(`BEGIN TRANSACTION`);

      const getIds = PaymentHistoryService.#cache.get(`idProducts`).split(` `);

      const query = `INSERT INTO CONTEUDOSCOMPRADOSUSUARIO (ID_CONTEUDO, ID_USUARIO) VALUES (?, ?)`;

      for (const idsProducts of getIds) {
        await database.run(query, [idsProducts, ID]);
      }

      await database.exec(`COMMIT`);
    } catch (error) {
      await database.exec(`ROLLBACK`);
      throw new Error(error);
    } finally {
      await database.close();
    }
  }

  static async updateUSERtable(id) {
    const db = await this.#database.db();
    try {
      await db.exec(`BEGIN TRANSACTION`);

      const query = `UPDATE USER SET status_assinatura = ? WHERE ID = ?`;
      await db.run(query, [`ASSINANTE`, id]);

      await db.exec(`COMMIT`);
    } catch (error) {
      await db.exec(`ROLLBACK`);
      throw new Error(error);
    }finally{
      await db.close()
    }
  }
}

module.exports = PaymentHistoryService;
