const PaymentHistoryService = require("../../../utils/PaymentHistoryService");
const SendPaymentReceipt = require("../../../utils/SendPaymentReceipt");

class WebHookStripe {
  static #cache = require(`../../../cache/cacheData`);
  static async webWhook(req, res) {
    const typeNotification = req.body.type;

    if (typeNotification === `charge.succeeded`) {
      const user = WebHookStripe.#cache.get(`user`);
      
      if (user) {
        const { email, ID } = user;

        await PaymentHistoryService.historyPayment(ID);

        const charge = req.body.data.object;

        await SendPaymentReceipt.sendPaymentReceipt(charge.receipt_url, email);
        await PaymentHistoryService.contentPay(ID)
        await PaymentHistoryService.updateUSERtable(ID)
        res.status(201)
      }
    }
  }
}

module.exports = WebHookStripe