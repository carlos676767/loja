class Sql {
  static sqlLite = require("sqlite");
  static sql3 = require(`sqlite3`).verbose();
  static async db() {
    return await Sql.sqlLite.open({
      filename: "C://Users//Administrator//Desktop//loja//backend//db//databaseUsers.db",
      driver: this.sql3.Database,
    });
  }
}

module.exports = Sql;
