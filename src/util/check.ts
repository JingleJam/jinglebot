import getNow from "./now";
import { date, time } from "./format";

const checkDate = (start: Date) => {
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
        return `Jingle Jam hasn't launched yet! Get ready to raise money for some awesome causes and grab the games collection when it goes live at ${time(
            start,
        )}.`;
    }

    // Otherwise, show the date
    return `It's not currently Jingle Jam time. We look forward to seeing you on ${date(
        start,
    )} when we'll be back to raise money again!`;
};

export default checkDate;
