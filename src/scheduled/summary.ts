import getNow from "../util/now";
import checkDate from "../util/check";
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
    if (checkDate(start)) return;

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
    const timeRemaining = ended ? null : italic(timeSince(now, end));
    const totalRaised = bold(
        money("£", stats.raised.yogscast + stats.raised.fundraisers),
    );
    const collections = bold(number(stats.collections.redeemed));
    const fundraisers = bold(number(stats.campaigns.count - 1));

    // Send the webhooks, in the background, with errors logged to the console
    const content = [
        `# :snowflake: Jingle Jam ${stats.event.year} Day ${daysSinceLaunch} Summary`,
        "",
        `:money_with_wings: ${
            ended ? "We" : "We've"
        } raised a total of ${totalRaised} for charity over the ${timeElapsed} of Jingle Jam ${
            stats.event.year
        }${ended ? "!" : " so far!"}`,
        `:package: There ${
            ended ? "were" : "have already been"
        } ${collections} games collections redeemed, and ${fundraisers} fundraisers ${
            ended ? "joined" : "have joined"
        } to raise money for charity.`,
        "",
        causesBreakdown(stats),
        "",
        `:heart: Thank you for supporting some wonderful causes! ${
            timeRemaining
                ? `\n:arrow_right: There ${
                      /^\D*1 /.test(timeRemaining) ? "is" : "are"
                  } still ${timeRemaining} remaining to get involved and grab the collection at <https://jinglejam.tiltify.com>`
                : `We look forward to seeing you again for Jingle Jam ${
                      stats.event.year + 1
                  }.`
        }`,
    ].join("\n");
    ctx.waitUntil(
        Promise.all(
            webhooks.map((webhook) =>
                sendWebhook(webhook, { content }).catch(console.error),
            ),
        ),
    );

    // Update the last summary we posted
    await env.STORE.put("lastSummary", now.toISOString());
};

export default summaryScheduled;
