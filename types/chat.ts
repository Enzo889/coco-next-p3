export interface Message {
  idMessage: number;
  idPetition: number | null;
  idSenderUser: number;
  idReceiverUser: number;
  content: string;
  viewed: boolean;
  dateCreate: Date | string;
  dateUpdate: Date | string;
  senderName?: string;
  senderEmail?: string;
  receiverName?: string;
  receiverEmail?: string;
}

export interface Conversation {
  userId: number;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageDate: Date | string;
  unreadCount: number;
}

export interface SendMessageDto {
  receiverId: number;
  content: string;
  petitionId?: number;
}
