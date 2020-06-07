import { append } from "./append.ts";

/**
 * Mark that a request is varied on a header field.
 *
 * @param {function} responseHeadersGet
 * @param {function} responseHeadersSet
 * @param {String|Array} field
 * @public
 */
export const vary = (
  responseHeadersGet: (header: string) => string,
  responseHeadersSet: (header: string, value: string) => void,
  field: string | string[],
) => {
  // get existing header
  let val = responseHeadersGet("Vary");

  const header = Array.isArray(val) ? val.join(", ") : String(val);

  // set new header
  if ((val = append(header, field))) {
    responseHeadersSet("Vary", val);
  }
};
