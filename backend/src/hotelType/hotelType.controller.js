import * as hotelTypeService from "./hotelType.service.js";

export const getHotelTypes = async (req, res) => {
  try {
    const types = await hotelTypeService.getHotelTypes();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
