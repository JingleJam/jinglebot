import { defineConfig } from "tsup";
import { registerCommands } from "workers-discord";
import dotenv from "dotenv";

import statsCommand from "./src/commands/stats";
import totalCommand from "./src/commands/total";
import causesCommand from "./src/commands/causes";

dotenv.config({ path: ".dev.vars", quiet: true });

export default defineConfig({
    // Generate a single ESM file for the worker
    // Include type definitions so we check them when building
    // Include source maps to help with debugging in development
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    outExtension: () => ({ js: ".js" }),
    // Register the commands once the worker is built
    onSuccess: async () => {
        await registerCommands(
            process.env.DISCORD_CLIENT_ID!,
            process.env.DISCORD_CLIENT_SECRET!,
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
