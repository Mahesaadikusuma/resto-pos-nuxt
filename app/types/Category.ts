export interface ICategory {
  uuid: string
  name: string
  slug: string
  is_active: number
  created_at: string
}

export interface IPayloadCategory {
  name: string,
  is_active: boolean
}

export interface ISingleCategoryResponse {
  success: boolean
  message: string
  data: ICategory 
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}



export interface ICategoryResponse {
  success: boolean
  message: string
  data: ICategory[]
  meta: PaginationMeta
}