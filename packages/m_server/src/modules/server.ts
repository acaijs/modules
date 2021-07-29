// Packages
import { route }	from "@acai/router";
import * as http	from "http";

// Interfaces
import { ServerInterface } 			from "@acai/interfaces";
import { ServerConfigInterface } 	from "@acai/interfaces";
import { ProviderInterface } 		from "@acai/interfaces";
import { MiddlewareInterface }		from "@acai/interfaces";
import { RequestInterface } 		from "@acai/interfaces";
import { RouteInterface } 			from "@acai/router";

// Classes
import RequestHandler from "../classes/RequestHandler";

// Utils
import respond from "../utils/respond";
import { onErrorProvider } from "../utils/error";

export default class Server implements ServerInterface {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected onRequest?: (path: string, method: string) => RequestInterface;
	protected _config	: Partial<ServerConfigInterface> = {};
	protected routes	: RouteInterface[] = [];
	protected server	: http.Server;

	// extra config
	protected providers		: ProviderInterface[] 					= [];
	protected middlewares	: Record<string, MiddlewareInterface> 	= {};
	protected globals		: MiddlewareInterface[] 				= [];

	// -------------------------------------------------
	// Boot methods
	// -------------------------------------------------

	public constructor (config?: Partial<ServerConfigInterface>) {
		this._config = config || {};

		// prepare server instance
		this.server = http.createServer();
	}

	public setConfig (config: Partial<ServerConfigInterface>) {
		this._config = {...this._config, ...config};
	}

	public get config () {
		return this._config;
	}

	// -------------------------------------------------
	// Provider methods
	// -------------------------------------------------

	public addProvider(Provider: ProviderInterface): void {
		this.providers.push(new Provider());
	}

	public addProviders(Providers: ProviderInterface[]): void {
		this.providers = [...this.providers, ...Providers.map( Provider => new Provider())];
	}

	public getProviders() {
		return this.providers;
	}

	public clearProviders(): void {
		this.middlewares = {};
	}

	// -------------------------------------------------
	// Middleware methods
	// -------------------------------------------------

	public addMiddleware(id: string, cb: MiddlewareInterface): void {
		this.middlewares[id] = cb;
	}

	public addMiddlewares(middlewares: Record<string, MiddlewareInterface>): void {
		this.middlewares = {...this.middlewares, ...middlewares};
	}

	public getMiddlewares(): Record<string, MiddlewareInterface> {
		return this.middlewares;
	}

	public clearMiddlewares(): void {
		this.middlewares = {};
	}

	// -------------------------------------------------
	// Global middleware methods
	// -------------------------------------------------

	public addGlobal(cb: MiddlewareInterface): void {
		this.globals.push(cb);
	}

	public addGlobals(globals: MiddlewareInterface[]): void {
		this.globals = [...this.globals, ...globals];
	}

	public getGlobals(): MiddlewareInterface[] {
		return this.globals;
	}

	public clearGlobals(): void {
		this.globals = [];
	}

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public async run(port?: number, hostname = "0.0.0.0"): Promise<void> {
		// run providers
		for (let i = 0; i < this.providers.length; i++) {
			try {
				const provider = this.providers[i];
				if (provider.boot) await provider.boot(this);
			}
			catch (e) {
				await onErrorProvider(this, {} as any, e);
			}
		}

		// build routes
		this.routes = route.build();

		this.server.on("request", async (req, res) => {
			const r = new RequestHandler({ req, res }, this, this.onRequest);

			const flux = await r.buildBaseRequest(this.routes);

			if (flux) {
				const curry = await r.buildPipeline(flux, [...this.globals].reverse(), this.middlewares);
				await r.proccess(flux, curry);
			}
			else {
				respond(res, {
					body: "<h1>404 - Not Found</h1>",
					status: 200,
				});

				// respond to server
				res.end();
			}
		});

		this.server.listen(this.config.port || port || 8000, hostname);

		await new Promise((r) => {
			this.server?.on("listening", () => r(true));
		});
	}

	public async stop() {
		if (this.server) {
			this.server.close();
		}
	}
}
