import cache from "node-cache";
class Cache {
  static CacheData() {
    return new cache();
  }
}

export default Cache.CacheData();
