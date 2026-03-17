// CART SERVICE (Improved)
export const addToCart = (cart, item) => {
  const existing = cart.find((c) => c.id === item.id);

  if (existing) {
    return cart.map((c) =>
      c.id === item.id
        ? { ...c, quantity: Math.min(c.quantity + 1, 10) } // Limit max quantity
        : c
    );
  }

  return [...cart, { ...item, quantity: 1 }];
};

export const removeFromCart = (cart, id) => {
  return cart.filter((item) => item.id !== id);
};

export const updateQuantity = (cart, id, quantity) => {
  const qty = Math.max(1, Math.min(quantity, 10)); // 1–10 safe limit

  return cart.map((item) =>
    item.id === id ? { ...item, quantity: qty } : item
  );
};

// 💰 Tax + Service Fee (Restaurant Standard)
export const calculateSubtotal = (cart) => {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

export const calculateTax = (subtotal) => subtotal * 0.08; // 8% tax
export const calculateServiceFee = (subtotal) => subtotal * 0.05; // 5% service charge

export const calculateTotal = (cart) => {
  const subtotal = calculateSubtotal(cart);
  return subtotal + calculateTax(subtotal) + calculateServiceFee(subtotal);
};

// Save cart for persistence
export const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
