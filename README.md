<h1 align="center">vary</h1>
<p align="center">
    <a href="https://github.com/dmpjs/vary/releases">
        <img src="https://img.shields.io/github/release/dmpjs/vary.svg?color=bright_green&label=latest&style=flat-square">
    </a>
    <a href="https://github.com/dmpjs/vary/actions">
        <img src="https://img.shields.io/github/workflow/status/dmpjs/vary/master?label=ci&style=flat-square">
    </a>
    <a href="https://github.com/semantic-release/semantic-release">
        <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
    </a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square">
    </a>
</p>

Manipulate the HTTP Vary header.

vary is based on [vary](https://www.npmjs.com/package/vary) and has been ported for use on Deno

## Installation

Use the following import:

```
const { vary } = "https://raw.githubusercontent.com/dmpjs/vary/master/mod.ts"; // import from github as raw data

const { vary } = "https://deno.land/x/vary/mod.ts"; // If module is uploaded into deno.land
```

## Usage

### vary(responseHeadersGet, responseHeadersSet, field)

Adds the given header field to the Vary response header of response. This can be a string of a single field, a string of a valid Vary header, or an array of multiple fields.

This will append the header if not already listed, otherwise leaves it listed in the current location.

```typescript
import { Drash } from "https://deno.land/x/drash@v1.0.5/mod.ts";
import { vary } from "https://raw.githubusercontent.com/dmpjs/vary/master/mod.ts";

let response: Drash.response

// Append "Origin" to the Vary header of the response
vary(
    (header: string) => response.headers.get(header) || "",
    (header: string, value: string) => { response.headers.set(header, value)},
    'Origin'
)
```

## append(header, field)

Adds the given header field to the Vary response header string header. This can be a string of a single field, a string of a valid Vary header, or an array of multiple fields.

This will append the header if not already listed, otherwise leaves it listed in the current location. The new header string is returned.

```typescript
import { append } from "https://raw.githubusercontent.com/dmpjs/vary/master/mod.ts";

// Get header string appending "Origin" to "Accept, User-Agent"
append('Accept, User-Agent', 'Origin')
```

## Test

Run

```
deno test ./test.ts
```

## Versioning

This library follows semantic versioning, and additions to the code ruleset are performed in major releases.

## Changelog

Please have a look at [`CHANGELOG.md`](CHANGELOG.md).

## Contributing

Please have a look at [`CONTRIBUTING.md`](.github/CONTRIBUTING.md).

## Code of Conduct

Please have a look at [`CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md).

## License

This package is licensed using the MIT License.

Please have a look at [`LICENSE.md`](LICENSE.md).

