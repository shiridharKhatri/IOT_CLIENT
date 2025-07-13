"use client"

export default function Pizza({ toggleSidePanel, selectItem }) {
  const pizzas = [
    {
      id: 1,
      name: "Margherita",
      description: "Tomato, mozzarella, basil",
      price: 8.5,
      images: "/image/pizza/Margherita.png",
    },
    {
      id: 2,
      name: "Pepperoni",
      description: "Pepperoni, mozzarella, tomato sauce",
      price: 9.0,
      images: "/image/pizza/Pepperoni.png",
    },
    {
      id: 3,
      name: "Vegetarian",
      description: "Mushrooms, bell peppers, onions, olives",
      price: 7.5,
      images: "/image/pizza/Vegetarian.png",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Wood-Fired Pizza
        </h1>
        <p className="text-gray-600">Authentic Italian flavors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <div
            key={pizza.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
            onClick={() => selectItem(pizza)}
          >
            <div className="relative overflow-hidden">
              <img
                src={pizza.images || "/placeholder.svg"}
                alt={pizza.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors duration-200">
                {pizza.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pizza.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-yellow-600">${pizza.price.toFixed(2)}</span>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-600 transition-colors duration-200">
                  <span className="text-yellow-600 group-hover:text-white text-lg font-bold">+</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
