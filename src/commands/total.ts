import { InteractionResponseType } from "discord-api-types/payloads";
import type { Command } from "workers-discord";

import getStats from "../util/stats";
import checkDate from "../util/check";
import { bold, italic, money, number } from "../util/format";
import type { CtxWithEnv } from "../env";

const totalCommand: Command<CtxWithEnv> = {
    name: "total",
    description:
        "Check the total raised for Jingle Jam, and how many bundles have been claimed.",
    execute: ({ response, wait, edit, context }) => {
        wait(
            (async () => {
                const stats = await getStats(context.env.STATS_API_ENDPOINT);

                // Check if Jingle Jam is running
                const start = new Date(stats.event.start);
                const check = checkDate(start);
                // TODO: Re-enable this check once testing is done
                // if (check) return edit({ content: check });

                // Check if Jingle Jam has finished
                const end = new Date(stats.event.end);
                if (isNaN(+end)) throw new Error("Invalid end date");

                // Time since launch
                // TODO: Switch back to using the current time once testing is done
                // const now = new Date();
                const now = end;
                const ended = now >= end;

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

                const bundles = bold(number(stats.collections.redeemed));

                await edit({
                    content: [
                        `:snowflake: ${totalRaised} ${
                            ended ? "was" : "has been"
                        } raised for charity (Yogscast: ${totalYogscast}, fundraisers: ${totalFundraisers}) during Jingle Jam ${
                            stats.event.year
                        }${ended ? "!" : " so far!"} `,
                        `:package: ${bundles} bundles ${
                            ended ? "were" : "have been"
                        } redeemed, and over all the years, we've now raised ${historyRaised} for charity!`,
                        `:heart: Thank you for supporting some wonderful causes! ${
                            ended
                                ? `We look forward to seeing you again for Jingle Jam ${
                                      stats.event.year + 1
                                  }.`
                                : "Get involved at <https://jinglejam.tiltify.com>"
                        }`,
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
            },
        });
    },
};

export default totalCommand;
