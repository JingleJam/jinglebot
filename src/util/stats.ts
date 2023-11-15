interface Stats {
    date: string;
    event: {
        year: number;
        start: string;
        end: string;
    };
    raised: {
        yogscast: number;
        fundraisers: number;
    };
    collections: {
        redeemed: number;
        total: number;
    };
    donations: {
        count: number;
    };
    history: {
        year: number;
        total: {
            dollars: number;
            pounds: number;
        };
        donations: number;
    }[];
    causes: {
        name: string;
        description: string;
        url: string;
        donateUrl: string;
        raised: {
            yogscast: number;
            fundraisers: number;
        };
    }[];
    campaigns: {
        count: number;
        list: {
            name: string;
            slug: string;
            description: string;
            url: string;
            raised: number;
            goal: number;
            livestream: {
                channel: string | null;
                type: string;
            };
            user: {
                name: string;
                slug: string;
                url: string;
            };
        }[];
    };
}

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isStats = (value: unknown): value is Stats => {
    // Validate the overall stats object
    if (!isObject(value)) throw new Error("Value is not an object");

    // Validate the date
    if (typeof value.date !== "string")
        throw new Error("Value#date is not a string");

    // Validate the event data
    if (!isObject(value.event)) throw new Error("Value#event is not an object");
    if (typeof value.event.year !== "number")
        throw new Error("Value#event#year is not a number");
    if (typeof value.event.start !== "string")
        throw new Error("Value#event#start is not a string");
    if (typeof value.event.end !== "string")
        throw new Error("Value#event#end is not a string");

    // Validate the raised data
    if (!isObject(value.raised))
        throw new Error("Value#raised is not an object");
    if (typeof value.raised.yogscast !== "number")
        throw new Error("Value#raised#yogscast is not a number");
    if (typeof value.raised.fundraisers !== "number")
        throw new Error("Value#raised#fundraisers is not a number");

    // Validate the collections data
    if (!isObject(value.collections))
        throw new Error("Value#collections is not an object");
    if (typeof value.collections.redeemed !== "number")
        throw new Error("Value#collections#redeemed is not a number");
    if (typeof value.collections.total !== "number")
        throw new Error("Value#collections#total is not a number");

    // Validate the donations data
    if (!isObject(value.donations))
        throw new Error("Value#donations is not an object");
    if (typeof value.donations.count !== "number")
        throw new Error("Value#donations#count is not a number");

    // Validate the history data
    if (!Array.isArray(value.history))
        throw new Error("Value#history is not an array");
    for (let i = 0; i < value.history.length; i++) {
        const history = value.history[i];
        if (!isObject(history))
            throw new Error(`Value#history[${i}] is not an object`);
        if (typeof history.year !== "number")
            throw new Error(`Value#history[${i}]#year is not a number`);
        if (!isObject(history.total))
            throw new Error(`Value#history[${i}]#total is not an object`);
        if (typeof history.total.dollars !== "number")
            throw new Error(
                `Value#history[${i}]#total#dollars is not a number`,
            );
        if (typeof history.total.pounds !== "number")
            throw new Error(`Value#history[${i}]#total#pounds is not a number`);
        if (typeof history.donations !== "number")
            throw new Error(`Value#history[${i}]#donations is not a number`);
    }

    // Validate the causes data
    if (!Array.isArray(value.causes))
        throw new Error("Value#causes is not an array");
    for (let i = 0; i < value.causes.length; i++) {
        const cause = value.causes[i];
        if (!isObject(cause))
            throw new Error(`Value#causes[${i}] is not an object`);
        if (typeof cause.name !== "string")
            throw new Error(`Value#causes[${i}]#name is not a string`);
        if (typeof cause.description !== "string")
            throw new Error(`Value#causes[${i}]#description is not a string`);
        if (typeof cause.url !== "string")
            throw new Error(`Value#causes[${i}]#url is not a string`);
        if (typeof cause.donateUrl !== "string")
            throw new Error(`Value#causes[${i}]#donateUrl is not a string`);
        if (!isObject(cause.raised))
            throw new Error(`Value#causes[${i}]#raised is not an object`);
        if (typeof cause.raised.yogscast !== "number")
            throw new Error(
                `Value#causes[${i}]#raised#yogscast is not a number`,
            );
        if (typeof cause.raised.fundraisers !== "number")
            throw new Error(
                `Value#causes[${i}]#raised#fundraisers is not a number`,
            );
    }

    // Validate the campaigns data
    if (!isObject(value.campaigns))
        throw new Error("Value#campaigns is not an object");
    if (typeof value.campaigns.count !== "number")
        throw new Error("Value#campaigns#count is not a number");
    if (!Array.isArray(value.campaigns.list))
        throw new Error("Value#campaigns#list is not an array");
    for (let i = 0; i < value.campaigns.list.length; i++) {
        const campaign = value.campaigns.list[i];
        if (!isObject(campaign))
            throw new Error(`Value#campaigns#list[${i}] is not an object`);
        if (typeof campaign.name !== "string")
            throw new Error(`Value#campaigns#list[${i}]#name is not a string`);
        if (typeof campaign.slug !== "string")
            throw new Error(`Value#campaigns#list[${i}]#slug is not a string`);
        if (typeof campaign.description !== "string")
            throw new Error(
                `Value#campaigns#list[${i}]#description is not a string`,
            );
        if (typeof campaign.url !== "string")
            throw new Error(`Value#campaigns#list[${i}]#url is not a string`);
        if (typeof campaign.raised !== "number")
            throw new Error(
                `Value#campaigns#list[${i}]#raised is not a number`,
            );
        if (typeof campaign.goal !== "number")
            throw new Error(`Value#campaigns#list[${i}]#goal is not a number`);
        if (!isObject(campaign.livestream))
            throw new Error(
                `Value#campaigns#list[${i}]#livestream is not an object`,
            );
        if (
            typeof campaign.livestream.channel !== "string" &&
            campaign.livestream.channel !== null
        )
            throw new Error(
                `Value#campaigns#list[${i}]#livestream#channel is not a string or null`,
            );
        if (typeof campaign.livestream.type !== "string")
            throw new Error(
                `Value#campaigns#list[${i}]#livestream#type is not a string`,
            );
        if (!isObject(campaign.user))
            throw new Error(`Value#campaigns#list[${i}]#user is not an object`);
        if (typeof campaign.user.name !== "string")
            throw new Error(
                `Value#campaigns#list[${i}]#user#name is not a string`,
            );
        if (typeof campaign.user.slug !== "string")
            throw new Error(
                `Value#campaigns#list[${i}]#user#slug is not a string`,
            );
        if (typeof campaign.user.url !== "string")
            throw new Error(
                `Value#campaigns#list[${i}]#user#url is not a string`,
            );
    }

    return true;
};

const getStats = async (endpoint: string): Promise<Stats> => {
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
    // `isStats` will throw its own error, the throw here just keeps TS happy
    if (!isStats(json)) throw new Error("Invalid stats response");
    return json;
};

export default getStats;
