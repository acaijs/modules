// Packages
import * as Cookies	from "cookies"

// Interfaces
import type ServerRequest from "./request"

export type HttpRequest = {
	cookies: Cookies;
} & ServerRequest