// Interfaces
import { AdapterInterface } from "@acai/interfaces"

// Utils
import smartResponse from "../../utils/response"

export default class MockAdapter implements AdapterInterface {
	private onRequestData = () => {}

	public boot () {
		this.onRequestData()
		return true
	}

	public shutdown () {}

	public onRequest (onRequestStart, safeHandle) {
		this.onRequestData = (...args) => safeHandle(() => onRequestStart(...args))
	}

	public async makeRequest (this: any, arg1: any, arg2: string | ((...args: any[]) => any), arg3?: string[]) {
		const response = await this.onRequestData(arg1, arg2, arg3)
		const { body } = await smartResponse(response, { headers: {} } as any)

		return body as any
	}
}