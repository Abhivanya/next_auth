import mongoose, { Mongoose } from "mongoose";

interface MongosseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongosseCache | undefined;
}

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) throw new Error("Pleae Define Mongo Uri in Env");

export const connectDB = async () => {
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }

  if (global.mongooseCache.conn) return global.mongooseCache.conn;

  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }
  global.mongooseCache.conn = await global.mongooseCache.promise;

  return global.mongooseCache.conn;
};
