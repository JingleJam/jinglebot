export interface Env {
    DISCORD_CLIENT_ID: string;
    DISCORD_PUBLIC_KEY: string;
    STATS_API_ENDPOINT: string;
    DISCORD_SUMMARY_WEBHOOK?: string;
    DISCORD_MILESTONE_WEBHOOK?: string;
    WORKER_BASE_URL?: string;
    STORE: KVNamespace;
}

export interface CtxWithEnv extends ExecutionContext {
    env: Env;
}
