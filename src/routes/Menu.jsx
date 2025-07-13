"use client"

import { useState, useEffect } from "react"
import { FaArrowLeft, FaShoppingCart, FaTimes, FaPlus, FaMinus, FaUtensils } from "react-icons/fa"
import Nav from "../components/Nav"
import Burger from "../components/pages/Burger"
import Salad from "../components/pages/Salad"
import Pizza from "../components/pages/Pizza"
import Drinks from "../components/pages/Drinks"
import { createOrder } from "../api/order"
import { useParams } from "react-router-dom"

const Menu = () => {
  const [cartOpen, setCartOpen] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [selectedVal, setSelectedVal] = useState("salad")
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)
  const [showEmptyCartError, setShowEmptyCartError] = useState(false)

  const { id } = useParams()

  const menuVal = (val) => {
    setSelectedVal(val)
  }

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || []
    setCartItems(savedCart)
    calculateTotal(savedCart)
  }, [])

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setTotalAmount(total.toFixed(2))
  }

  const addToCart = (item) => {
    const updatedCart = [...cartItems]
    const existingItemIndex = updatedCart.findIndex((cartItem) => cartItem.id === item.id)

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += 1
    } else {
      updatedCart.push({ ...item, quantity: 1 })
    }

    setCartItems(updatedCart)
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
    calculateTotal(updatedCart)
    setSidePanelOpen(false)
  }

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
    calculateTotal(updatedCart)
  }

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id)
    } else {
      const updatedCart = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      setCartItems(updatedCart)
      localStorage.setItem("cartItems", JSON.stringify(updatedCart))
      calculateTotal(updatedCart)
    }
  }

  const selectItem = (item) => {
    setSelectedItem(item)
    setSidePanelOpen(true)
  }

  const toggleCartPanel = () => {
    setCartOpen(!cartOpen)
  }

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen)
  }

  const orderConfirm = async () => {
    // Validation: Check if cart is empty
    if (cartItems.length === 0) {
      setShowEmptyCartError(true)
      setTimeout(() => setShowEmptyCartError(false), 3000)
      return
    }

    // Validation: Check if table number is valid (only 1, 2, or 3)
    const tableNumber = Number(id)
    if (![1, 2, 3].includes(tableNumber)) {
      setOrderStatus("invalid_table")
      return
    }

    setLoading(true)
    const order = {
      tableNumber: tableNumber,
    }

    try {
      const response = await createOrder(order)
      if (response.success) {
        setOrderStatus("success")
        setCartItems([])
        localStorage.setItem("cartItems", JSON.stringify([]))
        setTotalAmount(0)
        setCartOpen(false)
      } else {
        setOrderStatus("failure")
      }
    } catch (error) {
      setOrderStatus("failure")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 font-medium">Processing your order...</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {orderStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 transform animate-pulse">
            {orderStatus === "success" ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUtensils className="text-2xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Order Successful!</h2>
                <p className="text-gray-600 mb-6">Your delicious meal is being prepared!</p>
                <button
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setOrderStatus(null)}
                >
                  Continue
                </button>
              </div>
            ) : orderStatus === "invalid_table" ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="text-2xl text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-orange-600 mb-2">Invalid Table!</h2>
                <p className="text-gray-600 mb-6">Only tables 1, 2, and 3 are available for ordering.</p>
                <button
                  className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors duration-200"
                  onClick={() => setOrderStatus(null)}
                >
                  Got it
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="text-2xl text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Order Failed!</h2>
                <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
                <button
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
                  onClick={() => setOrderStatus(null)}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty Cart Error */}
      {showEmptyCartError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-40 animate-bounce">
          <p className="font-medium">Please add items to your cart first!</p>
        </div>
      )}

      <div className="pt-6 px-4 md:px-8 lg:px-12 grid lg:grid-cols-5 gap-8 pb-20">
        <Nav menuVal={menuVal} />

        <main className="lg:col-span-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg border border-purple-100">
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Table #{id}
              </span>
            </div>

            <div className="flex gap-3">
              <button className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <FaArrowLeft className="text-gray-600" />
              </button>

              <button
                className="flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-gray-700"
                onClick={toggleCartPanel}
              >
                <FaShoppingCart className="text-purple-600" />
                <span>{cartItems.length} items</span>
                <span className="text-purple-600 font-bold">${totalAmount}</span>
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
            {selectedVal === "salad" && <Salad toggleSidePanel={toggleSidePanel} selectItem={selectItem} />}
            {selectedVal === "burger" && <Burger toggleSidePanel={toggleSidePanel} selectItem={selectItem} />}
            {selectedVal === "pizza" && <Pizza toggleSidePanel={toggleSidePanel} selectItem={selectItem} />}
            {selectedVal === "drink" && <Drinks toggleSidePanel={toggleSidePanel} selectItem={selectItem} />}
          </div>
        </main>
      </div>

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out z-40 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Your Order</h2>
              <button
                onClick={toggleCartPanel}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors duration-200"
              >
                <FaTimes className="text-white" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some delicious items!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors duration-200"
                        >
                          <FaMinus className="text-xs text-purple-600" />
                        </button>
                        <span className="font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors duration-200"
                        >
                          <FaPlus className="text-xs text-purple-600" />
                        </button>
                      </div>
                      <span className="font-bold text-purple-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-purple-600">${totalAmount}</span>
              </div>
              <button
                onClick={orderConfirm}
                disabled={loading || cartItems.length === 0}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Processing..." : "Order & Pay"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Panel */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out z-40 ${
          sidePanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedItem && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <button
                onClick={toggleSidePanel}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center">
                <img
                  src={selectedItem.images || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-48 h-48 object-cover rounded-2xl mx-auto mb-6 shadow-lg"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedItem.name}</h2>
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                <div className="text-3xl font-bold text-purple-600 mb-6">${selectedItem.price.toFixed(2)}</div>

                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows="3"
                  placeholder="Special instructions (optional)..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => addToCart(selectedItem)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for panels */}
      {(cartOpen || sidePanelOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => {
            setCartOpen(false)
            setSidePanelOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default Menu
