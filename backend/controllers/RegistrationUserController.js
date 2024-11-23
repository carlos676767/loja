class RegistrationUserController {
  "use strict"
  static cache = require(`../cache/cacheData`);
  static Sql = require("../db/database")
  static jwt = require(`jsonwebtoken`)
  static async router(req, res) {
    try {
        const {codigo} = req.body
        RegistrationUserController.verifyCode(codigo)

        const {code, senha,  email} = RegistrationUserController.verifyCache()

        const codeConfirm = RegistrationUserController.verifyCodeInConfirm(codigo, code)

        if (codeConfirm) {
        return  await RegistrationUserController.insertUser(email, senha, res)
        
        }

    } catch (error) {
        res.status(400).send({err: error.message})
    }
  }

  static verifyCode(codigo){
    if (!codigo) {
        throw new Error("enter the code");
    }

    return true
  }


  static verifyCache() {
    const getUser = this.cache.get(`dadosUser`);

    if (getUser == undefined) {
      throw new Error("The time to check your email has passed, make a new request or enter an invalid code, check and try again" );
    }

    const { email, senha, code } = getUser
    console.log(code);
    
    return {email,senha, code}
  }


  static verifyCodeInConfirm(codigoUserBody, codeInCache){
    if (codigoUserBody != codeInCache) {
        throw new Error("the code provided is not the same in our database");
    }

    return true
  }

  static async insertUser(email, senha, res){
    const db = await this.Sql.db()
    try {
         await db.exec(`BEGIN TRANSACTION`)

         const {lastID} =  await db.run(`INSERT INTO USER(email, senha) VALUES(?, ?)`, [email,senha])

         await db.exec(`COMMIT`)

         res.status(200).send({jwt: this.tokenJwt(lastID), register: true})

    } catch (error) {
        await db.exec(`ROLLBACK`)
        throw new Error(error.message);
    }finally{
        await db.close()
    }
  } 

  static tokenJwt(id){
    const config = {
        id
    }

    return this.jwt.sign(config, process.env.SECRET_KEY_JWT, {expiresIn: `2h`})
  }
} 

module.exports = RegistrationUserController;
