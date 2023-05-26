import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ResponseLoginData, UserInfo } from '@/types'

export interface userState {
  // Log in the pop -up switch
  loginModal: boolean
  // User Info
  user_info: UserInfo | undefined
  // Log in token
  token: string | undefined
  // Modify login pop -up window
  setLoginModal: (value: boolean) => void
  // Log in
  login: (data: ResponseLoginData) => void
  // quit
  logout: () => void
}

const userStore = create<userState>()(
  persist(
    (set, get) => ({
      loginModal: false,
      user_info: undefined,
      token: undefined,
      setLoginModal: (value) => set({ loginModal: value }),
      login: (data) => set(() => ({ ...data })),
      logout: () => set(() => ({ user_info: undefined, token: undefined }))
    }),
    {
      name: 'user_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default userStore
