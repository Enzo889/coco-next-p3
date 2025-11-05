import { TYPE_PETITION } from "./type_petition.enum";
export interface INotification {
  idNotification?: number;
  idProvider?: number | null;
  idCustomer?: number | null;
  type: TYPE_PETITION;
  message: string | null;
  viewed: boolean | null;
  idUserUpdate: number | null;
  idUserCreate: number | null;
  dateUpdate?: Date | null;
  dateCreate?: Date | null;
  deleted: boolean | null;
}
