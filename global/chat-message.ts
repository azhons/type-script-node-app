interface ChatMessage
{
    text: string;
    author: number;
    time?: number;
    counter?: number;
}

export = ChatMessage;