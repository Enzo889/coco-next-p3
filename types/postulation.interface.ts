export interface IPostulation {
  idpostulation: number;
  idPetition: string | null; // Mapeado desde 'bigint'
  idProvider: string | null; // Mapeado desde 'bigint'
  winner: boolean;
  proposal: string | null;
  cost: string | null; // Mapeado desde 'bigint'
  idState: number | null;
  idUserCreate: string | null; // Mapeado desde 'bigint'
  idUserUpdate: string | null; // Mapeado desde 'bigint'
  dateCreate: Date;
  dateUpdate: Date;
}
