# Formio Submission Data Validator

A Node.js service for validating **Form.io** form
submissions against external form definitions.\
This module extracts and simplifies the core Form.io validation logic,
providing a API for backend validation flows.

## Features

-   Validates submission data against a remote Form.io form definition
-   Runs validation logic inside an isolated VM

## Quick Start

```js
const FormioSubmissionDataValidator = require('formio-submission-data-validator');

const validator = new FormioSubmissionDataValidator({
    logger: console,
    vmTimeout: 5000,
    cacheTtl: 30000,
});

async function run() {
    const result = await validator.validateSubmission(
        {
            display: 'form',
            type: 'form',
            components: [
                {
                    label: 'Name',
                    key: 'name',
                    type: 'textfield',
                    input: true,
                },
                {
                    label: 'Email',
                    key: 'email',
                    type: 'email',
                    input: true,
                },
            ],
        },
        { name: 'John', email: 'john@example.com' },
        { tokens: { 'x-jwt-token': 'abc123' } }
    );

    console.log(result);
}

run();
```

## API

### `new FormioSubmissionDataValidator(options)`

Creates a new formio submission data validator instance.

**Options:**

-   **logger** (Logger)  
    Optional logger object. Should implement at least `.debug()`, `.info()`, and `.error()`.

-   **vmTimeout** (number)  
    Timeout in milliseconds for the VM evaluator.  
    Default: `5000`.

-   **cacheTtl** (number)  
    Optional metadata cache duration in milliseconds.

---

### `validateSubmission(formUrl, submissionData, options)`

Validates submission data against a Form.io form definition.

**Parameters:**

-   **form** (object)  
    Form.io form JSON definition.

-   **submissionData** (object)  
    Submission data object that will be placed under `submission.data`.

-   **options.tokens** (object)  
    Optional authentication tokens to pass into the Validator (e.g., JWT headers).

-   **options.submissionMeta** (object)  
    Additional metadata to merge into the internal submission object.

---

### Returns

A Promise resolving to a result object. The shape depends on whether validation succeeded, failed due to form validation errors, or failed due to an internal exception.

```js
{
  success: boolean,

  // Present only when the Form.io validator reports validation issues
  errors?: Array | object,

  // Present only when an unexpected error occurs in the validation logic
  error?: {
    message: string,
    type: string
  },

  timestamp: string
}
```

## Attribution (OSL-3.0 Compliance)

This project contains derivative components based on the Form.io
open-source codebase.

Portions of this work are derived from:

-   https://github.com/formio/formio
-   Version v4.2.8-rc.2

Original work copyright:

    Copyright (c) 2020 Form.io LLC

Modified files include an in-source Attribution Notice as required by
OSL-3.0 Section 6.

This project is licensed under:

    Open Software License 3.0 (OSL-3.0)

## License

Licensed under the Open Software License version 3.0 (OSL-3.0).\
See the LICENSE file for full details.

## Development

### Build

```bash
pnpm build
```

Outputs:

-   lib/ --- non-bundled CommonJS build
-   dist/ --- bundled build for consumers

### Lint

```bash
pnpm lint
```

## Installation

You can install this package directly from GitHub. Use the following commands depending on whether you want the latest version or a specific tagged release.

### Install Latest Version

```bash
pnpm add myqld/formio-submission-data-validator
```

### Install a Specific Version

Replace v0.0.2 with any available tag:

```bash
pnpm add myqld/formio-submission-data-validator#v0.0.2
```
