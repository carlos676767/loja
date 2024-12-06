class SendPaymentReceipt {
  static emailService = require("./email/email");

  static async sendPaymentReceipt(charge, email) {
    const configs = {
      title: `🧾 Comprovante de Pagamento`,
      content: `🔍 Para visualizar o comprovante da Stripe, clique no link abaixo:  
      👉 [Ver comprovante](${charge})`,

      eu: process.env.EMAIL_YAHOO,
      emailUser: email,
    };

    const { eu, emailUser, title, content } = configs;
    await this.emailService.sendEmail(eu, emailUser, title, content);
  }
}

module.exports = SendPaymentReceipt;
