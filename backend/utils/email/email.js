
import emailMailer from "nodemailer";
 export default class email {
  static nodemailer = emailMailer
  static #configEmail() {
    const config = this.nodemailer.createTransport({
      service: "yahoo",
      auth: {
        user:process.env.EMAIL_YAHOO,
        pass: process.env.SENHA_APLICATIVO_YAHOO,
      },
    });
    return config;
  }

  static async sendEmail(text, emailUser, textTittle) {
    try {
      const email = this.#configEmail();
      return await email.sendMail({
        from: process.env.EMAIL_YAHOO,
        to: emailUser,
        subject: textTittle,
        text: text ,
      });
    } catch (error) {
      console.log(error);
      
      throw new Error(`error sending email`)
     
    }
  }

}

