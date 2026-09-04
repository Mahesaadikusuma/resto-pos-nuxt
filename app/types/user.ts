export interface ISingleResponseUserHakAkses {
    success: boolean
    message: string
    data: IUserHakAkses
}


export interface IUserHakAkses {
    success: boolean
    message: string
    data: {
        id: number
        name: string
        email: string
        roles: {
            id: number
            name: string
            permissions: IPermission[]
        }[]
    }

}