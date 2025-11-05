export enum TYPE_PETITION {
  newPetition = "new_petition",
  newPostulation = "postulation",
  petitionSelected = "petition_selected",
  petitionRejected = "petition_rejected",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNotificationMessage(type: TYPE_PETITION, data: any): string {
  switch (type) {
    case TYPE_PETITION.newPetition:
      return `Nueva petición #${data.petitionId}: ${data.description?.substring(
        0,
        50
      )}...`;
    case TYPE_PETITION.newPostulation:
      return `Nueva postulación en tu petición: ${data.petitionDescription?.substring(
        0,
        40
      )}...`;
    case TYPE_PETITION.petitionSelected:
      return `¡Felicidades! Tu postulación fue seleccionada en: ${data.petitionDescription?.substring(
        0,
        40
      )}...`;
    case TYPE_PETITION.petitionRejected:
      return `Lamentablemente, tu postulación no fue seleccionada en: ${data.petitionDescription?.substring(
        0,
        40
      )}...`;
    default:
      return "Nueva notificación";
  }
}
