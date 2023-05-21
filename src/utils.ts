import { PostBody } from "./interfaces";

export function isListed(uri: string, listing: RegExp[]): boolean {
  return listing.some((m) => !!uri.match(m));
}

export function validateBody(body: PostBody): boolean {
  const requiredProps = ["URL", "Screen Dimensions", "Referrer", "User Agent"];
  // eslint-disable-next-line no-prototype-builtins
  return requiredProps.every((prop) => body.hasOwnProperty(prop));
}
