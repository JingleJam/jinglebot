import {
    InteractionResponseType,
    ComponentType,
    ButtonStyle,
    type APIButtonComponent,
} from "discord-api-types/payloads";
import type { Component } from "workers-discord";

import type { CtxWithEnv } from "../env";

export const component: APIButtonComponent = {
    type: ComponentType.Button,
    custom_id: "ping",
    style: ButtonStyle.Secondary,
    label: "Refresh",
};

const pingComponent: Component<CtxWithEnv> = {
    name: "ping",
    execute: async ({ response }) =>
        response({
            type: InteractionResponseType.UpdateMessage,
            data: {
                content: `Pong! \`${new Date().toISOString()}\``,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [component],
                    },
                ],
            },
        }),
};

export default pingComponent;
