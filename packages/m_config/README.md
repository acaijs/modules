<p align="center"><img src="https://api.aposoftworks.com/storage/image/ehRdFIz6tqiERXID1SIXAeu0mmTBKLdixIXsNj9s.png" width="256"></p>

# Açai Config Module

 [![Support](https://img.shields.io/badge/Patreon-Support-orange.svg?logo=Patreon&style=for-the-badge)](https://www.patreon.com/rafaelcorrea) ![https://www.npmjs.com/package/@acai/config](https://img.shields.io/npm/dm/@acai/config?color=%238033BC&style=for-the-badge) ![NPM](https://img.shields.io/npm/l/@acai/query?style=for-the-badge)

Açai config module is a small tool that helps you handle data inside of your application. It exports a global config by default, and an option to create a scoped config.

## Usage

``` typescript
import config from "https://deno.land/x/acai_config/mod.ts";

// access your env variables with
console.log(config.env);
// or
console.log(config.getEnv("key"));

// you can access your config with
console.log(config.config);
// or
console.log(config.getConfig("key"));

// you can also set a config with
config.setConfig("key", "value");
```

If you wish to bind your env variables with your config variables, you can call `config.fetchEnv(undefined, true)`, this will store all your env variables inside of the config.

## Optional envs

By default, config will try to fetch from `.env`, but you can pass a preset to try. If not found, it will alert on the console and try to fetch .env instead.

``` typescript
import config from "https://deno.land/x/acai_config/mod.ts";

// will fetch env from .env.testing
config.fetchEnv("testing");
// will fetch env from .env.production
config.fetchEnv("production");
```