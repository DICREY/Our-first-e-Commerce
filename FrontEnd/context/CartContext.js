"use client"

import { createContext, useContext, useReducer } from "react"

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, size, color } = action.payload
      const existingItem = state.find(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color,
      )

      if (existingItem) {
        return state.map((item) =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...state, { ...product, quantity: 1, selectedSize: size, selectedColor: color }]
    }

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload)

    case "UPDATE_QUANTITY":
      return state
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)

    case "CLEAR_CART":
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const addToCart = (product, size, color) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, size, color } })
  }

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
