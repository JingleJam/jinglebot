import {
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads";
import type { Command } from "workers-discord";

import getStats from "../util/stats";
import type { CtxWithEnv } from "../env";

const statsCommand: Command<CtxWithEnv> = {
    name: "stats",
    description:
        "Get the latest stats for Jingle Jam. Check how much has been raised for some awesome causes.",
    execute: ({ response, wait, edit, context }) => {
        wait(
            (async () => {
                const stats = await getStats(context.env.STATS_API_ENDPOINT);
                console.log(stats);

                await edit({
                    content: `Total Raised: ${
                        stats.raised.yogscast + stats.raised.fundraisers
                    }`,
                });
            })().catch(async (error) => {
                console.error(error);

                await edit({
                    content: "An error occurred while fetching the stats.",
                });
            }),
        );

        return response({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Fetching...",
                flags: MessageFlags.Ephemeral,
            },
        });
    },
};

export default statsCommand;
