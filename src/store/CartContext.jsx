import { createContext, useEffect, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  function saveCartToLocalStorage(items) {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`cart-${userId}`, JSON.stringify(items));
    }
  }

  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    saveCartToLocalStorage(updatedItems);
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    saveCartToLocalStorage(updatedItems);
    return { ...state, items: updatedItems };
  }

  if (action.type === "INCREASE_QUANTITY") {
    const updatedItems = state.items.map((item) =>
      item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
    );

    saveCartToLocalStorage(updatedItems);
    return { ...state, items: updatedItems };
  }

  if (action.type === "DECREASE_QUANTITY") {
    const updatedItems = state.items.map((item) =>
      item.id === action.id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    saveCartToLocalStorage(updatedItems);
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ALL") {
    const updatedItems = state.items.filter((item) => item.id !== action.id);
    saveCartToLocalStorage(updatedItems);
    return { ...state, items: updatedItems };
  }

  if (action.type === "CLEAR_CART") {
    saveCartToLocalStorage([]); // clear it from localStorage too
    return { ...state, items: [] };
  }

  if (action.type === "LOAD_CART") {
    return { ...state, items: action.items };
  }

  // Unknown action type
  return state;
}

export function CartContextProvider({ children }) {
  const userId = localStorage.getItem("userId");
  const initialCart = {
    items: JSON.parse(localStorage.getItem(`cart-${userId}`)) || [],
  };

  const [cart, dispatchCartAction] = useReducer(cartReducer, initialCart);

  // const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedCart = userId
      ? JSON.parse(localStorage.getItem(`cart-${userId}`)) || []
      : [];

    dispatchCartAction({ type: "LOAD_CART", items: storedCart });
  }, []); // runs once on mount

  function addItem(item) {
    dispatchCartAction({
      type: "ADD_ITEM",
      item,
    });
  }

  function removeItem(id) {
    dispatchCartAction({
      type: "REMOVE_ITEM",
      id,
    });
  }

  function increaseQuantity(id) {
    dispatchCartAction({ type: "INCREASE_QUANTITY", id });
  }

  function decreaseQuantity(id) {
    dispatchCartAction({ type: "DECREASE_QUANTITY", id });
  }

  function removeAll(id) {
    dispatchCartAction({ type: "REMOVE_ALL", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeAll,
  };

  console.log(cartContext);
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
