export interface IPaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}