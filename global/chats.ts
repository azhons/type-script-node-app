export interface ChatMessage
{
    text: string;
    author?: number;
    time?: number;
    counter?: number;
}

export interface ClientChatContext
{
    otherUserId: number;
    lastReadCounter: number;
}