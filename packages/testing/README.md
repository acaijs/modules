<div align="center"><img src="https://github.com/AcaiJS/ref_documentation/blob/production/public/img/logo.svg" width="128"></div>

# Açai Tester Module

![https://gitlab.com/acaijs/tester.git](https://img.shields.io/badge/a%C3%A7a%C3%ADjs-module-%238033BC?style=for-the-badge) ![https://www.npmjs.com/package/@acai/testing](https://img.shields.io/npm/v/@acai/testing?color=%2392CB0D&style=for-the-badge) ![https://www.npmjs.com/package/@acai/testing](https://img.shields.io/npm/dm/@acai/testing?color=%238033BC&style=for-the-badge) ![https://www.npmjs.com/package/@acai/testing](https://img.shields.io/npm/l/@acai/testing.svg?style=for-the-badge)

A testing suite that proposes some tools that help you organize and easily escalate your own tests.
** Attention! ** All of tests in the same context are ran before tests on the following context.

## Usage

Assertions should run inside of a test scope, see a simple example:

```typescript
import test from "@acai/testing";

test("Test that 2 + 2 is equal 4", (expect) => {
  expect(2 + 2).toEqual(4);
});

// You can run all the tests recorded using test.run, this will print
// in the console
test.run();
```

### Automatic test find

You can automatically search for tests in your current project using `await test.find(/regex/)`, you can pass a regex to match a test file.

### Grouping

You can group tests to easily distinguish between them without writing multiple files.

```typescript
import test from "@acai/tester";

test.group("Group description", () => {
  /*Your tests here*/
});
```

### Except/Only

You can filter tests to be ran with except/only, working opposite of one another. They stack, so if you have two only tests, those two will run.

```typescript
test.only("test description", () => {
  // Your test here
});
```

You can also pass a second parameter to true, to force running all tests, ignoring the except/only.

### Tag

You can tag your tests/groups, to filter them when running your tests. For example:

```typescript
test("test description", () => {
  // Your test here
}).tag(["tag1", "tag2"]);

test("other test description", () => {
  // Your test here
}).tag(["tag3"]);

// Will only run tests marked with the tag2 tag
await test.run(["tag2"]);
```

### Caching

Most of the times you want to debug a value that cannot be accessed otherwise, and simply console log would mess the CLI up. So we provide an organized and (almost) serializable way of debugging your code. There are two ways of doing so:

```typescript
// you can use it as an assertion
expect(value).cache("optional title for organization");

// or simply call it inside a test context (means it must run when calling a test itself)
test.cache(value);
// or
test.cache("title", value);
```

## Assertions available

### toBe (value: any)

Makes an exact, and deeply compares objects and arrays.

### toNotBe (value: any)

Makes an exact match and rejects if are equals, deeply compares objects and arrays.

### toBeTypeOf (typeOf)

Returns the typeof of the expect and compare it.

### toBeDefined ()

Checks if value is not undefined.

### toBeUndefined ()

Checks if value is defined

### toBeNull ()

Checks value to be null

### toNotBeNull ()

Checks value to not be null

### toThrow ()

Expects an callable function that will be run (can be async), and it expects it to throw.

### toContain (parts: string|string[])

Check if expect value contains parts of the assertion. This will act differently depending on what it receives:

- object: will check if contain array of keys
- array: will check if it contain values
- string: will check if it contains text

### cache (title?: string)

Not actually an assertion, but allows you to verify values after the tests.

## Recommended setup

For your convenience, we recommend you setting up a test.ts or test.js in your project root and placing the following:

```typescript
// run from command line
async function main() {
  // with this you can change the test regex find from cli
  const path =
    process.argv.includes("--path") &&
    process.argv[process.argv.indexOf("--path") + 1];
  // you can filter tags through the cli
  const tags = `${
    (process.argv.includes("--tags") &&
      process.argv[process.argv.indexOf("--tags") + 1]) ||
    ""
  }`
    .split(",")
    .filter((i) => i);
  // force run all tests
  const all = process.argv.includes("--all");
  // skip printing
  const print = !process.argv.includes("--no-print");

  await test.find(path || "./**/*.{test,tests}.{js,ts}");
  await test.runAndPrint({
    tags: tags,
    forceAll: all,
    spinner: print,
  });
}

main();
```

And adding to your package.json in the scripts category: `"test": "ts-node ./test.ts"`, you can also use any runtime typescript compiler or simply run with node in case you don't use typescript. Now you have access to run your tests through the CLI.

## Support

Do you have a question? Please open an issue on our [main repo](https://gitlab.com/acaijs/tester/issues).

## License

[BSD Clause 3](https://opensource.org/licenses/BSD-3-Clause)

Copyright (c) 2021 The Nuinalp Authors. All rights reserved.  
Use of this source code is governed by a BSD-style license that can be found in the LICENSE file.
