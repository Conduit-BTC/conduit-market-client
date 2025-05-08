import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  cart: CartItem[]
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addToCart: (product: CartItem) => void
  decreaseQuantity: (product: CartItem) => void
  removeAllFromCart: (product: CartItem) => void
  getItemCount: (product: CartItem) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addToCart: (product: CartItem) => {
        const existingProduct = get().cart.find(
          (p) => p.productId === product.productId
        )
        if (existingProduct) {
          set((state) => ({
            cart: state.cart.map((p) =>
              p.productId === product.productId
                ? { ...p, quantity: p.quantity + 1 }
                : p
            )
          }))
        } else {
          set((state) => ({
            cart: [...state.cart, { ...product, quantity: 1 }]
          }))
        }
      },
      decreaseQuantity: (product: CartItem) => {
        const existingProduct = get().cart.find(
          (p) => p.productId === product.productId
        )
        if (existingProduct) {
          if (existingProduct.quantity === 1) {
            set((state) => ({
              cart: state.cart.filter((p) => p.productId !== product.productId)
            }))
          } else {
            set((state) => ({
              cart: state.cart.map((p) =>
                p.productId === product.productId
                  ? { ...p, quantity: p.quantity - 1 }
                  : p
              )
            }))
          }
        }
      },
      removeAllFromCart: (product: CartItem) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.productId !== product.productId)
        })),
      getItemCount: (product: CartItem) =>
        get().cart.reduce(
          (count, item) =>
            item.productId === product.productId
              ? count + item.quantity
              : count,
          0
        )
    }),
    {
      name: 'conduit-market-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart })
    }
  )
)
