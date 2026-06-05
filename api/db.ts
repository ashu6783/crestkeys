import dns from "node:dns";
import mongoose from "mongoose";

// Helps some Windows + Node DNS setups; SRV still fails on many networks — use a standard MONGO_URI.
dns.setDefaultResultOrder("ipv4first");

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  if (mongoURI.startsWith("mongodb+srv://")) {
    console.warn(
      "Tip: mongodb+srv uses SRV DNS. If you see querySrv ECONNREFUSED, switch to the",
      "Standard connection string from MongoDB Atlas (mongodb://... with shard hosts)."
    );
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("MongoDB connection failed:", message);

    if (message.includes("querySrv") || message.includes("ECONNREFUSED")) {
      console.error(
        "\nFix: In Atlas → Connect → Drivers → copy the *Standard* connection string",
        "(mongodb://..., not mongodb+srv://) into api/.env as MONGO_URI.\n"
      );
    }

    process.exit(1);
  }
};

export default connectDB;
