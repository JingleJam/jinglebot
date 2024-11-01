import {
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads";
import type { Command } from "workers-discord";

import getStats from "../util/stats";
import { error, loading, notStarted, thanks } from "../util/messages";
import getNow from "../util/now";
import { bold, number } from "../util/format";
import causesBreakdown, { parseEmoji } from "../util/causes";
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
                const check = notStarted(start);
                if (check) return edit({ content: check });

                // Check if Jingle Jam has finished
                const end = new Date(stats.event.end);
                if (isNaN(+end)) throw new Error("Invalid end date");
                const ended = getNow() >= end;

                await edit({
                    content: [
                        `<:JingleJammy:1047503567981903894> Jingle Jam ${
                            stats.event.year
                        } ${ended ? "supported" : "is supporting"} ${bold(
                            number(stats.causes.length),
                        )} amazing causes:`,
                        "",
                        causesBreakdown(
                            stats,
                            parseEmoji(context.env.DISCORD_CAUSES_EMOJI),
                        ),
                        "",
                        thanks(end, stats.event.year),
                    ].join("\n"),
                });
            })().catch(async (err) => {
                console.error(err);
                await edit({ content: error() });
            }),
        );

        return response({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: loading(),
                flags: MessageFlags.Ephemeral,
            },
        });
    },
};

export default causesCommand;
