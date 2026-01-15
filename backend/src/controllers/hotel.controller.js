import {
  getAllApprovedHotels,
  getHotelById,
  createHotel,
  approveHotel,
  getPendingHotels,
  getHotelsByManager,
} from "../models/hotel.model.js";

/* ================= PUBLIC ================= */
export const fetchHotels = async (req, res) => {
  try {
    const hotels = await getAllApprovedHotels();
    res.json(hotels);
  } catch (error) {
    console.error("FETCH HOTELS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch hotels",
    });
  }
};

export const fetchHotelById = async (req, res) => {
  try {
    const hotel = await getHotelById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    console.error("FETCH HOTEL ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch hotel",
    });
  }
};

/* ================= HOTEL MANAGER ================= */
export const addHotel = async (req, res) => {
  try {
    const hotelId = await createHotel(req.body);
    res.status(201).json({
      message: "Hotel added successfully. Waiting for admin approval.",
      hotel_id: hotelId,
    });
  } catch (error) {
    console.error("ADD HOTEL ERROR:", error);
    res.status(500).json({
      message: "Failed to add hotel",
    });
  }
};

/* ================= ADMIN ================= */
export const adminApproveHotel = async (req, res) => {
  const { hotel_id, approval_status, admin_id } = req.body;

  if (!hotel_id || !approval_status || !admin_id) {
    return res.status(400).json({
      message: "hotel_id, approval_status, admin_id are required",
    });
  }

  try {
    const updated = await approveHotel({
      hotel_id,
      approval_status,
      admin_id,
    });

    if (!updated) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json({
      message: `Hotel ${approval_status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("APPROVE HOTEL ERROR:", error);
    res.status(500).json({
      message: "Failed to update hotel",
    });
  }
};

export const fetchPendingHotels = async (req, res) => {
  try {
    const hotels = await getPendingHotels();
    res.json(hotels);
  } catch (error) {
    console.error("FETCH PENDING HOTELS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch pending hotels",
    });
  }
};

export const fetchMyHotels = async (req, res) => {
  try {
    const hotels = await getHotelsByManager(req.user.user_id);
    res.json(hotels);
  } catch (error) {
    console.error("FETCH MY HOTELS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch hotels",
    });
  }
};
