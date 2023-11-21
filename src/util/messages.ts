import getNow from "./now";
import { date, time, timeSince } from "./format";

export const notStarted = (start: Date) => {
    // Ensure we have a valid date
    if (isNaN(+start)) throw new Error("Invalid start date");

    // If the date is in the past, we're fine
    const now = getNow();
    if (start < now) return null;

    // If we're within the same day, show the time
    if (
        start.getUTCFullYear() === now.getUTCFullYear() &&
        start.getUTCMonth() === now.getUTCMonth() &&
        start.getUTCDate() === now.getUTCDate()
    ) {
        return `<:JingleJammy:1047503567981903894> Jingle Jam hasn't launched yet! Get ready to raise money for some awesome causes and grab the games collection when it goes live at ${time(
            start,
        )}.`;
    }

    // Otherwise, show the date
    return `<:JingleJammy:1047503567981903894> It's not currently Jingle Jam time. We look forward to seeing you on ${date(
        start,
    )} when we'll be back to raise money again!`;
};

export const thanks = (end: Date, year: number) => {
    // Ensure we have a valid date
    if (isNaN(+end)) throw new Error("Invalid start date");

    // Determine if Jingle Jam has ended
    const now = getNow();
    if (now >= end) {
        return (
            "<:Jammy_LOVE:1047503543935967273> Thank you for supporting some wonderful causes!" +
            `We look forward to seeing you again for Jingle Jam ${year + 1}.`
        );
    }

    // Otherwise, show the time remaining
    const timeRemaining = timeSince(now, end);
    return (
        `<:Jammy_LOVE:1047503543935967273> Thank you for supporting some wonderful causes!` +
        `\n:mega: There ${
            /^1 /.test(timeRemaining) ? "is" : "are"
        } still _${timeRemaining}_ remaining to get involved and grab the collection at <https://jinglejam.tiltify.com>`
    );
};

export const error = () =>
    "<:Jammy_SAD:1047503547555643392> Sorry, an error occurred while fetching the stats." +
    "\n  _An ~~angry~~ polite message has been sent to the team letting them know._";

export const loading = () =>
    "<:JingleJammy:1047503567981903894> Fetching the latest Jingle Jam stats...";
