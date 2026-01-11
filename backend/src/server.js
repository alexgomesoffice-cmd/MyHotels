import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initDB } from "./db.js";
import createTables from "./setupTables.js";

import hotelRoutes from "./routes/hotel.routes.js";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./users/user.routes.js";
import authRoutes from "./auth/auth.routes.js";
import managerRoutes from "./manager/manager.routes.js";

dotenv.config();

const app = express();


// MIDDLEWARE

app.use(cors());
app.use(express.json());


// ROUTES 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/manager", managerRoutes);

// START SERVER
async function startServer() {
  try {
    console.log("Initializing DB...");
    await initDB();

    console.log("Creating tables...");
    await createTables();

    console.log("Starting server...");
    app.listen(process.env.PORT, () => {
      console.log(
        `Backend running on http://localhost:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
