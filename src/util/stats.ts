import { z } from "zod";

const statsSchema = z.object({
    date: z.iso.datetime(),
    event: z.object({
        year: z.number(),
        start: z.iso.datetime(),
        end: z.iso.datetime(),
    }),
    raised: z.number(),
    collections: z.object({
        redeemed: z.number(),
        total: z.number(),
    }),
    donations: z.number(),
    history: z.array(
        z.object({
            year: z.number(),
            total: z.object({
                pounds: z.number(),
            }),
            donations: z.number(),
        }),
    ),
    causes: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            url: z.string(),
            donateUrl: z.string(),
            raised: z.number(),
        }),
    ),
    campaigns: z.object({
        count: z.number(),
    }),
});

export type Stats = z.infer<typeof statsSchema>;

const getStats = async (endpoint: string) => {
    // Cancel the request after 5 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    // Fetch the stats
    const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: { "User-Agent": "JingleBot/1.0.0" },
    }).finally(() => clearTimeout(timeout));
    const json = await response.json();

    // Validate the response
    return statsSchema.parse(json);
};

export default getStats;
