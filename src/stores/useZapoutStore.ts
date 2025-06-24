import type { ShippingFormData } from '@/components/ZapoutPage/ShippingForm'
import type { CartItem as StoreCartItem } from '@/stores/useCartStore'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ZapoutState {
  shippingInfo?: ShippingFormData;
  paymentMethod?: string;
  cartItems?: StoreCartItem[];
  notes?: string;

  setShippingInfo: (data: ShippingFormData) => void;
  setPaymentMethod: (method: string) => void;
  setCartItems: (items: StoreCartItem[]) => void;
  setNotes: (text: string) => void;
}

export const useZapoutStore = create<ZapoutState>()(
  persist(
    (set, get) => ({
      shippingInfo: undefined,
      setShippingInfo: (data) => {
        set((state) => ({
          ...state,
          shippingInfo: data,
        }));
      },

      paymentMethod: undefined,
      setPaymentMethod: (method) => {
        set((state) => ({
          ...state,
          paymentMethod: method,
        }));
      },

      cartItems: undefined,
      setCartItems: (items) => {
        set((state) => ({
          ...state,
          cartItems: items,
        }));
      },

      notes: undefined,
      setNotes: (notes) => {
        set((state) => ({
          ...state,
          notes,
        }));
      },
    }),
    {
      name: 'conduit-customer-zapout-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        shippingInfo: state.shippingInfo,
        paymentMethod: state.paymentMethod,
        cartItems: state.cartItems,
        notes: state.notes,
      }),
    }
  )
);

