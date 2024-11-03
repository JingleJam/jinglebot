export interface Env {
    DISCORD_CLIENT_ID: string;
    DISCORD_PUBLIC_KEY: string;
    DISCORD_BOT_TOKEN?: string;
    STATS_API_ENDPOINT: string;
    DISCORD_SUMMARY_CHANNEL?: string;
    DISCORD_MILESTONE_CHANNEL?: string;
    DISCORD_CAUSES_EMOJI?: string;
    WORKER_BASE_URL?: string;
    STORE: KVNamespace;
}

export interface CtxWithEnv extends ExecutionContext {
    env: Env;
}
