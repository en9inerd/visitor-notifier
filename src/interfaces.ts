export interface Env {
  EVENT_NAME: string;
  WEBHOOKS_KEY: string;
}

export interface PostBody {
  URL: string;
  "Screen Dimensions": string;
  Referrer: string;
  "User Agent": string;
}
