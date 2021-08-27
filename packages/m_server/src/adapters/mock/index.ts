// Interfaces
import { AdapterInterface } from "@acai/interfaces"

export default class MockAdapter implements AdapterInterface {
	private onRequestData = () => {}

	public boot () {
		return true
	}

	public shutdown () {}

	public onRequest (onRequestStart) {
		this.onRequestData = onRequestStart
	}

	public makeRequest (this: any, arg1: any, arg2: string | ((...args: any[]) => any), arg3?: string[]) {
		return this.onRequestData(arg1, arg2, arg3)
	}
}