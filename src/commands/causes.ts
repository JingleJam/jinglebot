import {
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads";
import type { Command } from "workers-discord";

import getStats from "../util/stats";
import checkDate from "../util/check";
import { bold, italic, money, number } from "../util/format";
import type { CtxWithEnv } from "../env";

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

const causesCommand: Command<CtxWithEnv> = {
    name: "causes",
    description:
        "Check the causes supported by Jingle Jam. See how much has been raised for each cause.",
    execute: ({ response, wait, edit, context }) => {
        wait(
            (async () => {
                const stats = await getStats(context.env.STATS_API_ENDPOINT);

                // Check if Jingle Jam is running
                const start = new Date(stats.event.start);
                const check = checkDate(start);
                // TODO: Re-enable this check once testing is done
                // if (check) return edit({ content: check });

                // Check if Jingle Jam has finished
                const end = new Date(stats.event.end);
                if (isNaN(+end)) throw new Error("Invalid end date");

                // Time since launch
                // TODO: Switch back to using the current time once testing is done
                // const now = new Date();
                const now = end;
                const ended = now >= end;

                await edit({
                    content: [
                        `:snowflake: Jingle Jam ${stats.event.year} ${
                            ended ? "supported" : "is supporting"
                        } ${bold(number(stats.causes.length))} amazing causes:`,
                        "",
                        ...stats.causes.map((cause) => {
                            const slug = sluggify(cause.name);
                            const { name, emote } = data[slug] ?? {};

                            return bold(
                                `[${emote || heart(cause.name)} ${
                                    name || cause.name
                                }](${cause.url}): ${money(
                                    "£",
                                    cause.raised.yogscast +
                                        cause.raised.fundraisers,
                                )}`,
                            );
                        }),
                        "",
                        `:heart: Thank you for supporting some wonderful causes! ${
                            ended
                                ? `We look forward to seeing you again for Jingle Jam ${
                                      stats.event.year + 1
                                  }.`
                                : "Get involved at <https://jinglejam.tiltify.com>"
                        }`,
                    ].join("\n"),
                });
            })().catch(async (error) => {
                console.error(error);

                await edit({
                    content: [
                        ":pensive: Sorry, an error occurred while fetching the stats.",
                        italic(
                            "An ~~angry~~ polite message has been sent to the team letting them know.",
                        ),
                    ].join("\n"),
                });
            }),
        );

        return response({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: ":mag: Fetching the latest Jingle Jam stats...",
                flags: MessageFlags.Ephemeral,
            },
        });
    },
};

export default causesCommand;
