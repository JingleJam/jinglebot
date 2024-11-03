import {
    RouteBases,
    Routes,
    type RESTPostAPIChannelMessageJSONBody,
    type RESTPostAPIChannelMessageResult,
} from "discord-api-types/rest";
import type { Snowflake } from "discord-api-types/globals";

const api = async (
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    token?: string,
    data?: any,
) => {
    const res = await fetch(`${RouteBases.api}${endpoint}`, {
        method,
        body: data !== undefined ? JSON.stringify(data) : undefined,
        headers: {
            ...(token !== undefined && { Authorization: `Bot ${token}` }),
            ...(data !== undefined && { "Content-Type": "application/json" }),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Received unexpected status code ${res.status} from ${method} ${endpoint} - ${text}`,
        );
    }

    return res;
};

const sendMessage = async (
    channel: Snowflake,
    data: RESTPostAPIChannelMessageJSONBody,
    token: string,
) =>
    api(Routes.channelMessages(channel), "POST", token, data).then(
        (res) => res.json() as Promise<RESTPostAPIChannelMessageResult>,
    );

export default sendMessage;
