import type { Env } from "../env";

const parseEmoji = (env?: string): Record<string, string> => {
    try {
        const raw = JSON.parse(env || "{}");
        if (
            typeof raw !== "object" ||
            raw === null ||
            Object.entries(raw).some(
                ([key, value]) =>
                    typeof key !== "string" || typeof value !== "string",
            )
        )
            throw new Error("Invalid JSON");
        return raw;
    } catch (e) {
        return {};
    }
};

const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
};

const hearts = [
    ":heart:",
    ":orange_heart:",
    ":yellow_heart:",
    ":green_heart:",
    ":blue_heart:",
    ":purple_heart:",
];

let emojiCausesCache: Record<string, string> | null = null;
export const emojiCauses = (env: Env, cause: string) => {
    const obj =
        emojiCausesCache ||
        (emojiCausesCache = parseEmoji(env.DISCORD_CAUSES_EMOJI));
    return obj[cause] || hearts[Math.abs(hash(cause)) % hearts.length];
};

const regular = {
    mascot: ":snowflake:",
    happy: ":smile:",
    hype: ":partying_face:",
    love: ":heart_eyes:",
    sad: ":sob:",
};

let emojiRegularCache: Record<string, string> | null = null;
export const emojiRegular = (env: Env, type: keyof typeof regular) => {
    if (!(type in regular)) throw new Error(`Invalid emoji type: ${type}`);

    const obj =
        emojiRegularCache ||
        (emojiRegularCache = parseEmoji(env.DISCORD_REGULAR_EMOJI));
    return obj[type] || regular[type as keyof typeof regular];
};
