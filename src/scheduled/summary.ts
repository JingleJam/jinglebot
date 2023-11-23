import getNow from "../util/now";
import { notStarted, thanks } from "../util/messages";
import getStats from "../util/stats";
import sendWebhook from "../util/webhook";
import { bold, italic, money, number, timeSince } from "../util/format";
import causesBreakdown from "../util/causes";
import type { Env } from "../env";

// Aim to post at 23:00 UTC every day
const target = () => {
    const now = getNow();
    now.setUTCHours(23, 0, 0, 0);
    return now;
};

// Check the end, but allow for posting a final summary within 12 hours of the end
const checkEnd = (end: Date) => {
    const offset = new Date(end);
    offset.setHours(offset.getHours() + 12);
    return getNow() > offset;
};

const summaryScheduled = async (
    event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
) => {
    // Short-circuit if there are no webhooks
    const webhooks = env.DISCORD_SUMMARY_WEBHOOK?.split(",")
        ?.map((s) => s.trim())
        ?.filter(Boolean);
    if (!webhooks || webhooks.length === 0) return;

    // Get the target, and short-circuit if we're not there yet
    const targetSummary = target();
    const now = getNow();
    if (now < targetSummary) return;

    // Check when we last posted a summary, and don't post if it was after the current target
    const lastSummary = new Date((await env.STORE.get("lastSummary")) || 0);
    if (lastSummary >= targetSummary) return;

    // Get the stats, and check if Jingle Jam is running
    const stats = await getStats(env.STATS_API_ENDPOINT);
    const start = new Date(stats.event.start);
    if (notStarted(start)) return;

    // Check the end, allowing for a final post after the end
    const end = new Date(stats.event.end);
    if (isNaN(+end)) throw new Error("Invalid end date");
    if (checkEnd(end)) return;

    // Format some stats
    const daysSinceLaunch = Math.ceil(
        Math.max((now.getTime() - start.getTime()) / 1000 / 60 / 60 / 24, 1),
    );
    const ended = now >= end;
    const timeElapsed = italic(timeSince(start, ended ? end : now));
    const totalRaised = bold(
        money("£", stats.raised.yogscast + stats.raised.fundraisers),
    );
    const collections = bold(number(stats.collections.redeemed));
    const fundraisers = bold(number(stats.campaigns.count - 1));

    // Send the webhooks, in the background, with errors logged to the console
    const content = [
        `# <:JingleJammy:1047503567981903894> Jingle Jam ${stats.event.year} Day ${daysSinceLaunch} Summary`,
        "",
        `<:Jammy_HAPPY:1047503540475674634> ${
            ended ? "We" : "We've"
        } raised a total of ${totalRaised} for charity over the ${timeElapsed} of Jingle Jam ${
            stats.event.year
        }${ended ? "!" : " so far!"}`,
        `:black_small_square: There ${
            ended ? "were" : "have already been"
        } ${collections} Games Collections redeemed, and ${fundraisers} fundraisers ${
            ended ? "joined" : "have joined"
        } to raise money for charity.`,
        "",
        causesBreakdown(stats),
        "",
        thanks(end, stats.event.year),
    ].join("\n");
    ctx.waitUntil(
        Promise.all(
            webhooks.map((webhook) =>
                sendWebhook(webhook, {
                    content,
                    username: "JingleBot",
                    avatar_url: env.WORKER_BASE_URL
                        ? `${env.WORKER_BASE_URL}/icon.png`
                        : undefined,
                }).catch(console.error),
            ),
        ),
    );

    // Update the last summary we posted
    await env.STORE.put("lastSummary", now.toISOString());
};

export default summaryScheduled;
