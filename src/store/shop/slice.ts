import { PayTypeInfo, ProductInfo } from '@/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface shopState {
  // Pay payment method
  payTypes: Array<PayTypeInfo>
  // Product list
  goodsList: Array<ProductInfo>
  // Modify the list of products
  changeGoodsList: (list: Array<ProductInfo>) => void
  // Modify the payment method
  changePayTypes: (list: Array<PayTypeInfo>) => void
}

const shopStore = create<shopState>()(
  persist(
    (set, get) => ({
      payTypes: [],
      changePayTypes: (list) => set({ payTypes: list }),
      goodsList: [],
      changeGoodsList: (list) => set({ goodsList: list })
    }),
    {
      name: 'shop_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default shopStore
