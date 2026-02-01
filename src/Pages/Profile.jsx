import React, { useEffect, useState } from "react";
import { fetchMyProfile, updateMyProfile } from "../data/api";
import Navbar from "../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ===============================
  // Navigation
  // ===============================
  const goToBookingHistory = () => {
    navigate("/booking-history");
  };

  // ===============================
  // Load profile from backend
  // ===============================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyProfile();

        setFormData({
          name: data?.name ?? "",
          email: data?.email ?? "",
          phone: data?.phone ?? "",
          address: data?.address ?? "",
          gender: data?.gender ?? "",
          dob: data?.dob ? data.dob.split("T")[0] : "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ===============================
  // Handle input change
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Save profile changes
  // ===============================
  const handleSave = async () => {
    try {
      setMessage("");

      await updateMyProfile({
        name: formData.name,
        phone: formData.phone || null,
        dob: formData.dob || null,
        gender: formData.gender || null,
        address: formData.address || null,
      });

      setMessage("Profile updated successfully");

      // Sync navbar name instantly
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            name: formData.name,
          })
        );
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      setMessage("Failed to update profile");
    }
  };

  // ===============================
  // Loading state
  // ===============================
  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading profile...
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>

          {message && (
            <p className="mb-4 text-green-600">{message}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            {/* Email  */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={formData.email}
                disabled
                className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 0123...."
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                rows="3"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>

            <button
              onClick={goToBookingHistory}
              className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md border hover:bg-gray-200"
            >
              Booking History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
