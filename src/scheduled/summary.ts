import checkDate from "../util/check";
import getStats from "../util/stats";
import sendWebhook from "../util/webhook";
import type { Env } from "../env";

// Aim to post at 23:00 UTC every day
const target = () => {
    // TODO: Switch back to using the current time once testing is done
    // const now = new Date();
    const now = new Date("2023-12-02T23:15:00.000Z");
    now.setUTCHours(23, 0, 0, 0);
    return now;
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
    // TODO: Switch back to using the current time once testing is done
    // const now = new Date();
    const now = new Date("2023-12-02T23:15:00.000Z");
    console.log(now, targetSummary);
    if (now.getTime() < targetSummary.getTime()) return;

    // Check when we last posted a summary, and don't post if it was after the current target
    const lastSummary = new Date((await env.STORE.get("lastSummary")) || 0);
    if (lastSummary.getTime() >= targetSummary.getTime()) return;

    // Get the stats, and check if Jingle Jam is running
    const stats = await getStats(env.STATS_API_ENDPOINT);
    const start = new Date(stats.event.start);
    // TODO: Re-enable this check once testing is done
    // if (checkDate(start)) return;

    // Check the end, but less precisely, to allow for posting a final summary after the event
    const end = new Date(stats.event.end);
    if (isNaN(+end)) throw new Error("Invalid end date");
    end.setMinutes(end.getMinutes() + 23 * 60 + 59);
    if (now.getTime() > end.getTime()) return;

    // Format some stats
    const daysSinceLaunch = Math.ceil(
        Math.max((now.getTime() - start.getTime()) / 1000 / 60 / 60 / 24, 1),
    );

    // TODO: Send the webhooks, in the background, with errors logged to the console
    // const content = [
    //     bold(`:snowflake: Jinlge Jam ${stats.event.year} Day ${daysSinceLaunch} Summary`),
    //     "",
    //     ":heart: Thank you for supporting some wonderful causes! Get involved at <https://jinglejam.tiltify.com>",
    // ].join("\n");
    // ctx.waitUntil(
    //     Promise.all(
    //         webhooks.map((webhook) =>
    //             sendWebhook(webhook, { content }).catch(console.error),
    //         ),
    //     ),
    // );

    // Update the last summary we posted
    await env.STORE.put("lastSummary", now.toISOString());
};

export default summaryScheduled;
