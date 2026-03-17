export const submitOrder = (cart, info) => {
  if (!cart.length) {
    return { success: false, message: "Cart is empty." };
  }

  if (!info.name || !info.phone || !info.address) {
    return { success: false, message: "Please fill all fields." };
  }

  return {
    success: true,
    message: "Order placed successfully! Your food is on the way.",
    order: {
      items: cart,
      customer: info,
      timestamp: new Date().toISOString(),
    },
  };
};
