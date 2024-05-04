// User.js

import { useState, useEffect } from "react";
import axios from "axios";
import formatDate from "../features/formatDate";
const API_URL = import.meta.env.VITE_API_URL;

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users data from backend API
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/schools`, {
          withCredentials: true, // Send cookies along with the request
        });
        setUsers(response.data.users);
        console.log(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold mb-2 text-center">All Users</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
