import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for interacting with a MongoDB service.
 */
class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        // console.log('Connected successfully to server');
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.log(err.message);
        this.db = false; 
      }
    });
  }

  /**
   * Checks if the connection to the MongoDB server is alive.
   * 
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Retrieves the count of documents within the 'users' collection.
   * 
   * @returns {Promise<number>} A Promise that resolves to the number of documents.
   */
  async nbUsers() {
    const numberOfUsers = await this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  /**
   * Retrieves the count of documents within the 'files' collection.
   * 
   * @returns {Promise<number>} A Promise that resolves to the number of documents.
   */
  async nbFiles() {
    const numberOfFiles = await this.filesCollection.countDocuments();
    return numberOfFiles;
  }
}

const dbClient = new DBClient();

export default dbClient;
