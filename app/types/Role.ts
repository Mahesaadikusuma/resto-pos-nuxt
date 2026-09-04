export interface IRole {
    id: number
    name: string
    users_count?: number
    permissions?: IPermission[]
}

export interface IRoleResponse {
    success: boolean
    message: string
    data: IRole[]
    meta?: IPaginationMeta
}