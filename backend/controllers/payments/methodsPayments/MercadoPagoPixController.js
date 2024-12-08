const { MercadoPagoConfig, Payment } = require("mercadopago");

class MercadoPagoPixController {
  "use strict";
  static payment() {
    console.log(process.env.SECRET_KEY_MERCADO_PAGO);
    
    const client = new MercadoPagoConfig({
      accessToken: process.env.SECRET_KEY_MERCADO_PAGO,
      timeout: 5000,
    });
    
    return new Payment(client);
  }

  static objectWithPaymentInformation(valorItem, nameItens) {
    if (!valorItem || typeof valorItem !== "number" || valorItem <= 0) {
      throw new Error("O valor do item (transaction_amount) é inválido.");
    }
     
    return {
      transaction_amount: valorItem,
      description: `${nameItens}`,
      payment_method_id: "pix",
      payer: {
        email: `ftftftftt@gmail.com`,
      },
    };
  }

  static async generatePayMent(valorItem, nameItens){
    try {
      const body = this.objectWithPaymentInformation((valorItem), nameItens)
      
      const pay = await MercadoPagoPixController.payment().create(body)

      const  {ticket_url,   qr_code_base64} = pay.point_of_interaction.transaction_data

      return {ticket_url, qr_code_base64}
    } catch (error) {
      throw new Error("error creating payment");
    }
  }
}

module.exports = MercadoPagoPixController;
