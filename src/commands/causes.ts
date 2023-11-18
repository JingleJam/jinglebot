import { InteractionResponseType } from "discord-api-types/payloads";
import type { Command } from "workers-discord";

import getStats from "../util/stats";
import checkDate from "../util/check";
import { bold, italic, money, number } from "../util/format";
import type { CtxWithEnv } from "../env";

const causesCommand: Command<CtxWithEnv> = {
    name: "causes",
    description:
        "Check the causes supported by Jingle Jam. See how much has been raised for each cause.",
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

                await edit({
                    content: [
                        `:snowflake: Jingle Jam ${stats.event.year} ${
                            ended ? "supported" : "is supporting"
                        } ${bold(number(stats.causes.length))} amazing causes:`,
                        "",
                        ...stats.causes.map((cause) =>
                            bold(
                                `[${cause.name}](${cause.url}): ${money(
                                    "£",
                                    cause.raised.yogscast +
                                        cause.raised.fundraisers,
                                )}`,
                            ),
                        ),
                        "",
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

export default causesCommand;
