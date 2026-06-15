import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

// Import routes
import movieRoutes from "./routes/movieRoutes.js"; // must add .js to end b/c is a file, not a package
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

// Load env vars
config();
connectDB();

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for html form submissions

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

const PORT = process.env.PORT || 5001;
// the 0.0.0.0 part tells Node to listen to traffic from network interface, not just from our computer (locally via localhost), like load balancers, our domains, actual users, public IPs, private IPs, localhost, etc., which is what is used in development, so this part is for deployment purposes
const server = app.listen(PORT, "0.0.0.0", () => { // Note the instance of the server (`const server`) that must be created so that 
  // the subsequent listeners that are listening for certain events can actually perform the `server.close()` part
  console.log(`Server running on PORT ${PORT}`);
});

// Three cases when you want to disconnect from db to prevent memory leaks: (always have this to handle errors/situations that may break this API)
// 1. Handle unhandled promise rejections (e.g., database connection errors)
// Listens for "unhandledRejection" events and on that happening (any unhandled promise errorsin our app), catches that error and closes server and disconnects from db.
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// 2. Do this for uncaught exceptions too
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// 3. Graceful shutdown on app shut down on production
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

// API Parts (Routes):
// AUTH - signin, signup
// MOVIE - Getting all movies, etc.
// USER - Profile
// WATCHLIST - Add, delete, etc.