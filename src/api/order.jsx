export const createOrder = async (object) => {
  const BACKEND_URL = import.meta.env.VITE_HOST;
  console.log("Creating order with data:", object.tableNumber);

  try {
    const response = await fetch(`${BACKEND_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableNumber: object.tableNumber }),
    });
    console.log("Order created successfully:", response);
    return { success: true, response };
  } catch (error) {
    console.error(error);
    return { success: false, response: error };
  }
};
