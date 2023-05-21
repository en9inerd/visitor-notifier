interface Env {
	EVENT_NAME: string;
	WEBHOOKS_KEY: string;
}

interface Body {
	URL: string;
	"Screen Dimensions": string;
	Referrer: string;
	"User Agent": string;
}

const whitelist: RegExp[] = [/.*/];

function isListed(uri: string, listing: RegExp[]): boolean {
	return listing.some((m) => !!uri.match(m));
}

function validateBody(body: Body): boolean {
	const requiredProps = ["URL", "Screen Dimensions", "Referrer", "User Agent"];
	return requiredProps.every((prop) => body.hasOwnProperty(prop));
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const origin = request.headers.get("Origin") ?? "";
		let body: Body;

		try {
			body = await request.json();
			if (!validateBody(body)) {
				throw new Error("Invalid body");
			}
		} catch (e) {
			return new Response(null, {
				status: 400,
				statusText: "Bad Request",
			});
		}

		if (!isListed(origin, whitelist)) {
			return new Response(null, {
				status: 403,
				statusText: "Forbidden",
			});
		}

		const requesterIp = request.headers.get("CF-Connecting-IP");
		const requesterIp6 = request.headers.get("CF-Connecting-IPv6");
		const requesterInfo = [
			`IP: ${requesterIp ?? requesterIp6 ?? ""}`,
			`Country: ${request.cf?.country ?? ""}`,
			`Datacenter: ${request.cf?.colo ?? ""}`,
			`URL: ${body.URL}`,
			`Screen Dimensions: ${body["Screen Dimensions"]}`,
			`Referrer: ${body.Referrer}`,
			`User Agent: ${body["User Agent"]}`,
		].join("<br>");

		try {
			await fetch(`https://maker.ifttt.com/trigger/${env.EVENT_NAME}/with/key/${env.WEBHOOKS_KEY}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					value1: requesterInfo,
				}),
			});
		} catch (e) {
			return new Response(JSON.stringify(e), {
				status: 500,
				statusText: "Internal Server Error",
			});
		}

		return new Response(null, {
			status: 200,
			statusText: "OK",
		});
	},
};
