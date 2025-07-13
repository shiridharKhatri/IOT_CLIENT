"use client"

export default function Salad({ toggleSidePanel, selectItem }) {
  const salads = [
    {
      id: 1,
      name: "Fruit Salad",
      description: "Mango, Orange, Passion fruit",
      price: 6.3,
      images: "/image/salad/fruit.png",
    },
    {
      id: 2,
      name: "Vegetable Salad",
      description: "Lettuce, Carrot, Cucumber",
      price: 5.5,
      images: "/image/salad/vegetable.png",
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Romaine, Croutons, Caesar Dressing",
      price: 7.9,
      images: "/image/salad/caesar.png",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Fresh Salads
        </h1>
        <p className="text-gray-600">Healthy and delicious options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salads.map((salad) => (
          <div
            key={salad.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
            onClick={() => selectItem(salad)}
          >
            <div className="relative overflow-hidden">
              <img
                src={salad.images || "/placeholder.svg"}
                alt={salad.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200">
                {salad.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{salad.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">${salad.price.toFixed(2)}</span>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200">
                  <span className="text-green-600 group-hover:text-white text-lg font-bold">+</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
