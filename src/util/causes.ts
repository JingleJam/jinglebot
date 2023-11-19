import { bold, money } from "./format";
import type { Stats } from "./stats";

const sluggify = (str: string) =>
    str
        // Remove anything that isn't a word character or space
        .replace(/[^\w\s]+/g, "")
        // Convert spaces to case changes for camel case
        .replace(/\s+\S/g, (match) => match.trim().toUpperCase())
        // Ensure first character is lowercase for camel case
        .replace(/^./, (match) => match.toLowerCase());

const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
};

const hearts = [
    ":blue_heart:",
    ":green_heart:",
    ":purple_heart:",
    ":yellow_heart:",
    ":heart:",
];

const heart = (str: string) => hearts[Math.abs(hash(str)) % hearts.length];

const data: Record<string, { name?: string; emote?: string }> = {
    autistica: {
        emote: "<:Autistica:1159097680753066035>",
    },
    campaignAgainstLivingMiserablyCALM: {
        emote: "<:CALM:1159097678957920286>",
    },
    comicRelief: {
        emote: "<:ComicRelief:1159097684750250044>",
    },
    coppafeel: {
        emote: "<:CoppaFeel:1160890771273162832>",
    },
    galop: {
        emote: "<:Galop:1160890850075742309>",
    },
    movember: {
        emote: "<:Movember:1160891203986927627>",
    },
    helloWorld: {
        emote: "<:HelloWorld:1160884733283147866>",
    },
    justdiggit: {
        emote: "<:Justdiggit:1160889813461913632>",
    },
    royalNationalInstituteOfBlindPeopleRNIB: {
        emote: "<:RNIB:1160891327635017820>",
    },
    warChild: {
        emote: "<:WarChild:1159097686394425385>",
    },
    wallaceGromitsGrandAppeal: {
        emote: "<:GrandAppeal:1160891082972868608>",
    },
    whaleAndDolphinConservation: {
        emote: "<:WDC:1159097675304669214>",
    },
};

const causesBreakdown = (stats: Stats) =>
    stats.causes
        .map((cause) => {
            const slug = sluggify(cause.name);
            const { name, emote } = data[slug] ?? {};

            return bold(
                `[${emote || heart(cause.name)} ${name || cause.name}](${
                    cause.url
                }): ${money(
                    "£",
                    cause.raised.yogscast + cause.raised.fundraisers,
                )}`,
            );
        })
        .join("\n");

export default causesBreakdown;
