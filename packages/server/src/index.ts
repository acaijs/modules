/**
* Copyright (c) 2021 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/

// Providers
export { ProviderInterface }				from "@acai/interfaces";
export { ProviderInterface as Provider }	from "@acai/interfaces";

// Middlewares
export { MiddlewareInterface } 					from "@acai/interfaces";
export { MiddlewareInterface as Middleware }	from "@acai/interfaces";

// useful interfaces
export { ServerInterface }				from "@acai/interfaces";
export { RequestInterface }				from "@acai/interfaces";
export { RequestInterface as Request }	from "@acai/interfaces";

// server
import Server from "./modules/server";
export default Server;

// utility for the server
export { default as response }			from "./modules/response";
export { default as CustomException }	from "./modules/CustomException";
