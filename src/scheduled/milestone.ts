import getStats from "../util/stats";
import { bold, money, number } from "../util/format";
import sendMessage from "../util/send";
import { thanks } from "../util/messages";
import type { Env } from "../env";
import { emojiRegular } from "../util/emoji";

const milestones = [
    100_000, 500_000, 1_000_000, 1_500_000, 2_000_000, 2_500_000, 3_000_000,
    4_000_000, 5_000_000, 6_000_000, 7_000_000, 8_000_000, 9_000_000,
    10_000_000,
];

const milestoneScheduled = async (
    event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
) => {
    // Short-circuit if there is no token
    const token = env.DISCORD_BOT_TOKEN?.trim();
    if (!token) return;

    // Short-circuit if there are no channels
    const channels = env.DISCORD_MILESTONE_CHANNEL?.split(",")
        ?.map((s) => s.trim())
        ?.filter(Boolean);
    if (!channels || channels.length === 0) return;

    // Get the latest stats, and all the milestones we've hit
    const stats = await getStats(env.STATS_API_ENDPOINT);
    const passed = milestones.filter((m) => m <= stats.raised);

    // Short-circuit + reset if we haven't hit any milestones
    const lastMilestone = Number((await env.STORE.get("lastMilestone")) || 0);
    if (passed.length === 0) {
        if (lastMilestone !== 0) await env.STORE.put("lastMilestone", "0");
        return;
    }

    // Check if we have any new milestones since the last milestone we posted
    const remainingMilestones = passed.filter((m) => m > lastMilestone);
    if (!remainingMilestones.length) return;

    // Get the most recent milestone we hit
    // This could be switched to `Math.min` if we wanted to post every milestone
    // instead of just the most recent one (skipping any intermediate ones)
    const recentMilestone = Math.max(...passed);

    // Format some stats
    const totalRaised = bold(money("£", stats.raised));
    const collections = bold(number(stats.collections.redeemed));
    const countFundraisers = bold(number(stats.campaigns.count));

    // Send the messages, in the background, with errors logged to the console
    const content = [
        `# ${emojiRegular(env, "hype")} ${money("£", recentMilestone, false)}`,
        "",
        Math.random() < 0.5
            ? `${emojiRegular(env, "mascot")} Jingle Jam ${stats.event.year} just hit a new milestone, with ${totalRaised} raised so far thanks to our fundraisers.`
            : `${emojiRegular(env, "mascot")} A new milestone has been reached! Jingle Jam ${stats.event.year} has raised ${totalRaised} so far thanks to our fundraisers.`,
        Math.random() < 0.5
            ? `:black_small_square: There have already been ${collections} Games Collections claimed, and ${countFundraisers} fundraisers have signed up to support Jingle Jam!`
            : `:black_small_square: ${collections} Games Collections have already been claimed, and ${countFundraisers} fundraisers have signed up to get involved with Jingle Jam!`,
        "",
        thanks(new Date(stats.event.end), stats.event.year, env),
    ].join("\n");
    ctx.waitUntil(
        Promise.all(
            channels.map((channel) =>
                sendMessage(
                    channel,
                    {
                        content,
                    },
                    token,
                ).catch(console.error),
            ),
        ),
    );

    // Update the last milestone we posted
    await env.STORE.put("lastMilestone", String(recentMilestone));
};

export default milestoneScheduled;
