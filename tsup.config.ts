import { defineConfig } from 'tsup';
import { registerCommands } from 'workers-discord';
import dotenv from 'dotenv';

import pingCommand from './src/commands/ping';

dotenv.config({ path: '.dev.vars' });

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
    onSuccess: async () => {
        await registerCommands(
            process.env.DISCORD_CLIENT_ID!,     // Discord application client ID
            process.env.DISCORD_CLIENT_SECRET!, // Discord application client secret
            [ pingCommand ],                    // Array of commands to register with Discord
            true,                               // Whether to log warnings for any invalid commands passed
            process.env.DISCORD_GUILD_ID,       // Optional guild ID to register guild-specific commands
        );
    },
});
