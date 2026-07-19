// services/authService.ts

import type { ILogin, ILoginResponse, IUser } from "~/types/Auth"

export const authService = {
  async login(payload: ILogin) {
    // Memanggil config di dalam fungsi agar terhindar dari error 'context unavailable'
    const config = useRuntimeConfig()
    
    return await $fetch<ILoginResponse>(`${config.LARAVEL_BASE_URL}/auth/login`, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  },

  async getProfile(accessToken: string) {
    const config = useRuntimeConfig()
    
    return await $fetch<IUser>(`${config.LARAVEL_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  }
}