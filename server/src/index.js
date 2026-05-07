require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { connectToMongo } = require("./db");
const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/user.routes");
const chiTieuRoutes = require("./routes/chiTieu.routes");
const lichSuRoutes = require("./routes/lichSuChiTieu.routes");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api", chiTieuRoutes);
app.use("/api", lichSuRoutes);

app.use(notFound);
app.use(errorHandler);

async function main() {
  await connectToMongo();
  const port = Number(process.env.PORT || 8081);
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on http://localhost:${port}`);
  });
  server.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error(`[server] listen error: ${err.code || err.message}`);
    process.exit(1);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

