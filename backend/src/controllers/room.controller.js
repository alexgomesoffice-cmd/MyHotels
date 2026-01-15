import {
  createRoom,
  approveRoom,
  getApprovedRoomsByHotel,
} from "../models/room.model.js";

/**
 * HOTEL MANAGER
 * Add room
 */
export const addRoom = async (req, res) => {
  try {
    const {
      hotel_id,
      hotel_room_type_id,
      room_number,
      price,
    } = req.body;

    const created_by_user_id = req.user?.user_id;

    if (
      !hotel_id ||
      !hotel_room_type_id ||
      !room_number ||
      !price
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!created_by_user_id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const roomId = await createRoom({
      hotel_id,
      hotel_room_type_id,
      room_number,
      price,
      created_by_user_id,
    });

    res.status(201).json({
      message: "Room added successfully (pending admin approval)",
      room_id: roomId,
    });
  } catch (error) {
    console.error("ADD ROOM ERROR:", error);
    res.status(500).json({
      message: "Failed to add room",
    });
  }
};

/**
 * ADMIN
 * Approve / reject room
 */
export const adminApproveRoom = async (req, res) => {
  try {
    const { hotel_room_details_id, approval_status } = req.body;
    const admin_id = req.user?.user_id;

    if (!hotel_room_details_id || !approval_status) {
      return res.status(400).json({
        message: "hotel_room_details_id and approval_status are required",
      });
    }

    if (!["APPROVED", "REJECTED"].includes(approval_status)) {
      return res.status(400).json({
        message: "approval_status must be APPROVED or REJECTED",
      });
    }

    if (!admin_id) {
      return res.status(401).json({
        message: "Unauthorized",
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
    });
  }
};

/**
 * PUBLIC
 * Fetch approved rooms by hotel
 */
export const fetchApprovedRoomsByHotel = async (req, res) => {
  try {
    const { hotel_id } = req.params;

    if (!hotel_id) {
      return res.status(400).json({
        message: "hotel_id is required",
      });
    }

    const rooms = await getApprovedRoomsByHotel(hotel_id);
    res.json(rooms);
  } catch (error) {
    console.error("FETCH ROOMS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
};
