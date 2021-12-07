import { MiddlewareCbType, MiddlewareClassType, MiddlewareType, ServerRequest } from "@acai/interfaces"

type ConstructableMiddleware = [MiddlewareType, string[] | undefined]

export default class MiddlewareHandler {
	private middlewares: ConstructableMiddleware[] = []

	public constructor(md?: ConstructableMiddleware | ConstructableMiddleware[]) {
		if (md) this.add(md)
	}

	public add(md: ConstructableMiddleware | ConstructableMiddleware[]) {
		if (md.length > 0) {
			if (Array.isArray(md[0])) this.middlewares = [...this.middlewares, ...(md as ConstructableMiddleware[])]
			else this.middlewares = [...this.middlewares, md as ConstructableMiddleware]
		}

		return this
	}

	public clear() {
		this.middlewares = []
	}

	public async pipe(request: ServerRequest) {
		if (this.middlewares.length === 0) return [request, request]

		const lastrequest = request
		const stack = [] as any[]

		for (let i = 0; i < this.middlewares.length; i++) {
			const curr = this.middlewares[i]

			stack.push(async (r: ServerRequest) => {
				try {
					const response = await this.buildCallback(curr[0])(
						(await r)[0],
						async (r) => await (stack[i + 1] || ((r: ServerRequest) => r))([await r]),
						curr[1] || [],
					)

					return response
				}
				catch (e) {
					(e as any).request = r[0]
					throw e
				}
			})
		}

		if (stack.length) return stack[0]([lastrequest])
		return lastrequest
	}

	protected buildCallback (middleware: MiddlewareType) {
		if ((middleware as MiddlewareClassType).onApply) {
			return (middleware as MiddlewareClassType).onApply.bind(middleware)
		}

		return middleware as MiddlewareCbType
	}
}