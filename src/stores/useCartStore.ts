import type { NDKTag } from '@nostr-dev-kit/ndk'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  merchantPubkey: string
  productId: string
  eventId: string
  tags: NDKTag[]
  currency: string
  name: string
  price: number
  image: string
  quantity: number
  selectedForZapout?: boolean
}

export interface Cart {
  merchantPubkey: string
  items: CartItem[]
}

interface CartState {
  carts: Cart[]

  // HUD state
  selectedHUDCart: Cart | null
  setSelectedHUDCart: (cart: Cart | null) => void

  // Cart actions
  clearCart: (merchantPubkey: string) => void
  clearAllCarts: () => void

  // All carts getters
  getCartsTotal: () => number
  getCartsItemsCount: () => number

  // Single cart getters
  getCart: (merchantPubkey: string) => Cart | undefined
  getCartTotal: (merchantPubkey: string) => number
  getCartItemsCount: (merchantPubkey: string) => number

  // Item getters
  getItem: (merchantPubkey: string, productId: string) => CartItem | undefined
  getItemQuantity: (merchantPubkey: string, productId: string) => number

  // Item actions
  addItemToCart: (product: CartItem) => void
  increaseItemQuantity: (product: CartItem) => void
  decreaseItemQuantity: (product: CartItem) => void
  removeItemFromCart: (product: CartItem) => void
  toggleItemSelectionForZapout: (product: CartItem, force?: boolean) => void
  toggleAllItemsSelectionForZapout: (force?: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: [],
      selectedHUDCart: null,
      setSelectedHUDCart: (cart: Cart) =>
        set(() => ({
          selectedHUDCart: cart
        })),

      addItemToCart: (product: CartItem) => {
        const existingCart = get().getCart(product.merchantPubkey)

        if (!existingCart) {
          set((state) => ({
            carts: [
              ...state.carts,
              {
                merchantPubkey: product.merchantPubkey,
                items: [{ ...product, quantity: 1, selectedForZapout: true }]
              }
            ]
          }))
          return
        }

        const existingItem = existingCart.items.find(
          (item) => item.productId === product.productId
        )

        if (existingItem) {
          get().increaseItemQuantity(product)
          return
        }

        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.merchantPubkey === product.merchantPubkey
              ? {
                  ...cart,
                  items: [
                    ...cart.items,
                    { ...product, quantity: 1, selectedForZapout: true }
                  ]
                }
              : cart
          )
        }))
      },

      increaseItemQuantity: (product: CartItem) => {
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.merchantPubkey === product.merchantPubkey
              ? {
                  ...cart,
                  items: cart.items.map((item) =>
                    item.productId === product.productId
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  )
                }
              : cart
          )
        }))
      },

      decreaseItemQuantity: (product: CartItem) => {
        set((state) => ({
          carts: state.carts
            .map((cart) => {
              if (cart.merchantPubkey !== product.merchantPubkey) return cart

              const updatedItems = cart.items
                .map((item) =>
                  item.productId === product.productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                )
                .filter((item) => item.quantity > 0)

              return updatedItems.length > 0
                ? { ...cart, items: updatedItems }
                : cart
            })
            .filter((cart) => cart.items.length > 0)
        }))
      },

      removeItemFromCart: (product: CartItem) => {
        set((state) => ({
          carts: state.carts
            .map((cart) => {
              if (cart.merchantPubkey !== product.merchantPubkey) return cart

              return {
                ...cart,
                items: cart.items.filter(
                  (item) => item.productId !== product.productId
                )
              }
            })
            .filter((cart) => cart.items.length > 0)
        }))
      },
      clearCart: (merchantPubkey: string) => {
        set((state) => ({
          carts: state.carts.filter(
            (cart) => cart.merchantPubkey !== merchantPubkey
          )
        }))
      },

      clearAllCarts: () => {
        set((state) => ({ carts: [] }))
      },

      getCart: (merchantPubkey: string) =>
        get().carts.find((cart) => cart.merchantPubkey === merchantPubkey),

      getCartTotal: (merchantPubkey: string) => {
        const cart = get().getCart(merchantPubkey)
        return cart
          ? cart.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )
          : 0
      },

      getCartItemsCount: (merchantPubkey: string) => {
        const cart = get().getCart(merchantPubkey)
        return cart
          ? cart.items.reduce((count, item) => count + item.quantity, 0)
          : 0
      },

      getCartsTotal: () =>
        get().carts.reduce(
          (total, cart) =>
            total +
            cart.items.reduce(
              (cartTotal, item) => cartTotal + item.price * item.quantity,
              0
            ),
          0
        ),

      getCartsItemsCount: () => {
        return get().carts.reduce(
          (total, cart) =>
            total +
            cart.items.reduce((count, item) => count + item.quantity, 0),
          0
        )
      },

      getItem: (merchantPubkey: string, productId: string) => {
        const cart = get().getCart(merchantPubkey)
        return cart?.items.find((item) => item.productId === productId)
      },

      getItemQuantity: (merchantPubkey: string, productId: string) => {
        const cart = get().getCart(merchantPubkey)
        return (
          cart?.items.find((item) => item.productId === productId)?.quantity ||
          0
        )
      },

      toggleItemSelectionForZapout: (product: CartItem, force?: boolean) => {
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.merchantPubkey === product.merchantPubkey
              ? {
                  ...cart,
                  items: cart.items.map((item) =>
                    item.productId === product.productId
                      ? {
                          ...item,
                          selectedForZapout:
                            force !== undefined
                              ? force
                              : !item.selectedForZapout
                        }
                      : item
                  )
                }
              : cart
          )
        }))
      },

      toggleAllItemsSelectionForZapout: (force?: boolean) => {
        set((state) => ({
          carts: state.carts.map((cart) => ({
            ...cart,
            items: cart.items.map((item) => ({
              ...item,
              selectedForZapout:
                force !== undefined ? force : !item.selectedForZapout
            }))
          }))
        }))
      }
    }),
    {
      name: 'conduit-market-carts',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ carts: state.carts })
    }
  )
)
