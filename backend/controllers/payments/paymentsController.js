
"use strict";
import  MercadoPagoPixController  from "./methodsPayments/MercadoPagoPixController.js";
import cacheData from "../../cache/cacheData.js"

import db from ".././../db/database.js";
import stripe from "../payments/methodsPayments/StripeApi.js"
import Cupom from "./cupomUsar.js";

class ValidacoesService {
  static validacoes(idsProdutos, idUsuario, metodoPagamento) {
    const payMentsValides = [`pix`, `boleto`];

    if (!payMentsValides.includes(metodoPagamento)) {
      throw new Error("Enter a valid payment method between bank slip and oix");
    }

    if (!metodoPagamento || !idsProdutos || !idUsuario) {
      throw new Error(  "Missing required fields: Payment method, product IDs, or user ID is not provided." );
    }
  }
}

class UserExistService {
  static cache = cacheData
  static Database = db
  static async verifyEmail(idUser) {
    const db = await this.Database.db()
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
}


class GetProductService extends Cupom  {
  static cache = cacheData
  static Database = db
  static async getProducts(idsProdutos, cupom) {
    const digits = idsProdutos.split(``).filter((char) => char !== `,`);
    

    
    const formattedVector = digits.map(() => `?`).join(` `);
   
    
    const query = `SELECT * FROM CONTEUDO WHERE ID IN(${formattedVector})`;

    const db = await this.Database.db();
    const digitsFormate = digits.join(`,`)
    const resultsProducts = await db.all(query, [digitsFormate]);
  
    
    if (!resultsProducts || resultsProducts.length === 0) {
      throw new Error("the id entered does not exist in the database");
    }
    
    const priceContent = resultsProducts.map((char) => char.PRECO_CONTEUDO).reduce((acc, ac) => ac + acc, 0);
    const priceDescont = priceContent - Cupom.UseCupom()
    const nameContents = resultsProducts.map((char) => char.NOME_IMG).join(`,`);

    
    this.cache.set(`idProducts`, digitsFormate)

    return {
      priceDescont,
      nameContents,
    };
  }
}


 export default class PaymentsController {
  static StripeApi = stripe
  static async router(req, res) {
    const { idsProdutos, idUsuario, metodoPagamento, cupom } = req.body;
    try {
    
      if (cupom !== `nao` ) {
        ValidacoesService.validacoes(idsProdutos, idUsuario, metodoPagamento);

        await UserExistService.verifyEmail(idUsuario);
  
        const  { nameContents, priceContent } = await GetProductService.getProducts( idsProdutos, cupom );
       
        const paymentMethods  = {
          pix: async () => {
            const {ticket_url,qr_code_base64}  = await MercadoPagoPixController.generatePayMent(priceContent, nameContents)
            res.status(200).send({url: ticket_url, base64: qr_code_base64, status: `awaiting payment`})
          },
  
          boleto: async() => {
            const { url } = await PaymentsController.StripeApi.gerarPagamento( priceContent,   nameContents  );
            res.status(200).send({ url: url, status: `awaiting payment` });
          }
  
        }
  
        const executePay = paymentMethods[metodoPagamento]
        
        if (executePay) {
          return await executePay()
        }
  
        throw new Error("please provide a valid option");
      }
      
      

    } catch (error) {
      res.status(200).send({ err: error.message });
    }
  }
}


