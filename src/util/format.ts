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
    minutes = false,
    seconds = false,
) => {
    const diff = Math.abs(end.getTime() - start.getTime());
    const secs = Math.floor(diff / 1000);
    const mins = seconds
        ? Math.floor(diff / 1000 / 60)
        : Math.round(diff / 1000 / 60);
    const hours =
        minutes || seconds
            ? Math.floor(diff / 1000 / 60 / 60)
            : Math.round(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    const parts = [
        // Only show days if there are days
        days > 0 && plural(days, "day", "days"),
        // Only show hours if there are hours, seconds, or minutes
        hours > 0 &&
            (hours % 24 !== 0 ||
                (minutes && mins % 60 !== 0) ||
                (seconds && secs % 60 !== 0)) &&
            plural(hours % 24, "hour", "hours"),
        // Only show minutes if there are minutes or seconds
        minutes &&
            mins > 0 &&
            (mins % 60 !== 0 || (seconds && secs % 60 !== 0)) &&
            plural(mins % 60, "minute", "minutes"),
        // Only show seconds if there are seconds
        seconds && secs > 0 && plural(secs % 60, "second", "seconds"),
    ].filter(Boolean);

    // Format as a well-formed list
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
