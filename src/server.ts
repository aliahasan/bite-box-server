import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("✅ Connected to MongoDB");
    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the application", error);
    process.exit(1);
  }
}
main();

process.on("unhandledRejection", (error) => {
  console.log(`😈 unhandled Rejection is detected , shutting down ...`, error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log(`😈 uncaught Exception is detected , shutting down ...`, error);
  process.exit(1);
});
