class DatabaseService {
  static database = require(`../db/database`);

  static async deleteUser(id) {
    const db = await DatabaseService.database.db();
    try {
      await db.exec(`BEGIN TRANSACTION`);

      const query = `DELETE FROM USER WHERE ID = ?`;

      const { changes } = await db.run(query, [id]);

      if (changes === 0) {
        throw new Error("id no exist user");
      }

      await db.exec(`COMMIT`);
    } catch (error) {
      await db.exec(`ROLLBACK`);
    }
  }
}


class ValideId {
  static valideId(id) {
    if (!id) {
      throw new Error("ID cannot be null or undefined.");
    }
  }
}


class DeleteUserController extends DatabaseService {
  static async router(req, res) {
    try {
      const userId = req.params.userId;
      ValideId.valideId(userId);
      await DeleteUserController.deleteUser(userId);
      res.status(200).send({ msg: `User delete sucess` });
    } catch (error) {
      res.status(401).send({ msg: error.message });
    }
  }
}


module.exports = DeleteUserController;