# JingleBot

**Jingle Jam Discord bot built on Cloudflare Workers, providing stats commands and automatic announcements**

## Development

1. Create your test Discord application at https://discord.com/developers/applications (this does not need a bot account, just the application).
2. Create your `.dev.vars` file.
    - Copy `.dev.vars.example` and fill out the information from your Discord application, plus the ID of your test server/guild where you'll use the bot.
    - Optionally, `DISCORD_SUMMARY_CHANNEL` + `DISCORD_MILESTONE_CHANNEL` can be set to channel IDs for testing the scheduled messages, as well as the `DISCORD_BOT_TOKEN` to send the messages as.
    - Optionally, `DISCORD_CAUSES_EMOJI` can be set to a JSON object mapping the cause names to custom emoji Markdown (which can be [uploaded directly to the Discord application](https://discord.com/developers/docs/resources/emoji#emoji-object-applicationowned-emoji)).
3. Authenticate with Wrangler by running `npx wrangler login`.
4. Update `wrangler.toml` for your account.
    - Use `npx wrangler whoami` to get your account ID, update the value in `wrangler.toml` to match.
    - Use `npx wrangler kv:namespace create "STORE"` to create the KV namespace, update the `id` and `preview_id` in `wrangler.toml` to match.
5. Develop with the worker by running `npm run dev`.
    - To test the CRON functionality, hit the `/__scheduled?cron=*+*+*+*+*` endpoint.
6. (Optional) Start an HTTP tunnel to your local development server by running `npm run tunnel`, using [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/run-tunnel/trycloudflare).
    - To use a custom hostname in your Cloudflare account, first make sure you're authenticated with `cloudflared login`, then run `npm run tunnel -- --overwrite-dns --hostname <hostname> --name <name>` (where `<name>` can be any convenient name for the tunnel).

## Deployments

`wrangler.toml` and this repository is currently designed for a staging deployment and a production deployment.

Ensure that the environment in `wrangler.toml` has been updated with your chosen for the worker.

Ensure that the KV namespaces are created for staging/production environments and are configured in `wrangler.toml`. Use `npx wrangler kv:namespace create "STORE" -e <staging/production>`.

You'll also want to set `DISCORD_CLIENT_ID` + `DISCORD_PUBLIC_KEY` + `STATS_API_ENDPOINT` (optionally, `DISCORD_SUMMARY_CHANNEL` + `DISCORD_MILESTONE_CHANNEL` + `DISCORD_BOT_TOKEN` + `DISCORD_CAUSES_EMOJI` + `WORKER_BASE_URL`) as secrets for the worker, which you can do with `npx wrangler secret put <var name> -e <staging/production>` (the channel secrets can contain multiple IDs, separated by a comma).

If you're deploying for local, make sure that you've got the appropriate environment variables set for `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` + `DISCORD_GUILD_ID` (otherwise, they'll default to the values in `.dev.vars`).

To deploy from local, run `npm run publish:staging` to deploy to staging, and `npm run publish:production` to deploy to the production environment.

To deploy using GitHub, run `make deploy-staging` to force push and deploy to staging, and `make deploy-production` to force push and deploy to the production environment.

Live logs for both environments can be accessed with `npm run logs:staging` and `npm run logs:production` as needed.
