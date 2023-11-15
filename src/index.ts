import { createHandler } from "workers-discord";

import pingCommand from "./commands/ping";
import pingComponent from "./components/ping";
import statsCommand from "./commands/stats";
import type { CtxWithEnv, Env } from "./env";

let handler: ReturnType<typeof createHandler<CtxWithEnv>>;

const worker: ExportedHandler<Env> = {
    fetch: async (request, env, ctx) => {
        // Create the handler if it doesn't exist yet
        handler ??= createHandler<CtxWithEnv>(
            [pingCommand, statsCommand],
            [pingComponent],
            env.DISCORD_PUBLIC_KEY,
            true,
        );

        // Run the handler, passing the environment to the command/component context
        (ctx as CtxWithEnv).env = env;
        const resp = await handler(request, ctx as CtxWithEnv);
        if (resp) return resp;

        // Fallback for any requests not handled by the handler
        return new Response("Not found", { status: 404 });
    },
};

export default worker;
