import { newRegister } from "@/types/home";

export interface letterListType extends newRegister {
  email: string | null;
}

export interface letterType {
  content: string;
  createdAt: Date;
  email: string;
  id: string;
  isRead: number;
  isReply: number;
  replyContent: string | null;
  status: number;
}
