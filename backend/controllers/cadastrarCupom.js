
import db from "../db/database.js";

class CadastrarCupom {
  static async insert(
    CUPOM,
    VALOR_CUPOM,
    DATA_EXPIRACAO,
    TOTAL_USUARIOS_CUPOM
  ) {
    const database = await db.db();
    try {
      await database.exec(`BEGIN TRANSACTION`);
      const query = `INSERT INTO CUPOM(CUPOM, VALOR_CUPOM, DATA_EXPIRACAO, TOTAL_USUARIOS_CUPOM) VALUES(?,?,?, ?)`;
      await database.run(query, [
        CUPOM,
        VALOR_CUPOM,
        DATA_EXPIRACAO,
        TOTAL_USUARIOS_CUPOM,
      ]);
      await database.exec(`COMMIT`);
    } catch (error) {
      await database.exec(`ROLLBACK`);
      throw new Error("error registering coupon, try again");
    } finally {
      await database.close();
    }
  }
}

class Validacoes {
  static async ValideDados(data, cupom, valor_cupom, TOTAL_USUARIOS_CUPOM) {
    const regexData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

    if (!regexData.test(data)) {
      throw new Error("enter a valid data format, example 12/10/2024");
    }

    const database = await db.db();
    const query = `SELECT * FROM CUPOM WHERE CUPOM = ?`;
    const getCupom = await database.get(query, [cupom]);

    if (getCupom !== undefined) {
      throw new Error("Register another coupon, this one already exists in our database." );
    }

    if ( typeof valor_cupom !== `number` || typeof TOTAL_USUARIOS_CUPOM != `number`) {
      throw new Error("the coupon value must be a number");
    }

    if (!data || !cupom || !valor_cupom) {
      throw new Error("please fill in all fields");
    }

    if (cupom.length < 10) {
      throw new Error("The coupon must have at least 10 characters");
    }
  }
}

export default class RouterInsert extends CadastrarCupom {
  static async main(req, res) {
    try {
      const { CUPOM, VALOR_CUPOM, DATA_EXPIRACAO, TOTAL_USUARIOS_CUPOM } = req.body;
      

      await Validacoes.ValideDados(
        DATA_EXPIRACAO,
        CUPOM,
        VALOR_CUPOM,
        TOTAL_USUARIOS_CUPOM
      );

      await CadastrarCupom.insert(
        CUPOM,
        VALOR_CUPOM,
        DATA_EXPIRACAO,
        TOTAL_USUARIOS_CUPOM
      );

      return res.status(200).send({ msg: `Coupon registered successfully.` });
    } catch (error) {
      
      res.status(400).send({ err: error.message });
    }
  }
}

//quando o usuario usuar um cupom ir tirando 1 , caso seja igual a 0 exclui o cupom.
