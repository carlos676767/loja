const { default: axios } = require("axios");
const PaymentHistoryService = require("../../../utils/PaymentHistoryService");

class DadosService {
  static #cache = require(`../../../cache/cacheData`);
  static async dadosService() {
    const { email, ID } = user;
    const user = DadosService.#cache.get(`user`);

    await PaymentHistoryService.historyPayment(ID);
    await PaymentHistoryService.PaymentHistoryService(ID);
  }
}

class WebHookMercadoPago extends DadosService {
  static async routerWebHookMp(req, res) {
    const idPay = req.body.id;

    const verifyPayMent = await axios( `https://api.mercadopago.com/v1/payments/${idPay}`);

    const { status } = verifyPayMent.data;

    if (status === "approved") {
      return await WebHookMercadoPago.dadosService();
    }
  }
}

module.exports = WebHookMercadoPago;
