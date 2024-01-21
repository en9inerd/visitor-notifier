> :warning: **Attention!** This repository is no longer maintained since IFTTT webhooks are no longer free. You can still use the code as a reference for your own implementation. As an alternative, you can use Node-RED to create a similar workflow, but it will need public ip address.

# Visitor Notifier based on Cloudflare Workers and IFTTT Webhooks

This Cloudflare Worker sends notifications to website owner about visitor activity. It uses the Fetch API to send data to a specified webhook using the IFTTT Maker Webhooks service.

## Deployment

1. Install Wrangler.
2. Authenticate with your Cloudflare account using `wrangler login`.
3. Update `wrangler.toml` with your event name and webhook key.
4. (Optional) Add allowed origins to the whitelist:
    - Open the `index.ts` file.
    - Modify the `whitelist` array in the following format: `const whitelist: RegExp[] = [/origin1.com/, /origin2.com/];`
    - Add regular expressions for the origins you want to allow, e.g., `/origin1.com/` or `/.*\.example\.com/`.
5. Deploy the worker using `wrangler deploy`.

Make sure to follow the instructions and customize the necessary files before deploying the Cloudflare Worker.
