"use strict"

import Sql from "../db/database.js";
import jwt from "jsonwebtoken";
import Email from "../utils/email/email.js";
class VerifyEmail {
  static async verifyEmail(email) {
    const db = await Sql.db();
    try {
      const query = `SELECT * FROM USER WHERE email = ?`;
      const emailExist = await db.get(query, [email]);
      
      if (!emailExist) {
        throw new Error("The email address provided does not exist in our database, please check if you have entered the correct email address");
      }

    } catch (error) {
      throw new Error(
        "Error when checking whether the email exists in any database, try again later"
      );
    } finally {
      await db.close();
    }
  }
}


class EmailSendRequest {

  static async setSendResetPass(email, res) {
    const token = jwt.sign({ email }, process.env.SECRET_KEY_JWT, {
      expiresIn: `5m`,
    });

    const config = {
        titleEmail: `🔐 **Clique no link abaixo para trocar sua senha`,

        content:  ` 🔐 **Clique no link abaixo para trocar sua senha:**
        👉 [http://localhost:8080/resetPass.html?token=${token}](#)

        💻 Lembre-se de escolher uma senha forte e segura!

        Se você não fez essa solicitação, por favor, ignore este e-mail. ⚠️`
      }

      
      const {content, titleEmail} = config
      await Email.sendEmail(content, email,  titleEmail)
      res.status(200).send({msg: `has been sent to your email to change your password, you only have 5 minutes to change your password`})
  }
}


 export default class verifyPassResetController {
  static async router(req, res) {
    try {
      const { email } = req.body;
      await VerifyEmail.verifyEmail(email);
      await EmailSendRequest.setSendResetPass(email,res)
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }
} 



