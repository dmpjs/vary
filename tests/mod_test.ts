import { vary, append } from "../mod.ts";
import { assertEquals, assertThrows } from "./../test_deps.ts";

const { test } = Deno;

const callVary = (
  field: string | string[],
  getHeaderValue: string | null = null,
): { [key: string]: string | null } => {
  let headers: { [key: string]: string | null } = {
    "Vary": getHeaderValue,
  };

  const response = {
    headers: {
      get: (h: string) => headers[h],
      set: (h: string, value: string) => {
        headers[h] = value;
      },
    },
  };

  vary(
    (h: string) => response.headers.get(h) || "",
    (h: string, value: string) => {
      response.headers.set(h, value);
    },
    field,
  );

  return headers;
};

test("should accept string", (): void => {
  const headers = callVary("foo");

  assertEquals(headers["Vary"], `foo`);
});
test("should accept array of string", (): void => {
  const headers = callVary(["foo", "bar"]);

  assertEquals(headers["Vary"], `foo, bar`);
});
test("should accept string that is Vary header", (): void => {
  const headers = callVary("foo, bar");

  assertEquals(headers["Vary"], `foo, bar`);
});
test('should not allow separator ":"', (): void => {
  assertThrows(() => callVary("invalid:header"));
});
test('should not allow separator " "', (): void => {
  assertThrows(() => callVary("invalid header"));
});
test("should preserve case", (): void => {
  const headers = callVary(["ORIGIN", "user-agent", "AccepT"]);

  assertEquals(headers["Vary"], `ORIGIN, user-agent, AccepT`);
});
test("should preserve case", (): void => {
  const headers = callVary([]);

  assertEquals(headers["Vary"], null);
});
test("should set value", (): void => {
  const headers = callVary("Origin", "Accept");

  assertEquals(headers["Vary"], `Accept, Origin`);
});
test("should not duplicate existing value", (): void => {
  const headers = callVary("Accept", "Accept");

  assertEquals(headers["Vary"], `Accept`);
});
test("should compare case-insensitive", (): void => {
  const headers = callVary("accEPT", "Accept");

  assertEquals(headers["Vary"], `Accept`);
});
test("should preserve case", (): void => {
  const headers = callVary(["accEPT", "ORIGIN"], "AccepT");

  assertEquals(headers["Vary"], `AccepT, ORIGIN`);
});
test("should set on existing multi vary header", (): void => {
  const headers = callVary("Origin", "Accept, Accept-Encoding");

  assertEquals(headers["Vary"], `Accept, Accept-Encoding, Origin`);
});
test("should not duplicate existing value", (): void => {
  const headers = callVary(["accept", "origin"], "Accept, Accept-Encoding");

  assertEquals(headers["Vary"], `Accept, Accept-Encoding, origin`);
});
test("should handle contained *", (): void => {
  const headers = callVary("Accept,*");

  assertEquals(headers["Vary"], `*`);
});
test("should handle contained * in array", (): void => {
  const headers = callVary(["Origin", "User-Agent", "*", "Accept"]);

  assertEquals(headers["Vary"], `*`);
});
test("should accept *", (): void => {
  const headers = callVary("*");

  assertEquals(headers["Vary"], `*`);
});
test("should act as if all values alread set, if * is provided", (): void => {
  const headers = callVary(["Origin", "User-Agent"], "*");

  assertEquals(headers["Vary"], `*`);
});
test("should erradicate existing values, if * is provided", (): void => {
  const headers = callVary("*", "Origin, User-Agent");

  assertEquals(headers["Vary"], `*`);
});
test("should update bad existing header, if * is provided", (): void => {
  const headers = callVary("Origin", "Accept, Accept-Encoding, *");

  assertEquals(headers["Vary"], `*`);
});
test("should acept LWS", (): void => {
  const headers = callVary("  Accept     ,     Origin    ");

  assertEquals(headers["Vary"], `Accept, Origin`);
});
test("should ignore double-entries", (): void => {
  const headers = callVary(["Accept", "Accept"]);

  assertEquals(headers["Vary"], `Accept`);
});
test("should be case-insensitive", (): void => {
  const headers = callVary(["Accept", "ACCEPT"]);

  assertEquals(headers["Vary"], `Accept`);
});

test("should set value when header empty", (): void => {
  assertEquals(append("", "Origin"), `Origin`);
});
test("should set value with array when header empty", (): void => {
  assertEquals(append("", ["Origin", "User-Agent"]), "Origin, User-Agent");
});
test("should preserve case when header empty", (): void => {
  assertEquals(
    append("", ["ORIGIN", "user-agent", "AccepT"]),
    "ORIGIN, user-agent, AccepT",
  );
});
test("should preserve case when header has values", (): void => {
  assertEquals(
    append("Accept", "Origin"),
    "Accept, Origin",
  );
});
test("should set value with array when header has values", (): void => {
  assertEquals(
    append("Accept", ["Origin", "User-Agent"]),
    "Accept, Origin, User-Agent",
  );
});
test("should not duplicate existing value when header has values", (): void => {
  assertEquals(
    append("Accept", "Accept"),
    "Accept",
  );
});
test("should compare case-insensitive when header has values", (): void => {
  assertEquals(
    append("Accept", "accEPT"),
    "Accept",
  );
});
test("should preserve case when header has values", (): void => {
  assertEquals(
    append("Accept", "AccepT"),
    "Accept",
  );
});
test("should set value when *", (): void => {
  assertEquals(
    append("", "*"),
    "*",
  );
});
test("should act as if all values already set when *", (): void => {
  assertEquals(
    append("*", "Origin"),
    "*",
  );
});
test("should erradicate existing values when *", (): void => {
  assertEquals(
    append("Accept, Accept-Encoding", "*"),
    "*",
  );
});
test("should update bad existing header when *", (): void => {
  assertEquals(
    append("Accept, Accept-Encoding, *", "Origin"),
    "*",
  );
});
test("should set value when field is string", (): void => {
  assertEquals(
    append("", "Accept"),
    "Accept",
  );
});
test("should set value when vary header when field is string", (): void => {
  assertEquals(
    append("", "Accept, Accept-Encoding"),
    "Accept, Accept-Encoding",
  );
});
test("should acept LWS when field is string", (): void => {
  assertEquals(
    append("", "  Accept     ,     Origin    "),
    "Accept, Origin",
  );
});
test("should handle contained * when field is string", (): void => {
  assertEquals(
    append("", "Accept,*"),
    "*",
  );
});
test("should set value when field is array", (): void => {
  assertEquals(
    append("", ["Accept", "Accept-Language"]),
    "Accept, Accept-Language",
  );
});
test("should ignore double-entries when field is array", (): void => {
  assertEquals(
    append("", ["Accept", "Accept"]),
    "Accept",
  );
});
test("should be case-insensitive when field is array", (): void => {
  assertEquals(
    append("", ["Accept", "ACCEPT"]),
    "Accept",
  );
});
test("should handle contained * when field is array", (): void => {
  assertEquals(
    append("", ["Origin", "User-Agent", "*", "Accept"]),
    "*",
  );
});
test("should handle existing values when field is array", (): void => {
  assertEquals(
    append("Accept, Accept-Encoding", ["origin", "accept", "accept-charset"]),
    "Accept, Accept-Encoding, origin, accept-charset",
  );
});
