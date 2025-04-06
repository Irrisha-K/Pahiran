import React from "react";
import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";

import "./Home.css";

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section
        className="hero-section bg-cover h-[90vh] text-white flex flex-col justify-center items-center text-center p-8"
        style={{ backgroundImage: 'url("/images/hero.jpg")' }}
      >
        <h1 className="text-5xl font-bold mb-4">Embrace Your Style</h1>
        <p className="text-lg mb-6 max-w-xl">
          Explore the finest in women’s fashion - elegant dresses, chic
          workwear, and stylish casuals tailored just for you.
        </p>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl text-lg">
          Shop Now
        </button>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Dresses", "Ethnic Wear", "Casuals", "Workwear"].map((cat, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src={`/images/category-${idx + 1}.jpg`}
                alt={cat}
                className="w-full h-48 object-cover"
              />
              <p className="p-4 font-medium text-lg">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-12 px-6 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Collection
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white w-72 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={`/images/featured-${item}.jpg`}
                alt="product"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold">Floral Co-ord Set</h3>
                <p className="text-pink-500 font-bold">Rs. 1,999</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6">
              <p className="italic">
                “Absolutely in love with the quality and fit. Perfect for my
                office and after-hours too!”
              </p>
              <p className="mt-4 font-bold">— Seema.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 px-6 bg-pink-50 text-center">
        <h2 className="text-3xl font-semibold mb-4">Stay In The Know</h2>
        <p className="mb-6">
          Subscribe to get updates on new arrivals, discounts & more!
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-xl border border-gray-300 w-64"
          />
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
