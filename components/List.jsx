'use client';

import React, { useState, useEffect } from 'react';

const JsonBinComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [order, setOrder] = useState('');

  const BIN_ID = '67175be0acd3cb34a89b03d6';
  const API_KEY = '$2a$10$dhDGoYephc6t09M.V6/9gek5W.YLXLVbEejVGieyKqUmelttmPVCe';
  const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  // Get the current date in YYYY-MM-DD format
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // Fetch the current data from the bin
  const fetchData = async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
          'X-Master-Key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const fetchedData = result.record;

      // Check if we need to reset the orders based on the date
      if (fetchedData.dateReset !== getCurrentDate()) {
        // Reset all users' orders to "No orders"
        const resetUsers = fetchedData.users.map((user) => ({
          ...user,
          order: 'No orders',
        }));

        // Update the dateReset to today's date
        const updatedData = {
          ...fetchedData,
          users: resetUsers,
          dateReset: getCurrentDate(),
        };

        // Save the reset data to JSONBin
        await updateBin(updatedData);

        // Set the state with the reset data
        setData(updatedData);
      } else {
        setData(fetchedData); // Set the fetched data if no reset is needed
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the bin with new or updated data
  const updateBin = async (updatedData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
      const result = await response.json();
      setData(result.record); // Update local state with the new data
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle form submission to add or update a user
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, order };

    // Check if the user already exists
    const existingUserIndex = data.users.findIndex((user) => user.name === name);

    let updatedUsers;
    if (existingUserIndex !== -1) {
      // Replace the order of the existing user
      updatedUsers = data.users.map((user, index) =>
        index === existingUserIndex ? { ...user, order } : user
      );
    } else {
      // Add the new user
      updatedUsers = [...data.users, newUser];
    }

    // Update the bin with the new or updated users list
    const updatedData = {
      ...data,
      users: updatedUsers,
    };

    updateBin(updatedData);
    setName('');
    setOrder('');
  };

  useEffect(() => {
    fetchData(); // Load data on component mount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md mt-10 border border-gray-300">
      <h1 className="text-center text-xl font-bold mb-4">Store Receipt</h1>
      <div className="receipt bg-gray-100 p-4 rounded">
        <p className="text-center text-sm text-gray-500 mb-4">Date: {new Date().toLocaleDateString()}</p>

        {/* Display list of users as receipt items */}
        <ul className="divide-y divide-gray-300">
          {data.users && data.users.length > 0 ? (
            data.users.map((user, index) => (
              <li key={index} className="flex justify-between py-2 text-sm font-mono">
                <span>{user.name}</span>
                <span className="text-right">{user.order}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No users found.</p>
          )}
        </ul>

        {/* Total Section */}
        <div className="mt-4 border-t border-gray-300 pt-4">
          <p className="flex justify-between text-sm font-bold font-mono">
            <span>Total Items</span>
            <span>{data.users ? data.users.length : 0}</span>
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold mt-6 mb-4 text-center">Add a New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Order</label>
          <input
            type="text"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded px-4 py-2 font-bold hover:bg-blue-600 focus:outline-none"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default JsonBinComponent;
