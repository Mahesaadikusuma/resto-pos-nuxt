import type { User } from "next-auth"

export interface ILogin {
  email: string
  password: string
}


export interface ILoginResponse {
    success: boolean
    message: string
    data: {
        user: {
            id: number
            name: string
            email: string
        }
        token: string
    }
}


export interface IUser {
    success: boolean
    message: string
    data: {
        id: number
        name: string
        email: string
        roles: Role[]
    }
}


export interface UserExtended extends User {
  accessToken?: string;
  role?: string;
}

export interface SessionExtended extends Session {
  accessToken?: string;
}

export interface JWTExtended extends JWT {
  user?: UserExtended;
}  