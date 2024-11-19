class Sql {
	static sqlLite = require("sqlite");
	static async connectDb() {
		return await Sql.sqlLite.open({
			driver: Sql.sqlLite.Database,
			filename: "./database.db",
		});
	}
}

module.exports = Sql;
