/// <reference path="typings/all.ts" />

export function getEnv(env: string) : Settings
{
    switch (env)
    {
        case 'dev':
        default:
            return {
                redisHost: null,
                redisPort: null
            };
    }
}

export interface Settings
{
    redisHost: string;
    redisPort: number;
}