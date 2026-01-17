import React, { useEffect, useState } from "react";
import { fetchAllUsers, toggleUserStatus } from "../../data/api";

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
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isBlocked = Number(user.is_blocked) === 1;

              return (
                <tr key={user.user_id} className="border-t">
                  <td className="p-3">
                    {/* {user.first_name} {user.last_name} */}
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

                  <td className="p-3">
                    <button
                      onClick={() => handleToggle(user)}
                      className={`px-3 py-1 rounded text-white ${
                        isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isBlocked ? "Unblock" : "Block"}
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
