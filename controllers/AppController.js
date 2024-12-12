import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Checks the health status of the application (Redis and database).
   * 
   * @param {Object} request - The Express request object.
   * @param {Object} response - The Express response object.
   */
  static getStatus(request, response) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(status);
  }

  /**
   * Retrieves the number of users and files stored in the database.
   * 
   * @param {Object} request - The Express request object.
   * @param {Object} response - The Express response object.
   */
  static async getStats(request, response) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    response.status(200).send(stats);
  }
}

export default AppController;
