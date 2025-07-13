"use client"

export default function Burger({ toggleSidePanel, selectItem }) {
  const burgers = [
    {
      id: 1,
      name: "Bacon Jammer",
      description: "bacon, iceberg, mayo",
      price: 3.5,
      images: "/image/burger/bacon.png",
    },
    {
      id: 2,
      name: "Cheeseburger Deluxe",
      description: "cheese, lettuce, tomato, pickles",
      price: 4.0,
      images: "/image/burger/cheese.png",
    },
    {
      id: 3,
      name: "BBQ Chicken Burger",
      description: "grilled chicken, BBQ sauce, lettuce",
      price: 5.0,
      images: "/image/burger/bbq.png",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Juicy Burgers
        </h1>
        <p className="text-gray-600">Satisfying and flavorful classics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {burgers.map((burger) => (
          <div
            key={burger.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
            onClick={() => selectItem(burger)}
          >
            <div className="relative overflow-hidden">
              <img
                src={burger.images || "/placeholder.svg"}
                alt={burger.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                {burger.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{burger.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-orange-600">${burger.price.toFixed(2)}</span>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-200">
                  <span className="text-orange-600 group-hover:text-white text-lg font-bold">+</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
