import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { initDB } from "./db.js";
import createTables from "./setupTables.js";
import searchRoutes from "./routes/search.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./users/user.routes.js";
import authRoutes from "./auth/auth.routes.js";
import managerRoutes from "./manager/manager.routes.js";
import hotelTypeRoutes from "./hotelType/hotelType.routes.js";
import roomTypeRoutes  from "./roomType/roomType.routes.js";
import adminRoutes from "./admin/admin.routes.js";
//import bookingRoutes from "./bookings/booking.routes.js";
import hotelImageRoutes from "./routes/hotelImage.routes.js";


dotenv.config();

const app = express();


// MIDDLEWARE

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ROUTES 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/hotel-types", hotelTypeRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/hotel-images", hotelImageRoutes);


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
