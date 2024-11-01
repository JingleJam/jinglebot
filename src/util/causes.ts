import { bold, money } from "./format";
import type { Stats } from "./stats";

export const parseEmoji = (env?: string): Record<string, string> => {
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

const heart = (str: string) => hearts[Math.abs(hash(str)) % hearts.length];

const causesBreakdown = (stats: Stats, emoji: Record<string, string>) =>
    stats.causes
        .map((cause) => {
            return bold(
                `[${emoji[cause.name] || heart(cause.name)} ${cause.name}](${
                    cause.url
                }): ${money(
                    "£",
                    cause.raised.yogscast + cause.raised.fundraisers,
                )}`,
            );
        })
        .join("\n");

export default causesBreakdown;
