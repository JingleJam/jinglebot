import { createHandler } from "workers-discord";

import statsCommand from "./commands/stats";
import totalCommand from "./commands/total";
import causesCommand from "./commands/causes";
import summaryScheduled from "./scheduled/summary";
import milestoneScheduled from "./scheduled/milestone";
import iconAssetPNG from "./assets/icon.png";
import iconAssetSVG from "./assets/icon.svg";
import type { CtxWithEnv, Env } from "./env";

let handler: ReturnType<typeof createHandler<CtxWithEnv>>;

const worker: ExportedHandler<Env> = {
    fetch: async (request, env, ctx) => {
        // Create the handler if it doesn't exist yet
        handler ??= createHandler<CtxWithEnv>(
            [statsCommand, totalCommand, causesCommand],
            [],
            env.DISCORD_PUBLIC_KEY,
            true,
        );

        // Run the handler, passing the environment to the command/component context
        (ctx as CtxWithEnv).env = env;
        const resp = await handler(request, ctx as CtxWithEnv);
        if (resp) return resp;

        // Parse the URL
        const url = new URL(request.url);

        // Provide a direct link to invite the app
        if (request.method === "GET" && url.pathname === "/invite") {
            return Response.redirect(
                `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&scope=applications.commands`,
                302,
            );
        }

        // Serve the icon for the scheduled webhook messages
        if (request.method === "GET" && url.pathname === "/icon.png") {
            return new Response(iconAssetPNG, {
                headers: { "Content-Type": "image/png" },
            });
        }
        if (request.method === "GET" && url.pathname === "/icon.svg") {
            return new Response(iconAssetSVG, {
                headers: { "Content-Type": "image/svg+xml" },
            });
        }

        // Fallback for any requests not handled by the handler
        return new Response("Not found", { status: 404 });
    },
    scheduled: async (event, env, ctx) => {
        // Provide some automated posting
        await summaryScheduled(event, env, ctx);
        await milestoneScheduled(event, env, ctx);
    },
};

export default worker;
