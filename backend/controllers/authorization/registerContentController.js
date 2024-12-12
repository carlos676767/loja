import sql from "../../db/database.js";

 export default class RegisterContentController {
  static sqlLite =sql
  static async router(req, res){
    try {
      const {conteudo, preco_conteudo} = req.body
      
      const file = req.file.originalname
      

      RegisterContentController.validacoes(conteudo, file)
      await RegisterContentController.dbExecDados(file, conteudo, res,preco_conteudo)
    } catch (error) {
      
      res.status(400).send({msg: error.message})
    }
  }


  static getDate(){
    const agora = new Date()
    return `${agora.getMonth() + 1}/${agora.getDate()}/${agora.getFullYear()}`
  }



  static validacoes(conteudo, file){
    if (!conteudo) {
      throw new Error(`please send the content`)
    }


    if (typeof conteudo != `string`) {
      throw new Error("O conteúdo enviado está inválido. Por favor, envie um texto válido.");
    }


    if (!file) {
      throw new Error("No file uploaded.");
    }


    const sizeLimitCaracter = 20
    if (conteudo.length < sizeLimitCaracter) {
      throw new Error(`content must be longer than 20 characters`)
    }


  }


  static async dbExecDados(imgname, conteudo, res, PRECO_CONTEUDO){
    const db = await this.sqlLite.db()
    try {
      await db.exec(`BEGIN TRANSACTION`)
      const query = `INSERT INTO CONTEUDO(DATACONTEUDO, NOME_IMG, CONTEUDO, PRECO_CONTEUDO) VALUES(?, ?, ?, ?)`

      await db.run(query, [this.getDate(), imgname, conteudo, PRECO_CONTEUDO])

      await db.exec(`COMMIT`)

      res.status(201).send({msg: `content successfully registered`})
    } catch (error) {

      await db.exec(`ROLLBACK`)
      throw new Error("An error occurred while registering content, please try again.");
    }finally{
      await db.close()
    }
  }
}

