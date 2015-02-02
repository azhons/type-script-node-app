declare module "redis" {
    interface RedisClient {
        incrAsync(key: string): Promise<number>;
        zaddAsync(key: string, score: number, value: string): Promise<number>;
        zrangebyscoreAsync(key: string, min: string, max: string): Promise<string[]>;
        zrevrangebyscoreAsync(key: string, max: string, min: string): Promise<string[]>;
        delAsync(key: string): Promise<number>;
        lpushAsync(key: string, value: string): Promise<number>;
    }
}

declare module SocketIO {
    interface Server {
        set(...args: any[]);
    }
}

declare module LazyJS {
    interface SequenceBaser<T> {
        sort(): Sequence<T>;
    }
}

declare module "parallel-io" {

    interface Group
    {
        onAllDone(callback: (result: any) => void);
        wrap(key: string, callback: Function);
    }

    function groupCreator(): Group;

    export = groupCreator;
}