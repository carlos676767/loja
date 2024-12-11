"use strict";

import database from "../db/database.js";
import GetDate from "./getDateService.js";
import getHours from "./getHoursService.js";
import cache from "./../cache/cacheData.js";

export default class PaymentHistoryService {
  static #database = database;
  static #GetDate = GetDate;
  static #getHours = getHours;
  static #cache = cache;

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
    } finally {
      await db.close();
    }
  }
}


