import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string
      roles?: { id: number; name: string; permissions: any[] }[]
    } & DefaultSession["user"]
  }

  interface User {
    access_token?: string
    roles?: { id: number; name: string; permissions: any[] }[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    roles?: { id: number; name: string; permissions: any[] }[]
  }
}