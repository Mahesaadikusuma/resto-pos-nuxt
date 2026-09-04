import type { Session, User } from "next-auth"

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

export interface IUserResponse {
    success: boolean
    message: string
    data: {
        id: number
        name: string
        email: string
        roles: Role[]
    }
}
export interface IUser {
    id: number
    name: string
    email: string
    roles: Role[]
    permission: Permission[]
}

export interface IUsers {
  success: boolean
  message: string
  data: IUser[]
  meta?: IPaginationMeta
}


export interface UserExtended extends User {
  id?: number | string;
  roles?: Role[];
  accessToken?: string;
  role?: string;
}

export interface SessionExtended extends Session {
  accessToken?: string;
  user?: UserExtended;
}

export interface JWTExtended {
  user?: UserExtended;
}  