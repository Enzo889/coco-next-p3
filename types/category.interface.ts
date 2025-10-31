import { IUserInterest } from "./user-interest.interface";

export interface INCategory {
  idCategory: number;
  name: string;

  userInterests: IUserInterest[];
}
