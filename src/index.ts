import { PostBody, Env } from "./interfaces";
import { isListed, validateBody } from "./utils";

const whitelist: RegExp[] = [/.*/];
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request: Request, env: Env) {
    const apiUrl = `https://maker.ifttt.com/trigger/${env.EVENT_NAME}/with/key/${env.WEBHOOKS_KEY}`;

    if (!isListed(request.headers.get("Origin") ?? "", whitelist)) {
      return new Response(null, {
        status: 403,
        statusText: "Forbidden",
      });
    }

    if (request.method === "OPTIONS") {
      return handleOptions(request);
    } else if (request.method === "POST") {
      return handlePost(apiUrl, request);
    } else {
      return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      });
    }
  },
};

async function handlePost(apiUrl: string, request: Request) {
  let body: PostBody;

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
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": new URL(apiUrl).origin,
      },
      body: JSON.stringify({
        value1: requesterInfo,
      }),
    };
    const response = await fetch(apiUrl, fetchOptions);

    return new Response(null, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": request.headers.get("Origin") ?? "",
        "Vary": "Origin",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify(e), {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

function handleOptions(request: Request) {
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Headers": request.headers.get(
          "Access-Control-Request-Headers"
        ) ?? "",
      },
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "POST, OPTIONS",
      },
    });
  }
}
