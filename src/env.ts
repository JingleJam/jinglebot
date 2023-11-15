export interface Env {
    DISCORD_PUBLIC_KEY: string;
    STATS_API_ENDPOINT: string;
}

export interface CtxWithEnv extends ExecutionContext {
    env: Env;
}
