import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id); //returns the index of the card/item clicked on the frontend

    const updatedItems = [...state.items]; //copied the original array

    // using -1 since the array index starts from 0
    if (existingCartItemIndex > -1) {
      const existingItems = state.items[existingCartItemIndex]; // we get the index of the item that was clicked
      // we update the object and store it here
      const updatedItem = {
        ...existingItems,
        quantity: existingItems.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem; // this updates/replaces the copy of the original array by getting the index
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }
    return { ...state, items: updatedItems }; // we return full state, in this case items array and store updatedItems in items
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id); //returns the index of the card/item clicked on the frontend

    const existingCartItem = state.items[existingCartItemIndex];
    const updatedItems = [...state.items];
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = { ...existingCartItem, quantity: existingCartItem.quantity - 1 };
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return { ...state, items: updatedItems }; // we return full state, in this case items array and store updatedItems in items
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatch({ type: "ADD_ITEM", item });
  }

  function removeItem(id) {
    dispatch({ type: "REMOVE_ITEM", id });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext value={cartContext}>{children}</CartContext>;
}

export default CartContext;
