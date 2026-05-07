const mongoose = require("mongoose");

function redactMongoUri(uri) {
  if (!uri) return uri;
  // redact credentials if present: mongodb://user:pass@host/...
  return uri.replace(/\/\/([^:@/]+):([^@/]+)@/g, "//$1:***@");
}

async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000
  });

  // eslint-disable-next-line no-console
  console.log(`[mongo] connected: ${redactMongoUri(uri)}`);
}

module.exports = { connectToMongo };

