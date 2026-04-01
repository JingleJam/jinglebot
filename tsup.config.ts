/// <reference types="node" />

import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { defineConfig } from "tsup";
import { registerCommands } from "workers-discord";

import causesCommand from "./src/commands/causes";
import statsCommand from "./src/commands/stats";
import totalCommand from "./src/commands/total";

dotenv.config({ path: ".dev.vars", quiet: true });

// Include type definitions if they've been generated so we can check them when building
const dts = existsSync("worker-configuration.d.ts");
if (!dts) {
    console.warn(
        "worker-configuration.d.ts is required for type definitions. Please run `npm run types` to generate it.",
    );
}

export default defineConfig({
    // Generate a single ESM file for the worker
    // Include source maps to help with debugging in development
    entry: ["src/index.ts"],
    format: ["esm"],
    dts,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    outExtension: () => ({ js: ".js" }),
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
    esbuildOptions: (options) => {
        options.platform = "browser";
    },
});
