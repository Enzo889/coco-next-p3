import { TYPE_PETITION } from "@/types/type_petition.enum";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PETITION_TITLES: Record<TYPE_PETITION, string> = {
  [TYPE_PETITION.newPetition]: "Nueva Petición Creada",
  [TYPE_PETITION.newPostulation]: "Nueva Postulación",
  [TYPE_PETITION.petitionSelected]: "Petición Aceptada",
  [TYPE_PETITION.petitionRejected]: "Petición Rechazada",
};

export function getPetitionTitle(type: TYPE_PETITION): string {
  switch (type) {
    case TYPE_PETITION.newPetition:
      return "Nueva Petición";
    case TYPE_PETITION.newPostulation:
      return "Nueva Postulación";
    case TYPE_PETITION.petitionSelected:
      return "Petición Aceptada";
    case TYPE_PETITION.petitionRejected:
      return "Petición Rechazada";
    default:
      return PETITION_TITLES[type] || ""; // Devuelve cadena vacía si el tipo no coincide
  }
}
