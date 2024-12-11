 import * as sqlite from "sqlite";
 import sql3 from "sqlite3";
 export default class Sql {
  static sqlLite = sqlite
  static sql3 = sql3.verbose()
  static async db() {
    return await Sql.sqlLite.open({
      filename: "C://Users//Administrator//Desktop//loja//backend//db//databaseUsers.db",
      driver: this.sql3.Database,
    });
  }
}


