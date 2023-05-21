# Visitor Notifier

This Cloudflare Worker sends notifications to website owners about visitor activity. It uses the Fetch API to send data to a specified webhook using the IFTTT Maker Webhooks service.

## Usage

1. Clone or download this repository.
2. Customize the `index.ts` file.
3. Update the `wrangler.toml` file with your IFTTT event name and webhook key.
4. Deploy the Cloudflare Worker using Wrangler or the Cloudflare Workers Dashboard.

## Files

- `index.ts`: Contains the worker code for handling requests and sending notifications.
- `wrangler.toml`: Configuration file for deploying the Cloudflare Worker.

## Deployment

1. Install Wrangler.
2. Authenticate with your Cloudflare account using `wrangler login`.
3. Update `wrangler.toml` with your event name and webhook key.
4. Deploy the worker using `wrangler deploy`.
