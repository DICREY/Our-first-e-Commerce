export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  sizes: string[]
  colors: string[]
  description: string
  featured?: boolean
  onSale?: boolean
}

export interface CartItem extends Product {
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, size: string, color: string) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getTotalPrice: () => number
  getTotalItems: () => number
  clearCart: () => void
}
