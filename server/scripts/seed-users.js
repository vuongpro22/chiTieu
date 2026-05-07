require("dotenv").config();

const { connectToMongo } = require("../src/db");
const User = require("../src/models/User");

async function main() {
  await connectToMongo();

  const users = [
    { id: 1, fullname: "Vương", username: "vuong", pass: "vuong123" },
    { id: 2, fullname: "Quân", username: "quan", pass: "quan123" },
    { id: 3, fullname: "Cường", username: "cuong", pass: "cuong123" }
  ];

  for (const u of users) {
    // eslint-disable-next-line no-await-in-loop
    await User.updateOne({ id: u.id }, { $set: u }, { upsert: true });
  }

  // eslint-disable-next-line no-console
  console.log("[seed] users upserted:", users.map((u) => u.username).join(", "));
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

