#!/usr/bin/node

import redis from 'redis';
import { promisify } from 'util';

/**
 * This class provides methods for interacting with a Redis server.
 * It manages the connection state and offers asynchronous operations 
 * for getting, setting, and deleting key-value pairs.
 */
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.conn = false; 

    // Handle connection events
    this.client.on('error', (error) => {
      this.conn = false;
      console.log(`Redis client not connected to the server: ${error.message || error.toString()}`);
    });

    this.client.on('connect', () => {
      this.conn = true;
    });
  }

  /**
   * Checks if the Redis client is currently connected to the server.
   * 
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.conn;
  }

  /**
   * Asynchronously retrieves the value associated with the given key from Redis.
   * 
   * @param {string} key - The key of the value to retrieve.
   * @returns {Promise<string|null>} A Promise that resolves to the value associated 
   *                                with the key, or null if the key does not exist.
   */
  async get(key) {
    const asyncGet = promisify(this.client.GET).bind(this.client);
    const result = await asyncGet(key);
    return result;
  }

  /**
   * Asynchronously sets a key-value pair in Redis with an optional expiration time (TTL).
   * 
   * @param {string} key - The key of the element to set.
   * @param {string} value - The value to set for the key.
   * @param {number} duration - The TTL for the key in seconds (optional).
   */
  async set(key, value, duration) {
    const asyncSet = promisify(this.client.SET).bind(this.client);
    if (duration) {
      await asyncSet(key, value, 'EX', duration); 
    } else {
      await asyncSet(key, value);
    }
  }

  /**
   * Asynchronously deletes the key and its associated value from Redis.
   * 
   * @param {string} key - The key of the element to delete.
   */
  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    await asyncDel(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
