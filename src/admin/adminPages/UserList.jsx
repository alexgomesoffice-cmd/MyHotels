import React, { useEffect, useState } from "react";
import { fetchAllUsers, toggleUserStatus, deleteUser } from "../../data/api";

const roleMap = {
  1: "Admin",
  2: "User",
  3: "Manager",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("FAILED TO LOAD USERS:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (user) => {
    const isBlocked = Number(user.is_blocked) === 1;
    const newBlockedState = isBlocked ? 0 : 1;

    if (
      !window.confirm(
        `Are you sure you want to ${
          newBlockedState ? "block" : "unblock"
        } this user?`
      )
    ) {
      return;
    }

    try {
      await toggleUserStatus(user.user_id, newBlockedState);
      loadUsers();
    } catch (err) {
      console.error("FAILED TO UPDATE USER:", err);
      alert("Failed to update user status");
    }
  };

  const handleDelete = async (user) => {
    const roleType = roleMap[user.role_id] || "Unknown";
    
    const confirmMessage = user.role_id === 3 
      ? `Are you sure you want to delete this Manager? This will also delete all their hotels and rooms from the database.\n\nManager: ${user.name}`
      : `Are you sure you want to delete this ${roleType}?\n\nUser: ${user.name}`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteUser(user.user_id);
      alert("User deleted successfully");
      loadUsers();
    } catch (err) {
      console.error("FAILED TO DELETE USER:", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <p className="p-6">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isBlocked = Number(user.is_blocked) === 1;

              return (
                <tr key={user.user_id} className="border-t">
                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">{user.email}</td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {roleMap[user.role_id] || "Unknown"}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        isBlocked ? "bg-red-600" : "bg-green-600"
                      }`}
                    >
                      {isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleToggle(user)}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="px-3 py-1 rounded text-white text-sm bg-gray-700 hover:bg-gray-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
