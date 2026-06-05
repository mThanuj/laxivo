import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env.local file");
}

type CachedConnection = {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongooseCache || {
    connection: null,
    promise: null,
};

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectDb() {
    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI as string, {
            bufferCommands: false,
        });
    }

    cached.connection = await cached.promise;

    return cached.connection;
}
