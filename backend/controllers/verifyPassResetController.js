class verifyPassResetController {
  "use strict"
  static jwt = require(`jsonwebtoken`);
  static Email = require("../utils/email/email");
  static Sql = require("../db/database");
  static async router(req, res) {
    try {
      const { email } = req.body;

      
      await verifyPassResetController.verifyEmail(email);
      await verifyPassResetController.setSendResetPass(email,res)
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }

  static async verifyEmail(email) {
    const db = await this.Sql.db();
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

  static async setSendResetPass(email, res) {
    const token = this.jwt.sign({ email }, process.env.SECRET_KEY_JWT, {
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
      await this.Email.sendEmail(content, email,  titleEmail)

      res.status(200).send({msg: `has been sent to your email to change your password, you only have 5 minutes to change your password`})
  }
} 


module.exports = verifyPassResetController
