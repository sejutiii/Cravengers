'use client';
import Head from 'next/head';
import { useState } from 'react';

const hours = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

export default function RestaurantSignup() {
  const [form, setForm] = useState({
    ownerName: '',
    restaurantName: '',
    username: '',
    email: '',
    password: '',
    phoneNo: '',
    country: '',
    city: '',
    roadBlock: '',
    cuisineType: '',
    otherCuisine: '',
    openingHour: '',
    closingHour: ''
  });

  const cuisines = [
    "Bangladeshi",
    "Indian",
    "Chinese",
    "Italian",
    "Peshwari",
    "Thai",
    "American",
    "Mexican"
  ];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCuisineChange = e => {
    setForm({
      ...form,
      cuisineType: e.target.value,
      otherCuisine: e.target.value === "Other" ? form.otherCuisine : ""
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // No backend connection, just UI
  };

  return (
    <div className="bg-neutral min-h-screen">
      <Head>
        <title>Restaurant Sign Up - Food Delivery App</title>
        <meta name="description" content="Sign up your restaurant for Food Delivery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-primary text-white p-4 shadow">
        <a href='/homepage' className="container mx-auto flex items-center">
          <img src="/fast-delivery.png" alt="Cravengers" className="h-10" />
          <h1 className="text-2xl font-bold ml-2">Cravangers</h1>
        </a>
      </header>

      <div className="flex items-center text-black justify-center py-12">
        <div className="bg-white border border-accent rounded-lg shadow p-6 w-full max-w-md">
          <h2 className="text-text text-2xl font-semibold mb-6">Restaurant Owner Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="ownerName" className="block text-text font-medium mb-2">
                Owner Name
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="restaurantName" className="block text-text font-medium mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={form.restaurantName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your restaurant's name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-text font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Choose a username"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-text font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-text font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNo" className="block text-text font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNo"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your phone number"
                required
              />
            </div>
            {/* Address Section */}
            <div className="mb-4 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <div className="mb-4">
                <label className="block text-text font-medium mb-2">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="Bangladesh">Pakistan</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-text font-medium mb-2">City</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select City</option>
                  {form.country === 'Bangladesh' && (
                    <>
                      <option value="Dhaka">Karachi</option>
                      <option value="Sylhet">Lahore</option>
                      <option value="Chittagong">Islamabad</option>
                    </>
                  )}
                  {form.country === 'India' && (
                    <>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                    </>
                  )}
                  {form.country === 'USA' && (
                    <>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                    </>
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="roadBlock" className="block text-text font-medium mb-2">
                  Road/Block Number
                </label>
                <input
                  type="text"
                  id="roadBlock"
                  name="roadBlock"
                  value={form.roadBlock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your road or block number"
                  required
                />
              </div>
            </div>

            <div className="border-t-2 border-accent mb-4"></div>
             <div className="mb-4">
              <label className="block text-text font-medium mb-2">Cuisine Type</label>
              <div className="flex flex-wrap gap-4">
                {cuisines.map(cuisine => (
                  <label key={cuisine} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="cuisineType"
                      value={cuisine}
                      checked={form.cuisineType.includes(cuisine)}
                      onChange={handleCuisineChange}
                      className="accent-primary"
                    />
                    <span>{cuisine}</span>
                  </label>
                ))}
              </div>
              {/* Others text field */}
              <input
                type="text"
                name="otherCuisine"
                value={form.otherCuisine}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Other cuisine (if any)"
              />
            </div>
            {/* Opening Hours */}
            <div className="mb-4">
              <label className="block text-text font-medium mb-2">Opening Hours</label>
              <div className="flex space-x-2">
                <select
                  name="openingHour"
                  value={form.openingHour}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Open</option>
                  {hours.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <select
                  name="closingHour"
                  value={form.closingHour}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Close</option>
                  {hours.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition mb-4"
            >
              Sign Up
            </button>
          </form>
          <p className="text-text text-center mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:text-secondary">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}