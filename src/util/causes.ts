import type { Env } from "../env";
import { emojiCauses } from "./emoji";
import { bold, money } from "./format";
import type { Stats } from "./stats";

const causesBreakdown = (stats: Stats, env: Env) =>
    stats.causes
        .map((cause) => {
            return bold(
                `${emojiCauses(env, cause.name)} [${cause.name}](${
                    cause.url
                }): ${money(
                    "£",
                    cause.raised.yogscast + cause.raised.fundraisers,
                )}`,
            );
        })
        .join("\n");

export default causesBreakdown;
