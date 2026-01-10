import {
  getAllApprovedHotels,
  getHotelById,
  createHotel,
  approveHotel,
  getPendingHotels,
  getHotelsByManager 
} from "../models/hotel.model.js";


//FETCH ALL APPROVED HOTELS

export const fetchHotels = async (req, res) => {
  try {
    const hotels = await getAllApprovedHotels();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//FETCH SINGLE HOTEL
export const fetchHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await getHotelById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//ADD HOTEL (HOTEL MANAGER)

export const addHotel = async (req, res) => {
  console.log("REQUEST BODY:", req.body);

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
      error: error.message,
    });
  }
};


//ADMIN APPROVE / REJECT
export const adminApproveHotel = async (req, res) => {
  try {
    const { hotel_id, approval_status, admin_id } = req.body;

    if (!hotel_id || !approval_status || !admin_id) {
      return res.status(400).json({
        message: "hotel_id, approval_status, admin_id are required",
      });
    }

    if (!["APPROVED", "REJECTED"].includes(approval_status)) {
      return res.status(400).json({
        message: "approval_status must be APPROVED or REJECTED",
      });
    }

    const updated = await approveHotel({
      hotel_id,
      approval_status,
      admin_id,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json({
      message: `Hotel ${approval_status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("ADMIN APPROVAL ERROR:", error);
    res.status(500).json({
      message: "Failed to update approval status",
      error: error.message,
    });
  }
};


// ADMIN > VIEW PENDING HOTELS

export const fetchPendingHotels = async (req, res) => {
  try {
    const hotels = await getPendingHotels();
    res.json(hotels);
  } catch (error) {
    console.error("FETCH PENDING HOTELS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch pending hotels",
      error: error.message,
    });
  }
};

// HOTEL MANAGER > VIEW OWN HOTELS

export const fetchMyHotels = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "user_id is required",
      });
    }

    const hotels = await getHotelsByManager(user_id);
    res.json(hotels);
  } catch (error) {
    console.error("FETCH MY HOTELS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch hotels",
      error: error.message,
    });
  }
};
