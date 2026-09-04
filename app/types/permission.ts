export interface IPermission {
  id: number;
  name: string;
}


export interface IPayloadPermission {
  name: string;
}
export interface ISinglePermissionResponse {
  success: boolean;
  message: string;
  data: IPermission;
}
export interface IPermissionResponse {
  success: boolean;
  message: string;
  data: IPermission[];
  meta?: IPaginationMeta
}