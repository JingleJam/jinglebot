import dotenv from "dotenv";
import { defineConfig } from "tsdown";
import { registerCommands } from "workers-discord";

import causesCommand from "./src/commands/causes.ts";
import statsCommand from "./src/commands/stats.ts";
import totalCommand from "./src/commands/total.ts";

dotenv.config({ path: ".dev.vars", quiet: true });

export default defineConfig({
    // Include source maps to help with debugging in development
    sourcemap: true,
    // Register the commands once the worker is built
    onSuccess: async () => {
        if (
            !process.env.DISCORD_CLIENT_ID ||
            !process.env.DISCORD_CLIENT_SECRET
        ) {
            console.warn(
                "DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET are required to register commands. Skipping registration.",
            );
            return;
        }

        await registerCommands(
            process.env.DISCORD_CLIENT_ID,
            process.env.DISCORD_CLIENT_SECRET,
            [statsCommand, totalCommand, causesCommand],
            true,
            process.env.DISCORD_GUILD_ID,
        );
    },
    // Allow importing of PNG and SVG files
    // Set platform to browser so esbuild uses `atob`, not `Buffer`
    loader: {
        ".png": "binary",
        ".svg": "text",
    },
    // Apply no syntax transformations and assume a browser-ish environment, not Node.js
    target: false,
    platform: "browser",
});
