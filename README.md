<div align="center"><img src="https://github.com/AcaiJS/ref_documentation/blob/production/public/img/logo.svg" width="128"></div>

# Açai Modules

![https://github.com/AcaiJS/modules](https://img.shields.io/badge/a%C3%A7a%C3%ADjs-module-%238033BC?style=for-the-badge) ![https://github.com/AcaiJS/modules/actions/workflows/integration.yml](https://img.shields.io/badge/githubactions-integration-%23369909?style=for-the-badge)

This workspace contains the packages that constitute the main açaí's modules that are used in the framework. You can checkout more about each module inside their respective directory and README. You can read on how to contribute here: [wiki](https://github.com/AcaiJS/modules/wiki)

## Installation

You can use our CLI to easily create a project using açaí packages, with a boilerplate of a HTTP application. Even then, you are not obligated in any way to use our architecture, Açaí is modular and allows you to assemble pieces as you please.

``` bash
yarn create acai
# or
npm init acai
```

You will receive a few questions about how your application should be made, and you should be ready to go!

## Modules
Açaí is composed by various modules, here you can read about some of them:
- server: a mainframe for any server that can be created through adapters. You can also create your own adapters such as web sockets, NATS, http, cli, etc;
- router: we abstracted the router from outside the server so you can reimplement what you prefer if it comes to that;
- query/model: a query builder and ORM for your application that is encapsulated into an adapter pattern, allowing you to use and create your own ecossystems;
- testing: a custom testing library that proposes new features that help with development and integration;