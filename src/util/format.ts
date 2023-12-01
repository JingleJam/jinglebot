export const money = (currency: string, amount: number, decimals = true) =>
    `${currency}${amount.toLocaleString(undefined, {
        minimumFractionDigits: decimals ? 2 : 0,
        maximumFractionDigits: decimals ? 2 : 0,
    })}`;

export const date = (date: Date, time = false) =>
    date.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        ...(time && {
            hour: "numeric",
            minute: "numeric",
            timeZone: "GMT",
            timeZoneName: "short",
        }),
    });

export const time = (date: Date, seconds = false) =>
    date.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        timeZone: "GMT",
        timeZoneName: "short",
        ...(seconds && {
            second: "numeric",
        }),
    });

export const plural = (number: number, singular: string, plural: string) =>
    `${number} ${number === 1 ? singular : plural}`;

export const timeSince = (
    start: Date,
    end: Date,
    {
        accuracy = "hours",
        floor = true,
    }: {
        accuracy?: "seconds" | "minutes" | "hours";
        floor?: boolean;
    } = {},
) => {
    // Determine our accuracy
    const minutes = accuracy === "minutes" || accuracy === "seconds";
    const seconds = accuracy === "seconds";

    // Get the difference in seconds
    const diff = Math.abs((end.getTime() - start.getTime()) / 1000);

    // Get the values for each unit
    let secs = Math.round(diff);
    let mins = Math[floor ? "floor" : "ceil"](secs / 60);
    let hours = Math[floor ? "floor" : "ceil"](mins / 60);
    const days = Math[floor ? "floor" : "ceil"](hours / 24);

    // Truncate the values
    secs %= 60;
    mins %= 60;
    hours %= 24;

    // Decide which units to show
    const parts = [
        // We'll show the number of days if it's non-zero
        ...(days ? [plural(days, "day", "days")] : []),
        // We'll show the number of hours if it's non-zero
        // We'll also show the number of hours if there are days, and minutes are enabled, and they're non-zero
        // We'll also show the number of hours if there are days, and seconds are enabled, and they're non-zero
        ...(hours || (days && minutes && mins) || (days && seconds && secs)
            ? [plural(hours, "hour", "hours")]
            : []),
        // We'll show the number of minutes if they're enabled and non-zero
        // We'll also show the number of minutes if there are days or seconds, and if seconds are enabled, and they're non-zero
        ...((minutes && mins) || ((days || hours) && seconds && secs)
            ? [plural(mins, "minute", "minutes")]
            : []),
        // We'll also show the number of seconds if they're enabled and non-zero
        ...(seconds && secs ? [plural(secs, "second", "seconds")] : []),
    ].filter(Boolean);

    // If we have no parts, return less than
    if (!parts.length) {
        if (accuracy === "seconds") return "less than a second";
        if (accuracy === "minutes") return "less than a minute";
        return "less than an hour";
    }

    // Otherwise, return a well-formatted list
    if (parts.length < 3) return parts.join(" and ");
    return `${parts.slice(0, -1).join(", ")}, and ${parts.slice(-1)}`;
};

export const number = (
    number: number,
    decimals: number | undefined = undefined,
) =>
    number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

export const bold = (text: string, escape = true) =>
    `**${escape ? text.replace(/\*/g, "\\*") : text}**`;

export const italic = (text: string, escape = true) =>
    `*${escape ? text.replace(/\*/g, "\\*") : text}*`;

export const strike = (text: string, escape = true) =>
    `~~${escape ? text.replace(/~/g, "\\~") : text}~~`;
