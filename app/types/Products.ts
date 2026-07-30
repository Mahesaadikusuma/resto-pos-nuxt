export interface IProduct {
    uuid: string,
    slug: string,
    name: string,
    category_id: string,
    price: number,
    stock: number,
    image: string,
    image_file_id: string,
    is_available: boolean,
    created_at: string,
    updated_at: string,
    category: ICategory,
}

export interface IProductResponse {
    success: boolean
    message: string
    data: IProduct[]
    meta: IPaginationMeta
}

export interface ISingleProductResponse {
    success: boolean
    message: string
    data: IProduct
}

export interface IPayloadStoreProduct {
    name: string,
    price: number,
    stock: number,
    category_uuid: string,
    image: File,
    is_available: boolean,
}

export interface IPayloadUpdateProduct {
    name?: string,
    price?: number,
    stock?: number,
    category_uuid?: { label: string, value: string },
    image?: File,
    is_available?: boolean,
}