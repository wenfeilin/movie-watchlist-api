import { PrismaClient } from "@prisma/client";

// Configures connection to db

// For auto-completion of stuff like type definitions by using prisma client
const prisma = new PrismaClient({
  log: // for logging
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"] // if in development, then want to see queries, errors, warnings
      : ["error"], // if not in development (in production), then just want to see errors
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB Connected via Prisma");
  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    // Exit (for when running locally); stops Node.js app
    process.exit(1);
  }
}

const disconnectDB = async () => {
  await prisma.$disconnect();
}

export { prisma, connectDB, disconnectDB };
