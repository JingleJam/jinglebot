import type { Env } from "../env";
import getNow from "./now";
import { timeSince, italic, strike } from "./format";
import { emojiRegular } from "./emoji";

export const notStarted = (start: Date, env: Env) => {
    // Ensure we have a valid date
    if (isNaN(+start)) throw new Error("Invalid start date");

    // If the date is in the past, we're fine
    const now = getNow();
    if (start < now) return null;

    // Check if we're within the final day
    const finalDay = start.getTime() - now.getTime() <= 1000 * 60 * 60 * 24;

    // Get time until we start (show minutes if within the final day)
    const timeRemaining = italic(
        timeSince(start, now, { accuracy: finalDay ? "minutes" : "hours" }),
    );

    // If we're within the same day, show the time
    if (finalDay) {
        return (
            `${emojiRegular(env, "mascot")} Jingle Jam launches in ${timeRemaining}!` +
            "\n:black_small_square: Get ready to raise money for some awesome causes and grab the collection when it goes live."
        );
    }

    // Otherwise, show the date
    return (
        `${emojiRegular(env, "mascot")} It's not currently Jingle Jam time.` +
        `\n:black_small_square: We look forward to seeing you in ${timeRemaining} when we'll be back to raise money again!`
    );
};

export const thanks = (end: Date, year: number, env: Env) => {
    // Ensure we have a valid date
    if (isNaN(+end)) throw new Error("Invalid start date");

    // Determine if Jingle Jam has ended
    const now = getNow();
    if (now >= end) {
        return (
            `${emojiRegular(env, "love")} Thank you for supporting some wonderful causes!` +
            ` We look forward to seeing you again for Jingle Jam ${year + 1}.`
        );
    }

    // Check if we're within the final hour
    const finalHour = end.getTime() - now.getTime() <= 1000 * 60 * 60;

    // Get time until we end (show minutes if within the final hour)
    const timeRemaining = italic(
        timeSince(now, end, { accuracy: finalHour ? "minutes" : "hours" }),
    );

    // Otherwise, show the time remaining
    return (
        (Math.random() < 0.5
            ? `${emojiRegular(env, "love")} Thank you for supporting some wonderful causes!`
            : `${emojiRegular(env, "love")} Your support means the world to these amazing causes. Thank you!`) +
        (Math.random() < 0.5
            ? `\n:mega: There ${
                  /^(\D*1|less) /.test(timeRemaining) ? "is" : "are"
              } still ${timeRemaining} remaining to get involved and grab the collection at <https://jinglejam.co.uk/donate>`
            : `\n:mega: Keep the momentum going! With ${timeRemaining} left, grab your collection at <https://jinglejam.co.uk/donate>`)
    );
};

export const error = (env: Env) =>
    `${emojiRegular(env, "sad")} Sorry, an error occurred while fetching the stats.` +
    `\n:black_small_square: ${italic(
        `An ${strike(
            "angry",
        )} polite message has been sent to the team letting them know.`,
    )}`;

export const loading = (env: Env) =>
    `${emojiRegular(env, "mascot")} Fetching the latest Jingle Jam stats...`;
