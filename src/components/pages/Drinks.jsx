"use client"

export default function Drinks({ toggleSidePanel, selectItem }) {
  const drinks = [
    {
      id: 1,
      name: "Mango Lassi",
      description: "Mango, yogurt, sugar",
      price: 3.5,
      images: "/image/drink/mangoLassi.png",
    },
    {
      id: 2,
      name: "Iced Latte",
      description: "Espresso, milk, ice",
      price: 4.0,
      images: "/image/drink/latte.png",
    },
    {
      id: 3,
      name: "Lemonade",
      description: "Lemon, sugar, water",
      price: 2.5,
      images: "/image/drink/lemon.png",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Refreshing Drinks
        </h1>
        <p className="text-gray-600">Cool and energizing beverages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drinks.map((drink) => (
          <div
            key={drink.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
            onClick={() => selectItem(drink)}
          >
            <div className="relative overflow-hidden">
              <img
                src={drink.images || "/placeholder.svg"}
                alt={drink.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {drink.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{drink.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">${drink.price.toFixed(2)}</span>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                  <span className="text-blue-600 group-hover:text-white text-lg font-bold">+</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
