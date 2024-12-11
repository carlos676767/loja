
import stripe from "stripe"
 export default class StripeApi {
  "use strict";
  static #stripeApi = stripe(`sk_test_51QPs1QBSDNyGjeuCk6d2qWug8e0wzorZ8euKtc76mWtjX2FgKrMOyMptQ6hB6SFQXUTZiP7rpbKjdLY1GGuJQxjM00M4JjCJCr`);
  static #informacoesPagamento(valor, itens) {
    const valorParaMultiplicarEmCentavos = 100;
    const valorEmCentavos = valor * valorParaMultiplicarEmCentavos;
    const price_data = {
      price_data: {
        currency: "brl",
        product_data: { name: `${itens}` },
        unit_amount: valorEmCentavos,
      },
      quantity: 1,
    };

    
    return price_data;
  }

  static configsRedirecionamentoEpagamneto() {
    return {
      mode: "payment",
      success_url: "https://www.exemplo.com",
      cancel_url: "https://www.exemplo.com",
    };
  }

  static async gerarPagamento(valor, itens) {
    try {

      const { url } = await StripeApi.#stripeApi.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [this.#informacoesPagamento(valor, itens)],
        ...this.configsRedirecionamentoEpagamneto(),
      });

      return { url };
    } catch (error) {
     
      
      throw new Error("error ao criar pagamento.");
    }
  }
}



