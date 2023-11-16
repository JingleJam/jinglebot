import { defineConfig } from "tsup";
import { registerCommands } from "workers-discord";
import dotenv from "dotenv";

import pingCommand from "./src/commands/ping";
import statsCommand from "./src/commands/stats";
import totalCommand from "./src/commands/total";

dotenv.config({ path: ".dev.vars" });

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    outExtension: () => ({ js: ".js" }),
    onSuccess: async () => {
        await registerCommands(
            process.env.DISCORD_CLIENT_ID!,
            process.env.DISCORD_CLIENT_SECRET!,
            [pingCommand, statsCommand, totalCommand],
            true,
            process.env.DISCORD_GUILD_ID,
        );
    },
});
