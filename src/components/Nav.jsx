"use client"

import { useState } from "react"
import { FaCarrot, FaHamburger, FaPizzaSlice, FaBeer, FaBars, FaTimes } from "react-icons/fa"

const Nav = ({ menuVal }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("salad")

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleMenuClick = (val) => {
    menuVal(val)
    setActiveItem(val)
    setMenuOpen(false)
  }

  const menuItems = [
    { id: "salad", icon: FaCarrot, label: "Salads", color: "from-green-400 to-emerald-500" },
    { id: "burger", icon: FaHamburger, label: "Burgers", color: "from-orange-400 to-red-500" },
    { id: "pizza", icon: FaPizzaSlice, label: "Pizza", color: "from-yellow-400 to-orange-500" },
    { id: "drink", icon: FaBeer, label: "Drinks", color: "from-blue-400 to-purple-500" },
  ]

  return (
    <div className="lg:col-span-1">
      <nav className="h-full">
        <div className="flex justify-between items-center mb-8 px-4 lg:px-0">
          <h1 className="font-bold">
            <div className="text-2xl lg:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Order <span className="text-orange-500 font-black">Bot</span>
            </div>
          </h1>

          <button
            className="lg:hidden p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={toggleMenu}
          >
            <FaBars className="text-xl text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
            onClick={toggleMenu}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-80 h-full bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">Menu Categories</h2>
              <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <FaTimes className="text-xl text-gray-600" />
              </button>
            </div>

            <ul className="space-y-3">
              {menuItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.id}>
                    <button
                      className={`w-full rounded-xl py-4 px-4 text-left font-semibold flex items-center transition-all duration-300 transform hover:scale-105 ${
                        activeItem === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleMenuClick(item.id)}
                    >
                      <IconComponent className="mr-3 text-lg" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:block space-y-4 pr-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.id}>
                <button
                  className={`w-full rounded-xl py-4 px-4 text-left font-semibold flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    activeItem === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <IconComponent className="mr-3 text-lg" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Nav
