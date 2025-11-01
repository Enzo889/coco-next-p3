export interface IPetition {
  idPetition?: number;
  idTypePetition: number | null;
  description: string | null;
  dateSince: string | null; // El tipo 'date' de MySQL a menudo se mapea a string en JS
  dateUntil: string | null; // El tipo 'date' de MySQL a menudo se mapea a string en JS
  idUserCreate: number | null;
  idUserUpdate: number | null;
  dateCreate?: Date;
  dateUpdate?: Date;
  idState: number | null;
  idCustomer: number;
  idCategory: number;
}
