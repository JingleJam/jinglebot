# JingleBot

**Jingle Jam Discord bot built on Cloudflare Workers, providing stats commands and automatic announcements**

## Development

1. Create your test Discord application at https://discord.com/developers/applications (this does not need a bot account, just the application).
2. Create your `.dev.vars` file.
    - Copy `.dev.vars.example` and fill out the information from your Discord application, plus the ID of your test server/guild and webhooks for the bot to use.
3. Authenticate with Wrangler by running `npx wrangler login`.
4. Update `wrangler.toml` for your account.
    - Use `npx wrangler whoami` to get your account ID, update the value in `wrangler.toml` to match.
    - Use `npx wrangler kv:namespace create "STORE"` to create the KV namespace, update the `id` and `preview_id` in `wrangler.toml` to match.
5. Develop with the worker by running `npm run dev`.
    - To test the CRON functionality, hit the `/__scheduled?cron=*+*+*+*+*` endpoint.
6. (Optional) Start an HTTP tunnel to your local development server by running `npm run tunnel`, using [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/run-tunnel/trycloudflare).

## Deployments

`wrangler.toml` and this repository is currently designed for a staging deployment and a production deployment.

Ensure that the environment in `wrangler.toml` has been updated with your chosen for the worker.

Ensure that the KV namespaces are created for staging/production environments and are configured in `wrangler.toml`. Use `npx wrangler kv:namespace create "STORE" -e <staging/production>`.

You'll also want to set `DISCORD_PUBLIC_KEY` + `STATS_API_ENDPOINT` + `DISCORD_SUMMARY_WEBHOOK` + `DISCORD_MILESTONE_WEBHOOK` as secrets for the worker, which you can do with `npx wrangler secret put <var name> -e <staging/production>` (the webhook secrets can contain multiple webhooks, separated by a comma).

If you're deploying for local, make sure that you've got the appropriate environment variables set for `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` + `DISCORD_GUILD_ID` (otherwise, they'll default to the values in `.dev.vars`).

To deploy from local, run `npm run publish:staging` to deploy to staging, and `npm run publish:production` to deploy to the production environment.

To deploy using GitHub, run `make deploy-staging` to force push and deploy to staging, and `make deploy-production` to force push and deploy to the production environment.

Live logs for both environments can be accessed with `npm run logs:staging` and `npm run logs:production` as needed.
