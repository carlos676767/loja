const { default: axios } = require("axios")
class WebHookMercadoPago {
  static async routerWebHookMp(req, res) {

    const idPay = req.body.id

    const verifyPayMent = await axios(`https://api.mercadopago.com/v1/payments/${idPay}`)

    const {status} = verifyPayMent.data
    console.log(status);

  }
}

module.exports = WebHookMercadoPago