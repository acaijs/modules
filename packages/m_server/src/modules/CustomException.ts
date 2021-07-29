// Interfaces
import { CustomExceptionInterface } from "@acai/interfaces";

export default class Exception extends Error implements CustomExceptionInterface {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// internal cached data
	_message: string;
	_data?: unknown;
	_type: string;

	// public config
	public status = 500;
	public readonly shouldReport: boolean = true;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (type: string, message: string, data?: unknown) {
		super (message);

		this._type		= type;
		this._data 		= data;
		this._message 	= message;
	}

	// -------------------------------------------------
	// Acessor methods
	// -------------------------------------------------

	public get message () {
		return this._message;
	}

	public get data () {
		return this._data;
	}

	public get type () {
		return this._type;
	}
}