export const money = (currency: string, amount: number) =>
    `${currency}${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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
