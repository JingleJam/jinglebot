import {
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads";
import type { Command } from "workers-discord";

import getStats from "../util/stats";
import checkDate from "../util/check";
import getNow from "../util/now";
import { bold, italic, money, number, timeSince } from "../util/format";
import type { CtxWithEnv } from "../env";

const statsCommand: Command<CtxWithEnv> = {
    name: "stats",
    description:
        "Get the latest stats for Jingle Jam. Check how much has been raised for some awesome causes.",
    execute: ({ response, wait, edit, context }) => {
        wait(
            (async () => {
                const stats = await getStats(context.env.STATS_API_ENDPOINT);

                // Check if Jingle Jam is running
                const start = new Date(stats.event.start);
                const check = checkDate(start);
                if (check) return edit({ content: check });

                // Check if Jingle Jam has finished
                const end = new Date(stats.event.end);
                if (isNaN(+end)) throw new Error("Invalid end date");

                // Time since launch
                const now = getNow();
                const ended = now >= end;
                const timeSinceLaunch = Math.min(
                    now.getTime() - start.getTime(),
                    end.getTime() - start.getTime(),
                );
                const hoursSinceLaunch = Math.max(
                    timeSinceLaunch / 1000 / 60 / 60,
                    1,
                );
                const daysSinceLaunch = Math.max(hoursSinceLaunch / 24, 1);
                const timeElapsed = italic(timeSince(start, ended ? end : now));
                const timeRemaining = ended
                    ? null
                    : italic(timeSince(now, end));

                // Format some stats
                const totalRaised = bold(
                    money(
                        "£",
                        stats.raised.yogscast + stats.raised.fundraisers,
                    ),
                );
                const totalYogscast = bold(money("£", stats.raised.yogscast));
                const totalFundraisers = bold(
                    money("£", stats.raised.fundraisers),
                );

                const countFundraisers = bold(
                    number(stats.campaigns.count - 1),
                );
                const countCauses = bold(number(stats.causes.length));

                const historyRaised = bold(
                    money(
                        "£",
                        stats.raised.yogscast +
                            stats.raised.fundraisers +
                            stats.history.reduce(
                                (total, year) => total + year.total.pounds,
                                0,
                            ),
                    ),
                );
                const historyDonations = bold(
                    number(
                        stats.donations.count +
                            stats.history.reduce(
                                (total, year) => total + year.donations,
                                0,
                            ),
                    ),
                );
                const historyYears = bold(number(stats.history.length));
                const historyOldest = bold(
                    Math.min(
                        ...stats.history.map((year) => year.year),
                    ).toString(),
                );

                const collections = bold(number(stats.collections.redeemed));
                const average = bold(
                    money("£", stats.raised.yogscast / stats.donations.count),
                );

                const perHourDonations = bold(
                    number(stats.donations.count / hoursSinceLaunch, 0),
                );
                const perDayDonations = bold(
                    number(stats.donations.count / daysSinceLaunch, 0),
                );
                const perHourCollections = bold(
                    number(stats.collections.redeemed / hoursSinceLaunch, 0),
                );
                const perDayCollections = bold(
                    number(stats.collections.redeemed / daysSinceLaunch, 0),
                );

                await edit({
                    content: [
                        bold(
                            `:snowflake: Jingle Jam ${stats.event.year} Stats`,
                        ),
                        "",
                        `:money_with_wings: ${
                            ended ? "We" : "We've"
                        } raised a total of ${totalRaised} for charity over the ${timeElapsed} of Jingle Jam ${
                            stats.event.year
                        }${ended ? "!" : " so far!"}`,
                        `  Of that, ${totalYogscast} by the Yogscast, and ${totalFundraisers} from fundraisers.`,
                        `  There ${
                            ended ? "were" : "are currently"
                        } ${countFundraisers} fundraisers${
                            ended ? " this year" : ""
                        }, supporting the ${countCauses} amazing causes.`,
                        "",
                        `:package: This year, ${collections} games collections ${
                            ended ? "were" : "have already been"
                        } redeemed, with the average donation being ${average}.`,
                        `  That works out to an average of ${perHourCollections} collections claimed per hour, or ${perDayCollections} collections per day.`,
                        `  We've also received an average of ${perHourDonations} donations per hour, or ${perDayDonations} donations per day.`,
                        "",
                        `:scroll: Over the past ${historyYears} years, plus this year, we've raised a total of ${historyRaised} for charity!`,
                        `  Since ${historyOldest}, we've received ${historyDonations} charitable donations as part of Jingle Jam.`,
                        "",
                        `:heart: Thank you for supporting some wonderful causes! ${
                            timeRemaining
                                ? `\n:arrow_right: There ${
                                      /^\D*1 /.test(timeRemaining)
                                          ? "is"
                                          : "are"
                                  } still ${timeRemaining} remaining to get involved and grab the collection at <https://jinglejam.tiltify.com>`
                                : `We look forward to seeing you again for Jingle Jam ${
                                      stats.event.year + 1
                                  }.`
                        }`,
                        "",
                        `:chart_with_upwards_trend: ${italic(
                            "Explore more stats at <https://www.jinglejam.co.uk/tracker>",
                        )}`,
                    ].join("\n"),
                });
            })().catch(async (error) => {
                console.error(error);

                await edit({
                    content: [
                        ":pensive: Sorry, an error occurred while fetching the stats.",
                        italic(
                            "An ~~angry~~ polite message has been sent to the team letting them know.",
                        ),
                    ].join("\n"),
                });
            }),
        );

        return response({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: ":mag: Fetching the latest Jingle Jam stats...",
                flags: MessageFlags.Ephemeral,
            },
        });
    },
};

export default statsCommand;
