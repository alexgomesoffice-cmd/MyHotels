import {
  createRoom,
  approveRoom,
  getApprovedRoomsByHotel,
} from "../models/room.model.js";


// ADD ROOM (Manager)
export const addRoom = async (req, res) => {
  try {
    console.log("ADD ROOM CONTROLLER HIT");

    const {
      hotel_id,
      hotel_room_type_id,
      room_number,
      price,
      created_by_user_id,
    } = req.body;

    if (
      !hotel_id ||
      !hotel_room_type_id ||
      !room_number ||
      !price ||
      !created_by_user_id
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const roomId = await createRoom({
      hotel_id,
      hotel_room_type_id,
      room_number,
      price,
      created_by_user_id,
    });

    res.json({
      message: "Room added successfully (PENDING approval)",
      room_id: roomId,
    });
  } catch (error) {
    console.error("ADD ROOM ERROR:", error);
    res.status(500).json({
      message: "Failed to add room",
      error: error.message,
    });
  }
};


// ADMIN APPROVE / REJECT ROOM

export const adminApproveRoom = async (req, res) => {
  try {
    console.log("ADMIN APPROVE ROOM CONTROLLER HIT");

    const { hotel_room_details_id, approval_status, admin_id } = req.body;

    if (!hotel_room_details_id || !approval_status || !admin_id) {
      return res.status(400).json({
        message:
          "hotel_room_details_id, approval_status, admin_id are required",
      });
    }

    if (!["APPROVED", "REJECTED"].includes(approval_status)) {
      return res.status(400).json({
        message: "approval_status must be APPROVED or REJECTED",
      });
    }

    const updated = await approveRoom({
      hotel_room_details_id,
      approval_status,
      admin_id,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json({
      message: `Room ${approval_status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("ROOM APPROVAL ERROR:", error);
    res.status(500).json({
      message: "Failed to update room approval",
      error: error.message,
    });
  }
};


// FETCH APPROVED ROOMS BY HOTEL (PUBLIC)
export const fetchApprovedRoomsByHotel = async (req, res) => {
  try {
    const { hotel_id } = req.params;

    const rooms = await getApprovedRoomsByHotel(hotel_id);

    res.json(rooms);
  } catch (error) {
    console.error("FETCH ROOMS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};
