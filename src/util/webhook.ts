import type { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/rest";

const sendWebhook = async (
    hook: string,
    data: RESTPostAPIWebhookWithTokenJSONBody,
) => {
    // Ensure we wait for the webhook to send, to get any errors
    const url = new URL(hook);
    url.searchParams.set("wait", "true");

    // Force a standard username for the webhook
    const payload: RESTPostAPIWebhookWithTokenJSONBody = {
        ...data,
        username: "JingleBot",
        // TODO: avatar_url
    };

    // Make the request and check for any errors
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(
            `API request failed: ${res.status} ${res.statusText}: ${body}`,
        );
    }
};

export default sendWebhook;
