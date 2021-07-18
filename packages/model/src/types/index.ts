// interfaces
import ModelTypeInterface from "../interfaces/modelType";

// Types
import stringType 		from "./string/index";
import intType 			from "./int";
import dateType 		from "./date";
import booleanType 		from "./boolean";
import floatType 		from "./float";
import hashType 		from "./hash";
import sidType	 		from "./sid";
import uuidType	 		from "./uuid";
import bigIntType 		from "./bigInt";
import datetimeType 	from "./datetime";
import idType 			from "./id";
import jsonType 		from "./json";
import smallIntType 	from "./smallInt";
import textType 		from "./text";
import timeType 		from "./time";
import timestampType 	from "./timestamp";

let typesList: Record<string, ModelTypeInterface> = {
	"bigint"	: bigIntType,
	"boolean"	: booleanType,
	"date"		: dateType,
	"datetime"	: datetimeType,
	"float"		: floatType,
	"hash"		: hashType,
	"id"		: idType,
	"int"		: intType,
	"json"		: jsonType,
	"sid"		: sidType,
	"smallint"	: smallIntType,
	"string"	: stringType,
	"text"		: textType,
	"time"		: timeType,
	"timestamp"	: timestampType,
	"uuid"		: uuidType,
};

// -------------------------------------------------
// Methods
// -------------------------------------------------

export const clear 	= () => typesList = {};
export const add 	= (name: string, modelType: ModelTypeInterface) => typesList[name] = modelType;
export const get 	= (name: string) => typesList[name];
export const all	= () => typesList;

export default {
	clear,
	add,
	get,
	all,
};