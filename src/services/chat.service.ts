import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  type: 'text' | 'image' | 'document';
  imageUrl?: string;
  documentUrl?: string;
  timestamp: Timestamp;
  isRead: boolean;
  readAt: Timestamp | null;
  isDelivered: boolean;
  deliveredAt: Timestamp;
}

export interface Conversation {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserPhoto: string | null;
  lastMessage: string | null;
  lastMessageTime: Timestamp | null;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
}

export class ChatService {
  static subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ): Unsubscribe {
    const db = getDb();
    const conversationsRef = collection(
      db,
      'userConversations',
      userId,
      'conversations'
    );
    const q = query(
      conversationsRef,
      orderBy('lastMessageTime', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const conversations: Conversation[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          conversationId: doc.id,
          otherUserId: data.otherUserId ?? '',
          otherUserName: data.otherUserName ?? 'Unknown',
          otherUserPhoto: data.otherUserPhoto ?? null,
          lastMessage: data.lastMessage ?? null,
          lastMessageTime: data.lastMessageTime ?? null,
          unreadCount: data.unreadCount ?? 0,
          isPinned: data.isPinned ?? false,
          isMuted: data.isMuted ?? false,
          isArchived: data.isArchived ?? false,
        });
      });
      callback(conversations);
    });
  }

  static subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): Unsubscribe {
    const db = getDb();
    const messagesRef = collection(
      db,
      'conversations',
      conversationId,
      'messages'
    );
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          messageId: doc.id,
          conversationId: data.conversationId ?? '',
          senderId: data.senderId ?? '',
          receiverId: data.receiverId ?? '',
          text: data.text ?? '',
          type: (data.type as Message['type']) ?? 'text',
          imageUrl: data.imageUrl,
          documentUrl: data.documentUrl,
          timestamp: data.timestamp,
          isRead: data.isRead ?? false,
          readAt: data.readAt ?? null,
          isDelivered: data.isDelivered ?? false,
          deliveredAt: data.deliveredAt ?? data.timestamp,
        });
      });
      callback(messages);
    });
  }

  static subscribeToUnreadCount(
    userId: string,
    callback: (count: number) => void
  ): Unsubscribe {
    const db = getDb();
    const conversationsRef = collection(
      db,
      'userConversations',
      userId,
      'conversations'
    );
    return onSnapshot(conversationsRef, (snapshot) => {
      let totalUnread = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        totalUnread += data.unreadCount ?? 0;
      });
      callback(totalUnread);
    });
  }
}
