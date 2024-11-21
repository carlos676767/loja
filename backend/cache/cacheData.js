class Cache {
  static cache = require(`node-cache`);
  static CacheData() {
    return new this.cache();
  }
}

module.exports = Cache.CacheData()
