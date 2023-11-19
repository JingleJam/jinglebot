import { defineConfig } from "tsup";
import { registerCommands } from "workers-discord";
import dotenv from "dotenv";

import statsCommand from "./src/commands/stats";
import totalCommand from "./src/commands/total";
import causesCommand from "./src/commands/causes";

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
            [statsCommand, totalCommand, causesCommand],
            true,
            process.env.DISCORD_GUILD_ID,
        );
    },
});
