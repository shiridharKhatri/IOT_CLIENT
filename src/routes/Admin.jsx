/*
 * Intelligent Food Delivery Robot - React Admin Panel (with Global Lock)
 * --------------------------------------------------------------------------
 * NEW: Listens for a global 'robotStatus' and disables all dispatch
 * buttons when the robot is busy, preventing multiple dispatches.
 */
import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_HOST || "http://localhost:3001";
const socket = io(BACKEND_URL);

// --- SVG Icons ---
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);
const TruckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 animate-pulse"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1-1h-1a1 1 0 00-1 1v5a1 1 0 001 1h1a1 1 0 001-1V7z" />
  </svg>
);
const BoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm3 3a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Component for Order Items ---
const OrderCard = ({ order, onDispatch, isRobotBusy }) => {
  const { tableNumber, status } = order;

  const statusStyles = {
    pending: {
      bgColor: "bg-gray-700",
      textColor: "text-amber-400",
      icon: <ClockIcon />,
      buttonText: "Dispatch Robot",
      buttonClass: "bg-amber-500 hover:bg-amber-600 text-gray-900",
      disabled: false,
    },
    waiting_for_food: {
      bgColor: "bg-blue-900/50",
      textColor: "text-blue-300",
      icon: <BoxIcon />,
      buttonText: "Waiting for Food...",
      buttonClass: "bg-blue-400 text-gray-900",
      disabled: true,
    },
    delivering: {
      bgColor: "bg-green-900/50",
      textColor: "text-green-300",
      icon: <TruckIcon />,
      buttonText: "Delivering...",
      buttonClass: "bg-green-500 text-white",
      disabled: true,
    },
  };

  const currentStatus = statusStyles[status] || statusStyles.pending;
  // The button is disabled if the robot is busy OR if this specific order is not pending.
  const isDisabled = isRobotBusy || currentStatus.disabled;

  return (
    <li
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg transition-colors duration-300 ${currentStatus.bgColor}`}
    >
      <div
        className={`flex items-center font-semibold mb-3 sm:mb-0 ${currentStatus.textColor}`}
      >
        {currentStatus.icon}
        Order for Table {tableNumber}
      </div>
      <button
        onClick={() => onDispatch(tableNumber)}
        disabled={isDisabled}
        className={`py-2 px-5 text-sm rounded-md font-bold transition-transform ${
          isDisabled ? "cursor-not-allowed opacity-60" : "hover:scale-105"
        } ${currentStatus.buttonClass}`}
      >
        {currentStatus.buttonText}
      </button>
    </li>
  );
};

// --- Main App Component ---
function App() {
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("deliveryHistory");
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      return [];
    }
  });
  const [isRobotBusy, setIsRobotBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("deliveryHistory", JSON.stringify(history));
  }, [history]);

  const handleDispatch = useCallback(async (tableNumber) => {
    try {
      await fetch(`${BACKEND_URL}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ table: tableNumber }).toString(),
      });
    } catch (error) {
      setMessage(`Dispatch Error: ${error.message}`);
    }
  }, []);

  const handleClearHistory = useCallback(() => setHistory([]), []);
  const handleRemoveHistoryItem = useCallback((indexToRemove) => {
    setHistory((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  useEffect(() => {
    const onNewOrder = (newOrder) =>
      setOrders((prev) =>
        prev.some((o) => o.tableNumber === newOrder.tableNumber)
          ? prev
          : [...prev, newOrder]
      );
    const onStatusChange = ({ tableNumber, status }) =>
      setOrders((prev) =>
        prev.map((o) => (o.tableNumber === tableNumber ? { ...o, status } : o))
      );
    const onRobotStatus = ({ isBusy }) => setIsRobotBusy(isBusy);

    const onOrderCompleted = ({ tableNumber }) => {
      setOrders((prevOrders) => {
        const orderToMove = prevOrders.find(
          (o) => o.tableNumber === tableNumber
        );
        if (orderToMove) {
          const historyEntry = {
            ...orderToMove,
            status: "delivered",
            completedAt: new Date().toLocaleString(),
          };
          setHistory((prevHistory) => [historyEntry, ...prevHistory]);
        }
        return prevOrders.filter((o) => o.tableNumber !== tableNumber);
      });
    };

    socket.on("newOrder", onNewOrder);
    socket.on("orderStatusChange", onStatusChange);
    socket.on("robotStatus", onRobotStatus);
    socket.on("orderCompleted", onOrderCompleted);

    return () => {
      socket.off("newOrder", onNewOrder);
      socket.off("orderStatusChange", onStatusChange);
      socket.off("robotStatus", onRobotStatus);
      socket.off("orderCompleted", onOrderCompleted);
    };
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            <span className="text-amber-400">Robo</span>-Waiter Dispatch
          </h1>
          <p className="text-gray-400 mt-2">Real-time delivery management</p>
          {message && <p className="mt-4 text-base text-red-400">{message}</p>}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-5 text-white">
              Active Orders
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400">No pending orders.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Waiting for customers...
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <OrderCard
                    key={order.tableNumber}
                    order={order}
                    onDispatch={handleDispatch}
                    isRobotBusy={isRobotBusy}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-semibold text-white">
                Delivery History
              </h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs bg-red-800 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md"
                >
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400">No completed deliveries yet.</p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {history.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-800 rounded-md group"
                  >
                    <div className="flex items-center text-green-400">
                      <CheckCircleIcon />
                      <span className="text-md text-gray-300 ml-2">
                        Table {item.tableNumber}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-4">
                        {item.completedAt}
                      </span>
                      <button
                        onClick={() => handleRemoveHistoryItem(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500 p-1 rounded-full"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
