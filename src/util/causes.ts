import type { Env } from "../env.ts";
import { emojiCauses } from "./emoji.ts";
import { bold, money } from "./format.ts";
import type { Stats } from "./stats.ts";

const causesBreakdown = (stats: Stats, env: Env) =>
    stats.causes
        .map((cause) => {
            return bold(
                `${emojiCauses(env, cause.name)} [${cause.name}](${
                    cause.url
                }): ${money("£", cause.raised)}`,
            );
        })
        .join("\n");

export default causesBreakdown;
