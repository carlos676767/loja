import GetDate from "../../utils/getDateService.js";
import db from "./../../db/database.js";

class ValideCupom {
  static async valideCupomUser(getCupom, myDb, cupom) {
    if (getCupom === undefined) {
      throw new Error("the coupon entered does not exist, try another coupon");
    }

    const { DATA_EXPIRACAO, TOTAL_USUARIOS_CUPOM } = getCupom;
    const dateYear = GetDate();

    if (DATA_EXPIRACAO < dateYear) {
      throw new Error( `coupon expiration time has expired, the expiration date was${DATA_EXPIRACAO}`);
    }

    if (TOTAL_USUARIOS_CUPOM <= 0) {
      await myDb.run(`DELETE FROM CUPOM WHERE CUPOM = ?`, [cupom]);
      throw new Error("the coupon dropped the maximum number of users to use.");
    }

    if (TOTAL_USUARIOS_CUPOM - 1 === 0) {
      await myDb.run(`DELETE FROM CUPOM WHERE CUPOM = ?`, [cupom]);
    }
  }
}

export default class Cupom extends ValideCupom {
  static database = db;

  static async UseCupom(cupom) {
    const myDb = await this.database.db();
    try {
      await myDb.exec(`BEGIN TRANSACTION`);

      const getCupom = await myDb.get(`SELECT * FROM CUPOM WHERE CUPOM = ?`, [
        cupom,
      ]);

      await Cupom.valideCupomUser(getCupom, myDb, cupom);
      await myDb.run( `UPDATE CUPOM SET TOTAL_USUARIOS_CUPOM = -1 WHERE CUPOM = ?`,  [cupom]);

      const { VALOR_CUPOM } = getCupom;
      await myDb.exec(`COMMIT`);
      return VALOR_CUPOM;
    } catch (error) {
      await myDb.exec(`ROLLBACK`);
      throw new Error(error);
    } finally {
      await myDb.close();
    }
  }
}