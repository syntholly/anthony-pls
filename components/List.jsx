'use client';

import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

const JsonBinComponent = () => {
  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getReceiptNumber = () =>
    `R${getCurrentDate().replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [order, setOrder] = useState('');
  const [today] = useState(getCurrentDate());
  const [suggestions, setSuggestions] = useState([]);
  const [ordersClosed, setOrdersClosed] = useState(false); // State to track if orders are closed

  const BIN_ID = '67175be0acd3cb34a89b03d6';
  const API_KEY = '$2a$10$dhDGoYephc6t09M.V6/9gek5W.YLXLVbEejVGieyKqUmelttmPVCe';
  const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

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

      if (fetchedData.dateReset !== getCurrentDate()) {
        const resetUsers = fetchedData.users.map((user) => ({
          ...user,
          order: 'No Order',
        }));

        const updatedData = {
          ...fetchedData,
          users: resetUsers,
          dateReset: getCurrentDate(),
        };

        await updateBin(updatedData);
        setData(updatedData);
      } else {
        setData(fetchedData);
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
      setData(result.record); // Update state with the new data
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle form submission to add or update a user
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, order, date: getCurrentDate() };

    const existingUserIndex = data.users.findIndex((user) => user.name === name);

    let updatedUsers;
    if (existingUserIndex !== -1) {
      updatedUsers = data.users.map((user, index) =>
        index === existingUserIndex ? { ...user, order, date: getCurrentDate() } : user
      );
    } else {
      updatedUsers = [...data.users, newUser];
    }

    const updatedData = {
      ...data,
      users: updatedUsers,
    };

    updateBin(updatedData); // Update data on JSONBin
    setName('');
    setOrder('');
  };

  // Initialize Fuse.js for fuzzy searching
  const fuse = new Fuse(data?.users || [], {
    keys: ['name'],
    threshold: 0.3, // 0.3 is the fuzzy search threshold, lower means more exact
  });

  // Handle name input change and filter suggestions
  const handleNameChange = (e) => {
    const input = e.target.value;
    setName(input);

    // Perform the fuzzy search if input is not empty
    if (input) {
      const result = fuse.search(input).map((result) => result.item.name);
      setSuggestions(result);
    } else {
      setSuggestions([]);
    }
  };

  // Handle selection of a suggestion from the dropdown
  const handleSuggestionClick = (suggestion) => {
    setName(suggestion);
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle the "Close Orders" button click
  const handleCloseOrders = async () => {
    const updatedUsers = data.users.map((user) =>
      user.date === today ? { ...user, order: user.order } : user // Mark orders made today
    );

    const updatedData = {
      ...data,
      users: updatedUsers,
    };

    setOrdersClosed(true); // Set orders to closed state
    await updateBin(updatedData); // Push updated data to JSONBin
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md mt-10 border border-gray-300 font-mono" style={{
      backgroundImage: "url('/crumple.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <h1 className="text-center text-xl font-bold mb-4 opacity-50">Store Receipt</h1>
      <p className="text-center text-sm text-gray-500">Cashier: Anthony Tsang</p>
      <p className="text-center text-sm text-gray-500 mb-4">Receipt No: {getReceiptNumber()}</p>
      <div className="receipt bg-gray-100 p-4 rounded opacity-50">
        <p className="text-center text-sm text-gray-500 mb-4">Date: {new Date().toLocaleDateString()}</p>

        <ul className="divide-y divide-gray-300">
          {data.users && data.users.length > 0 ? (
            data.users.map((user, index) => (
              <li
                key={index}
                className={`flex justify-between py-2 text-sm ${user.date === today && ordersClosed ? 'bg-green-100' : ''}`}
              >
                <span>{user.name}</span>
                <span className="text-right">{user.order}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No users found.</p>
          )}
        </ul>

        <div className="mt-4 border-t border-gray-300 pt-4">
          <p className="flex justify-between text-sm font-bold">
            <span>Total Items</span>
            <span>{data.users ? data.users.length : 0}</span>
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold mt-6 mb-2 text-center opacity-50">Update Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Display suggestions */}
          {suggestions.length > 0 && (
            <ul
              className="mt-2 border border-gray-300 rounded p-2 bg-white absolute z-10 max-h-40 overflow-auto shadow-lg w-full max-w-sm"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer py-1 px-2 hover:bg-gray-200 max-w-sm"
                  onClick={() => handleSuggestionClick(suggestion)} // Close dropdown on click
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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
          className="w-full bg-orange-500 text-white rounded px-4 py-2 font-bold hover:bg-orange-600 focus:outline-none"
          disabled={ordersClosed} // Disable if orders are closed
        >
          Add Item
        </button>
      </form>

      {/* <button
        onClick={handleCloseOrders}
        className="w-full bg-blue-500 text-white rounded px-4 py-2 font-bold hover:bg-blue-600 focus:outline-none mt-4"
        disabled={ordersClosed} // Disable if orders are already closed
      >
        Close Orders
      </button> */}
    </div>
  );
};

export default JsonBinComponent;
