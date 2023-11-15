import {
    InteractionResponseType,
    MessageFlags,
    ComponentType,
} from "discord-api-types/payloads";
import { type Command } from "workers-discord";

import { component } from "../components/ping";

const pingCommand: Command = {
    name: "ping",
    description: "Ping the application to check if it is online.",
    execute: ({ response, wait, edit }) => {
        wait(
            (async () => {
                await new Promise((resolve) => setTimeout(resolve, 5000));

                await edit({
                    content: `Pong! \`${new Date().toISOString()}\``,
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [component],
                        },
                    ],
                });
            })(),
        );

        return response({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Pinging...",
                flags: MessageFlags.Ephemeral,
            },
        });
    },
};

export default pingCommand;
