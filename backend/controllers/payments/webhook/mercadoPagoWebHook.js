
import  PaymentHistoryService  from "../../../utils/PaymentHistoryService.js";
import SendPaymentReceipt from "../../../utils/SendPaymentReceipt.js";
import RandomCod from "../../../utils/RandomCodService.js";
import axios from "axios";
import cacheData from "../../../cache/cacheData.js";

class DadosService {
  static #cache = cacheData
  static async dadosService() {
    const { email, ID } = user;
    const user = DadosService.#cache.get(`user`);

    await PaymentHistoryService.historyPayment(ID);
    await PaymentHistoryService.PaymentHistoryService(ID);
    await PaymentHistoryService.updateUSERtable(ID)

    await SendPaymentReceipt.sendPaymentReceipt(RandomCod.code(),email)
  }
}


 export default class WebHookMercadoPago extends DadosService {
  static async main(req, res) {
    const idPay = req.body.id;

    const verifyPayMent = await axios( `https://api.mercadopago.com/v1/payments/${idPay}`);

    const { status } = verifyPayMent.data;

    if (status === "approved") {
      return await WebHookMercadoPago.dadosService();
    }
  }
}


