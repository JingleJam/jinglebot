import { createHandler } from 'workers-discord';

import pingCommand from './commands/ping';
import pingComponent from './components/ping';

interface Env {
    DISCORD_PUBLIC_KEY: string;
};

type CtxWithEnv = ExecutionContext & { env: Env };

let handler: ReturnType<typeof createHandler<Request, CtxWithEnv>>;

const worker: ExportedHandler<Env> = {
    fetch: async (request, env, ctx) => {
        // Create the handler if it doesn't exist yet
        handler ??= createHandler<Request, CtxWithEnv>(
            [ pingCommand ],        // Array of commands to handle interactions for
            [ pingComponent ],      // Array of components to handle interactions for
            env.DISCORD_PUBLIC_KEY, // Discord application public key
            true,                   // Whether to log warnings for any invalid commands/components passed
        );

        // Run the handler, passing the environment to the command/component context
        (ctx as CtxWithEnv).env = env;
        const resp = await handler(request, ctx as CtxWithEnv);
        if (resp) return resp;

        // Fallback for any requests not handled by the handler
        return new Response('Not found', { status: 404 });
    },
};

export default worker;
