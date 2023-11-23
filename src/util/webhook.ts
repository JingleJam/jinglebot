import type { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/rest";

const sendWebhook = async (
    hook: string,
    data: RESTPostAPIWebhookWithTokenJSONBody,
) => {
    // Ensure we wait for the webhook to send, to get any errors
    const url = new URL(hook);
    url.searchParams.set("wait", "true");

    // Make the request and check for any errors
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(
            `API request failed: ${res.status} ${res.statusText}: ${body}`,
        );
    }
};

export default sendWebhook;
