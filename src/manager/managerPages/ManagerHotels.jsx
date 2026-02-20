import React, { useEffect, useState } from "react";
import api from "../../data/api";

const ManagerHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelTypes, setHotelTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    hotel_type_id: "",
  });

  // REQUIRED: image state
  const [images, setImages] = useState([]);

  const ADDRESS_OPTIONS = [
    "Dhaka",
    "Chittagong",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rajshahi",
    "Rangpur",
  ];

  useEffect(() => {
    fetchHotels();
    fetchHotelTypes();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await api.get("/manager/hotels");
      setHotels(res.data);
    } catch {
      setError("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelTypes = async () => {
    try {
      const res = await api.get("/hotel-types");
      setHotelTypes(res.data);
    } catch {
      setError("Failed to load hotel types");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  REQUIRED: image handler
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // REQUIRED: FormData for file upload
      const formPayload = new FormData();

      formPayload.append("name", formData.name);
      formPayload.append("address", formData.address);
      formPayload.append("description", formData.description);
      formPayload.append(
        "hotel_type_id",
        Number(formData.hotel_type_id)
      );

      // attach images
      for (let i = 0; i < images.length; i++) {
        formPayload.append("images", images[i]);
      }

      await api.post("/manager/hotels", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        name: "",
        address: "",
        description: "",
        hotel_type_id: "",
      });

      setImages([]);
      fetchHotels();
    } catch (err) {
  console.error(err);
  setError(
    err.response?.data?.message ||
    "Failed to create hotel"
  );
}
  };

  if (loading) {
    return <p className="text-center mt-10">Loading hotels...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Hotels</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* CREATE HOTEL */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-4"
      >
        <h2 className="font-semibold">Add New Hotel</h2>

        <input
          type="text"
          name="name"
          placeholder="Hotel Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        {/* HOTEL LOCATION */}
        <select
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Location</option>
          {ADDRESS_OPTIONS.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* HOTEL TYPE */}
        <select
          name="hotel_type_id"
          value={formData.hotel_type_id}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Hotel Type</option>
          {hotelTypes.map((type) => (
            <option
              key={type.hotel_type_id}
              value={type.hotel_type_id}
            >
              {type.name}
            </option>
          ))}
        </select>

        {/* HOTEL DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Hotel Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />

        {/* REQUIRED: HOTEL IMAGES */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border px-3 py-2 rounded"
        />

        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Submit for Approval
        </button>
      </form>

      {/* HOTEL LIST */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Address</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => {
              const statusColor = 
                hotel.approval_status === "APPROVED" 
                  ? "bg-green-100 text-green-700" 
                  : hotel.approval_status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";

              return (
                <tr key={hotel.hotel_id} className="border-t">
                  <td className="p-3">{hotel.name}</td>
                  <td className="p-3">{hotel.address}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded font-semibold ${statusColor}`}>
                      {hotel.approval_status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(hotel.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {hotels.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No hotels added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagerHotels;
